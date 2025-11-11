import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { Button, Card, Input, Space, Table, Tag } from "antd";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import { Modal, Carousel, Descriptions, Spin } from "antd";

const Complain = () => {
  const [complain, setComplain] = useState(null);
  const navigate = useNavigate();
  const [detailModal, setDetailModal] = useState(false);
  const [complainDetail, setComplainDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);

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
  //dong ý
  const handleAccept = async () => {
    try {
      await api.patch(
        `/buyer/complaints/agree?complaintId=${complainDetail.id}`
      );
      toast.success("Bạn đã chấp nhận phương án giải quyết.");
      setDetailModal(false);
      fetchComplain(); // reload lại danh sách complaint nếu có
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi xác nhận đồng ý.");
    }
  };
  // từ chối
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
      setDetailModal(false);
      fetchComplain();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi từ chối.");
    } finally {
      setRejectLoading(false);
    }
  };

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
      // render: (text) => <a>{text}</a>,
    },
    {
      title: "Seller Name",
      dataIndex: "name",
      key: "name",
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
        //     PENDING,
        // RESOLUTION_GIVEN,
        // RESOLVED,
        // REJECTED,
        // ADMIN_SOLVING
        if (status === "PENDING") color = "green";
        if (status === "RESOLUTION_GIVEN") color = "blue";
        if (status === "RESOLVED") color = "orange";
        if (status === "REJECTED") color = "red";
        if (status === "ADMIN_SOLVING") color = "red";

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a onClick={() => handleViewDetail(record.id)}>View detail</a>
          <a>Delete</a>
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
              {/* <ShoppingCartOutlined className="text-2xl text-blue-600" /> */}
              <span className="text-2xl ">Danh sách khiếu nại</span>
              <Tag color="blue" className="ml-2">
                {complain?.length} đơn hàng
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

        {/* //modo chi tiet compalin */}
        <Modal
          open={detailModal}
          onCancel={() => setDetailModal(false)}
          footer={
            complainDetail?.status === "RESOLUTION_GIVEN"
              ? [
                  <Button type="primary" onClick={handleAccept} key="accept">
                    Đồng ý
                  </Button>,
                  <Button danger onClick={showRejectModal} key="reject">
                    Từ chối
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
                  {complainDetail.name}
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
        {/* modal tu choi */}
        <Modal
          open={rejectModalVisible}
          title="Nhập lý do từ chối"
          onCancel={() => setRejectModalVisible(false)}
          footer={[
            <Button
              key="ok"
              type="primary"
              danger
              style={{ marginTop: 16 }} // Thêm margin-top 16px
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
      </div>
    </div>
  );
};

export default Complain;
