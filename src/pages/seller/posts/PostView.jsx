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
  Upload,
  Modal,
} from "antd";
import { toast } from "react-toastify";
import { ArrowLeft, Save } from "lucide-react"; // Icon cho các nút
import api from "../../../config/axios";
import { uploadFile } from "../../../utils/upload";

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
  //const [newImageFiles, setNewImageFiles] = useState([]);
  const [fileListState, setFileListState] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  // state để lưu giá ước tính
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  //  state để kiểm soát việc gọi API
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // **BƯỚC THÊM MỚI:** useEffect để gọi API gợi ý giá
  useEffect(() => {
    // Chỉ chạy nếu post đã có và productType là VEHICLE HOẶC BATTERY
    const isPricable =
      post &&
      (post.productType === "VEHICLE" || post.productType === "BATTERY");

    if (!isPricable) {
      setSuggestedPrice(null);
      return;
    }

    const fetchSuggestedPrice = async () => {
      // 1. LẤY GIÁ TRỊ TỪ FORM
      const values = form.getFieldsValue();
      let isMissingRequiredFields = false;
      let pricingPayload = {};

      // 2. CHỈ KIỂM TRA ĐIỀU KIỆN CƠ BẢN CỦA XE (theo swagger tối thiểu)
      if (post.productType === "VEHICLE") {
        if (
          !values.vehicleBrand ||
          !values.model ||
          !values.yearOfManufacture ||
          !values.mileage
        ) {
          isMissingRequiredFields = true;
        } else {
          pricingPayload = {
            productType: "VEHICLE",
            vehicleBrand: values.vehicleBrand,
            model: values.model,
            color: values.color,
            yearOfManufacture: Number(values.yearOfManufacture),
            mileage: Number(values.mileage),
          };
        }
      } else if (post.productType === "BATTERY") {
        if (
          !values.batteryType ||
          !values.capacity ||
          !values.voltage ||
          !values.batteryBrand
        ) {
          isMissingRequiredFields = true;
        } else {
          pricingPayload = {
            productType: "BATTERY",
            batteryType: values.batteryType,
            capacity: Number(values.capacity),
            voltage: values.voltage,
            batteryBrand: values.batteryBrand,
          };
        }
      } else {
        // Nếu không phải 2 loại này, không cần gợi ý giá
        isMissingRequiredFields = true;
      } // 2. THOÁT NẾU THIẾU TRƯỜNG HOẶC LOẠI SẢN PHẨM KHÔNG HỖ TRỢ

      if (isMissingRequiredFields) {
        setSuggestedPrice(null);
        return;
      }

      setIsFetchingPrice(true);
      setSuggestedPrice(null);

      try {
        const priceRes = await api.post(
          "/seller/ai/suggest-price",
          pricingPayload
        );
        setSuggestedPrice(priceRes.data.suggestedPrice);
      } catch (err) {
        console.error(
          "Lỗi khi fetch giá ước tính:",
          err.response?.data?.message || err.message
        );
        setSuggestedPrice(null);
      } finally {
        setIsFetchingPrice(false);
      }
    };

    // Sử dụng debounce với setTimeout để tránh gọi API quá nhiều
    const handler = setTimeout(() => {
      fetchSuggestedPrice();
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [
    form,
    post, // Quan trọng: cần đảm bảo form/post đã sẵn sàng
    // Dùng form.getFieldsValue để lấy giá trị mới nhất của các trường cần theo dõi
    form.getFieldValue("vehicleBrand"),
    form.getFieldValue("model"),
    form.getFieldValue("yearOfManufacture"),
    form.getFieldValue("mileage"),
    form.getFieldValue("color"),
    form.getFieldValue("batteryType"),
    form.getFieldValue("capacity"),
    form.getFieldValue("voltage"),
    form.getFieldValue("batteryBrand"),
  ]);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      // Đảm bảo file là File object, không phải file đã có URL
      const fileObject = file.originFileObj || file;

      if (fileObject instanceof File) {
        reader.readAsDataURL(fileObject);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      } else {
        // Trả về chính URL nếu nó không phải là File object (ảnh cũ)
        resolve(file.url);
      }
    });
  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/seller/posts/${id}`);
        const data = res.data.data || res.data;
        setPost(data);
        const initialFileList =
          data.images?.map((img, index) => ({
            uid: img.id ? String(img.id) : `-${index + 1}`, // Dùng ID API hoặc ID tạm
            name: `image-${img.id || index + 1}.jpg`,
            status: "done",
            url: img.imageUrl, // Đây là URL ảnh đã tồn tại
            originalUrl: img.imageUrl, // Giữ lại URL gốc
          })) || [];

        setFileListState(initialFileList); // Set danh sách file ban đầu
        const formData = {
          ...data,
          // Chuyển đổi mảng URL thành format mà Form.Item có thể hiểu (nếu cần)
          images: initialFileList.map((f) => f.url),
        };
        form.setFieldsValue(formData); // Điền toàn bộ dữ liệu vào form
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
      const filesToUpload = fileListState
        .filter((f) => f.originFileObj) // File mới được chọn từ máy tính
        .map((f) => f.originFileObj);

      const existingUrls = fileListState
        .filter((f) => !f.originFileObj) // File đã có (chỉ có URL)
        .map((f) => f.url);

      // 2. Upload các file mới
      let uploadedNewImageUrls = [];
      if (filesToUpload.length > 0) {
        toast.info(`Đang tải lên ${filesToUpload.length} ảnh mới...`);
        uploadedNewImageUrls = await Promise.all(
          filesToUpload.map((file) => uploadFile(file))
        );
      }

      // 3. Kết hợp URLs ảnh cũ (còn lại) và URLs mới
      const finalImageUrls = [...existingUrls, ...uploadedNewImageUrls];

      // CẬP NHẬT PAYLOAD VÀ GỌI API
      await api.put(`/seller/posts/${id}`, {
        ...values,
        productType: post.productType,
        images: finalImageUrls,
      });

      toast.success("Cập nhật thành công!");
      navigate(-1);
      // Cập nhật form/state (Quan trọng để hiển thị ảnh ngay lập tức nếu không navigate)
      form.setFieldsValue({ ...values, images: finalImageUrls });
      setPost({ ...post, ...values, images: finalImageUrls });
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

                <div className="md:col-span-1">
                  {/* Thẻ trống để giữ vị trí dưới Tiêu đề */}
                </div>

                <>
                  {isFetchingPrice && (
                    <p className="mt-[-10px] text-blue-500 text-sm flex justify-end">
                      Đang ước tính giá...
                    </p>
                  )}
                  {suggestedPrice !== null && !isFetchingPrice && (
                    <p className=" mt-[-10px] text-sm text-green-600 flex justify-end">
                      Giá AI gợi ý:{" "}
                      <span className="font-bold">
                        {Number(suggestedPrice).toLocaleString("vi-VN")} VNĐ
                      </span>
                    </p>
                  )}
                  {suggestedPrice === null && !isFetchingPrice && (
                    <p className="mt-[-10px] text-sm text-gray-500 flex justify-end">
                      Điền đủ thông số sản phẩm để nhận giá gợi ý.
                    </p>
                  )}
                </>
              </div>
              <Form.Item label="Mô tả" name="description">
                <Input.TextArea rows={4} />
              </Form.Item>
              <Form.Item label="Địa chỉ" name="address">
                <Input readOnly />
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
              )}

              {post.productType === "BATTERY" && (
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
              )}

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
              <Form.Item label="Quản lý Hình ảnh">
                <Upload
                  listType="picture-card"
                  fileList={fileListState}
                  multiple
                  accept="image/*"
                  beforeUpload={() => false}
                  onRemove={(file) => {
                    const newFileList = fileListState.filter(
                      (item) => item.uid !== file.uid
                    );
                    setFileListState(newFileList);
                  }}
                  onChange={({ fileList: newFileList }) => {
                    setFileListState(newFileList);
                  }}
                  // <<< THÊM prop ONPREVIEW VÀO ĐÂY >>>
                  onPreview={async (file) => {
                    const previewUrl = file.url || file.preview;
                    let finalPreviewUrl = previewUrl;

                    if (!previewUrl && file.originFileObj) {
                      // Là file mới: Đọc file để lấy Data URL
                      finalPreviewUrl = await getBase64(file);
                    }

                    setPreviewImage(finalPreviewUrl);
                    setPreviewOpen(true);
                    setPreviewTitle(file.name || "Ảnh xem trước");

                    // Xóa file.preview nếu không dùng cơ chế mặc định
                    delete file.preview;

                    // THÊM LỆNH RETURN ĐỂ NGĂN UPLOAD TỰ MỞ MODAL
                    return;
                  }}
                >
                  {fileListState.length < 10 && (
                    <div>
                      <div className="text-xl mb-1">+</div>
                      <div style={{ marginTop: 8 }}>Thêm ảnh</div>
                    </div>
                  )}
                </Upload>
                <p className="text-xs text-gray-500 mt-1">
                  Tối đa 10 ảnh. Bấm vào biểu tượng **X** để xóa ảnh, **bấm vào
                  ảnh để xem lớn**.
                </p>{" "}
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
                  {post.trusted ? "Premium" : "Normal"}
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
      <Modal
        open={previewOpen}
        title={previewTitle}
        footer={null}
        onCancel={() => setPreviewOpen(false)}
        centered
      >
        <img alt={previewTitle} style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
}
