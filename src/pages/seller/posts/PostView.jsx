"use client";
import React, { useEffect, useState, useCallback } from "react";
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
  Upload,
  Modal,
  Checkbox,
} from "antd";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react";
import api from "../../../config/axios";
import { uploadFile } from "../../../utils/upload";

// ========================================================================
// 1. HELPERS (Tiện ích)
// ========================================================================

const formatDate = (dateString) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const StatusTag = ({ status }) => {
  const colorMap = {
    POSTED: "blue",
    PENDING: "orange",
    APPROVED: "green",
    REJECTED: "red",
  };
  return <Tag color={colorMap[status] || "default"}>{status || "-"}</Tag>;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    const fileObject = file.originFileObj || file;

    if (fileObject instanceof File) {
      reader.readAsDataURL(fileObject);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    } else {
      resolve(file.url);
    }
  });

// ========================================================================
// 2. CUSTOM HOOK (Tách logic gợi ý giá)
// ========================================================================

/**
 * Hook để tự động lấy giá gợi ý từ AI khi các trường liên quan thay đổi.
 * Đã tích hợp sẵn debounce (trì hoãn) để tránh gọi API liên tục.
 */
const useSuggestedPrice = (form, productType) => {
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // Dùng Form.useWatch để theo dõi các trường hiệu quả hơn
  // Bằng cách này, hook sẽ tự "biết" khi nào giá trị thay đổi
  const vehicleValues = Form.useWatch(
    ["vehicleBrand", "model", "yearOfManufacture", "mileage", "color"],
    form
  );
  const batteryValues = Form.useWatch(
    ["batteryType", "capacity", "voltage", "batteryBrand"],
    form
  );

  useEffect(() => {
    const fetchPrice = async () => {
      let pricingPayload = {};
      let isMissingRequiredFields = true;

      // 1. Xây dựng payload dựa trên loại sản phẩm
      if (productType === "VEHICLE") {
        const [brand, model, year, mileage, color] = vehicleValues || [];
        if (brand && model && year && mileage) {
          pricingPayload = {
            productType: "VEHICLE",
            vehicleBrand: brand,
            model: model,
            color: color,
            yearOfManufacture: Number(year),
            mileage: Number(mileage),
          };
          isMissingRequiredFields = false;
        }
      } else if (productType === "BATTERY") {
        const [type, capacity, voltage, brand] = batteryValues || [];
        if (type && capacity && voltage && brand) {
          pricingPayload = {
            productType: "BATTERY",
            batteryType: type,
            capacity: Number(capacity),
            voltage: voltage,
            batteryBrand: brand,
          };
          isMissingRequiredFields = false;
        }
      }

      // 2. Thoát nếu thiếu trường hoặc loại SP không hỗ trợ
      if (isMissingRequiredFields) {
        setSuggestedPrice(null);
        return;
      }

      setIsFetchingPrice(true);
      setSuggestedPrice(null); // Xóa giá cũ

      // 3. Gọi API
      try {
        const priceRes = await api.post(
          "/seller/ai/suggest-price",
          pricingPayload
        );
        setSuggestedPrice(priceRes.data.suggestedPrice);
      } catch (err) {
        console.error("Lỗi khi fetch giá ước tính:", err);
        setSuggestedPrice(null);
      } finally {
        setIsFetchingPrice(false);
      }
    };

    // Sử dụng debounce với setTimeout
    const handler = setTimeout(() => {
      // Chỉ gọi khi có productType (dữ liệu post đã load xong)
      if (productType) {
        fetchPrice();
      }
    }, 800); // Trì hoãn 800ms

    return () => {
      clearTimeout(handler);
    };
    // Chỉ chạy lại khi các giá trị (đã được watch) thay đổi
  }, [productType, vehicleValues, batteryValues]);

  return { suggestedPrice, isFetchingPrice };
};

// ========================================================================
// 3. COMPONENT CON (Tách biệt các phần UI)
// ========================================================================

/**
 * Component con chỉ để hiển thị các trường form cho XE hoặc PIN
 */
