import React, { useState, useEffect } from "react";
import {
  Loader2,
  ArrowLeft,
  Send,
 XCircle,
  Check,
  X,

  AlertCircle,
} from "lucide-react";

 import { useNavigate, useParams } from "react-router-dom"; 
 import api from "../../../config/axios"; 
 import { toast } from "react-toastify"; 
import ImageModal from "./ImageModal";




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

const formatCurrency = (number) => {
  if (number === null || number === undefined) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

const StatusTag = ({ status }) => {
  // Ánh xạ status sang màu sắc Tailwind
  const colorMap = {
    PENDING: "bg-orange-100 text-orange-800",
    RESOLUTION_GIVEN: "bg-blue-100 text-blue-800",
    RESOLVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    ADMIN_SOLVING: "bg-purple-100 text-purple-800",

    // Loại khiếu nại
    DAMAGED_PRODUCT: "bg-yellow-100 text-yellow-800",
    WRONG_ITEM: "bg-yellow-100 text-yellow-800",
    NOT_AS_DESCRIBED: "bg-yellow-100 text-yellow-800",
  };

  //  status sang văn bản tiếng Việt
  const textMap = {
    // Status
    PENDING: "Chờ xử lý",
    RESOLUTION_GIVEN: "Đã phản hồi",
    RESOLVED: "Đã giải quyết",
    REJECTED: "Đã từ chối",
    ADMIN_SOLVING: "Admin đang giải quyết",

    // Loại khiếu nại
    DAMAGED_PRODUCT: "Sản phẩm bị hỏng",
    WRONG_ITEM: "Giao sai sản phẩm",
    NOT_AS_DESCRIBED: "Không đúng mô tả",
  };

  // Dùng màu mặc định (xám) nếu status không có trong map
  const color = colorMap[status] || "bg-gray-100 text-gray-800";
  // Dùng chính giá trị status làm text nếu không có trong map
  const text = textMap[status] || status;

  return (
    <span className={`px-3 py-1 rounded-full text-base font-medium ${color}`}>
      {text}
    </span>
  );
};

// === THÀNH PHẦN CHÍNH ===

export default function ComplaintDetail() {
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [modalImageUrl, setModalImageUrl] = useState(null);

  const navigate = useNavigate();
 const { id } = useParams();

  const goBack = () => {
    navigate(-1);
  };

  // Gọi API lấy chi tiết
  useEffect(() => {
    const fetchComplaint = async () => {
      if (!id) {
        setError("Không tìm thấy ID khiếu nại.");
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        // Dùng đúng API GET user yêu cầu
        const res = await api.get(
          `/seller/complaints/detail?complaintId=${id}`
        );
        const data = res.data.data || res.data;
        if (res.data.success) {
          setComplaint(data);
        } else {
          throw new Error(res.data.message || "Định dạng dữ liệu không đúng");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Lỗi không xác định";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchComplaint();
  }, [id]);

  // Hàm xử lý khi nhấn các nút hành động
  const handleSubmitResolution = async (action) => {
    if (action !== "accept" && !resolutionNotes) {
      toast.error("Vui lòng nhập lý do/giải pháp khi Từ chối hoặc Gửi Admin.");
      return;
    }
    
    setIsSubmitting(true);
    
    // Xây dựng payload dựa trên hành động
    const payload = {
      complaintId: Number(complaint.id),
      resolution: resolutionNotes,
      requestToAdmin: action === "admin",
      accepted: action === "accept",
    };
    console.log(payload);
    

    try {
      const res = await api.patch("/seller/complaints/resolution", payload);
      if (res.data.success) {
        toast.success("Xử lý khiếu nại thành công!");
       
        navigate(-1); 
      } else {
        throw new Error(res.data.message || "Lỗi khi xử lý");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

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
          Lỗi khi tải khiếu nại: {error}
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

  if (!complaint) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500">Không tìm thấy dữ liệu khiếu nại.</p>
      </div>
    );
  }

  // Màn hình chính
  return (
    <div className=" min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <ImageModal
          imageUrl={modalImageUrl}
          onClose={() => setModalImageUrl(null)}
        />
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800 truncate px-4">
            Chi tiết Khiếu nại 
          </h1>
          <button
            onClick={goBack}
            className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại
          </button>
        </div>

        {/* Bố cục 2 cột */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Chi tiết khiếu nại */}
          <div className="lg:col-span-2 space-y-6">
            {/* Thẻ Chi tiết */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
                Thông tin Khiếu nại
              </h2>
              <div className="space-y-4">
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Lý do khiếu nại
                  </label>

                  <StatusTag status={complaint.type} />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="info-item">
                    <label className="text-sm font-medium text-gray-500">
                      Người khiếu nại
                    </label>
                    <p className="text-base text-gray-900">
                      {complaint.buyerName}
                    </p>
                  </div>
                  <div className="info-item">
                    <label className="text-sm font-medium text-gray-500">
                      Mã đơn hàng
                    </label>
                    <p className="text-base text-gray-900 font-mono">
                      #{complaint.orderId}
                    </p>
                  </div>
                </div>

                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Tiêu đề
                  </label>
                  <p className="text-lg font-semibold text-gray-900">
                    {complaint.title}
                  </p>
                </div>

                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Lý do khiếu nại (Mô tả từ khách hàng)
                  </label>
                  <p className="text-base text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border w-full">
                    {complaint.description}
                  </p>
                </div>

                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Hình ảnh đính kèm
                  </label>
                  {complaint.imageUrls && complaint.imageUrls.length > 0 ? (
                    <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      {complaint.imageUrls.map((url, index) => (
                        <a
                          key={index}
                          onClick={() => setModalImageUrl(url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block border rounded-lg overflow-hidden shadow-sm"
                        >
                          <img
                            src={url}
                            alt={`Hình ảnh khiếu nại ${index + 1}`}
                            className="w-full h-56 object-cover cursor-pointer hover:opacity-80 transition-opacity"
                            onError={(e) =>
                              (e.target.src =
                                "https://placehold.co/400x300/e2e8f0/cbd5e0?text=Lỗi+ảnh")
                            }
                          />
                        </a>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">
                      Không có hình ảnh đính kèm.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Thẻ Sản phẩm */}
            {complaint.productSnapshot && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 border-b pb-3">
                  Sản phẩm liên quan
                </h2>
                <div className="flex items-center space-x-4">
                  <img
                    src={complaint.productSnapshot.image}
                    alt={complaint.productSnapshot.name}
                    className="w-20 h-20 rounded-lg object-cover border"
                    onError={(e) =>
                      (e.target.src =
                        "https://placehold.co/100x100/e2e8f0/cbd5e0?text=Lỗi+ảnh")
                    }
                  />
                  <div>
                    <p className="text-base font-semibold text-gray-900">
                      {complaint.productSnapshot.name}
                    </p>
                    <p className="text-sm text-gray-600">
                      {formatCurrency(complaint.productSnapshot.price)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Cột phải: Trạng thái và Hành động */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                Trạng thái
              </h2>
              <StatusTag status={complaint.status} />
              <p className="text-sm text-gray-500 mt-2">
                Ngày tạo: {formatDate(complaint.createdAt)}
              </p>
              {complaint.status !== "PENDING" && (
                <p className="text-sm text-gray-500 mt-1">
                  Ngày xử lý: {formatDate(complaint.updatedAt)}
                </p>
              )}
            </div>

            {/* Chỉ hiển thị Form Hành động nếu status là PENDING */}
            {complaint.status === "PENDING" ? (
              <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Hành động xử lý
                </h2>

                <div>
                  <label
                    htmlFor="resolution"
                    className="text-sm font-medium text-gray-700"
                  >
                    Lý do / Giải pháp <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="resolution"
                    rows="4"
                    value={resolutionNotes}
                    onChange={(e) => setResolutionNotes(e.target.value)}
                    disabled={isSubmitting}
                    className="w-full mt-1 p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Nhập lý do từ chối, giải pháp chấp nhận, hoặc lý do gửi admin..."
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-1">
                    Bắt buộc nhập khi 'Từ chối' hoặc 'Gửi Admin'.
                  </p>
                </div>

                <div className="mt-4 space-y-3">
                  <button
                    onClick={() => handleSubmitResolution("accept")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Đồng ý giải quyết
                  </button>

                  <button
                    onClick={() => handleSubmitResolution("reject")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    Từ chối giải quyết
                  </button>

                  <button
                    onClick={() => handleSubmitResolution("admin")}
                    disabled={isSubmitting}
                    className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Gửi lên Admin xử lí
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-lg p-6 h-fit">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Kết quả xử lý
                </h2>
                <div className="info-item">
                  <label className="text-sm font-medium text-gray-500">
                    Nội dung xử lý
                  </label>
                  <p className="text-base text-gray-800 whitespace-pre-wrap bg-gray-50 p-3 rounded-md border">
                    {complaint.resolutionNotes || "Không có ghi chú."}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}