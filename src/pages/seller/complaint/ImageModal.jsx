import React from "react";
import ReactDOM from "react-dom";
import { XCircle } from "lucide-react";

const ImageModal = ({ imageUrl, onClose }) => {
  if (!imageUrl) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4"
      onClick={onClose}
    >
      {/* Container ảnh */}
      <div
        className="relative max-w-[95vw] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Nút đóng nằm trên ảnh */}
        <button
          className="absolute top-3 right-3 text-white bg-black/50 rounded-full p-1 hover:bg-black/70 transition"
          onClick={onClose}
        >
          <XCircle className="w-8 h-8" />
        </button>

        {/* Ảnh */}
        <img
          src={imageUrl}
          alt="Xem ảnh lớn"
          className="w-[60vw] h-[60vh] object-contain rounded-none"
        />
      </div>
    </div>,
    document.body
  );
};

export default ImageModal;