const ProductSpecificFields = ({ productType }) => {
  if (productType === "VEHICLE") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item label="Thương hiệu" name="vehicleBrand">
          <Input />
        </Form.Item>
        <Form.Item label="Model" name="model">
          <Input />
        </Form.Item>
        <Form.Item label="Năm sản xuất" name="yearOfManufacture">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Màu sắc" name="color">
          <Input />
        </Form.Item>
        <Form.Item label="Số KM đã đi" name="mileage">
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
        <Form.Item label="Trọng lượng(g)" name="weight">
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
      </div>
    );
  }

  if (productType === "BATTERY") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Form.Item label="Loại pin" name="batteryType">
          <Input />
        </Form.Item>
        <Form.Item label="Dung lượng (Ah)" name="capacity">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Điện áp (V)" name="voltage">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item label="Thương hiệu pin" name="batteryBrand">
          <Input />
        </Form.Item>
        <Form.Item label="Trọng lượng(g)" name="weight">
          <InputNumber
            style={{ width: "100%" }}
            formatter={(value) =>
              `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
            }
          />
        </Form.Item>
      </div>
    );
  }

  return null; // Không hiển thị gì nếu_ không phải 2 loại trên
};

/**
 * Component con cho cột thông tin tóm tắt bên phải
 */
const PostInfoSidebar = ({ post }) => (
  <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit">
    <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
      Thông tin bài đăng
    </h2>
    <div className="space-y-3 mt-4">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Loại sản phẩm</span>
        <Tag color={post.productType === "VEHICLE" ? "cyan" : "lime"}>
          {post.productType}
        </Tag>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Trạng thái</span>
        <StatusTag status={post.status} />
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">
          Nhãn Kiểm Duyệt
        </span>
        <Tag color={post.trusted ? "gold" : "default"}>
          {post.trusted ? "Premium" : "Normal"}
        </Tag>
      </div>
      <Divider className="my-1" />
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Ngày đăng</span>
        <span className="text-sm text-gray-800">
          {formatDate(post.postDate)}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Ngày hết hạn</span>
        <span className="text-sm text-gray-800">
          {formatDate(post.expiryDate)}
        </span>
      </div>
      <Divider className="my-1" />
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Lượt xem</span>
        <span className="text-sm text-gray-800 font-semibold">
          {post.viewCount ?? 0}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-gray-600">Lượt thích</span>
        <span className="text-sm text-gray-800 font-semibold">
          {post.likeCount ?? 0}
        </span>
      </div>
    </div>
  </div>
);

/**
 * Component con chịu trách nhiệm cho logic Upload và Preview ảnh
 */
const ImageUploader = ({ fileList, setFileList }) => {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  const handlePreview = async (file) => {
    const previewUrl = file.url || file.preview;
    let finalPreviewUrl = previewUrl;

    if (!previewUrl && file.originFileObj) {
      finalPreviewUrl = await getBase64(file);
    }

    setPreviewImage(finalPreviewUrl);
    setPreviewOpen(true);
    setPreviewTitle(file.name || "Ảnh xem trước");
  };

  return (
    <>
      <Form.Item label="Quản lý Hình ảnh">
        <Upload
          listType="picture-card"
          fileList={fileList}
          multiple
          accept="image/*"
          beforeUpload={() => false} // Ngăn tự động upload
          onRemove={(file) => {
            const newFileList = fileList.filter(
              (item) => item.uid !== file.uid
            );
            setFileList(newFileList);
          }}
          onChange={({ fileList: newFileList }) => {
            setFileList(newFileList);
          }}
          onPreview={handlePreview}
        >
          {fileList.length < 10 && (
            <div>
              <div className="text-xl mb-1">+</div>
              <div style={{ marginTop: 8 }}>Thêm ảnh</div>
            </div>
          )}
        </Upload>
        <p className="text-xs text-gray-500 mt-1">
          Tối đa 10 ảnh. Bấm **X** để xóa, bấm vào ảnh để xem lớn.
        </p>
      </Form.Item>

      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
      >
        <img alt={previewTitle} style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </>
  );
};

// ========================================================================
// 4. COMPONENT CHÍNH (Đã được làm gọn)
// ========================================================================

export default function PostView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const [fileListState, setFileListState] = useState([]);

  // Gọi custom hook để lấy giá gợi ý, truyền `form` instance vào
  const { suggestedPrice, isFetchingPrice } = useSuggestedPrice(
    form,
    post?.productType
  );

  // Effect để tải dữ liệu bài đăng khi component mount
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/seller/posts/${id}`);
        const data = res.data.data || res.data;
        setPost(data);

        // Chuyển đổi mảng URL (string) thành cấu trúc fileList của Antd
        const initialFileList =
          data.images?.map((imageUrl, index) => ({
            uid: `-${index + 1}`,
            name: `image-${index + 1}.jpg`,
            status: "done",
            url: imageUrl,
          })) || [];

        setFileListState(initialFileList);

        // Set giá trị cho form
        form.setFieldsValue({
          ...data,
          wantsTrustedLabel: data.wantsTrustedLabel || false,
        });
      } catch (err) {
        toast.error(err.response?.data?.message || "Không tìm thấy bài đăng");
        navigate("/seller");
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchPost();
    }
  }, [id, navigate, form]);
  

  const handleSubmit = async (values) => {
    setSaving(true);
    try {
      // 1. Lọc ra ảnh mới (file object) và ảnh cũ (chỉ có url)
      const filesToUpload = fileListState
        .filter((f) => f.originFileObj)
        .map((f) => f.originFileObj);

      const existingUrls = fileListState
        .filter((f) => !f.originFileObj)
        .map((f) => f.url);

      // 2. Upload các file mới nếu có
      let uploadedNewImageUrls = [];
      if (filesToUpload.length > 0) {
        toast.info(`Đang tải lên ${filesToUpload.length} ảnh mới...`);
        uploadedNewImageUrls = await Promise.all(
          filesToUpload.map((file) => uploadFile(file))
        );
      }

      // 3. Kết hợp mảng ảnh cũ + ảnh mới
      const finalImageUrls = [...existingUrls, ...uploadedNewImageUrls];

      // 4. Gửi payload (values từ form) và mảng ảnh cuối cùng lên API
      await api.put(`/seller/posts/${id}`, {
        ...values, // Dữ liệu từ các Form.Item (title, price, description, ...)
        productType: post.productType,
        paymentTypes: post.paymentTypes,
        images: finalImageUrls, // Mảng URL ảnh đã xử lý
      });

      toast.success("Cập nhật thành công!");
      navigate(-1); // Quay lại trang trước
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setSaving(false);
    }
  };

  // Màn hình chờ
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Spin size="large" />
      </div>
    );
  }

  // Lỗi không có bài
  if (!post) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100 text-gray-600">
        Không thể tải dữ liệu bài đăng.
      </div>
    );
  }

  // Giao diện chính
  return (
    <div className="bg-transparent ">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
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
            onClick={() => form.submit()} // Kích hoạt onFinish (handleSubmit)
            className="flex items-center"
          >
            Lưu thay đổi
          </Button>
        </div>

        {/* Bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Form */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                    }
                    parser={(value) => value.replace(/\./g, "")}
                  />
                </Form.Item>

                <div className="md:col-span-1">
                  <Form.Item
                    name="wantsTrustedLabel"
                    valuePropName="checked"
                    className="mt-2"
                  >
                    <Checkbox>
                      Yêu cầu kiểm định và gắn nhãn "Trusted Label"
                    </Checkbox>
                  </Form.Item>
                </div>

                {/* Phần hiển thị giá gợi ý từ Hook */}
                <div className="flex items-center justify-end mt-[-10px]">
                  {isFetchingPrice && (
                    <p className="text-blue-500 text-sm">
                      Đang ước tính giá...
                    </p>
                  )}
                  {suggestedPrice !== null && !isFetchingPrice && (
                    <p className="text-sm text-green-600">
                      Giá AI gợi ý:{" "}
                      <span className="font-bold">
                        {Number(suggestedPrice).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </p>
                  )}
                  {suggestedPrice === null &&
                    !isFetchingPrice &&
                    (post.productType === "VEHICLE" ||
                      post.productType === "BATTERY") && (
                      <p className="text-sm text-gray-500">
                        Điền đủ thông số sản phẩm để nhận giá gợi ý.
                      </p>
                    )}
                </div>
              </div>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>

              {/* Chi tiết sản phẩm (Component con) */}
              <h2 className="text-xl font-semibold text-gray-700 mt-6">
                Chi tiết sản phẩm
              </h2>
              <Divider />
              <ProductSpecificFields productType={post.productType} />

              <Divider />
              <Form.Item label="Phương thức giao hàng" name="deliveryMethods">
                <Select mode="multiple">
                  <Select.Option value="STANDARD">STANDARD</Select.Option>
                  <Select.Option value="EXPRESS">EXPRESS</Select.Option>
                  <Select.Option value="PICKUP">PICKUP</Select.Option>
                </Select>
              </Form.Item>

              {/* Upload ảnh (Component con) */}
              <ImageUploader
                fileList={fileListState}
                setFileList={setFileListState}
              />
            </Form>
          </div>

          {/* Cột phải: Thông tin (Component con) */}
          <PostInfoSidebar post={post} />
        </div>
      </div>
    </div>
  );
}
