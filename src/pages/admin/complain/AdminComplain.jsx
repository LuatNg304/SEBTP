import React, { useEffect, useState } from "react";
import api from "../../../config/axios";
import { toast } from "react-toastify";
import {
  Button,
  Carousel,
  Descriptions,
  Modal,
  Space,
  Spin,
  Table,
  Tag,
} from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";

const AdminComplain = () => {
  const [complain, setComplain] = useState(null);
  const [detailModal, setDetailModal] = useState(false);
  const [complainDetail, setComplainDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Modal refund
  const [refundModalVisible, setRefundModalVisible] = useState(false);
  const [refundLoading, setRefundLoading] = useState(false);

  // Modal reject
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
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

  //refund
  const showRefundModal = () => {
    setDetailModal(false);
    setRefundModalVisible(true);
  };

  const handleRefund = async () => {
    setRefundLoading(true);
    try {
      await api.patch(`/admin/complaints/handle`, {
        complaintId: complainDetail.id,
        resolutionType: "REFUND",
      });
      toast.success("Đã hoàn tiền.");
      setRefundModalVisible(false);
      fetchComplain();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Lỗi khi hoàn tiền.");
    } finally {
      setRefundLoading(false);
    }
  };

  //reject
  const showRejectModal = () => {
    setDetailModal(false);
    setRejectModalVisible(true);
  };

  const handleReject = async () => {
    setRejectLoading(true);
    try {
      await api.patch(`/admin/complaints/handle`, {
        complaintId: complainDetail.id,
        resolutionType: "NO_REFUND",
      });
      toast.success("Đã từ chối đơn khiếu nại.");
      setRejectModalVisible(false);
      fetchComplain();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Lỗi khi từ chối đơn khiếu nại."
      );
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
        if (status === "ADMIN_REVIEWING") color = "red";
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

      {/* Modal detail */}
      <Modal
        open={detailModal}
        onCancel={() => setDetailModal(false)}
        footer={
          complainDetail?.status === "ADMIN_REVIEWING"
            ? [
                <Button type="primary" onClick={showRefundModal} key="refund">
                  Hoàn tiền
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

      {/* Modal xác nhận hoàn tiền */}
      <Modal
        open={refundModalVisible}
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleFilled style={{ color: "#1890ff" }} />
            <span>Xác nhận hoàn tiền</span>
          </div>
        }
        onCancel={() => setRefundModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            loading={refundLoading}
            onClick={handleRefund}
          >
            Đồng ý
          </Button>,
          <Button key="cancel" onClick={() => setRefundModalVisible(false)}>
            Hủy
          </Button>,
        ]}
      >
        <p>
          Bạn có chắc chắn muốn hoàn tiền cho khiếu nại #
          {complainDetail?.id}?
        </p>
      </Modal>

      {/* Modal xác nhận từ chối */}
      <Modal
        open={rejectModalVisible}
        title={
          <div className="flex items-center gap-2">
            <ExclamationCircleFilled style={{ color: "#ff4d4f" }} />
            <span>Xác nhận từ chối</span>
          </div>
        }
        onCancel={() => setRejectModalVisible(false)}
        footer={[
          <Button
            key="ok"
            type="primary"
            danger
            loading={rejectLoading}
            onClick={handleReject}
          >
            Từ chối
          </Button>,
          <Button key="cancel" onClick={() => setRejectModalVisible(false)}>
            Hủy
          </Button>,
        ]}
      >
        <p>
          Bạn có chắc chắn muốn từ chối khiếu nại #{complainDetail?.id}?
        </p>
      </Modal>
    </div>
  );
};

export default AdminComplain;
