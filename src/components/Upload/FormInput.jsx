import React from "react";

function FormInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  // 💡 ĐÃ BỎ icon: Icon
  value,
  onChange,
  unit = "",
  required,
  // Bắt tất cả các props còn lại
  ...rest
}) {
  // Kiểm tra xem trường có phải là chỉ đọc không để điều chỉnh CSS
  const isReadOnly = rest.readOnly;

  // 💡 Đã cố định padding-left là pl-3 vì không còn icon nữa
  const inputPaddingLeft = "3";

  return (
    <div className="space-y-1">
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {/* 💡 ĐÃ BỎ PHẦN HIỂN THỊ ICON */}

        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          // TRUYỀN TẤT CẢ CÁC PROPS CÒN LẠI (BAO GỒM readOnly)
          {...rest}
          className={`
            block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:text-white 
            pl-${inputPaddingLeft} /* ⬅️ ĐÃ CỐ ĐỊNH Ở pl-3 */
            pr-${unit ? "10" : "3"} 
            py-2 text-sm
            focus:ring-emerald-500 focus:border-emerald-500 
            
            /* CSS CHO TRẠNG THÁI READONLY */
            ${
              isReadOnly
                ? "bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                : "dark:bg-gray-700"
            }
          `}
        />
        {unit && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              {unit}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
export { FormInput };
