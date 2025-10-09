import React from "react";
import { Row, Col, Card, Statistic, Table } from "antd";
import {
  DollarOutlined,
  UserOutlined,
  ShoppingCartOutlined,
} from "@ant-design/icons";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);


const AdminDashboard = () => {
  // Dữ liệu mẫu cho biểu đồ
  const lineData = {
    labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4", "Tháng 5", "Tháng 6"],
    datasets: [
      {
        label: "Doanh thu (triệu VND)",
        data: [12, 19, 14, 20, 25, 22],
        borderColor: "#22c55e",
        backgroundColor: "rgba(34,197,94,0.2)",
        tension: 0.3,
      },
    ],
  };

  const barData = {
    labels: ["Oto", "Xe máy", "Pin"],
    datasets: [
      {
        label: "Số lượng bán",
        data: [25, 40, 30],
        backgroundColor: ["#22c55e", "#16a34a", "#4ade80"],
      },
    ],
  };

  // Dữ liệu bảng mẫu
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên sản phẩm", dataIndex: "name", key: "name" },
    { title: "Loại", dataIndex: "type", key: "type" },
    { title: "Giá", dataIndex: "price", key: "price" },
    { title: "Số lượng tồn", dataIndex: "stock", key: "stock" },
  ];

  const data = [
    { id: 1, name: "Oto điện X1", type: "Oto", price: "120 triệu", stock: 5 },
    {
      id: 2,
      name: "Xe máy E-Bike",
      type: "Xe máy",
      price: "25 triệu",
      stock: 12,
    },
    {
      id: 3,
      name: "Pin Lithium 20Ah",
      type: "Pin",
      price: "5 triệu",
      stock: 20,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Cards thống kê */}
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Doanh thu tháng"
              value={12345}
              precision={0}
              valueStyle={{ color: "#22c55e" }}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Người dùng mới"
              value={532}
              valueStyle={{ color: "#16a34a" }}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={124}
              valueStyle={{ color: "#4ade80" }}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Card title="Biểu đồ doanh thu theo tháng">
        <Line data={lineData} />
      </Card>

      {/* Biểu đồ số lượng bán */}
      <Card title="Sản phẩm bán ra theo loại">
        <Bar data={barData} />
      </Card>

      {/* Bảng dữ liệu */}
      <Card title="Danh sách sản phẩm">
        <Table columns={columns} dataSource={data} rowKey="id" />
      </Card>
    </div>
  );
};

export default AdminDashboard;
