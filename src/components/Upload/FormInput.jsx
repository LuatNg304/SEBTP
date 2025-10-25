import React from "react";

// Giả định bạn đã import các icons cần thiết (ví dụ: LucideDollarSign)

function FormInput({
  id,
  name,
  label,
  type = "text",
  placeholder,
  icon: Icon,
  value,
  onChange,
  unit = "",
  required,
  // Bắt tất cả các props còn lại (bao gồm readOnly, style, etc.)
  ...rest
}) {
  // Kiểm tra xem trường có phải là chỉ đọc không để điều chỉnh CSS
  const isReadOnly = rest.readOnly;

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
        {Icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="text-gray-400 dark:text-gray-500" size={20} />
          </div>
        )}
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          // 💡 TRUYỀN TẤT CẢ CÁC PROPS CÒN LẠI (BAO GỒM readOnly)
          {...rest}
          className={`
            block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:text-white 
            pl-${Icon ? "10" : "3"} 
            pr-${unit ? "10" : "3"} 
            py-2 text-sm
            focus:ring-emerald-500 focus:border-emerald-500 
            
            /* 💡 CSS CHO TRẠNG THÁI READONLY */
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
