import React, { useState } from "react";
import { LucideBattery, LucideDollarSign, LucideRuler } from "lucide-react";
import ImageUploadArea from "../../components/Upload/ImageUploadArea";
import PostTypeToggle from "../../components/Upload/PostTypeToggle";
import { FormInput } from "../../components/Upload/FormInput";

export default function BatteryPost() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    batteryCapacity: "",
    batteryHealth: "",
    address: "",
    priorityPackageId: "",
    deliveryMethods: [],
    paymentTypes: [],
    isUseWallet: false,
  });

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

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate cơ bản
    if (!formData.address.trim()) {
      alert("Vui lòng nhập địa chỉ!");
      return;
    }
    if (!formData.deliveryMethods.length) {
      alert("Chọn ít nhất một phương thức giao hàng");
      return;
    }
    if (!formData.paymentTypes.length) {
      alert("Chọn ít nhất một loại thanh toán");
      return;
    }

    // Gửi dữ liệu lên API
    console.log("Dữ liệu pin:", { ...formData, productType: "battery" });
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

          {/* Thông số kỹ thuật Pin */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
              2. Thông số kỹ thuật Pin
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                id="batteryCapacity"
                name="batteryCapacity"
                label="Dung lượng (Capacity)"
                type="number"
                placeholder="60"
                icon={LucideRuler}
                value={formData.batteryCapacity}
                onChange={handleChange}
                unit="kWh"
                required
              />
              <FormInput
                id="batteryHealth"
                name="batteryHealth"
                label="Sức khỏe Pin (SOH)"
                type="number"
                placeholder="95"
                icon={LucideRuler}
                value={formData.batteryHealth}
                onChange={handleChange}
                unit="%"
                required
              />
            </div>
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
              placeholder="Thông tin chi tiết về pin, tình trạng, chu kỳ sạc, thương hiệu..."
              value={formData.description}
              onChange={handleChange}
              required
            />
            <ImageUploadArea />
          </div>

          {/* Phương thức giao hàng */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Phương thức giao hàng
            </label>
            {["Home Delivery", "Store Pickup"].map((method) => (
              <label key={method} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name="deliveryMethods"
                  value={method}
                  checked={formData.deliveryMethods.includes(method)}
                  onChange={handleChange}
                />
                <span className="ml-2">{method}</span>
              </label>
            ))}
          </div>

          {/* Loại thanh toán */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <label className="block text-gray-700 dark:text-gray-300 mb-2">
              Phương thức thanh toán
            </label>
            {["VNpay"].map((payment) => (
              <label key={payment} className="inline-flex items-center mr-4">
                <input
                  type="checkbox"
                  name="paymentTypes"
                  value={payment}
                  checked={formData.paymentTypes.includes(payment)}
                  onChange={handleChange}
                />
                <span className="ml-2">{payment}</span>
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
