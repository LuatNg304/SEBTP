import React, { useEffect, useState } from "react";
import {
  LucideCalendar,
  LucideCar,
  LucideDollarSign,
  LucideRuler,
} from "lucide-react";
import ImageUploadArea from "../../components/Upload/ImageUploadArea";
import { FormInput } from "../../components/Upload/FormInput";
import PostTypeToggle from "../../components/Upload/PostTypeToggle";
import api from "../../config/axios";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

export default function VehiclePost() {
  const [priorityPackages, setPriorityPackages] = useState([]);
  const [paymentTypesOptions, setPaymentTypesOptions] = useState([]);
  const [deliveryMethodsOptions, setDeliveryMethodsOptions] = useState([]);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const user = useSelector((state) => state.account.user);
  const [formData, setFormData] = useState({
    productType: "vehicle", // mặc định là xe
    title: "",
    description: "",
    price: "",
    address: user?.address || "",
    priorityPackageId: "", // gói ưu tiên
    deliveryMethods: [], // mảng các delivery method
    paymentTypes: [], // mảng các payment type
    isUseWallet: false, // sử dụng ví hay không
    productYear: "",
    vehicleMileage: "",
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
    if (type === "checkbox") {
      if (checked) {
        setFormData((prev) => ({
          ...prev,
          [name]: [...prev[name], value],
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: prev[name].filter((v) => v !== value),
        }));
      }
    } else if (type === "radio") {
      setFormData({ ...formData, [name]: value });
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
        vehicleMileage: Number(formData.vehicleMileage),
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
    <div className="min-h-screen bg-transparent p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
        <PostTypeToggle
          currentType={formData.productType}
          setType={(type) => setFormData({ ...formData, productType: type })}
        />

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
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
              1. Thông tin cơ bản
            </h2>

            <FormInput
              id="title"
              name="title"
              label="Tiêu đề bài đăng"
              placeholder="Ví dụ: VinFast Lux SA 2021, Màu Đỏ"
              icon={LucideCar}
              value={formData.title}
              onChange={handleChange}
              required
            />

            <FormInput
              id="price"
              name="price"
              label="Giá bán"
              type="number"
              placeholder="850,000,000"
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

            {/* Gói ưu tiên */}
            <div className="mt-2">
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
                <option value="">
                  -- Chọn gói đề xuất (không bắt buộc) --
                </option>
                {priorityPackages.map((pkg) => (
                  <option key={pkg.id} value={pkg.id}>
                    {pkg.type} ({pkg.durationDays} ngày) - {pkg.price} VNĐ
                  </option>
                ))}
              </select>
            </div>

            {/* Delivery methods dynamic */}
            <div className="mt-2">
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
            <div className="mt-2">
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

            {/* Use wallet */}
            <div className="mt-2">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="isUseWallet"
                  checked={formData.isUseWallet}
                  onChange={(e) =>
                    setFormData({ ...formData, isUseWallet: e.target.checked })
                  }
                  className="form-checkbox"
                />
                <span className="ml-2 text-gray-700 dark:text-gray-300">
                  Sử dụng ví điện tử
                </span>
              </label>
            </div>
          </div>

          {/* Thông số kỹ thuật Xe */}
          {formData.productType === "vehicle" && (
            <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 space-y-5">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b pb-3 border-gray-100 dark:border-gray-700">
                2. Thông số kỹ thuật Xe
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormInput
                  id="productYear"
                  name="productYear"
                  label="Năm sản xuất"
                  type="number"
                  placeholder="2021"
                  icon={LucideCalendar}
                  value={formData.productYear}
                  onChange={handleChange}
                  required
                />
                <FormInput
                  id="vehicleMileage"
                  name="vehicleMileage"
                  label="Số km đã đi"
                  type="number"
                  placeholder="50,000"
                  icon={LucideRuler}
                  value={formData.vehicleMileage}
                  onChange={handleChange}
                  unit="km"
                  required
                />
              </div>
            </div>
          )}

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
              placeholder="Thông tin chi tiết về tình trạng, lịch sử, tính năng đặc biệt..."
              value={formData.description}
              onChange={handleChange}
              required
            />
            <ImageUploadArea />
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
