import React, { useState, useEffect } from "react";
import { Table, Tag, Card } from "antd";
import api from "../../../config/axios";

const Escrow = () => {
  const [loading, setLoading] = useState(false);
  const [escrowData, setEscrowData] = useState([]);

  const fetchEscrowData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/escrow/list");
      if (response.data.success) {
        setEscrowData(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching escrow data:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchEscrowData();
  }, []);

  // Format số tiền theo chuẩn Việt Nam
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // Format ngày giờ
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Render status với màu sắc phù hợp
  const renderStatus = (status) => {
    const statusConfig = {
      LOCKED: { color: "orange", text: "Đang giữ tiền" },
      DISPUTED: { color: "red", text: "Đang có khiếu nại" },
      RELEASED_TO_SELLER: { color: "blue", text: " Giải ngân cho người bán" },
      REFUNDED_TO_BUYER: { color: "green", text: "Hoàn tiền cho người mua" },
      CLOSED: { color: "default", text: "Đã đóng" },
    };

    const config = statusConfig[status] || { color: "default", text: status };
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: "Escrow ID",
      dataIndex: "escrowId",
      key: "escrowId",
      width: 100,
    },
    {
      title: "Order ID",
      dataIndex: "orderId",
      key: "orderId",
      width: 100,
    },
    {
      title: "Người bán",
      dataIndex: "sellerName",
      key: "sellerName",
      width: 150,
    },
    {
      title: "Người mua",
      dataIndex: "buyerName",
      key: "buyerName",
      width: 150,
    },
    {
      title: "Tiền đặt cọc",
      dataIndex: "depositAmount",
      key: "depositAmount",
      width: 150,
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Tiền thanh toán",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      width: 150,
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalAmount",
      key: "totalAmount",
      width: 150,
      render: (amount) => formatCurrency(amount),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 180,
      render: (status) => renderStatus(status),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: (date) => formatDate(date),
    },
    {
      title: "Cập nhật",
      dataIndex: "updatedAt",
      key: "updatedAt",
      width: 150,
      render: (date) => formatDate(date),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Card title="Quản lý Escrow">
        <Table columns={columns} dataSource={escrowData} />
      </Card>
    </div>
  );
};

export default Escrow;
