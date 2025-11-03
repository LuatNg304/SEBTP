import React, { useState, useEffect, useCallback } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Button,
  Descriptions,
  Select,
  Tag,
  Space,
} from "antd";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import api from "../../../config/axios";
import { toast } from "react-toastify";

// --- DANH SÁCH TRẠNG THÁI ---

const STATUS_OPTIONS = [
  { value: "PREPARING", label: "Đang chuẩn bị" },
  { value: "READY", label: "Sẵn sàng giao" },
  { value: "PICKUP_PENDING", label: "Chờ lấy hàng" },
  { value: "DELIVERING", label: "Đang giao hàng" },
  { value: "DELIVERED", label: "Đã giao thành công" },
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
    case "DELIVERED":
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
  const [selectedStatus, setSelectedStatus] = useState(""); // Trạng thái được chọn trong dropdown

  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID từ URL

  const provider = deliveryInfo?.deliveryProvider?.toUpperCase();
  const isGhn = provider === "GHN";

  const currentOptions = isGhn
    ? STATUS_OPTIONS.filter((option) => option.value === "DELIVERED")
    : STATUS_OPTIONS;

  // --- HÀM TẢI DỮ LIỆU ---

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/seller/order-deliveries/${id}`);
      if (res.data && res.data.success) {
        const data = res.data.data || res.data;
        setDeliveryInfo(data);

        // === LOGIC CẬP NHẬT Ở ĐÂY ===
        const provider = data?.deliveryProvider?.toUpperCase();
        if (provider === "GHN") {
          // Nếu là GHN, tự động đặt trạng thái được chọn là "DELIVERED"
          setSelectedStatus("DELIVERED");
        } else {
          // Nếu là nhà vận chuyển khác, giữ trạng thái hiện tại
          setSelectedStatus(data.status);
        }
   
      } else {
        throw new Error(res.data.message || "Không thể tải dữ liệu");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  // --- HÀM CẬP NHẬT TRẠNG THÁI (ĐÃ CẬP NHẬT) ---
  const handleUpdateStatus = async () => {
    if (!selectedStatus) {
      toast.error("Vui lòng chọn một trạng thái để cập nhật.");
      return;
    }

    setIsUpdating(true);
    try {
      // Lấy nhà cung cấp (provider) một cách an toàn,
      // và chuyển sang chữ hoa để so sánh
      const provider = deliveryInfo?.deliveryProvider?.toUpperCase();

      if (provider === "GHN") {
        // --- 1. Lôgic mới cho GHN (Dùng PUT) ---
        // API PUT thường gửi dữ liệu trong body, không phải query param.
        // Tôi giả định API của bạn mong muốn { deliveryStatus: "TRẠNG THÁI" }
        const payload = {
          deliveryStatus: selectedStatus,
        };
        await api.put(`/seller/order-deliveries/${id}/ghn`, payload);
      } else {
        // --- 2. Lôgic cũ (Manual) ---
     
        await api.put(
          `/seller/order-deliveries/${id}/manual?deliveryStatus=${selectedStatus}`
        );
      }

      // Phần còn lại giữ nguyên
      toast.success("Cập nhật trạng thái thành công!");
      fetchData(); // Tải lại dữ liệu để thấy thay đổi
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Cập nhật thất bại";
      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  // --- HÀM QUAY LẠI ---
  const goBack = () => {
    navigate(-1);
  };

  // --- useEffect TẢI DỮ LIỆU LẦN ĐẦU ---
  useEffect(() => {
    if (id) {
      fetchData();
    } else {
      setError("Không tìm thấy ID giao hàng.");
      setLoading(false);
    }
  }, [id, fetchData]);

  // --- RENDER ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

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

  if (!deliveryInfo) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Không tìm thấy dữ liệu.</p>
      </div>
    );
  }

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

        {/* Component Descriptions của Ant Design để hiển thị thông tin */}
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
        {/* Chỉ hiển thị nếu đơn hàng chưa được giao */}
        {/* Khung Cập nhật Trạng thái */}
        {deliveryInfo.status !== "DELIVERED" && (
          <div className="mt-8 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-4">Cập nhật trạng thái</h3>

            {/* === LOGIC MỚI: KIỂM TRA isGhn === */}
            {isGhn ? (
              // 1. NẾU LÀ GHN: Chỉ hiển thị nút (vì status đã được set là "DELIVERED")
              <Button
                type="primary"
                size="large"
                onClick={handleUpdateStatus}
                loading={isUpdating}
                disabled={
                  isUpdating || deliveryInfo.status === selectedStatus // Vô hiệu hóa nếu đã là DELIVERED
                }
                style={{ width: "100%" }} // Cho nút rộng hết cỡ
              >
                {isUpdating ? "..." : "Cập nhật "}
              </Button>
            ) : (
              // 2. NẾU KHÔNG PHẢI GHN: Hiển thị như cũ (Select + Button)
              <Space.Compact style={{ width: "100%" }}>
                <Select
                  value={selectedStatus}
                  onChange={(value) => setSelectedStatus(value)}
                  options={currentOptions} // 'currentOptions' sẽ tự động là full list
                  style={{ width: "100%" }}
                  size="large"
                  placeholder="Chọn trạng thái..."
                />
                <Button
                  type="primary"
                  size="large"
                  onClick={handleUpdateStatus}
                  loading={isUpdating}
                  disabled={
                    isUpdating || deliveryInfo.status === selectedStatus
                  }
                >
                  {isUpdating ? "..." : "Cập nhật"}
                </Button>
              </Space.Compact>
            )}
           
          </div>
        )}
      </div>
    </div>
  );
}