import React, { useState, useEffect } from "react";
import { ArrowLeft, Check, Loader2, Printer } from "lucide-react"; // Thêm icon Printer
import { useNavigate, useParams } from "react-router-dom";
import api from "../../../config/axios";
import { toast } from "react-toastify";

const getTodayDate = () => {
  const today = new Date();
  return today.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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
 * Chuyển đổi loại thanh toán
 */
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

/**
 * Hiển thị giá trị, hoặc "Chưa cung cấp" nếu là null/undefined
 */
const formatText = (text) => {
  return text || "Chưa cung cấp";
};

/**
 * Định dạng trọng lượng từ gram sang kg
 */
const formatWeight = (grams) => {
  if (grams === null || grams === undefined) return "-";
  const kg = grams / 1000;
  return `${kg.toLocaleString("vi-VN")} kg`;
};

// Hàm kiểm tra giá trị có null hoặc undefined không
const isPresent = (value) => value !== null && value !== undefined;

// === THÀNH PHẦN CHÍNH ===

export default function Contract() {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [shippingFee, setShippingFee] = useState(0);

  const goBack = () => {
    navigate(-1);
  };

  const handleShippingFeeChange = (e) => {
    const rawValue = e.target.value;

    // 1. Xóa tất cả các ký tự không phải là số (giữ lại số)
    const cleanedValue = rawValue.replace(/\D/g, "");

    // 2. Chuyển về dạng số (number)
    const numericValue = parseInt(cleanedValue, 10);

    // 3. Cập nhật state với giá trị số. Nếu rỗng/NaN (người dùng xóa hết) thì set về 0.
    setShippingFee(isNaN(numericValue) ? 0 : numericValue);
  };

  // hàm tạo hợp đồng
  const handleCreateContract = async () => {
    setIsCreating(true);
    try {
      // Chuẩn bị dữ liệu gửi đi
      const payload = {
        orderId: id, // ID của đơn hàng
        content: additionalNotes, // Ghi chú bổ sung
        shippingFee: shippingFee,
      };

      // Gọi API như bạn yêu cầu
      console.log(payload);
      
      const res = await api.post("/seller/contracts", payload);

      if (res.data && res.data.success) {
        toast.success("Tạo hợp đồng thành công!");
        // Chuyển hướng đến trang danh sách hợp đồng (hoặc trang chi tiết hợp đồng mới)
        navigate("/seller/order");
      } else {
        throw new Error(res.data.message || "Không thể tạo hợp đồng");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      toast.error(errorMessage);
      navigate("/seller/order");
      setIsCreating(false); // Ở lại trang nếu có lỗi
    }
  };
  // Gọi API khi component được mount
  useEffect(() => {
    const fetchContractPreview = async () => {
      setLoading(true);
      try {
        // Sử dụng api.post theo code của bạn
        // Gửi một body rỗng nếu không cần, hoặc {id: id}
        const res = await api.get(`/seller/contracts/template/${id}`);

        if (res.data && res.data.success) {
          const data = res.data.data || res.data;
          setContract(data);
          setShippingFee(data.shippingFee || 0);
        } else {
          throw new Error(res.data.message || "Không thể lấy dữ liệu hợp đồng");
        }
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
      fetchContractPreview();
    } else {
      setError("Không tìm thấy ID đơn hàng.");
      setLoading(false);
      toast.error("Không tìm thấy ID đơn hàng.");
    }
  }, [id]); // Phụ thuộc vào 'id'

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

  // Màn hình hiển thị dữ liệu
  if (!contract) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <p className="text-gray-500">Không tìm thấy dữ liệu hợp đồng.</p>
      </div>
    );
  }

  // Tính toán
  const totalAmount = (contract.price || 0) + (contract.shippingFee || 0);

  return (
    <div className="bg-transparent min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto mb-6 flex justify-between items-center print:hidden">
        <button
          onClick={goBack}
          className="flex items-center bg-white text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-50 transition duration-200"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại
        </button>

        <button
          onClick={handleCreateContract}
          disabled={isCreating}
          className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-700 transition duration-200 disabled:bg-gray-400"
        >
          {isCreating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Check className="w-4 h-4 mr-2" />
          )}
          {isCreating ? "Đang tạo..." : "Tạo hợp đồng"}
        </button>
      </div>

      {/* Giao diện hợp đồng */}
      <div
        id="contract-to-print"
        className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8 sm:p-12 lg:p-16  text-gray-800"
      >
        {/* Tiêu đề */}

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
        <p className="text-right mb-8 italic"> Ngày {getTodayDate()}</p>
        {/* Các bên */}
        <section className="mb-8 space-y-4">
          <div>
            <h3 className="text-lg font-bold mb-2">BÊN A (BÊN BÁN):</h3>
            <p>
              <span className="font-semibold">Ông/Bà:</span>{" "}
              {formatText(contract.sellerName)}
            </p>
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
            <p>
              <span className="font-semibold">Địa chỉ:</span>{" "}
              {formatText(contract.buyerAddress)}
            </p>
            <p>
              <span className="font-semibold">Số điện thoại:</span>{" "}
              {formatText(contract.buyerPhone)}
            </p>
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

          {/* === 5. TỔNG GIÁ TRỊ CŨNG SẼ TỰ ĐỘNG CẬP NHẬT === */}
          <p className="mb-2 text-lg font-bold">
            <span className="font-semibold">3. TỔNG GIÁ TRỊ HỢP ĐỒNG:</span>
            {formatCurrency(totalAmount)}
          </p>
          <p className="mb-2">
            <span className="font-semibold">4. Hình thức thanh toán:</span>
            {formatPaymentType(contract.paymentType)}
          </p>
          {isPresent(contract.depositPercentage) && (
            <p className="mb-2">
              <span className="font-semibold">5. Đặt cọc:</span>
              {contract.depositPercentage}% giá trị tài sản (Tương đương
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
        <section className="mb-8 print:hidden">
          <h3 className="text-xl font-bold mb-4 ">PHÍ VẬN CHUYỂN</h3>

          <label
            htmlFor="shippingFee"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Nhập phí vận chuyển
          </label>
          <div className="relative">
            <input
              type="text" // Dùng 'text' để hiển thị format
              id="shippingFee"
              // Giá trị hiển thị là state đã được format
              value={shippingFee.toLocaleString("vi-VN")}
              onChange={handleShippingFeeChange}
              className="w-full p-3 pr-12 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 font-sans text-right"
              placeholder="0"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
              VND
            </span>
          </div>
        </section>
        {/* === KHỐI GHI CHÚ MỚI (CHỈ HIỂN THỊ TRÊN WEB) === */}
        <section className="mb-8 print:hidden">
          <h3 className="text-xl font-bold mb-4 ">
            ĐIỀU 5: ĐIỀU KHOẢN BỔ SUNG
          </h3>
          <label
            htmlFor="additionalNotes"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Người bán có thể nhập thêm các ghi chú hoặc điều khoản riêng tại
            đây:
          </label>
          <textarea
            id="additionalNotes"
            rows={4}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 font-sans" // Dùng font-sans cho ô input
            placeholder="Ví dụ: Bảo hành 6 tháng, bàn giao xe vào ngày..."
            value={additionalNotes}
            onChange={(e) => setAdditionalNotes(e.target.value)}
          />
        </section>
      </div>
    </div>
  );
}
