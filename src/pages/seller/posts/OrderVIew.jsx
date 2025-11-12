import React, { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react"; // Sử dụng icon từ lucide-react
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";


// === CÁC HÀM TIỆN ÍCH (Helpers) ===

const formatDate = (dateString) => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Định dạng số sang tiền tệ VND
 */
const formatCurrency = (number) => {
  if (number === null || number === undefined) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

/**
 * Tạo Tag màu cho trạng thái (giống StatusTag trong React)
 * Trả về JSX
 */
const StatusTag = ({ status }) => {
  const colorMap = {
    PENDING: "bg-orange-100 text-orange-800",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    SHIPPING: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-gray-100 text-gray-800",
  };
  const color = colorMap[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium ${color}`}>
      {status || "-"}
    </span>
  );
};

/**
 * Chuyển đổi giá trị boolean sang text (JSX)
 */
const FormatBoolean = ({ value }) => {
  if (value) {
    return <span className="text-green-600 font-semibold">Đã thanh toán</span>;
  }
  return <span className="text-red-600 font-semibold">Chưa thanh toán</span>;
};

/**
 * Chuyển đổi loại thanh toán
 */
const formatPaymentType = (type) => {
  if (type === "DEPOSIT") return "Đặt cọc";
  if (type === "FULL") return "Thanh toán toàn bộ";
  return type || "-";
};

/**
 * Chuyển đổi phương thức giao hàng
 */
const formatDeliveryMethod = (method) => {
  if (method === "SELLER_DELIVERY") return "Người bán tự vận chuyển";
  if (method === "EXPRESS") return "Hỏa tốc";
  if (method === "STANDARD") return "Tiêu chuẩn";
  return method || "-";
};

/**
 * Hiển thị giá trị, hoặc dấu gạch ngang nếu là null/undefined
 */
const formatText = (text) => {
  // Hàm này vẫn giữ nguyên để xử lý trường hợp giá trị là "" (chuỗi rỗng)
  return text || "-";
};

// === GIẢ LẬP API VÀ TOAST (ĐỂ KHẮC PHỤC LỖI XEM TRƯỚC) ===
const toast = {
  error: (message) => console.error("Toast (Mô phỏng):", message),
  success: (message) => console.log("Toast (Mô phỏng):", message),
  info: (message) => console.info("Toast (Mô phỏng):", message),
};


// === KẾT THÚC GIẢ LẬP ===

// === THÀNH PHẦN CHÍNH ===

export default function OrderView() {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  const goBack = () => {
    navigate(-1);
  };
  const goContract = async () => {
    try {
    
      navigate(`/seller/contract/create/${id}`);
    } catch (error) {
     
      console.error("Đã xảy ra lỗi:", error); // (Nên log lỗi ra console)
      
    }
  };

  // Hàm kiểm tra giá trị có null hoặc undefined không
  const isPresent = (value) => value !== null && value !== undefined;

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true);
      try {
        // Lấy orderId từ URL
        const res = await api.post(`/seller/orders/${id}`);
        // Xử lý response từ axios, dữ liệu thường nằm trong res.data
        // Sử dụng logic giống code mẫu của bạn để đảm bảo (res.data.data || res.data)
        const data = res.data.data || res.data;
        setOrder(data);
      } catch (err) {
        // Xử lý lỗi từ axios
        const errorMessage =
          err.response?.data?.message || err.message || "Lỗi không xác định";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Chỉ gọi API nếu có 'id'
    if (id) {
      fetchOrder();
    } else {
      setError("Không tìm thấy ID đơn hàng.");
      setLoading(false);
      toast.error("Không tìm thấy ID đơn hàng.");
    }
  }, [id]); // Phụ thuộc vào 'id', 'id' thay đổi sẽ gọi lại API

  // Màn hình chờ
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  // Màn hình lỗi
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
        <p className="text-red-500 text-center mb-4">
          Lỗi khi tải thông tin đơn hàng: {error}
        </p>
        <button
          onClick={goBack}
          className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
      </div>
    );
  }

  // Màn hình hiển thị dữ liệu
  if (!order) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500">Không tìm thấy dữ liệu đơn hàng.</p>
      </div>
    );
  }

  return (
    <div className="bg-transparent min-h-screen font-sans">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* Header: Nút quay lại và Tiêu đề */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={goBack}
            className="flex items-center bg-blue-400 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-4">
            Chi tiết Đơn hàng #{order.id}
          </h1>
          <button
            onClick={goContract}
            className="flex items-center bg-green-400 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
          >
            Tạo hợp đồng
            <ArrowRight className="w-4 h-4 mr-2" />
          </button>
        </div>

        {/* Bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Thông tin chi tiết */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
            {/* Thông tin sản phẩm */}
            <h2 className="text-xl font-semibold text-gray-700">
              Thông tin sản phẩm
            </h2>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Trường chung: Loại sản phẩm */}
              {isPresent(order.productType) && (
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Loại sản phẩm
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {formatText(order.productType)}
                  </p>
                </div>
              )}

              {/* === HIỂN THỊ THÔNG TIN XE === */}
              {order.productType === "VEHICLE" && (
                <>
                  {isPresent(order.vehicleBrand) && (
                    <div className="info-item">
                      <label className="text-sm font-medium text-gray-500">
                        Thương hiệu xe
                      </label>
                      <p className="text-lg text-gray-900">
                        {formatText(order.vehicleBrand)}
                      </p>
                    </div>
                  )}
                  {isPresent(order.model) && (
                    <div className="info-item">
                      <label className="text-sm font-medium text-gray-500">
                        Model xe
                      </label>
                      <p className="text-lg text-gray-900">
                        {formatText(order.model)}
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* === HIỂN THỊ THÔNG TIN PIN === */}
              {order.productType === "BATTERY" && (
                <>
                  {isPresent(order.batteryBrand) && (
                    <div className="info-item">
                      <label className="text-sm font-medium text-gray-500">
                        Thương hiệu pin
                      </label>
                      <p className="text-lg text-gray-900">
                        {formatText(order.batteryBrand)}
                      </p>
                    </div>
                  )}
                  {isPresent(order.batteryType) && (
                    <div className="info-item">
                      <label className="text-sm font-medium text-gray-500">
                        Loại pin
                      </label>
                      <p className="text-lg text-gray-900">
                        {formatText(order.batteryType)}
                      </p>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Thông tin thanh toán */}
            <h2 className="text-xl font-semibold text-gray-700 mt-8">
              Thông tin thanh toán
            </h2>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isPresent(order.price) && (
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Giá sản phẩm
                  </label>
                  <p className="text-lg font-semibold text-green-600">
                    {formatCurrency(order.price)}
                  </p>
                </div>
              )}
              {/* Trường shippingFee sẽ hiển thị (vì giá trị là 0, không phải null) */}
              {isPresent(order.shippingFee) && (
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Phí vận chuyển
                  </label>
                  <p className="text-lg text-gray-900">
                    {formatCurrency(order.shippingFee)}
                  </p>
                </div>
              )}
              {isPresent(order.paymentType) && (
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Hình thức thanh toán
                  </label>
                  <p className="text-lg text-gray-900">
                    {formatPaymentType(order.paymentType)}
                  </p>
                </div>
              )}
              {isPresent(order.depositPercentage) && (
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Phần trăm cọc
                  </label>
                  <p className="text-lg text-gray-900">
                    {order.depositPercentage
                      ? `${order.depositPercentage}%`
                      : "-"}
                  </p>
                </div>
              )}
              {/* Trường depositPaid sẽ hiển thị (vì giá trị là false, không phải null) */}
              {isPresent(order.depositPaid) && (
                <div className="info-item md:col-span-2">
                  <label className="text-sm font-medium text-gray-500">
                    Trạng thái cọc
                  </label>
                  <p className="text-lg">
                    <FormatBoolean value={order.depositPaid} />
                  </p>
                </div>
              )}
            </div>

            {/* Thông tin vận chuyển */}
            <h2 className="text-xl font-semibold text-gray-700 mt-8">
              Thông tin vận chuyển
            </h2>
            <hr className="my-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isPresent(order.deliveryMethod) && (
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Phương thức vận chuyển
                  </label>
                  <p className="text-lg text-gray-900">
                    {formatDeliveryMethod(order.deliveryMethod)}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Cột phải: Thông tin tóm tắt (Thường giữ lại các trường này) */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-lg p-6 h-fit">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
              Tóm tắt đơn hàng
            </h2>
            <div className="space-y-4 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Mã đơn hàng
                </span>
                <span className="text-sm text-gray-800 font-mono">
                  #{order.id}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Trạng thái
                </span>
                <StatusTag status={order.status} />
              </div>
              <hr className="my-2" />
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-600">
                  Ngày tạo
                </span>
                <span className="text-sm text-gray-800">
                  {formatDate(order.createdAt)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
