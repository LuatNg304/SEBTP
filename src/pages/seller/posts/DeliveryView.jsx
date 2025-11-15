"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Descriptions,
  // Select, // <- Không cần Select nữa
  Tag,
  Space,
  Steps,
} from "antd";
import { ArrowLeft, Loader2 } from "lucide-react";
import api from "../../../config/axios";
import { toast } from "react-toastify";

// --- DANH SÁCH TRẠNG THÁI ---
const STATUS_OPTIONS = [
  { value: "PREPARING", label: "Đang chuẩn bị" },
  { value: "READY", label: "Sẵn sàng giao" },
  { value: "DELIVERING", label: "Đang giao hàng" },
  { value: "PICKUP_PENDING", label: "Chờ thanh toán" },
  { value: "RECEIVED", label: "Đã giao thành công" },
];

// --- HELPER: Định dạng Tag Trạng thái ---
const getDeliveryStatusTag = (status) => {
  switch (status) {
    case "PREPARING":
      return <Tag color="blue">Đang chuẩn bị</Tag>;
    case "READY":
      return <Tag color="cyan">Sẵn sàng giao</Tag>;
    case "PICKUP_PENDING":
      return <Tag color="geekblue">Chờ lấy hàng</Tag>;
    case "DELIVERING":
      return <Tag color="orange">Đang giao hàng</Tag>;
    case "RECEIVED":
      return <Tag color="green">Đã giao thành công</Tag>;
    default:
      return <Tag color="gray">{status || "Không rõ"}</Tag>;
  }
};

