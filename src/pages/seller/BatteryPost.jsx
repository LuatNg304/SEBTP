import React, { useEffect, useState } from "react";

import PostTypeToggle from "../../components/Upload/PostTypeToggle";
import { FormInput } from "../../components/Upload/FormInput";
import { useSelector } from "react-redux";
import api from "../../config/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../utils/upload";
import ImageUpload from "../../components/Upload/ImageUploadArea";

export default function BatteryPost() {
  const [priorityPackages, setPriorityPackages] = useState([]);
  const [paymentTypesOptions, setPaymentTypesOptions] = useState([]);
  const [deliveryMethodsOptions, setDeliveryMethodsOptions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fileList, setFileList] = useState([]);
  const user = useSelector((state) => state.account.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    productType: "BATTERY",
    title: "",
    description: "",
    price: "",
    address: user?.address || "",
    priorityPackageId: "",
    deliveryMethods: [],
    paymentTypes: [],

    // --- Thông tin pin ---
    batteryType: "",
    capacity: "",
    voltage: "",
    batteryBrand: "",
    weight: "",
  });
  // state để lưu giá ước tính
  const [suggestedPrice, setSuggestedPrice] = useState(null);
  //  state để kiểm soát việc gọi API
  const [isFetchingPrice, setIsFetchingPrice] = useState(false);

  useEffect(() => {
    const fetchSuggestedPrice = async () => {
      // 1. CHỈ KIỂM TRA ĐIỀU KIỆN CƠ BẢN CỦA PIN/ẮC QUY
      if (
        !formData.batteryType ||
        !formData.capacity ||
        !formData.voltage ||
        !formData.batteryBrand ||
        Number(formData.capacity) <= 0 // Thêm kiểm tra giá trị số hợp lệ
      ) {
        setSuggestedPrice(null);
        return;
      }

      setIsFetchingPrice(true);
      setSuggestedPrice(null);

      // 2. TẠO PAYLOAD CHỈ VỚI THÔNG TIN CƠ BẢN CỦA PIN
      const pricingPayload = {
        productType: "BATTERY",
        batteryType: formData.batteryType,
        capacity: Number(formData.capacity),
        voltage: formData.voltage,
        batteryBrand: formData.batteryBrand,
      };

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

    const handler = setTimeout(() => {
      fetchSuggestedPrice();
    }, 800);

    return () => {
      clearTimeout(handler);
    };
  }, [
    // 💡 DEPENDENCY ARRAY CHỈ CHỨA CÁC TRƯỜNG PIN
    formData.batteryType,
    formData.capacity,
    formData.voltage,
    formData.batteryBrand,
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

  // handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "deliveryMethods") {
      setFormData((prev) => ({
        ...prev,
        deliveryMethods: checked
          ? [...prev.deliveryMethods, value]
          : prev.deliveryMethods.filter((m) => m !== value),
      }));
    } else if (type === "checkbox" && name === "paymentTypes") {
      setFormData((prev) => ({
        ...prev,
        paymentTypes: checked
          ? [...prev.paymentTypes, value]
          : prev.paymentTypes.filter((p) => p !== value),
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      // 1. Lọc ra các File Object thực sự cần upload
      const filesToUpload = fileList
        .filter((f) => f.originFileObj)
        .map((f) => f.originFileObj); // Kiểm tra bắt buộc

      const uploadedImageUrls = await Promise.all(
        filesToUpload.map(async (file) => {
          const url = await uploadFile(file);
          return url;
        })
      );
      const payload = {
        productType: formData.productType,
        title: formData.title,
        description: formData.description,
        price: Number(formData.price),
        address: formData.address,
        priorityPackageId: formData.priorityPackageId || null,
        deliveryMethods: formData.deliveryMethods.map((m) =>
          m.replace(" ", "_").toUpperCase()
        ),
        paymentTypes: formData.paymentTypes.map((p) => p.toUpperCase()),
        isUseWallet: formData.isUseWallet,
        images: uploadedImageUrls,

        // --- Truyền thông tin pin ---
        batteryType: formData.batteryType,
        capacity: Number(formData.capacity),
        voltage: formData.voltage,
        batteryBrand: formData.batteryBrand,
        weight: Number(formData.weight) * 1000,
      };

      const response = await api.post("/seller/posts", payload);
      navigate("/seller");
      console.log("Bài đăng thành công:", response.data);
      toast.success("Đăng bài thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        <PostTypeToggle />
        <header>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Đăng bán Pin điện
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Điền thông tin chi tiết pin để đăng bán.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cơ bản */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
              1. Thông tin cơ bản
            </h2>
            <FormInput
              id="title"
              name="title"
              label="Tiêu đề bài đăng"
              placeholder="Ví dụ: Bộ Pin LFP 60kWh, SOH 95%"
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
          </div>

          {/* --- Thông số Pin --- */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
              2. Thông số Pin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                id="batteryBrand"
                name="batteryBrand"
                label="Thương hiệu pin"
                placeholder="CATL, LG, VinES..."
                value={formData.batteryBrand}
                onChange={handleChange}
                required
              />
              <FormInput
                id="batteryType"
                name="batteryType"
                label="Loại pin"
                placeholder="LFP, NMC..."
                value={formData.batteryType}
                onChange={handleChange}
                required
              />
              <FormInput
                id="capacity"
                name="capacity"
                label="Dung lượng"
                type="number"
                placeholder="60 (Ah hoặc Wh)"
                value={formData.capacity}
                onChange={handleChange}
                required
              />
              <FormInput
                id="voltage"
                name="voltage"
                label="Điện áp định mức"
                placeholder="48V, 60V..."
                value={formData.voltage}
                onChange={handleChange}
                required
              />
              <FormInput
                id="weight"
                name="weight"
                label="Trong lượng pin"
                placeholder="50 (kg)"
                value={formData.weight}
                onChange={handleChange}
                required
              />
            </div>
            <FormInput
              id="price"
              name="price"
              label="Giá bán"
              type="number"
              placeholder="15,000,000"
              value={formData.price}
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

          {/* Mô tả & Hình ảnh */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
              3. Mô tả & Hình ảnh
            </h2>
            <textarea
              id="description"
              name="description"
              rows="5"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              placeholder="Thông tin chi tiết về pin, tình trạng, chu kỳ sạc..."
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

          {/* Gói đề xuất */}
          <div className="mt-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Gói đề xuất
            </label>
            <select
              name="priorityPackageId"
              value={formData.priorityPackageId}
              onChange={(e) => {
                const pkgId = e.target.value;
                setFormData((prev) => ({ ...prev, priorityPackageId: pkgId }));
                const selected = priorityPackages.find((p) => p.id === pkgId);
                setSelectedPackage(selected);
              }}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 focus:ring-emerald-500 focus:border-emerald-500"
            >
              <option value="">-- Chọn gói đề xuất (không bắt buộc) --</option>
              {priorityPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.type} ({pkg.durationDays} ngày) - {pkg.price} VNĐ
                </option>
              ))}
            </select>
          </div>

          {/* Delivery & Payment */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
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

            <div>
              <label className="block text-gray-700 dark:text-gray-300 mb-1">
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
          </div>

          <div className="flex justify-end pt-4">
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
