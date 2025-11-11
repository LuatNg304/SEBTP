import React, { useState, useEffect } from "react";
import { Loader2, Eye, ShieldAlert } from "lucide-react"; // Icon cho tải, xem, và tiêu đề
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import api from "../../../config/axios";

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
 * Tạo Tag màu cho trạng thái Khiếu nại
 */
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
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {text}
    </span>
  );
};



// === THÀNH PHẦN CHÍNH ===

export default function ComplaintList() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Gọi API khi component được mount
  useEffect(() => {
    const fetchComplaints = async () => {
      setLoading(true);
      try {
        const res = await api.get("/seller/complaints/list");
        const data = res.data.data || res.data;
        if (res.data.success && Array.isArray(data)) {
          setComplaints(data);
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

    fetchComplaints();
  }, []); // Mảng rỗng đảm bảo chỉ chạy 1 lần

  const handleViewDetails = (id) => {
    console.log(id);
    
    navigate(`/seller/complaints/${id}`);
  };

  // Màn hình chờ
  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  // Màn hình lỗi
  if (error) {
    return (
      <div className="flex flex-col justify-center items-center  p-4">
        <p className="text-red-500 text-center mb-4">
          Lỗi khi tải danh sách khiếu nại: {error}
        </p>
      </div>
    );
  }

  // Màn hình chính
  return (
    <div className=" min-h-screen  p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center space-x-3">
          <ShieldAlert className="w-8 h-8 text-red-600" />
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Quản lý Khiếu nại
          </h1>
        </div>

        {/* Bảng dữ liệu */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] divide-y divide-gray-200">
              {/* Header của bảng */}
              <thead className="bg-gray-50">
                <tr>
                  
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Mã Đơn hàng
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Người khiếu nại
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Tiêu đề
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Trạng thái
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Ngày tạo
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-center text-xs font-bold text-gray-600 uppercase tracking-wider"
                  >
                    Hành động
                  </th>
                </tr>
              </thead>

              {/* Body của bảng */}
              <tbody className="bg-white divide-y divide-gray-200">
                {complaints.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      Không tìm thấy khiếu nại nào.
                    </td>
                  </tr>
                ) : (
                  complaints.map((complaint) => (
                    <tr
                      key={complaint.id}
                      className="hover:bg-gray-50 transition duration-150"
                    >
                      
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        #{complaint.orderId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {complaint.name}
                      </td>
                      <td
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 max-w-xs truncate"
                        title={complaint.type}
                      >
                        <StatusTag status={complaint.type} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusTag status={complaint.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {formatDate(complaint.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                        <button
                          onClick={() => handleViewDetails(complaint.id)}
                          className="flex items-center justify-center mx-auto text-blue-600 hover:text-blue-800 transition duration-150"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Xem
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
