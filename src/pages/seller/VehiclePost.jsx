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
    productType: "VEHICLE",
    title: "",
    description: "",
    price: "",
    address: user?.address || "",
    priorityPackageId: "",
    deliveryMethods: [],
    paymentTypes: [],
    isUseWallet: false,

    // Thông tin xe
    vehicleBrand: "",
    model: "",
    yearOfManufacture: "",
    color: "",
    mileage: "",
  });

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
      if (name === "isUseWallet") {
        //  Checkbox boolean: gán trực tiếp giá trị checked (true/false)
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else {
        //  Checkbox dạng mảng
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
      //  Input text, number, select...
      setFormData({ ...formData, [name]: value });
    }
  };


  // handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
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

        // Các trường vehicle
        vehicleBrand: formData.vehicleBrand,
        model: formData.model,
        yearOfManufacture: Number(formData.yearOfManufacture),
        color: formData.color,
        mileage: Number(formData.mileage),
      };

      const response = await api.post("/seller/posts", payload);
      console.log("Đăng bài thành công:", response.data);
      toast.success("Đăng bài thành công!");
    } catch (error) {
      console.error("Lỗi khi đăng bài:", error);
      toast.error(error.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div className="min-h-screen bg-transparent p-4 sm:p-8 font-sans">
      <div className="max-w-3xl mx-auto space-y-6">
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
              placeholder="10,000,000"
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
                    {pkg.type} - {pkg.price} VNĐ
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
                icon={LucideCalendar}
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
                type="number"
                placeholder="5000"
                icon={LucideRuler}
                value={formData.mileage}
                onChange={handleChange}
                unit="km"
                required
              />
            </div>
          </div>

          {/* Mô tả & Hình ảnh */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg space-y-5">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              3. Mô tả & Hình ảnh
            </h2>
            <textarea
              id="description"
              name="description"
              rows="5"
              className="block w-full rounded-lg border-gray-300 dark:bg-gray-700 dark:text-white p-3"
              placeholder="Mô tả chi tiết về xe..."
              value={formData.description}
              onChange={handleChange}
              required
            />
            <ImageUploadArea />
          </div>
          {/* Sử dụng ví */}

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700"
            >
              Đăng Bài Ngay
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
