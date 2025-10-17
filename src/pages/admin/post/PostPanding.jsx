import React, { useEffect, useState } from "react";
import { Table, Tag, Modal, Descriptions, Button, message } from "antd";
import { toast } from "react-toastify";
import api from "../../../config/axios";

const PostPanding = ({ data }) => {
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
      toast.error("Loi lay du lieu");
    }
  };
  useEffect(() => {
    fetchPost();
    handleSubmit();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/posts/${selectedPost.id}/approve`);
      closeModal();
      toast.success("Cap nhat thanh cong");
      fetchPost();
    } catch {
      message.error("Duyệt bài đăng thất bại, thử lại sau!");
    }
    setLoading(false);
  };
  const handleReject = async () => {
    setLoading(true);
    try {
      await api.put(`/admin/posts/${selectedPost.id}/reject`); 
      message.success("Từ chối bài đăng thành công!");

      await fetchPost(); 
      closeModal();
    } catch {
      message.error("Từ chối bài đăng thất bại, thử lại sau!");
    }
    setLoading(false);
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
      render: (v) => v.toLocaleString(),
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
        visible={isModalOpen}
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
        width={700}
      >
        {selectedPost && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="ID">{selectedPost.id}</Descriptions.Item>
            <Descriptions.Item label="Tiêu đề">
              {selectedPost.title}
            </Descriptions.Item>
            <Descriptions.Item label="Loại sản phẩm">
              {selectedPost.productType}
            </Descriptions.Item>
            <Descriptions.Item label="Giá (VND)">
              {selectedPost.price.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Giá đề xuất (VND)">
              {selectedPost.suggestPrice.toLocaleString()}
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
              {selectedPost.deliveryMethods.length > 0
                ? selectedPost.deliveryMethods.join(", ")
                : "Không có"}
            </Descriptions.Item>
            <Descriptions.Item label="Phương thức thanh toán">
              {selectedPost.paymentTypes.length > 0
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
            <Descriptions.Item label="Mô tả">
              {selectedPost.description}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default PostPanding;
