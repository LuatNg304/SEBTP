import React, { useEffect, useState } from "react";
import { Table, Tag, Modal, Descriptions, Button, message, Image, Row, Col } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const PostPending = ({ data }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState([]);

  const openModal = (record) => {
    setSelectedPost(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const fetchPost = async () => {
    try {
      const res = await api.get("/admin/posts/pending");
      setPost(res.data.data);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Lỗi lấy dữ liệu");
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  const handleSubmit = async () => {
    if (!selectedPost) return;
    setLoading(true);
    try {
      await api.put(`/admin/posts/${selectedPost.id}/approve`);
      toast.success("Cập nhật thành công");
      closeModal();
      await fetchPost();
    } catch (error) {
      console.error("Approve error:", error);
      message.error("Duyệt bài đăng thất bại, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedPost) return;
    setLoading(true);
    try {
      await api.put(`/admin/posts/${selectedPost.id}/reject`);
      message.success("Từ chối bài đăng thành công!");
      await fetchPost();
      closeModal();
    } catch (error) {
      console.error("Reject error:", error);
      message.error("Từ chối bài đăng thất bại, thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      render: (text, record) => <a onClick={() => openModal(record)}>{text}</a>,
    },
    { title: "Loại sản phẩm", dataIndex: "productType", key: "productType" },
    {
      title: "Giá (VND)",
      dataIndex: "price",
      key: "price",
      render: (v) => v?.toLocaleString() ?? "0",
    },
    {
      title: "Mã gói ưu tiên",
      dataIndex: "priorityPackageId",
      key: "priorityPackageId",
      render: (v) => v ?? "Không",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "PENDING" ? "orange" : "green"}>{status}</Tag>
      ),
    },
    {
      title: "Tin cậy",
      dataIndex: "trusted",
      key: "trusted",
      render: (v) =>
        v ? <Tag color="green">Tin cậy</Tag> : <Tag color="red">Chưa</Tag>,
    },
  ];

  return (
    <>
      <Table columns={columns} dataSource={post} rowKey="id" />

      <Modal
        title="Chi tiết bài đăng"
        open={isModalOpen}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal} disabled={loading}>
            Hủy
          </Button>,
          <Button key="reject" danger loading={loading} onClick={handleReject}>
            Từ chối
          </Button>,
          <Button
            key="submit"
            type="primary"
            loading={loading}
            onClick={handleSubmit}
          >
            Duyệt
          </Button>,
        ]}
        width={900}
      >
        {selectedPost && (
          <>
            {/* Grid hiển thị ảnh với Image.PreviewGroup */}
            {selectedPost.images && selectedPost.images.length > 0 && (
              <div style={{ marginBottom: 24 }}>
                <Image.PreviewGroup>
                  <Row gutter={[16, 16]}>
                    {selectedPost.images.map((imageUrl, index) => (
                      <Col xs={12} sm={8} md={6} key={index}>
                        <Image
                          src={imageUrl}
                          alt={`Post image ${index + 1}`}
                          width="100%"
                          height={150}
                          style={{
                            objectFit: "cover",
                            borderRadius: "8px",
                          }}
                        />
                      </Col>
                    ))}
                  </Row>
                </Image.PreviewGroup>
              </div>
            )}

            {/* Thông tin chi tiết */}
            <Descriptions bordered column={1} size="small">
              <Descriptions.Item label="ID">{selectedPost.id}</Descriptions.Item>
              <Descriptions.Item label="Tiêu đề">
                {selectedPost.title}
              </Descriptions.Item>
              <Descriptions.Item label="Loại sản phẩm">
                {selectedPost.productType}
              </Descriptions.Item>
              <Descriptions.Item label="Giá (VND)">
                {selectedPost.price?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Giá đề xuất (VND)">
                {selectedPost.suggestPrice?.toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày đăng">
                {new Date(selectedPost.postDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày cập nhật">
                {selectedPost.updateDate
                  ? new Date(selectedPost.updateDate).toLocaleDateString()
                  : "Chưa cập nhật"}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày hết hạn">
                {new Date(selectedPost.expiryDate).toLocaleDateString()}
              </Descriptions.Item>
              <Descriptions.Item label="Lượt xem">
                {selectedPost.viewCount}
              </Descriptions.Item>
              <Descriptions.Item label="Lượt thích">
                {selectedPost.likeCount}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức giao hàng">
                {selectedPost.deliveryMethods?.length > 0
                  ? selectedPost.deliveryMethods.join(", ")
                  : "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedPost.paymentTypes?.length > 0
                  ? selectedPost.paymentTypes.join(", ")
                  : "Không có"}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedPost.address}
              </Descriptions.Item>
              <Descriptions.Item label="Mã gói ưu tiên">
                {selectedPost.priorityPackageId ?? "Không"}
              </Descriptions.Item>
              <Descriptions.Item label="Hết hạn ưu tiên">
                {selectedPost.priorityExpire
                  ? new Date(selectedPost.priorityExpire).toLocaleDateString()
                  : "Không"}
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag
                  color={selectedPost.status === "PENDING" ? "orange" : "green"}
                >
                  {selectedPost.status}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Tin cậy">
                {selectedPost.trusted ? (
                  <Tag color="green">Tin cậy</Tag>
                ) : (
                  <Tag color="red">Chưa</Tag>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="Người đăng">
                {selectedPost.user?.fullName ?? "Không có thông tin"}
              </Descriptions.Item>
              <Descriptions.Item label="Email Người đăng">
                {selectedPost.user?.email ?? "Không có thông tin"}
              </Descriptions.Item>
              
              {/* Thông tin xe (nếu là VEHICLE) */}
              {selectedPost.productType === "VEHICLE" && (
                <>
                  <Descriptions.Item label="Hãng xe">
                    {selectedPost.vehicleBrand ?? "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Model">
                    {selectedPost.model ?? "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Năm sản xuất">
                    {selectedPost.yearOfManufacture ?? "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Màu sắc">
                    {selectedPost.color ?? "N/A"}
                  </Descriptions.Item>
                  <Descriptions.Item label="Số km đã đi">
                    {selectedPost.mileage?.toLocaleString() ?? "N/A"}
                  </Descriptions.Item>
                </>
              )}
              
              {/* Thông tin pin (nếu có) */}
              {selectedPost.batteryType && (
                <>
                  <Descriptions.Item label="Loại pin">
                    {selectedPost.batteryType}
                  </Descriptions.Item>
                  <Descriptions.Item label="Dung lượng pin">
                    {selectedPost.capacity} mAh
                  </Descriptions.Item>
                  <Descriptions.Item label="Điện áp">
                    {selectedPost.voltage}
                  </Descriptions.Item>
                  <Descriptions.Item label="Hãng pin">
                    {selectedPost.batteryBrand}
                  </Descriptions.Item>
                </>
              )}
              
              <Descriptions.Item label="Mô tả">
                {selectedPost.description}
              </Descriptions.Item>
            </Descriptions>
          </>
        )}
      </Modal>
    </>
  );
};

export default PostPending;
