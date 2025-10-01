import React, { useState } from 'react';
import { FaPhoneAlt, FaRegHeart, FaShareAlt, FaMapMarkerAlt, FaCalendarAlt, FaChevronLeft, FaChevronRight, FaEllipsisH } from 'react-icons/fa'; // Thêm icon ellipsis cho menu
import { GoCheck } from 'react-icons/go'; // Icon checkmark

const ViewCar = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const car = {
    id: 1,
    name: "Chevrolet Captiva 2008 LT 2.4 - 990000 km", // Tên đầy đủ
    make: "Chevrolet",
    model: "Captiva",
    year: 2008,
    version: "LT 2.4",
    mileage: "990000 km", // Số km chạy
    transmission: "Số sàn", // Hộp số
    fuelType: "Xăng", // Nhiên liệu
    color: "Ghi", // Màu sắc (dựa trên ảnh)
    engine: "2.4L",
    seats: 7, // Số chỗ ngồi
    bodyType: "SUV / Cross-over", // Kiểu dáng
    horsepower: "134 HP @5000 RPM", // Công suất
    torque: "220 Nm @3200 RPM", // Mô-men xoắn
    groundClearance: "200 mm", // Khoảng sáng gầm
    doors: 5, // Số cửa
    weight: "> 1 tấn", // Trọng lượng
    origin: "Việt Nam", // Xuất xứ
    condition: "Đã sử dụng", // Tình trạng
    warranty: "Bảo hành hãng", // Bảo hành

    price: "110.000.000", // Giá tiền Việt Nam Đồng
    pricePerMonth: "5.197.000", // Giá trả góp hàng tháng
    description: `Xe nhà sử dụng cẩn thận, bảo dưỡng định kỳ, chạy êm ái.
                  Máy móc nguyên bản, không đâm đụng, ngập nước.
                  Nội thất sạch sẽ, ghế da, có màn hình Android.
                  Đời 2008 nhưng xe còn rất mới, chạy đường trường rất đầm.
                  Bán để lên đời xe mới. Liên hệ xem xe tại Huyện Bình Chánh.`,
    images: [ // Các URL ảnh thật của Captiva 2008 (thay thế bằng ảnh từ ảnh bạn cung cấp nếu có)
      "https://i.ibb.co/L63R87P/main-image.jpg", // Ảnh chính từ screenshot
      "https://i.ibb.co/N2z027b/thumb-1.jpg", // Thumbnail 1
      "https://i.ibb.co/3sH3LqK/thumb-2.jpg", // Thumbnail 2
      "https://i.ibb.co/X32W6f7/thumb-3.jpg", // Thumbnail 3
      "https://i.ibb.co/Zc23h6r/thumb-4.jpg", // Thumbnail 4 (Ảnh nội thất)
      "https://i.ibb.co/YhGvWqR/thumb-5.jpg"  // Thêm ảnh nếu có
    ],
    sellerName: "Duy Linh", // Tên người bán
    sellerPhone: "097417****9", // Số điện thoại
    location: "Phường 7, Quận Bình Thạnh, TP. Hồ Chí Minh",
    postedDate: "Đăng 10 ngày trước",
    isVerified: true, // Đã xác thực
    rating: 0, // Đánh giá người bán
    activeStatus: "Hoạt động 5 ngày trước", // Trạng thái hoạt động
    sellerNotes: "Chưa có đánh giá nào."
  };

  // Lấy ảnh chính từ mảng images (ảnh đầu tiên)
  const mainImage = car.images[currentSlide];

  return (
    <div className="bg-gray-100 min-h-screen font-sans antialiased text-gray-800">
      {/* Top Bar (Mô phỏng như trong ảnh của bạn) */}
      <div className="bg-white shadow-sm py-2 px-4 border-b border-gray-200 text-sm text-gray-600">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <span className="text-gray-500">
            Chợ Tốt Xe / Ô tô / Ô tô tại Hồ Chí Minh / Ô tô Quận Bình Thạnh / <span className="text-gray-800 font-medium">Chevrolet Captiva 2008 LT 2.4 - 990000 km</span>
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Cột trái: Ảnh và Mô tả */}
          <div className="md:w-2/3 space-y-6">
            {/* Carousel ảnh chính */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
              <div className="relative h-96 lg:h-[500px] overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out h-full"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Car image ${index + 1}`}
                      className="w-full flex-shrink-0 object-cover h-full"
                    />
                  ))}
                </div>

                {/* Nút điều hướng */}
                <button
                  onClick={prevSlide}
                  className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextSlide}
                  className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white bg-opacity-70 p-2 rounded-full shadow-md hover:bg-opacity-90 transition-all text-gray-700 hover:text-gray-900 focus:outline-none"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>

                {/* Số ảnh hiện tại */}
                <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white text-xs px-3 py-1 rounded-full">
                  {currentSlide + 1}/{car.images.length}
                </div>
              </div>

              {/* Thumbnail ảnh */}
              <div className="p-4 bg-gray-50">
                <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide"> {/* scrollbar-hide để ẩn thanh cuộn */}
                  {car.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`w-20 h-16 object-cover rounded-md cursor-pointer border-2 ${
                        index === currentSlide ? 'border-blue-500' : 'border-transparent'
                      } hover:border-blue-300 transition-all duration-200`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Mô tả chi tiết */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Mô tả chi tiết</h2>
              <div className="prose max-w-none text-gray-700 leading-relaxed text-base">
                {car.description.split('\n').map((paragraph, index) => (
                  <p key={index} className="mb-2">{paragraph.trim()}</p>
                ))}
              </div>
              <button className="text-blue-600 hover:text-blue-800 font-medium mt-4">
                Xem thêm <FaChevronRight className="inline ml-1 text-xs" />
              </button>
            </div>
          </div>

          {/* Cột phải: Thông tin chính, giá, liên hệ */}
          <div className="md:w-1/3 space-y-6">
            {/* Tiêu đề và nút yêu thích */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start mb-2">
                <h1 className="text-2xl font-bold text-gray-900 leading-tight">
                  {car.name}
                </h1>
                <button className="text-gray-400 hover:text-red-500 transition-all duration-300 p-2 rounded-full">
                  <FaRegHeart className="w-6 h-6" />
                </button>
              </div>
              <p className="text-3xl font-bold text-red-600 mt-2">{car.price} VNĐ</p>
              <p className="text-sm text-gray-500 mt-1">{car.pricePerMonth} VNĐ/tháng (trả góp)</p>

              <div className="flex items-center text-gray-600 text-sm mt-4 space-x-4">
                <p className="flex items-center">
                  <FaMapMarkerAlt className="mr-2 text-gray-400" /> {car.location}
                </p>
                <p className="flex items-center">
                  <FaCalendarAlt className="mr-2 text-gray-400" /> {car.postedDate}
                </p>
              </div>

              {/* Nút chat và hiện số */}
              <div className="mt-6 space-y-3">
                <button className="flex items-center justify-center w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300">
                  Chat
                </button>
                <button className="flex items-center justify-center w-full bg-yellow-400 hover:bg-yellow-500 text-gray-800 font-bold py-3 px-6 rounded-lg transition duration-300 shadow-md">
                  <FaPhoneAlt className="mr-3 text-lg" />
                  <span>Hiện số {car.sellerPhone}</span>
                </button>
              </div>
            </div>

            {/* Thông tin người bán */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-600 mr-3">
                    {car.sellerName.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-gray-900">{car.sellerName}</p>
                    <p className="text-sm text-gray-500 flex items-center">
                        {car.isVerified && <GoCheck className="text-blue-500 mr-1" />} Hoạt động {car.activeStatus}
                    </p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-800 p-2 rounded-full">
                    <FaEllipsisH />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-4">Đánh giá: (0) {car.sellerNotes}</p>
              <div className="flex justify-between text-blue-600 text-sm">
                <a href="#" className="hover:underline">Xe chưa chạy không?</a>
                <a href="#" className="hover:underline">Xe chính chủ hay đã qua sử dụng?</a>
              </div>
            </div>

            {/* Bình luận */}
            <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Bình luận</h2>
                <div className="text-gray-600 text-center py-8 border-t border-gray-200">
                    <p className="mb-2">Chưa có bình luận nào.</p>
                    <p>Hãy để lại bình luận cho người bán.</p>
                </div>
                {/* Khu vực nhập bình luận (tạm thời để trống) */}
                <div className="mt-4 flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0"></div> {/* Avatar người dùng */}
                    <input
                        type="text"
                        placeholder="Bình luận..."
                        className="flex-grow border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button className="text-blue-500 hover:text-blue-700 font-medium">Gửi</button>
                </div>
            </div>
          </div>
        </div>

        {/* Thông số chi tiết (phần dưới của trang) */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông số chi tiết</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-4 text-gray-700 text-sm">
                <div className="space-y-2">
                    <p className="font-semibold text-gray-900 mb-2">Tình trạng xe</p>
                    <p><span className="text-gray-500">Số Km đã đi:</span> {car.mileage}</p>
                    <p><span className="text-gray-500">Tình trạng:</span> {car.condition}</p>
                    <p><span className="text-gray-500">Xuất xứ:</span> {car.origin}</p>
                    <p><span className="text-gray-500">Chính sách bảo hành:</span> {car.warranty}</p>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold text-gray-900 mb-2">Thông số kỹ thuật</p>
                    <p><span className="text-gray-500">Hãng:</span> {car.make}</p>
                    <p><span className="text-gray-500">Động cơ:</span> {car.engine}</p>
                    <p><span className="text-gray-500">Hộp số:</span> {car.transmission}</p>
                    <p><span className="text-gray-500">Nhiên liệu:</span> {car.fuelType}</p>
                    <p><span className="text-gray-500">Kiểu dáng:</span> {car.bodyType}</p>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold text-gray-900 mb-2">Chi tiết khác</p>
                    <p><span className="text-gray-500">Năm sản xuất:</span> {car.year}</p>
                    <p><span className="text-gray-500">Phiên bản:</span> {car.version}</p>
                    <p><span className="text-gray-500">Số chỗ:</span> {car.seats}</p>
                    <p><span className="text-gray-500">Màu sắc:</span> {car.color}</p>
                    <p><span className="text-gray-500">Số cửa:</span> {car.doors}</p>
                    <p><span className="text-gray-500">Trọng lượng:</span> {car.weight}</p>
                </div>
                <div className="space-y-2">
                    <p className="font-semibold text-gray-900 mb-2">Hiệu năng</p>
                    <p><span className="text-gray-500">Công suất động cơ:</span> {car.horsepower}</p>
                    <p><span className="text-gray-500">Mô-men xoắn cực đại:</span> {car.torque}</p>
                    <p><span className="text-gray-500">Khoảng sáng gầm:</span> {car.groundClearance}</p>
                </div>
            </div>
        </div>

        {/* Khối "Bạn có cảm thấy tin đăng này rõ ràng..." */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6 flex items-center justify-between">
            <p className="text-base text-gray-700">Bạn có cảm thấy tin đăng này rõ ràng và đáng tin cậy để mua hàng không?</p>
            <div className="flex items-center space-x-4 text-2xl text-gray-500">
                <span className="cursor-pointer hover:text-green-500">😊</span>
                <span className="cursor-pointer hover:text-yellow-500">😐</span>
                <span className="cursor-pointer hover:text-red-500">😠</span>
                <button className="text-gray-400 hover:text-gray-600 text-xl"><span className="font-bold">x</span></button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCar;