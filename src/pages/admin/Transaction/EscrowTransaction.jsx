import React, { useState, useEffect } from "react";
import { Table, Tag, Card } from "antd";
import api from "../../../config/axios";

// Mapping cho kiểu giao dịch escrow
const transactionTypeConfig = {
  HOLD_DEPOSIT: { color: "orange", text: "Giữ tiền đặt cọc" },
  HOLD_PAYMENT: { color: "blue", text: "Giữ tiền thanh toán" },
  REFUND_TO_BUYER: { color: "green", text: "Hoàn tiền cho người mua" },
  RELEASE_TO_SELLER: { color: "purple", text: "Giải ngân người bán" },
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    amount
  );

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    // hour: "2-digit",
    // minute: "2-digit",
  });
};

const renderTypeTag = (type) => {
  const config = transactionTypeConfig[type] || {
    color: "default",
    text: type,
  };
  return <Tag color={config.color}>{config.text}</Tag>;
};

const EscrowTransaction = () => {
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const res = await api.get("/admin/escrow/transaction/list");
        if (res.data.success) setTransactions(res.data.data);
      } catch (error) {
        // Xử lý lỗi nếu cần
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const columns = [
    { title: "ID", dataIndex: "etId", key: "etId", width: 80 },
    { title: "Escrow ID", dataIndex: "escrowId", key: "escrowId", width: 100 },
    { title: "Order ID", dataIndex: "orderId", key: "orderId", width: 100 },
    {
      title: "Người nhận",
      dataIndex: "receiverName",
      key: "receiverName",
      width: 150,
      render: (value) => value || "--",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      width: 120,
      render: formatCurrency,
    },
    {
      title: "Kiểu giao dịch",
      dataIndex: "type",
      key: "type",
      width: 180,
      render: renderTypeTag,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 150,
      render: formatDate,
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Card title="Danh sách giao dịch escrow">
        <Table
          columns={columns}
          dataSource={transactions}
          rowKey="etId"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default EscrowTransaction;
