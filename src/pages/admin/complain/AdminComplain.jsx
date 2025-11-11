import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import {
  Button,
  Carousel,
  Descriptions,
  Input,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";

const AdminComplain = () => {
  const [complain, setComplain] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [complainDetail, setComplainDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectLoading, setRejectLoading] = useState(false);
  const fetchComplain = async () => {
    try {
      const res = await api.get("/admin/complaints/list");
      setComplain(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      toast.error(error?.response?.data.message);
    }
  };

  useEffect(() => {
    fetchComplain();
  }, []);
  //detail
  const handleViewDetail = async (complaintId) => {
    setDetailLoading(true);
    setDetailModal(true);
    try {
      const res = await api.get(
        `/admin/complaints/detail?complaintId=${complaintId}`
      );
      setComplainDetail(res.data.data);
    } catch (error) {
      toast.error("Lỗi khi lấy chi tiết khiếu nại");
      setComplainDetail(null);
    } finally {
      setDetailLoading(false);
    }
  };

  //refun
  const showRejectModal = () => {
    setDetailModal(false);
    setRejectModalVisible(true);
  };
  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await api.patch("/admin/complaints/handle", {
        complaintId: complainDetail.id,
        resolution: rejectReason,
      });
      toast.success("Đã gửi hướng giải quyết của bạn.");
      setRejectModalVisible(false);
      setDetailModal(false);
      fetchComplain();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi gửi hướng giải quyết.");
    } finally {
      setRejectLoading(false);
    }
  };
  //dong ý
  const handleRefun = async () => {
    try {
      await api.put(
        `/admin/complaints/refund?complaintId=${complainDetail.id}`
      );
      toast.success("Đã hoàn tiên.");
      setDetailModal(false);
      fetchComplain();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi hoàn tiền.");
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
        </Space>
      ),
    },
  ];
  return (
    <div>
      <Table columns={columns} dataSource={complain} />
      {/* modal rèun */}
      <Modal
        open={detailModal}
        onCancel={() => setDetailModal(false)}
        footer={
          complainDetail?.status === "ADMIN_SOLVING"
            ? [
                <Button type="primary" onClick={handleRefun}>
                  Hoàn tiền
                </Button>,
                <Button type="default" success onClick={showRejectModal}>
                  Đưa ra hướng giải quyết
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
            {complainDetail.imageUrls && complainDetail.imageUrls.length > 0 ? (
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
              <div className="text-gray-500 mb-4">Không có hình minh chứng</div>
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
          <div className="text-red-600">Không tìm thấy chi tiết khiếu nại</div>
        )}
      </Modal>
      {/* modal resol */}
      <Modal
        open={rejectModalVisible}
        title="Hướng giải quyết từ Amin"
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
            Gửi
          </Button>,
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        <Input.TextArea
          rows={4}
          placeholder="Hướng giải quyết"
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          showCount
          maxLength={500}
        />
      </Modal>
    </div>
  );
};

export default AdminComplain;
