import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import {
  Button,
  Card,
  Input,
  Space,
  Table,
  Tag,
  Modal,
  Carousel,
  Descriptions,
  Spin,
  Upload,
} from "antd";
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";

const { confirm } = Modal;

const Complain = () => {
  const [complain, setComplain] = useState(null);
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState(false);
  const [complainDetail, setComplainDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal từ chối phương án của seller
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

  // Modal yêu cầu seller tiếp tục giải quyết
  const [continueModalVisible, setContinueModalVisible] = useState(false);
  const [reDescription, setReDescription] = useState("");
  const [continueLoading, setContinueLoading] = useState(false);

  // Modal gửi lên admin
  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminDescription, setAdminDescription] = useState("");
  const [adminImageUrls, setAdminImageUrls] = useState([]);
  const [adminLoading, setAdminLoading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const fetchComplain = async () => {
    try {
      const res = await api.get("/buyer/complaints/list");
      setComplain(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  useEffect(() => {
    fetchComplain();
  }, []);

  const handleViewDetail = async (complaintId) => {
    setDetailLoading(true);
    setDetailModal(true);
    try {
      const res = await api.get(
        `/buyer/complaints/detail?complaintId=${complaintId}`
      );
      setComplainDetail(res.data.data);
    } catch (error) {
      toast.error("Lỗi khi lấy chi tiết khiếu nại");
      setComplainDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  // Đồng ý phương án
  const showAcceptConfirm = () => {
    confirm({
      title: "Xác nhận đồng ý",
      icon: <ExclamationCircleFilled />,
      content: `Bạn có chắc chắn muốn chấp nhận phương án giải quyết cho khiếu nại #${complainDetail?.id}?`,
      okText: "Đồng ý",
      cancelText: "Hủy",
      okType: "primary",
      onOk: async () => {
        try {
          await api.patch(
            `/buyer/complaints/agree?complaintId=${complainDetail.id}`
          );
          toast.success("Bạn đã chấp nhận phương án giải quyết.");
          setDetailModal(false);
          fetchComplain();
        } catch (error) {
          toast.error(
            error?.response?.data?.message || "Lỗi khi xác nhận đồng ý."
          );
        }
      },
    });
  };

  // Từ chối phương án
  const showRejectModal = () => {
    setDetailModal(false);
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await api.patch("/buyer/complaints/reject", {
        complaintId: complainDetail.id,
        reason: rejectReason,
      });
      toast.success("Bạn đã từ chối phương án giải quyết.");
      setRejectModalVisible(false);
      setRejectReason("");
      fetchComplain();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi từ chối.");
    } finally {
      setRejectLoading(false);
    }
  };

  // Yêu cầu seller tiếp tục giải quyết
  const showContinueModal = () => {
    setDetailModal(false);
    setContinueModalVisible(true);
  };

  const handleContinue = async () => {
    setContinueLoading(true);
    try {
      await api.patch("/buyer/complaints/continue", {
        complaintId: complainDetail.id,
        reDescription: reDescription,
      });
      toast.success("Đã gửi yêu cầu seller tiếp tục giải quyết.");
      setContinueModalVisible(false);
      setReDescription("");
      fetchComplain();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi gửi yêu cầu tiếp tục."
      );
    } finally {
      setContinueLoading(false);
    }
  };

  // Gửi khiếu nại lên admin
  const showAdminModal = () => {
    setDetailModal(false);
    
    // Lấy dữ liệu từ complainDetail hiện tại
    if (complainDetail) {
      // Map description
      setAdminDescription(complainDetail.description || "");
      
      // Map hình ảnh từ imageUrls
      if (complainDetail.imageUrls && complainDetail.imageUrls.length > 0) {
        const mappedImages = complainDetail.imageUrls.map((url, index) => ({
          uid: `-${index}`,
          name: `image-${index}.jpg`,
          status: "done",
          url: url,
        }));
        setFileList(mappedImages);
        setAdminImageUrls(complainDetail.imageUrls);
      } else {
        // Reset nếu không có ảnh
        setFileList([]);
        setAdminImageUrls([]);
      }
    }
    
    setAdminModalVisible(true);
  };

  const handleAdminRequest = async () => {
    setAdminLoading(true);
    try {
      await api.post("/buyer/complaints/admin-request", {
        orderId: complainDetail.orderId,
        complaintType: complainDetail.type,
        description: adminDescription,
        complaintImages: adminImageUrls,
      });
      toast.success("Đã gửi khiếu nại lên admin.");
      setAdminModalVisible(false);
      setAdminDescription("");
      setAdminImageUrls([]);
      setFileList([]);
      fetchComplain();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi gửi khiếu nại lên admin."
      );
    } finally {
      setAdminLoading(false);
    }
  };

  // Xử lý đóng modal admin với reset state
  const handleAdminModalCancel = () => {
    setAdminModalVisible(false);
    setAdminDescription("");
    setAdminImageUrls([]);
    setFileList([]);
  };

  // Xử lý upload hình ảnh
  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.preview);
    setPreviewOpen(true);
  };

  const handleChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    
    // Cập nhật adminImageUrls với các URL đã upload
    const urls = newFileList
      .filter((file) => file.status === "done" && file.url)
      .map((file) => file.url);
    setAdminImageUrls(urls);
  };

  const uploadButton = (
    <button style={{ border: 0, background: "none" }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload</div>
    </button>
  );

  const columns = [
    {
      title: "ComplainID",
      dataIndex: "id",
      key: "id",
      render: (id, record) => (
        <a
          style={{ cursor: "pointer" }}
          onClick={() => handleViewDetail(record.id)}
        >
          {id}
        </a>
      ),
    },
    {
      title: "OrderID",
      dataIndex: "orderId",
      key: "orderId",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Seller Name",
      dataIndex: "sellerName",
      key: "sellerName",
    },
    {
      title: "description",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "green";
        if (status === "SELLER_REVIEWING") color = "blue";
        if (status === "ADMIN_REVIEWING") color = "orange";
        if (status === "SELLER_REJECTED") color = "red";
        if (status === "BUYER_REJECTED") color = "red";
        if (status === "CLOSED_NO_REFUND") color = "volcano";
        if (status === "SELLER_RESOLVED") color = "cyan";
        if (status === "CLOSED_REFUND") color = "green";

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetail(record.id)}>View detail</a>
        </Space>
      ),
    },
  ];

  return (
    <div
      className="overflow-x-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Header />
      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <Card
          bordered={false}
          className="shadow-2xl rounded-xl"
          title={
            <div className="flex items-center gap-3">
              <span className="text-2xl ">Danh sách khiếu nại</span>
              <Tag color="blue" className="ml-2">
                {complain?.length} đơn khiếu nại
              </Tag>
            </div>
          }
          extra={
            <Button type="default" onClick={() => navigate("/orders")}>
              Danh sách đơn hàng
            </Button>
          }
        >
          <Table columns={columns} dataSource={complain} />
        </Card>

        {/* Modal chi tiết complaint */}
        <Modal
          open={detailModal}
          onCancel={() => setDetailModal(false)}
          footer={
            complainDetail?.status === "SELLER_RESOLVED"
              ? [
                  <Button
                    type="primary"
                    onClick={showAcceptConfirm}
                    key="accept"
                  >
                    Đồng ý
                  </Button>,
                  <Button danger onClick={showRejectModal} key="reject">
                    Từ chối
                  </Button>,
                  <Button onClick={() => setDetailModal(false)} key="close">
                    Đóng
                  </Button>,
                ]
              : complainDetail?.status === "SELLER_REJECTED"
              ? [
                  <Button danger onClick={showAdminModal} key="admin">
                    Gửi lên Admin
                  </Button>,
                  <Button onClick={() => setDetailModal(false)} key="close">
                    Đóng
                  </Button>,
                ]
              : [
                  <Button onClick={() => setDetailModal(false)} key="close">
                    Đóng
                  </Button>,
                ]
          }
          width={600}
          title={
            <div className="flex items-center gap-2">
              <span>Chi tiết khiếu nại #{complainDetail?.id}</span>
              <Tag color="blue">
                {complainDetail?.status?.toUpperCase() || ""}
              </Tag>
            </div>
          }
        >
          {detailLoading ? (
            <Spin />
          ) : complainDetail ? (
            <>
              {complainDetail.imageUrls &&
              complainDetail.imageUrls.length > 0 ? (
                <Carousel>
                  {complainDetail.imageUrls.map((url, idx) => (
                    <div key={idx} style={{ textAlign: "center" }}>
                      <img
                        src={url}
                        alt={`evidence-${idx}`}
                        style={{
                          maxHeight: 260,
                          maxWidth: "100%",
                          borderRadius: 8,
                        }}
                      />
                    </div>
                  ))}
                </Carousel>
              ) : (
                <div className="text-gray-500 mb-4">
                  Không có hình minh chứng
                </div>
              )}

              <Descriptions column={1} bordered size="middle">
                <Descriptions.Item label="Mã khiếu nại">
                  #{complainDetail.id}
                </Descriptions.Item>
                <Descriptions.Item label="Mã đơn hàng">
                  #{complainDetail.orderId}
                </Descriptions.Item>
                <Descriptions.Item label="Loại khiếu nại">
                  <Tag color="red">{complainDetail.type}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Người bán">
                  {complainDetail.sellerName}
                </Descriptions.Item>
                <Descriptions.Item label="Mô tả">
                  {complainDetail.description}
                </Descriptions.Item>
                <Descriptions.Item label="Ghi chú xử lý">
                  {complainDetail.resolutionNotes || (
                    <span className="text-gray-400">Chưa có</span>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Ngày tạo">
                  {new Date(complainDetail.createdAt).toLocaleString("vi-VN")}
                </Descriptions.Item>
              </Descriptions>
            </>
          ) : (
            <div className="text-red-600">
              Không tìm thấy chi tiết khiếu nại
            </div>
          )}
        </Modal>

        {/* Modal từ chối phương án */}
        <Modal
          open={rejectModalVisible}
          title="Nhập lý do từ chối"
          onCancel={() => setRejectModalVisible(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              danger
              loading={rejectLoading}
              onClick={handleReject}
              disabled={!rejectReason.trim()}
            >
              Xác nhận từ chối
            </Button>,
            <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
              Đóng
            </Button>,
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Vui lòng nhập lý do từ chối phương án giải quyết..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            showCount
            maxLength={500}
          />
        </Modal>

        {/* Modal yêu cầu seller tiếp tục giải quyết */}
        <Modal
          open={continueModalVisible}
          title="Yêu cầu seller tiếp tục giải quyết"
          onCancel={() => setContinueModalVisible(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              loading={continueLoading}
              onClick={handleContinue}
              disabled={!reDescription.trim()}
            >
              Gửi yêu cầu
            </Button>,
            <Button
              key="cancel"
              onClick={() => setContinueModalVisible(false)}
            >
              Đóng
            </Button>,
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder="Mô tả thêm về vấn đề cần seller tiếp tục giải quyết..."
            value={reDescription}
            onChange={(e) => setReDescription(e.target.value)}
            showCount
            maxLength={500}
          />
        </Modal>

        {/* Modal gửi lên admin */}
        <Modal
          open={adminModalVisible}
          title="Gửi khiếu nại lên Admin"
          onCancel={handleAdminModalCancel}
          footer={[
            <Button
              key="ok"
              type="primary"
              danger
              loading={adminLoading}
              onClick={handleAdminRequest}
              disabled={!adminDescription.trim()}
            >
              Gửi lên Admin
            </Button>,
            <Button key="cancel" onClick={handleAdminModalCancel}>
              Đóng
            </Button>,
          ]}
          width={700}
        >
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Mô tả vấn đề:</label>
              <Input.TextArea
                rows={4}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                value={adminDescription}
                onChange={(e) => setAdminDescription(e.target.value)}
                showCount
                maxLength={500}
              />
            </div>

            <div>
              <label className="block mb-2 font-medium">Hình ảnh minh chứng:</label>
              <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                beforeUpload={() => false}
              >
                {fileList.length >= 8 ? null : uploadButton}
              </Upload>
            </div>
          </div>
        </Modal>

        {/* Modal preview image */}
        <Modal
          open={previewOpen}
          title="Xem trước hình ảnh"
          footer={null}
          onCancel={() => setPreviewOpen(false)}
        >
          <img alt="preview" style={{ width: "100%" }} src={previewImage} />
        </Modal>
      </div>
    </div>
  );
};

export default Complain;
