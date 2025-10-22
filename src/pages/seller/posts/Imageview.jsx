
import React from "react";
import { Image } from "antd"; 

export default function ImageViewer({ images }) {
  if (!images || images.length === 0) {
    return <p className="text-gray-500">Chưa có hình ảnh nào.</p>;
  }

  // Lọc bỏ các giá trị không hợp lệ (như undefined/null nếu có)
  const validImages = images.filter(
    (url) => typeof url === "string" && url.length > 0
  );

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
      {validImages.map((url, index) => (
        <div
          key={index}
          className="aspect-square overflow-hidden rounded-lg shadow-sm"
        >
          {/* Sử dụng Antd Image để có chức năng xem đầy đủ (preview) */}
          <Image
            width="100%"
            height="100%"
            style={{ objectFit: "cover" }}
            src={url}
            fallback="placeholder.png" // Ảnh dự phòng nếu link lỗi
            alt={`Ảnh sản phẩm ${index + 1}`}
          />
        </div>
      ))}
    </div>
  );
}
