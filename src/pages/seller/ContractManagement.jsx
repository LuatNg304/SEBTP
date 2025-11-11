"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Segmented,
  Card,
  Typography,
  Input,
} from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";

// --- HELPER (Không đổi) ---
const { Title } = Typography;
const { Search } = Input;

// --- THÊM HÀM FORMAT DATE ---
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const getContractStatusTag = (status) => {
  let color = "gray";
  let text = "KHÔNG RÕ";
  const upperStatus = status?.toUpperCase();

  switch (upperStatus) {
    case "PENDING":
      color = "orange";
      text = "Chờ Ký";
      break;
    case "SIGNED":
      color = "blue";
      text = "Đã Ký";
      break;
    case "CANCELLED":
      color = "red";
      text = "Đã Hủy";
      break;
    default:
      text = status || "Không rõ";
  }
  return <Tag color={color}>{text.toUpperCase()}</Tag>;
};

// --- MAIN COMPONENT ---
const ContractManagement = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // --- FETCH DATA ---
  const fetchContracts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/seller/contracts");
      let incomingData =
        res.data?.data || (Array.isArray(res.data) ? res.data : []);
      let processedData = incomingData.map((item, index) => ({
        ...item,
        key: item.contractId || item.id || index,
      }));

      // --- 1. SẮP XẾP DỮ LIỆU SAU KHI TẢI ---
      // Sắp xếp theo 'createdAt' (ngày tạo), mới nhất lên đầu (descending)
      processedData.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      // --- KẾT THÚC SẮP XẾP ---

      setData(processedData);
      setFilteredData(processedData);
    } catch (err) {
      console.error("Fetch Contracts Error:", err);
      toast.error(
        err.response?.data?.message || "Không thể tải dữ liệu hợp đồng."
      );
      setData([]);
      setFilteredData([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  // useEffect để lọc (Không đổi)
  useEffect(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();
    const filtered = data.filter((item) =>
      (item.buyerName || "").toLowerCase().includes(lowerCaseSearchTerm)
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // --- ACTIONS (Không đổi) ---
  const handleViewContract = (record) => {
    navigate(`/seller/contract/view/${record.id}`);
  };

  const handleViewChange = (value) => {
    if (value === "orders") {
      navigate("/seller/order");
    }
  };

  // --- 2. CẬP NHẬT COLUMN DEFINITIONS ---
  const contractColumns = [
    {
      title: "Mã Hợp Đồng",
      dataIndex: "id",
      key: "id",
      render: (text) => <a className="font-medium">#{text}</a>,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Tên Khách Hàng",
      dataIndex: "buyerName",
      key: "buyerName",
      sorter: (a, b) => (a.buyerName || "").localeCompare(b.buyerName || ""),
    },
    // --- THÊM CỘT NGÀY TẠO ---
    {
      title: "Ngày Tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (text) => formatDate(text), // Sử dụng hàm formatDate
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      // Mặc định đã được sắp xếp lúc tải, đây là để user tự sort lại
    },
    // --- KẾT THÚC THÊM CỘT ---
    {
      title: "Trạng Thái",
      dataIndex: "status",
      key: "status",
      render: (status) => getContractStatusTag(status),
      filters: [
        { text: "Chờ Ký", value: "PENDING" },
        { text: "Đã Ký", value: "SIGNED" },
        { text: "Đã Hủy", value: "CANCELLED" },
      ],
      onFilter: (value, record) => record.status?.toUpperCase() === value,
    },
    {
      title: "Hành Động",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Button type="link" onClick={() => handleViewContract(record)}>
          Xem Chi Tiết
        </Button>
      ),
    },
  ];

  // --- RENDER JSX (Không đổi) ---
  return (
    <div className="min-h-screen bg-transparent space-y-6 flex flex-col">
      <Space
        direction="vertical"
        size="large"
        style={{ width: "100%", padding: "24px" }}
      >
        <div className="bg-dark p-5 rounded-xl ">
         
            <Segmented
              options={[
                {
                  label: "Quản lý Đơn Hàng",
                  value: "orders",
                },
                {
                  label: "Quản lý Hợp Đồng",
                  value: "contracts",
                },
              ]}
              value={"contracts"}
              onChange={handleViewChange}
              block
              size="large"
            />
         
        </div>
        <Card>
          <Space
            direction="vertical"
            style={{ width: "100%", marginBottom: 16 }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <Title level={3} style={{ margin: 0 }}>
                Danh sách Hợp đồng
              </Title>
              <Search
                placeholder="Tìm theo tên khách hàng..."
                allowClear
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ width: 300 }}
              />
            </div>
          </Space>

          <Table
            columns={contractColumns}
            dataSource={filteredData}
            loading={loading}
            rowKey="key"
            scroll={{
              x: "max-content",
            }}
            showSorterTooltip={false}
          />
        </Card>
      </Space>
    </div>
  );
};

export default ContractManagement;
