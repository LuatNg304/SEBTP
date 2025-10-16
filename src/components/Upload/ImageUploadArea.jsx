import React from "react";

export default function ImageUploadArea() {
  return (
    <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center cursor-pointer hover:border-emerald-500 transition duration-300 dark:hover:bg-gray-700/50">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="mx-auto text-gray-400 dark:text-gray-500"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" x2="12" y1="3" y2="15" />
      </svg>

      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Kéo thả ảnh tại đây, hoặc{" "}
        <span className="text-emerald-600 dark:text-emerald-400 font-medium">
          Chọn từ thiết bị
        </span>
      </p>

      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Tối đa 10 ảnh (JPEG, PNG, &lt;5MB)
      </p>

      <input type="file" multiple className="hidden" />
    </div>
  );
}
