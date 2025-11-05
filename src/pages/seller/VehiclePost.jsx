import React, { useEffect, useState } from "react";
import { FormInput } from "../../components/Upload/FormInput";
import PostTypeToggle from "../../components/Upload/PostTypeToggle";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../utils/upload";
import ImageUpload from "../../components/Upload/ImageUploadArea";


const parseNumber = (value) => {
  if (typeof value !== "string") return "";
  return value.replace(/[^\d]/g, "");
};


const formatNumber = (value) => {
  const rawValue = parseNumber(String(value)); // Luôn làm sạch trước
  if (rawValue === "") return "";

  // Sử dụng Intl.NumberFormat với locale "vi-VN" để có dấu chấm phân cách
  return new Intl.NumberFormat("vi-VN").format(Number(rawValue));
};
export default function VehiclePost() {
  const [priorityPackages, setPriorityPackages] = useState([]);
  const [paymentTypesOptions, setPaymentTypesOptions] = useState([]);
  const [deliveryMethodsOptions, setDeliveryMethodsOptions] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);

  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productType: "VEHICLE",
    title: "",
    description: "",
    price: "",
    address: user?.address || "",
    priorityPackageId: "",
    deliveryMethods: [],
    paymentTypes: [],
    isUseWallet: false,
    wantsTrustedLabel: false,

    // Thông tin xe
    vehicleBrand: "",
    model: "",
    yearOfManufacture: "",
    color: "",
    mileage: "",
    weight: "",
  });
  // state để lưu giá ước tính
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  //  state để kiểm soát việc gọi API
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  // Thay thế đoạn useEffect hiện tại bằng đoạn này
  useEffect(() => {
    const fetchSuggestedPrice = async () => {
      // 1. CHỈ KIỂM TRA ĐIỀU KIỆN CƠ BẢN CỦA XE (theo swagger tối thiểu)
      if (
        !formData.vehicleBrand ||
        !formData.model ||
        !formData.yearOfManufacture ||
        !formData.mileage
      ) {
        setSuggestedPrice(null);
        return;
      }

      setIsFetchingPrice(true);
      setSuggestedPrice(null);

      // 2. TẠO PAYLOAD CHỈ VỚI THÔNG TIN CƠ BẢN CỦA XE
      const pricingPayload = {
        productType: "VEHICLE",
        vehicleBrand: formData.vehicleBrand,
        model: formData.model,
        color: formData.color,
        yearOfManufacture: Number(formData.yearOfManufacture),
        mileage: Number(formData.mileage),
      };

      try {
        const priceRes = await api.post(
          "/seller/ai/suggest-price",
          pricingPayload
        );
        setSuggestedPrice(priceRes.data.suggestedPrice);
        console.log(priceRes.data.suggestPrice);
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

    const handler = setTimeout(() => {
      fetchSuggestedPrice();
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [
    formData.vehicleBrand,
    formData.model,
    formData.yearOfManufacture,
    formData.mileage,
    formData.color, // Thêm color vào dependency nếu bạn gửi nó
    // Đã loại bỏ các trường Pin khỏi dependency array
  ]);
  // Fetch APIs
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [pkgRes, payRes, delivRes] = await Promise.all([
          api.get("/seller/priority-packages"),
          api.get("/seller/payment-types"),
          api.get("/seller/delivery-methods"),
        ]);
        setPriorityPackages(pkgRes.data);
        setPaymentTypesOptions(payRes.data);
        setDeliveryMethodsOptions(delivRes.data);
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
      }
    };
    fetchAll();
  }, []);

  // handle change input
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "wantsTrustedLabel" || name === "isUseWallet") {
        setFormData((prev) => ({
          ...prev,
          [name]: checked, // Cập nhật bằng true hoặc false
        }));
      } else {
        // 2. Xử lý checkbox dạng mảng (chọn nhiều)
        if (checked) {
          setFormData((prev) => ({ ...prev, [name]: [...prev[name], value] }));
        } else {
          setFormData((prev) => ({
            ...prev,
            [name]: prev[name].filter((v) => v !== value),
          }));
        }
      }
    } else {
      // 1. Nếu là trường cần format số (price hoặc mileage)
      if (name === "price" || name === "mileage") {
        // Lấy giá trị số thô (loại bỏ dấu ".")
        const numericValue = parseNumber(value);
        if (!isNaN(Number(numericValue))) {
          setFormData({ ...formData, [name]: numericValue });
        }
      } else {

        setFormData({ ...formData, [name]: value });
      }

    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // Lấy ra mảng File object (originFileObj)
      const filesToUpload = fileList
        .filter((f) => f.originFileObj)
        .map((f) => f.originFileObj);

      if (filesToUpload.length === 0) {
        toast.warning("Vui lòng chọn ít nhất một ảnh sản phẩm.");
        return;
      }

      // Upload chỉ các file object đã lọc
      const uploadedImageUrls = await Promise.all(
        filesToUpload.map(async (file) => {
          const url = await uploadFile(file);
          return url;
        })
      );
      const payload = {
        productType: "VEHICLE",
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        priorityPackageId: formData.priorityPackageId || null,
        deliveryMethods: formData.deliveryMethods.map((m) =>
          m.replace(" ", "_").toUpperCase()
        ),
        paymentTypes: formData.paymentTypes.map((p) => p.toUpperCase()),
        images: uploadedImageUrls,
        wantsTrustedLabel: formData.wantsTrustedLabel,

        // Các trường vehicle
        vehicleBrand: formData.vehicleBrand,
        model: formData.model,
        yearOfManufacture: Number(formData.yearOfManufacture),
        color: formData.color,
        mileage: Number(formData.mileage),
        weight: Number(formData.weight) * 1000,
      };

      const response = await api.post("/seller/posts", payload);
      navigate("/seller");
      console.log("Đăng bài thành công:", response.data);
      toast.success("Đăng bài thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false); // TẮT LOADING
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-8 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <PostTypeToggle />
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Đăng bán Xe điện
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Điền thông tin chi tiết để đăng bán.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Thông tin cơ bản */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-5">
            <FormInput
              id="title"
              name="title"
              label="Tiêu đề bài đăng"
              placeholder="Ví dụ: Honda Wave RSX 2020, Màu đỏ"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <FormInput
              id="address"
              name="address"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
              readOnly
            />

            {/* Gói đề xuất */}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Gói đề xuất
              </label>
              <select
                name="priorityPackageId"
                value={formData.priorityPackageId}
                onChange={handleChange}
                className="w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:text-white p-3"
              >
                <option value="">-- Không chọn --</option>
                {priorityPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.durationDays} ngày - {pkg.type} - {pkg.price} VNĐ
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery methods */}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Phương thức giao hàng
              </label>
              {deliveryMethodsOptions.map((method) => (
                <label key={method} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="deliveryMethods"
                    value={method}
                    checked={formData.deliveryMethods.includes(method)}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{method}</span>
                </label>
              ))}
            </div>

            {/* Payment types */}
            <div>
              <label className="block mb-1 text-gray-700 dark:text-gray-300">
                Phương thức thanh toán
              </label>
              {paymentTypesOptions.map((type) => (
                <label key={type} className="inline-flex items-center mr-4">
                  <input
                    type="checkbox"
                    name="paymentTypes"
                    value={type}
                    checked={formData.paymentTypes.includes(type)}
                    onChange={handleChange}
                    className="form-checkbox"
                  />
                  <span className="ml-2">{type}</span>
                </label>
              ))}
            </div>

            <div>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="wantsTrustedLabel"
                  checked={formData.wantsTrustedLabel}
                  onChange={handleChange}
                  className="form-checkbox h-5 w-5 text-emerald-600 rounded"
                />
                <span className="ml-3 text-gray-700 dark:text-gray-300">
                  Bạn có muốn thêm nhãn kiểm định ?
                </span>
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 ml-8">
                Sản phẩm của bạn sẽ được kiểm định bởi chuyên gia và gắn nhãn
              </p>
            </div>
          </div>

          {/* Thông số kỹ thuật xe */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              2. Thông số kỹ thuật
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                id="vehicleBrand"
                name="vehicleBrand"
                label="Hãng xe"
                placeholder="Honda"
                value={formData.vehicleBrand}
                onChange={handleChange}
                required
              />
              <FormInput
                id="model"
                name="model"
                label="Dòng xe"
                placeholder="Air Blade"
                value={formData.model}
                onChange={handleChange}
                required
              />
              <FormInput
                id="yearOfManufacture"
                name="yearOfManufacture"
                label="Năm sản xuất"
                type="number"
                placeholder="2020"
                value={formData.yearOfManufacture}
                onChange={handleChange}
                required
              />
              <FormInput
                id="color"
                name="color"
                label="Màu xe"
                placeholder="Đỏ"
                value={formData.color}
                onChange={handleChange}
                required
              />
              <FormInput
                id="mileage"
                name="mileage"
                label="Số km đã đi"
                type="text"
                inputMode="numeric" // <-- Thêm: Giữ bàn phím số trên di động
                placeholder="5.000"
                value={formatNumber(formData.mileage)} // <-- SỬ DỤNG HÀM FORMAT
                onChange={handleChange}
                unit="km"
                required
              />
              <FormInput
                id="weight"
                name="weight"
                label="Trọng lượng xe"
                type="number"
                placeholder="100"
                value={formData.weight}
                onChange={handleChange}
                unit="kg"
                required
              />
            </div>
            <FormInput
              style={{ width: "100%" }}
              id="price"
              name="price"
              label="Giá bán"
              type="text" 
              inputMode="numeric" 
              placeholder="10.000.000" 
              value={formatNumber(formData.price)} // <-- SỬ DỤNG HÀM FORMAT
              onChange={handleChange}
              unit="VNĐ"
              required
            />
            {isFetchingPrice && (
              <p className="mt-2 text-blue-500">Đang ước tính giá...</p>
            )}
            {suggestedPrice !== null && !isFetchingPrice && (
              <p className="mt-2 text-sm text-emerald-600 dark:text-emerald-400">
                ChatGPT Giá gợi ý:{" "}
                <span className="font-bold">
                  {Number(suggestedPrice).toLocaleString("vi-VN")} VNĐ
                </span>
              </p>
            )}
            {/* Nếu không có giá gợi ý và không đang loading, có thể thêm hướng dẫn */}
            {suggestedPrice === null && !isFetchingPrice && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Điền đủ thông số xe để nhận giá gợi ý.
              </p>
            )}
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Mô tả & Hình ảnh
            </h2>

            <textarea
              id="description"
              name="description"
              rows="5" // <-- Đã thay đổi từ rows="5" thành rows="10"
              className="block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:text-white p-3"
              placeholder="Mô tả chi tiết về xe..."
              value={formData.description}
              onChange={handleChange}
              required
            />

            <ImageUpload
              fileList={fileList}
              setFileList={setFileList}
              maxCount={10}
            />
          </div>
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting} // Ngăn double-click
              className={`px-8 py-3 text-white rounded-full font-semibold transition duration-300 ${
                isSubmitting
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {isSubmitting ? "Đang đăng..." : "Đăng Bài Ngay"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
