// Tên file: src/pages/seller/ContractView.js (Ví dụ)

import React, { useState, useEffect, useCallback } from "react";
// 1. Thêm useCallback, useLocation
import { ArrowLeft, Loader2, Printer } from "lucide-react";
import {
  useNavigate,
  useParams,
  useLocation, // <-- Thêm
} from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify"; // <-- Dùng toast thật



const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};
const formatCurrency = (number) => {
  if (number === null || number === undefined) return "-";
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};
const formatPaymentType = (type) => {
  if (type === "DEPOSIT") return "Đặt cọc";
  if (type === "FULL") return "Thanh toán toàn bộ";
  return type || "-";
};
const formatDeliveryMethod = (method) => {
  if (method === "SELLER_DELIVERY") return "Người bán tự vận chuyển";
  if (method === "EXPRESS") return "Hỏa tốc";
  if (method === "STANDARD") return "Tiêu chuẩn";
  return method || "-";
};
const formatText = (text) => {
  return text || "Chưa cung cấp";
};
const formatWeight = (grams) => {
  if (grams === null || grams === undefined) return "-";
  const kg = grams / 1000;
  return `${kg.toLocaleString("vi-VN")} kg`;
};
const isPresent = (value) => value !== null && value !== undefined;
// === KẾT THÚC HELPERS ===

