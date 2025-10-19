"use client";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Spin,
  Form,
  Input,
  InputNumber,
  Select,
  Button,
  Divider,
  Tag,
} from "antd";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react"; // Icon cho các nút
import api from "../../../config/axios";

// Helper để định dạng ngày tháng
const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

// Helper để tạo Tag màu sắc cho trạng thái
const StatusTag = ({ status }) => {
  const colorMap = {
    POSTED: "blue",
    PENDING: "orange",
    APPROVED: "green",
    REJECTED: "red",
  };
  return <Tag color={colorMap[status] || "default"}>{status || "-"}</Tag>;
};

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/seller/posts/${id}`);
        const data = res.data.data || res.data;
        setPost(data);
        form.setFieldsValue(data); // Điền toàn bộ dữ liệu vào form
      } catch (err) {
        toast.error(err.response?.data?.message || "Không tìm thấy bài đăng");
        navigate("/seller"); // Quay về trang trước nếu có lỗi
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPost();
    }
  }, [id, navigate, form]);

  const handleSave = async (values) => {
    setSaving(true);
    try {
      await api.put(`/seller/posts/${id}`, {
        ...values,
        productType: post.productType, // Giữ nguyên loại sản phẩm không cho sửa
      });

      toast.success("Cập nhật thành công!");
      navigate(-1);
      setPost({ ...post, ...values }); // Cập nhật state để hiển thị ngay lập tức
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  // Màn hình chờ trong khi tải dữ liệu
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  // Nếu không có bài đăng
  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">
        Không thể tải dữ liệu bài đăng.
      </div>
    );
  }

  return (
    <div className="bg-transparent ">
      <div className="max-w-7xl mx-auto">
        {/* Header: Nút quay lại, Tiêu đề, Nút Lưu */}
        <div className="flex justify-between items-center mb-6">
          <Button
            icon={<ArrowLeft size={16} />}
            onClick={() => navigate(-1)}
            className="flex items-center"
          >
            Quay lại
          </Button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-4">
            Chỉnh sửa: {post.title}
          </h1>
          <Button
            type="primary"
            icon={<Save size={16} />}
            loading={saving}
            onClick={() => form.submit()} // Kích hoạt onFinish của Form
            className="flex items-center"
          >
            Lưu thay đổi
          </Button>
        </div>

        {/* Bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Form chỉnh sửa */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <h2 className="text-xl font-semibold text-gray-700">
                Thông tin cơ bản
              </h2>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item
                  label="Tiêu đề"
                  name="title"
                  rules={[{ required: true }]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  label="Giá (VND)"
                  name="price"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    min={0}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                    parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  />
                </Form.Item>
              </div>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input />
              </Form.Item>

              {/* Chi tiết sản phẩm */}
              <h2 className="text-xl font-semibold text-gray-700 mt-6">
                Chi tiết sản phẩm
              </h2>
              <Divider />

              {post.productType === "VEHICLE" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Thương hiệu" name="vehicleBrand">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Model" name="model">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Năm sản xuất" name="yearOfManufacture">
                    <InputNumber className="w-full" />
                  </Form.Item>
                  <Form.Item label="Màu sắc" name="color">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Số KM đã đi" name="mileage">
                    <InputNumber
                      className="w-full"
                      formatter={(value) =>
                        `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                      }
                    />
                  </Form.Item>
                </div>
              )}

              {post.productType === "BATTERY" && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Form.Item label="Loại pin" name="batteryType">
                    <Input />
                  </Form.Item>
                  <Form.Item label="Dung lượng (Ah)" name="capacity">
                    <InputNumber className="w-full" />
                  </Form.Item>
                  <Form.Item label="Điện áp (V)" name="voltage">
                    <InputNumber className="w-full" />
                  </Form.Item>
                  <Form.Item label="Thương hiệu pin" name="batteryBrand">
                    <Input />
                  </Form.Item>
                </div>
              )}

              {/* Vận chuyển & Hình ảnh */}
              <h2 className="text-xl font-semibold text-gray-700 mt-6">
                Vận chuyển & Hình ảnh
              </h2>
              <Divider />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Form.Item label="Phương thức giao hàng" name="deliveryMethods">
                  <Select mode="multiple">
                    <Select.Option value="STANDARD">Tiêu chuẩn</Select.Option>
                    <Select.Option value="EXPRESS">Hỏa tốc</Select.Option>
                    <Select.Option value="PICKUP">
                      Lấy tại cửa hàng
                    </Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Hình thức thanh toán" name="paymentTypes">
                  <Select mode="multiple">
                    <Select.Option value="DEPOSIT">Đặt cọc</Select.Option>
                    <Select.Option value="FULL">
                      Thanh toán toàn bộ
                    </Select.Option>
                  </Select>
                </Form.Item>
              </div>
              <Form.Item label="Link hình ảnh" name="images">
                <Select mode="tags" placeholder="Dán link ảnh và nhấn Enter" />
              </Form.Item>
            </Form>
          </div>

          {/* Cột phải: Thông tin tóm tắt */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Thông tin bài đăng
            </h2>
            <div className="space-y-3 mt-4">
              <div className="flex justify-between items-center hidden">
                <span className="text-sm font-medium text-gray-600">
                  ID bài đăng
                </span>
                <span className="text-sm text-gray-800 font-mono">
                  #{post.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Loại sản phẩm
                </span>
                <Tag color={post.productType === "VEHICLE" ? "cyan" : "lime"}>
                  {post.productType}
                </Tag>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Trạng thái
                </span>
                <StatusTag status={post.status} />
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Nhãn Kiểm Duyệt
                </span>
                <Tag color={post.trusted ? "gold" : "default"}>
                  {post.trusted ? "Premium" : "Thường"}
                </Tag>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Ngày đăng
                </span>
                <span className="text-sm text-gray-800">
                  {formatDate(post.postDate)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Ngày hết hạn
                </span>
                <span className="text-sm text-gray-800">
                  {formatDate(post.expiryDate)}
                </span>
              </div>
              <Divider className="my-1" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Lượt xem
                </span>
                <span className="text-sm text-gray-800 font-semibold">
                  {post.viewCount ?? 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Lượt thích
                </span>
                <span className="text-sm text-gray-800 font-semibold">
                  {post.likeCount ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
