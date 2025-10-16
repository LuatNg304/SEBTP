"use client";
import React, { useState } from "react";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  BarChart3,
  BatteryCharging,
  MessageCircle,
  Gauge,
} from "lucide-react";

import Header from "../../components/header";

// --- MOCK DATA ---
const sellerStats = {
  profit: 15420.75,
  profitChange: 12.4,
  unitsSold: 430,
  unitsChange: 8.2,
  estimatedSales: 74500.6,
  salesChange: 14.5,
  ppcSpend: 3120.5,
  ppcSpendChange: -4.2,
};

const mockProducts = [
  {
    sku: "EV-2025-01",
    name: "Xe điện E-Rider Pro",
    category: "Xe điện",
    stock: 25,
    revenue: 42500,
  },
  {
    sku: "BAT-4000",
    name: "Pin Lithium 72V - 40Ah",
    category: "Pin điện",
    stock: 58,
    revenue: 17500,
  },
  {
    sku: "CHG-FAST",
    name: "Bộ sạc nhanh E-Charge",
    category: "Phụ kiện",
    stock: 40,
    revenue: 14500,
  },
];

// --- HELPER ---
const formatUSD = (num) =>
  "$" +
  num.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

// --- COMPONENTS ---
const StatCard = ({ title, value, change }) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? TrendingUp : TrendingDown;
  const changeClass = isPositive
    ? "text-green-500 bg-green-50"
    : "text-red-500 bg-red-50";

  return (
    <div className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 space-y-2">
      <h3 className="text-md font-medium text-gray-500 dark:text-gray-400">
        {title}
      </h3>
      <div className="flex justify-between items-center">
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {value}
        </p>
        <div
          className={`flex items-center text-sm font-medium p-1 rounded-full ${changeClass}`}
        >
          <ChangeIcon className="w-4 h-4 mr-1" />
          {Math.abs(change)}%
        </div>
      </div>
    </div>
  );
};

const BarChartPlaceholder = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 min-h-80">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Doanh thu xe & pin điện theo tháng
    </h3>
    <svg
      viewBox="0 0 100 70"
      className="w-full h-56"
      preserveAspectRatio="none"
    >
      <line x1="15" y1="65" x2="95" y2="65" stroke="#ccc" strokeWidth="0.5" />
      {[...Array(12)].map((_, i) => {
        const ev = 10 + Math.random() * 20;
        const battery = 5 + Math.random() * 15;
        const total = ev + battery;
        const base = 65;
        return (
          <g key={i}>
            <rect
              x={15 + i * 7}
              y={base - total}
              width="3"
              height={ev}
              fill="#22C55E"
              rx="0.5"
              ry="0.5"
            />
            <rect
              x={15 + i * 7}
              y={base - battery}
              width="3"
              height={battery}
              fill="#FACC15"
              rx="0.5"
              ry="0.5"
            />
          </g>
        );
      })}
    </svg>
  </div>
);

const ProductTable = () => (
  <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
      Sản phẩm bán chạy
    </h3>
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              SKU
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Tên sản phẩm
            </th>
            <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Danh mục
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Tồn kho
            </th>
            <th className="px-3 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Doanh thu
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {mockProducts.map((p) => (
            <tr
              key={p.sku}
              className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
            >
              <td className="px-3 py-3 text-sm text-blue-600 font-medium">
                {p.sku}
              </td>
              <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                {p.name}
              </td>
              <td className="px-3 py-3 text-sm text-gray-700 dark:text-gray-300">
                {p.category}
              </td>
              <td className="px-3 py-3 text-sm text-right text-gray-700 dark:text-gray-300">
                {p.stock}
              </td>
              <td className="px-3 py-3 text-sm text-right font-semibold text-emerald-600 dark:text-emerald-400">
                {formatUSD(p.revenue)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

// --- MAIN ---
export default function SellerDashboard() {


  return (
    <div className={`${"bg-transparent"} min-h-screen`}>
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1 p-6 sm:p-10 space-y-6">
          {/* Stats + Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Stats left */}
            <div className="lg:col-span-1 grid grid-cols-2 gap-4 lg:grid-cols-1">
              <StatCard
                title="Lợi nhuận"
                value={formatUSD(sellerStats.profit)}
                change={sellerStats.profitChange}
              />
              <StatCard
                title="Sản phẩm bán ra"
                value={sellerStats.unitsSold}
                change={sellerStats.unitsChange}
              />
              <StatCard
                title="Doanh thu ước tính"
                value={formatUSD(sellerStats.estimatedSales)}
                change={sellerStats.salesChange}
              />
              <StatCard
                title="Chi phí quảng cáo"
                value={formatUSD(sellerStats.ppcSpend)}
                change={sellerStats.ppcSpendChange}
              />
            </div>
            {/* Chart right */}
            <div className="lg:col-span-2">
              <BarChartPlaceholder />
            </div>
          </div>

          {/* Product Table */}
          <ProductTable />

          <footer className="text-center text-sm text-gray-500 dark:text-gray-400 pt-6">
            © 2025 EVMarket Seller Platform. All rights reserved.
          </footer>
        </div>
      </div>
    </div>
  );
}