// --- HELPER: Định dạng Ngày ---
const formatDate = (dateString) => {
  if (!dateString) return "Chưa cập nhật";
  return new Date(dateString).toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// --- COMPONENT CHÍNH ---
export default function DeliveryView() {
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // State này giờ chỉ còn dùng cho GHN
  const [selectedStatus, setSelectedStatus] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const method = location.state?.deliveryMethod;

  // Các biến tính toán
  const provider = deliveryInfo?.deliveryProvider?.toUpperCase();
  const orderId = deliveryInfo?.id;
  const isGhn = provider === "GHN";

  console.log("Phương thức giao hàng:", method);

  // --- 1. LỌC CÁC BƯỚC (STEPS) DỰA TRÊN PHƯƠNG THỨC GIAO HÀNG ---
  let availableStatusOptions; // Dùng 'let'
  if (method === "BUYER_PICKUP") {
    // Nếu là "BUYER_PICKUP", lọc bỏ "Đang giao hàng"
    availableStatusOptions = STATUS_OPTIONS.filter(
      (option) => option.value !== "DELIVERING"
    );
  } else {
    // Mặc định trả về tất cả
    availableStatusOptions = STATUS_OPTIONS;
  }

  // Tạo items cho component Steps
  const availableStepItems = availableStatusOptions.map((option) => ({
    title: option.label,
  }));

  // --- 2. HÀM TẢI DỮ LIỆU ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/seller/order-deliveries/${id}`);
      if (res.data && (res.data.success || res.data)) {
        const data = res.data.data || res.data;
        setDeliveryInfo(data);

        const provider = data?.deliveryProvider?.toUpperCase();
        if (provider === "GHN") {
          // Chỉ set state này cho GHN
          setSelectedStatus("RECEIVED");
        }
        // Đã xóa: logic set `selectedStatus` cho manual
      } else {
        throw new Error(res.data.message || "Không thể tải dữ liệu");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      setError(errorMessage);
      toast.error("Vui lòng chờ người mua đặt thanh toán!");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  }, [id, navigate]); 

  // --- 3. HÀM CẬP NHẬT TRẠNG THÁI (CHỈ DÀNH CHO GHN) ---
  const handleUpdateStatus = async () => {
    // Kiểm tra logic GHN
    if (!selectedStatus || !isGhn) {
      toast.error("Hành động không hợp lệ.");
      return;
    }

    setIsUpdating(true);
    console.log(
      "Đang cập nhật (GHN) với orderId:",
      orderId,
      "và status:",
      selectedStatus
    );

    try {
      // Chỉ còn logic của GHN
      const payload = {
        deliveryStatus: selectedStatus, // Sẽ luôn là "RECEIVED"
      };
      await api.put(`/seller/order-deliveries/${orderId}/ghn`, payload);

      toast.success("Cập nhật trạng thái thành công!");
      fetchData(); // Tải lại dữ liệu
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Cập nhật thất bại";
      console.error("Lỗi cập nhật:", err);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 4. HÀM MỚI: CẬP NHẬT MANUAL THEO TỪNG BƯỚC ---
  const handleManualUpdate = async () => {
    // 1. Tìm trạng thái hiện tại
    const currentIndex = availableStatusOptions.findIndex(
      (option) => option.value === deliveryInfo.status
    );

    // 2. Kiểm tra xem có trạng thái tiếp theo không
    if (currentIndex < 0 || currentIndex >= availableStatusOptions.length - 1) {
      toast.warn("Không có trạng thái tiếp theo để cập nhật.");
      return;
    }

    // 3. Lấy trạng thái tiếp theo
    const nextStatus = availableStatusOptions[currentIndex + 1];
    const statusToUpdate = nextStatus.value; // (ví dụ: "READY")

    if (!statusToUpdate) {
      toast.error("Lỗi: Không tìm thấy trạng thái tiếp theo.");
      return;
    }

    setIsUpdating(true);

    try {
      // 4. Gọi API
      await api.put(
        `/seller/order-deliveries/${orderId}/manual?deliveryStatus=${statusToUpdate}`
      );

      toast.success("Cập nhật trạng thái thành công!");
      fetchData(); // Tải lại dữ liệu để cập nhật UI
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Cập nhật thất bại";
      console.error("Lỗi cập nhật:", err);
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- 5. HÀM QUAY LẠI ---
  const goBack = () => {
    navigate(-1);
  };

  // --- 6. useEffect TẢI DỮ LIỆU LẦN ĐẦU ---
  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      setError("Không tìm thấy ID giao hàng.");
      setLoading(false);
    }
  }, [id, fetchData]);

  // --- RENDER LOADING ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  // --- RENDER ERROR ---
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen p-4">
        <p className="text-red-500 text-center mb-4">Lỗi: {error}</p>
        <Button onClick={goBack} icon={<ArrowLeft className="w-4 h-4" />}>
          Quay lại
        </Button>
      </div>
    );
  }

  // --- RENDER KHÔNG CÓ DỮ LIỆU ---
  if (!deliveryInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Không tìm thấy dữ liệu.</p>
      </div>
    );
  }

  // --- 7. TÍNH TOÁN INDEX HIỆN TẠI CHO STEPS ---
  const currentStepIndex = availableStatusOptions.findIndex(
    (option) => option.value === deliveryInfo.status
  );

  // --- GIAO DIỆN CHÍNH ---
  return (
    <div className="bg-transparent min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Nút quay lại */}
      <div className="mb-6">
        <Button
          onClick={goBack}
          icon={<ArrowLeft className="w-4 h-4" />}
          className="flex items-center"
        >
          Quay lại danh sách
        </Button>
      </div>

      {/* Khung thông tin */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-xl font-semibold mb-6">
          Chi tiết Giao hàng cho Đơn hàng #{deliveryInfo.orderId}
        </h2>

        {/* Component Steps */}
        <div className="mb-8">
          <Steps
            current={currentStepIndex}
            items={availableStepItems}
            responsive={true}
          />
        </div>

        {/* Component Descriptions */}
        <Descriptions bordered column={1}>
          <Descriptions.Item label="ID Giao Hàng">
            {deliveryInfo.id}
          </Descriptions.Item>
          <Descriptions.Item label="Trạng thái hiện tại">
            {getDeliveryStatusTag(deliveryInfo.status)}
          </Descriptions.Item>
          <Descriptions.Item label="Nhà vận chuyển">
            {deliveryInfo.deliveryProvider || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Mã vận đơn">
            {deliveryInfo.deliveryTrackingNumber || "Chưa cập nhật"}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày giao (dự kiến/thực tế)">
            {formatDate(deliveryInfo.deliveryDate)}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày tạo phiếu">
            {formatDate(deliveryInfo.createdAt)}
          </Descriptions.Item>
        </Descriptions>

        {/* Khung Cập nhật Trạng thái */}
        {deliveryInfo.status !== "RECEIVED" && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h3>

            {isGhn ? (
              // 1. NẾU LÀ GHN
              <Button
                type="primary"
                size="large"
                onClick={handleUpdateStatus} // <-- Dùng hàm GHN
                loading={isUpdating}
                disabled={isUpdating} // Nút này luôn bật
                style={{ width: "100%" }}
              >
                {isUpdating ? "..." : "Xác nhận Đã Giao (GHN)"}
              </Button>
            ) : (
              // 2. NẾU KHÔNG PHẢI GHN (MANUAL)
              <>
                {/* Tự động tính toán trạng thái tiếp theo */}
                {(() => {
                  // Tìm nextStatus
                  const currentStepIndex = availableStatusOptions.findIndex(
                    (option) => option.value === deliveryInfo.status
                  );

                  let nextStatus = null;
                  if (
                    currentStepIndex > -1 &&
                    currentStepIndex < availableStatusOptions.length - 1
                  ) {
                    // Chỉ lấy nếu nó không phải là trạng thái cuối cùng
                    nextStatus = availableStatusOptions[currentStepIndex + 1];
                  }

                  // Chỉ hiển thị nút nếu có trạng thái tiếp theo
                  if (nextStatus) {
                    return (
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleManualUpdate} // <-- Dùng hàm Manual
                        loading={isUpdating}
                        disabled={isUpdating}
                        style={{ width: "100%" }}
                      >
                        {
                          isUpdating
                            ? "Đang cập nhật..."
                            : `Chuyển sang: ${nextStatus.label}` // <-- Hiển thị label động
                        }
                      </Button>
                    );
                  }

             
                  return null;
                })()}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
