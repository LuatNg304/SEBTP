import React, { useEffect, useState } from "react";
import { LucideBattery, LucideDollarSign, LucideRuler } from "lucide-react";
import ImageUploadArea from "../../components/Upload/ImageUploadArea";
import PostTypeToggle from "../../components/Upload/PostTypeToggle";
import { FormInput } from "../../components/Upload/FormInput";
import { useSelector } from "react-redux";
import api from "../../config/axios";
import { toast } from "react-toastify";

export default function BatteryPost() {
  const [priorityPackages, setPriorityPackages] = useState([]);
  const [paymentTypesOptions, setPaymentTypesOptions] = useState([]);
  const [deliveryMethodsOptions, setDeliveryMethodsOptions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const user = useSelector((state) => state.account.user);
  const [formData, setFormData] = useState({
    productType: "battery", // mặc định là xe
    title: "",
    description: "",
    price: "",
    address: user?.address || "",
    priorityPackageId: "", // gói ưu tiên
    deliveryMethods: [], // mảng các delivery method
    paymentTypes: [], // mảng các payment type
    isUseWallet: false, // sử dụng ví hay không
    productYear: "",
    
  });
  // Fetch priority packages
  useEffect(() => {
    const fetchPriorityPackages = async () => {
      try {
        const resp = await api.get("/seller/priority-packages");
        setPriorityPackages(resp.data); // giả sử API trả về array JSON
      } catch (err) {
        console.error("Lỗi lấy gói ưu tiên:", err);
      }
    };

    fetchPriorityPackages();
  }, []);

  // Fetch payment types
  useEffect(() => {
    const fetchPaymentTypes = async () => {
      try {
        const resp = await api.get("/seller/payment-types");
        setPaymentTypesOptions(resp.data); //  API trả về array: ["DEPOSIT","FULL", ...]
      } catch (err) {
        console.error("Lỗi lấy phương thức thanh toán:", err);
      }
    };
    fetchPaymentTypes();
  }, []);

  // Fetch delivery methods
  useEffect(() => {
    const fetchDeliveryMethods = async () => {
      try {
        const resp = await api.get("/seller/delivery-methods");
        setDeliveryMethodsOptions(resp.data); // ["HOME DELIVERY", "STORE PICKUP", ...]
      } catch (err) {
        console.error("Lỗi lấy phương thức giao hàng:", err);
      }
    };
    fetchDeliveryMethods();
  }, []);
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox" && name === "deliveryMethods") {
      setFormData((prev) => {
        const newMethods = checked
          ? [...prev.deliveryMethods, value]
          : prev.deliveryMethods.filter((m) => m !== value);
        return { ...prev, deliveryMethods: newMethods };
      });
    } else if (type === "checkbox" && name === "paymentTypes") {
      setFormData((prev) => {
        const newPayments = checked
          ? [...prev.paymentTypes, value]
          : prev.paymentTypes.filter((p) => p !== value);
        return { ...prev, paymentTypes: newPayments };
      });
    } else if (type === "checkbox" && name === "isUseWallet") {
      setFormData((prev) => ({ ...prev, isUseWallet: checked }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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
        productYear: Number(formData.productYear),
       
      };

      const response = await api.post("/seller/posts", payload);
      console.log("Bài đăng thành công:", response.data);
      toast.success("Đăng bài thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent dark:bg-gray-900 p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
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
              icon={LucideBattery}
              value={formData.title}
              onChange={handleChange}
              required
            />
            <FormInput
              id="price"
              name="price"
              label="Giá bán"
              type="number"
              placeholder="15,000,000"
              icon={LucideDollarSign}
              value={formData.price}
              onChange={handleChange}
              unit="VNĐ"
              required
            />
            <FormInput
              id="address"
              name="address"
              label="Địa chỉ"
              placeholder="Nhập địa chỉ"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          

          {/* Mô tả & Hình ảnh */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
              2. Mô tả & Hình ảnh
            </h2>
            <textarea
              id="description"
              name="description"
              rows="5"
              className="block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white p-3 focus:ring-emerald-500 focus:border-emerald-500 text-sm"
              placeholder="Thông tin chi tiết về pin, tình trạng, chu kỳ sạc, thương hiệu..."
              value={formData.description}
              onChange={handleChange}
              required
            />
            <ImageUploadArea />
          </div>

          {/* Gói ưu tiên */}
          <div className="mt-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-gray-700 dark:text-gray-300 mb-1">
              Gói đề xuất
            </label>
            <select
              name="priorityPackageId"
              value={formData.priorityPackageId}
              onChange={(e) => {
                const pkgId = e.target.value;

                // cập nhật id của gói vào formData
                setFormData((prev) => ({
                  ...prev,
                  priorityPackageId: pkgId,
                }));

                // tìm gói tương ứng trong danh sách
                const selected = priorityPackages.find((p) => p.id === pkgId);
                setSelectedPackage(selected);
              }}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 
             dark:bg-gray-700 dark:text-white p-3 focus:ring-emerald-500 
             focus:border-emerald-500"
            >
              <option value="">-- Chọn gói đề xuất (không bắt buộc) --</option>
              {priorityPackages.map((pkg) => (
                <option key={pkg.id} value={pkg.id}>
                  {pkg.type} ({pkg.durationDays} ngày) - {pkg.price} VNĐ
                </option>
              ))}
            </select>
          </div>

          {/* Delivery methods dynamic */}
          <div className="mt-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
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

          {/* Payment types dynamic */}
          <div className="mt-2 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
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

          {/* Sử dụng ví */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                name="isUseWallet"
                checked={formData.isUseWallet}
                onChange={handleChange}
              />
              <span className="ml-2">Sử dụng ví</span>
            </label>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-emerald-600 text-white font-semibold rounded-full shadow-lg hover:bg-emerald-700 transition duration-300"
            >
              Đăng Bài Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
