// PackageCard.jsx
import React from "react";

// Icon tick (dấu check)
const CheckIcon = () => (
  <svg
    className="w-5 h-5 text-blue-500"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

// Icon sao (hoặc dấu nổi bật)
const StarIcon = ({ filled }) => (
  <svg
    className={`w-5 h-5 ${
      filled ? "text-yellow-400 fill-current" : "text-gray-300"
    }`}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M5 12h14M12 5l7 7-7 7"
    />
  </svg>
);

// Component chính hiển thị thông tin gói
const PackageCard = ({ packageData }) => {
  const { name, price, duration, features, isFeatured } = packageData;

  // Style động
  const cardClass = `rounded-xl bg-white shadow-xl overflow-hidden ${
    isFeatured ? "border-2 border-red-500 transform scale-105 shadow-2xl" : ""
  }`;

  const headerClass = `p-6 text-white rounded-t-xl ${
    isFeatured
      ? "bg-gradient-to-r from-red-600 to-pink-600"
      : "bg-gradient-to-r from-purple-600 to-indigo-600"
  }`;

  const buttonClass =
    "bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-300 text-lg";

  // Xử lý hiển thị **bold** trong text
  const renderFeatureText = (text) => {
    return text.split(/(\*\*.*?\*\*)/g).map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className={cardClass}>
      {isFeatured && (
        <div className="absolute top-4 -right-12 bg-red-500 text-white py-1 px-10 text-sm font-bold uppercase transform rotate-45 shadow-lg">
          Featured
        </div>
      )}

      {/* Header */}
      <div className={headerClass}>
        <h2 className="text-2xl font-bold mb-1">{name}</h2>
        <p className="text-4xl font-extrabold border-b border-white border-opacity-30 pb-3">
          {price} <span className="text-xl font-medium">cho {duration}</span>
        </p>
      </div>

      {/* Danh sách tính năng */}
      <div className="p-6">
        <div className="flex justify-end mb-4">
          <StarIcon filled={isFeatured} />
        </div>

        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-start border-b pb-3 last:border-b-0"
            >
              <span className="mr-3 mt-1 text-blue-500">
                <CheckIcon />
              </span>
              <span className="text-gray-700">
                {renderFeatureText(feature)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Nút thanh toán */}
      <div className="p-6 pt-0">
        <button
          className={buttonClass}
          onClick={() => console.log(`Thanh toán ${name}`)}
        >
          Thanh toán
        </button>
      </div>
    </div>
  );
};

export default PackageCard;