export default function ContractView() {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams(); // Lấy ID hợp đồng từ URL
  const location = useLocation(); // <-- Thêm

  // --- HÀM XỬ LÝ ---
  const goBack = () => {
    navigate(-1); // Quay lại trang danh sách
  };

  const handlePrint = () => {
    window.print();
  };

  // Hàm điều hướng sang trang OTP
  const handleGoToSign = async () => {
    // Chuyển sang trang OTP (bạn phải tạo route cho trang này)
    try {
    await api.post(`/seller/contracts/${id}/sign/send-otp`);
    toast.success("Đã  mã OTP thành công!");
    navigate(`/seller/contract/sign-otp/${id}`);
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message;
      toast.error(errorMessage +" chờ người mua xác nhận");
    }
  };

  // --- LOGIC TẢI DỮ LIỆU ---

 
  const fetchContract = useCallback(async () => {
    setLoading(true);
    try {
      // Gọi API lấy chi tiết hợp đồng đã lưu
      const res = await api.get(`/seller/contracts/${id}`);

      if (res.data && res.data.success) {
        setContract(res.data.data || res.data);
      } else {
        throw new Error(res.data.message || "Không thể lấy dữ liệu hợp đồng");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]); // Phụ thuộc vào 'id'

  // 3. useEffect tải dữ liệu lần đầu
  useEffect(() => {
    if (id) {
      fetchContract();
    } else {
      setError("Không tìm thấy ID hợp đồng.");
      setLoading(false);
      toast.error("Không tìm thấy ID hợp đồng.");
    }
  }, [id, fetchContract]);

  // 4. useEffect xử lý khi ký OTP thành công và quay lại
 useEffect(() => {
   // Tạo một hàm async bên trong để có thể dùng await
   const handleSignSuccess = async () => {
     if (location.state?.signedSuccess) {
       toast.success("Ký hợp đồng thành công!");

       // 1. CHỜ cho hàm fetch chạy xong
       await fetchContract();

       // 2. CHỈ XÓA state sau khi đã fetch xong
       navigate(location.pathname, { replace: true, state: {} });
     }
   };

   handleSignSuccess(); // Gọi hàm async
 }, [location.state, navigate, location.pathname, fetchContract]);

  // --- RENDER ---
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <Loader2 className="w-16 h-16 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-100 p-4">
        <p className="text-red-500 text-center mb-4">
          Lỗi khi tải thông tin hợp đồng: {error}
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

  if (!contract) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500">Không tìm thấy dữ liệu hợp đồng.</p>
      </div>
    );
  }

  const totalAmount = (contract.price || 0) + (contract.shippingFee || 0);

  return (
    <div className="bg-transparent min-h-screen font-sans p-4 sm:p-6 lg:p-8">
      {/* Thanh điều hướng (KHÔNG IN) */}
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={goBack}
          className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>
        <button
          onClick={handlePrint}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-200"
        >
          <Printer className="w-4 h-4 mr-2" />
          In hợp đồng
        </button>
        {/* Xóa nút "Tạo hợp đồng" ở đây */}
      </div>

      {/* Giao diện hợp đồng A4 */}
      <div
        id="contract-to-print"
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 sm:p-12 lg:p-16 font-serif text-gray-800"
      >
        {/* Tiêu đề (Giữ nguyên) */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-2xl font-bold text-gray-900 mb-2">
            CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
          </h1>
          <p className="text-lg font-medium">Độc lập - Tự do - Hạnh phúc</p>
          <p className="text-gray-500">-----------------------------</p>
        </div>
        <h2 className="text-center text-2xl sm:text-2xl font-bold mb-6">
          HỢP ĐỒNG MUA BÁN TÀI SẢN
        </h2>
        {/* Hiển thị ngày tạo hợp đồng (createdAt) thay vì ngày hôm nay */}
        <p className="text-right mb-8 italic">
          Ngày{" "}
          {contract.createdAt
            ? new Date(contract.createdAt).toLocaleDateString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : getTodayDate()}
        </p>

        {/* Các bên (Giữ nguyên) */}
        <section className="mb-8 space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">BÊN A (BÊN BÁN):</h3>
            <p>
              <span className="font-semibold">Ông/Bà:</span>{" "}
              {formatText(contract.sellerName)}
            </p>
            {/* ... (các trường sellerAddress, sellerPhone) ... */}
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {formatText(contract.sellerAddress)}
            </p>
            <p>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {formatText(contract.sellerPhone)}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-2">BÊN B (BÊN MUA):</h3>
            <p>
              <span className="font-semibold">Ông/Bà:</span>{" "}
              {formatText(contract.buyerName)}
            </p>
            {/* ... (các trường buyerAddress, buyerPhone) ... */}
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {formatText(contract.buyerAddress)}
            </p>
            <p>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {formatText(contract.buyerPhone)}
            </p>
          </div>
        </section>

        <p className="mb-8">
          Hai bên đồng ý ký kết hợp đồng mua bán tài sản với các điều khoản sau:
        </p>

        {/* Điều 1: Thông tin tài sản */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">ĐIỀU 1: THÔNG TIN TÀI SẢN</h3>
          <table className="w-full border-collapse border border-gray-300">
            <tbody>
              <tr className="bg-gray-50">
                <td className="border border-gray-300 p-3 font-semibold">
                  Loại tài sản
                </td>
                <td className="border border-gray-300 p-3">
                  {formatText(contract.productType)}
                </td>
              </tr>

              {/* === HIỂN THỊ THÔNG TIN XE === */}
              {contract.productType === "VEHICLE" && (
                <>
                  {isPresent(contract.vehicleBrand) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Thương hiệu
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatText(contract.vehicleBrand)}
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.model) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Model
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatText(contract.model)}
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.yearOfManufacture) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Năm sản xuất
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatText(contract.yearOfManufacture)}
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.color) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Màu sắc
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatText(contract.color)}
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.mileage) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Số KM đã đi
                      </td>
                      <td className="border border-gray-300 p-3">
                        {contract.mileage.toLocaleString("vi-VN")} km
                      </td>
                    </tr>
                  )}
                </>
              )}

              {/* === HIỂN THỊ THÔNG TIN PIN === */}
              {contract.productType === "BATTERY" && (
                <>
                  {isPresent(contract.batteryBrand) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Thương hiệu pin
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatText(contract.batteryBrand)}
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.batteryType) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Loại pin
                      </td>
                      <td className="border border-gray-300 p-3">
                        {formatText(contract.batteryType)}
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.capacity) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Dung lượng
                      </td>
                      <td className="border border-gray-300 p-3">
                        {contract.capacity} Ah
                      </td>
                    </tr>
                  )}
                  {isPresent(contract.voltage) && (
                    <tr>
                      <td className="border border-gray-300 p-3 font-semibold">
                        Điện áp
                      </td>
                      <td className="border border-gray-300 p-3">
                        {contract.voltage} V
                      </td>
                    </tr>
                  )}
                </>
              )}

              {/* Thông tin chung */}
              {isPresent(contract.weight) && (
                <tr>
                  <td className="border border-gray-300 p-3 font-semibold">
                    Trọng lượng (Ước tính)
                  </td>
                  <td className="border border-gray-300 p-3">
                    {formatWeight(contract.weight)}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
        {/* Điều 2: Giá cả và Thanh toán */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">
            ĐIỀU 2: GIÁ CẢ VÀ PHƯƠNG THỨC THANH TOÁN
          </h3>
          <p className="mb-2">
            <span className="font-semibold">1. Giá tài sản:</span>{" "}
            {formatCurrency(contract.price)}
          </p>
          <p className="mb-2">
            <span className="font-semibold">2. Phí vận chuyển:</span>{" "}
            {formatCurrency(contract.shippingFee)}
          </p>
          <p className="mb-2 text-lg font-bold">
            <span className="font-semibold">3. TỔNG GIÁ TRỊ HỢP ĐỒNG:</span>{" "}
            {formatCurrency(totalAmount)}
          </p>
          <p className="mb-2">
            <span className="font-semibold">4. Hình thức thanh toán:</span>{" "}
            {formatPaymentType(contract.paymentType)}
          </p>
          {isPresent(contract.depositPercentage) && (
            <p className="mb-2">
              <span className="font-semibold">5. Đặt cọc:</span>{" "}
              {contract.depositPercentage}% giá trị tài sản (Tương đương{" "}
              {formatCurrency(
                contract.price * (contract.depositPercentage / 100)
              )}
              ).
            </p>
          )}
        </section>
        {/* Điều 3: Giao nhận */}
        <section className="mb-8">
          <h3 className="text-xl font-bold mb-4">ĐIỀU 3: GIAO NHẬN</h3>
          <p className="mb-2">
            <span className="font-semibold">1. Phương thức giao nhận:</span>{" "}
            {formatDeliveryMethod(contract.deliveryMethod)}.
          </p>
          <p className="mb-2">
            <span className="font-semibold">2. Địa điểm giao nhận:</span>{" "}
            {formatText(contract.buyerAddress)}.
          </p>
        </section>
        {/* Điều 4: Điều khoản chung */}
        <section className="mb-12">
          <h3 className="text-xl font-bold mb-4">ĐIỀU 4: ĐIỀU KHOẢN CHUNG</h3>
          <p className="mb-2">
            1. Hai bên cam kết thực hiện đúng các điều khoản đã thỏa thuận trong
            hợp đồng.
          </p>
          <p className="mb-2">
            2. Mọi tranh chấp phát sinh sẽ được giải quyết trên tinh thần thương
            lượng. Nếu không thể thương lượng, tranh chấp sẽ được đưa ra Tòa án
            nhân dân có thẩm quyền để giải quyết.
          </p>
          <p className="mb-2">
            3. Hợp đồng được lập thành 02 (hai) bản, mỗi bên giữ 01 (một) bản và
            có giá trị pháp lý như nhau.
          </p>
        </section>

        {/* 5. === YÊU CẦU MỚI: ĐIỀU 5 (HIỂN THỊ CONTENT) === */}
        {/* Mục này sẽ hiển thị cả trên web và khi in (KHÔNG CÓ print:hidden) */}
        {isPresent(contract.content) && contract.content.trim() !== "" && (
          <section className="mb-12">
            <h3 className="text-xl font-bold mb-4">
              ĐIỀU 5: ĐIỀU KHOẢN BỔ SUNG
            </h3>
            {/* whitespace-pre-wrap để giữ nguyên định dạng xuống dòng */}
            <p className="whitespace-pre-wrap font-serif">
              {formatText(contract.content)}
            </p>
          </section>
        )}

        {/* 6. === YÊU CẦU MỚI: LOGIC KÝ TÊN === */}
        {/* Mục này phải nằm sau Điều 5 */}
        <section className="grid grid-cols-2 gap-8 pt-10">
          {/* BÊN A (BÊN BÁN) - CÓ LOGIC KÝ */}
          <div className="text-center">
            <p className="font-bold text-lg mb-2">ĐẠI DIỆN BÊN A (BÊN BÁN)</p>

            {/* Giả sử backend trả về 'isSellerSigned' là true/false */}
            {contract.sellerSigned ? (
              // NẾU ĐÃ KÝ
              <>
                <p className="italic mb-5 text-green-600 font-semibold">
                  (Đã ký điện tử)
                </p>
                <p className="font-bold">{formatText(contract.sellerName)}</p>
              </>
            ) : (
              // NẾU CHƯA KÝ
              <>
                {/* Nút này chỉ hiển thị trên web (print:hidden) */}
                <button
                  onClick={handleGoToSign}
                  className="italic mb-5 text-blue-600 hover:text-blue-800 underline cursor-pointer print:hidden"
                >
                  (Nhấn để ký, ghi rõ họ tên)
                </button>
                {/* Chữ này chỉ hiển thị khi IN (hidden print:block) */}
                <p className="italic mb-5 hidden print:block">
                  (Ký, ghi rõ họ tên)
                </p>
                {/* Để trống tên khi chưa ký */}
                <p className="font-bold h-6"> </p>
              </>
            )}
          </div>

          {/* BÊN B (BÊN MUA) - Giữ nguyên (hoặc thêm logic ký nếu cần) */}
          <div className="text-center">
            <p className="font-bold text-lg mb-2">ĐẠI DIỆN BÊN B (BÊN MUA)</p>

           
            {contract.buyerSigned ? (
              // NẾU ĐÃ KÝ
              <>
                <p className="italic mb-5 text-green-600 font-semibold">
                  (Đã ký điện tử)
                </p>
                <p className="font-bold">{formatText(contract.buyerName)}</p>
              </>
            ) : (
              // NẾU CHƯA KÝ
              <>
                {/* Nút này chỉ hiển thị trên web (print:hidden) */}
                <button
                  onClick={handleGoToSign}
                  className="italic mb-5 text-blue-600 hover:text-blue-800 underline cursor-pointer print:hidden"
                >
                  (Nhấn để ký, ghi rõ họ tên)
                </button>
                {/* Chữ này chỉ hiển thị khi IN (hidden print:block) */}
                <p className="italic mb-5 hidden print:block">
                  (Ký, ghi rõ họ tên)
                </p>
                {/* Để trống tên khi chưa ký */}
                <p className="font-bold h-6"> </p>
              </>
            )}
          </div>
        </section>
      </div>

      {/* CSS Dành cho in (Giữ nguyên) */}
      <style>
        {`
          @media print {
            body * { visibility: hidden; }
            #contract-to-print, #contract-to-print * { visibility: visible; }
            #contract-to-print {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              margin: 0;
              padding: 0;
              border: none;
              box-shadow: none;
              background: white;
            }
          }
        `}
      </style>
    </div>
  );
}
