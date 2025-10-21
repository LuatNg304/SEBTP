import React, { useState, useRef, useCallback } from "react";
import { X, UploadCloud } from "lucide-react"; // Sử dụng icon Lucide thay vì SVG raw
import { toast } from "react-toastify";

// Giới hạn upload
const MAX_FILES = 10;
const MAX_FILE_SIZE_MB = 5;

export default function ImageUploadArea({ onImageFilesChange }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  // Chuyển đổi File Object thành URL để xem trước
  const getPreviewUrl = (file) => URL.createObjectURL(file);

  // Thêm file đã chọn vào danh sách
  const addFiles = useCallback(
    (newFiles) => {
      // Lọc bỏ file không phải là ảnh hoặc quá lớn
      const validFiles = Array.from(newFiles).filter((file) => {
        const isImage = file.type.startsWith("image/");
        const isSizeValid = file.size / 1024 / 1024 < MAX_FILE_SIZE_MB;

        if (!isImage) {
          toast.error(`File "${file.name}" không phải là ảnh!`);
          return false;
        }
        if (!isSizeValid) {
          toast.error(`Ảnh "${file.name}" quá lớn (> ${MAX_FILE_SIZE_MB}MB)!`);
          return false;
        }
        return true;
      });

      const currentCount = selectedFiles.length;
      const newCount = validFiles.length;

      if (currentCount + newCount > MAX_FILES) {
        toast.warning(
          `Chỉ được chọn tối đa ${MAX_FILES} ảnh. Đã bỏ qua ${
            currentCount + newCount - MAX_FILES
          } ảnh.`
        );
        validFiles.splice(MAX_FILES - currentCount); // Giới hạn số lượng
      }

      if (validFiles.length > 0) {
        const updatedFiles = [...selectedFiles, ...validFiles];
        setSelectedFiles(updatedFiles);
        // Gửi danh sách file mới lên component cha
        onImageFilesChange(updatedFiles);
      }
    },
    [selectedFiles, onImageFilesChange]
  );

  // Xử lý khi người dùng chọn file bằng cách click
  const handleFileSelect = (event) => {
    addFiles(event.target.files);
    // Reset input để có thể chọn lại file cũ sau khi xóa
    event.target.value = null;
  };

  // Xử lý kéo thả (Drop)
  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files) {
      addFiles(event.dataTransfer.files);
    }
  };

  // Xử lý xóa ảnh
  const handleRemoveFile = (fileToRemove) => {
    // Giải phóng bộ nhớ của URL preview
    URL.revokeObjectURL(getPreviewUrl(fileToRemove));

    const updatedFiles = selectedFiles.filter((file) => file !== fileToRemove);
    setSelectedFiles(updatedFiles);
    // Gửi danh sách file đã cập nhật lên component cha
    onImageFilesChange(updatedFiles);
  };

  // Mở hộp thoại chọn file
  const openFileBrowser = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="space-y-4">
      {/* Vùng Upload Kéo Thả */}
      <div
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition duration-300 
            ${
              isDragging
                ? "border-emerald-500 bg-emerald-500/10"
                : "border-gray-300 dark:border-gray-600 hover:border-emerald-500 dark:hover:bg-gray-700/50"
            }`}
        onClick={openFileBrowser}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
      >
        <UploadCloud
          size={32}
          className="mx-auto text-gray-400 dark:text-gray-500"
          style={{ color: isDragging ? "#10B981" : undefined }}
        />

        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Kéo thả ảnh tại đây, hoặc{" "}
          <span className="text-emerald-600 dark:text-emerald-400 font-medium">
            Chọn từ thiết bị
          </span>
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
          Tối đa {MAX_FILES} ảnh (JPEG, PNG, &lt;{MAX_FILE_SIZE_MB}MB)
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
          disabled={selectedFiles.length >= MAX_FILES}
        />
      </div>

      {/* Vùng Hiển thị Preview */}
      {selectedFiles.length > 0 && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm"
            >
              <img
                src={getPreviewUrl(file)}
                alt={`Preview ${index}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn chặn mở File Browser
                  handleRemoveFile(file);
                }}
                className="absolute top-1 right-1 bg-red-500/80 hover:bg-red-600 text-white rounded-full p-0.5 transition duration-200"
              >
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
