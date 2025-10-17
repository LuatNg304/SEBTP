import React, { useEffect, useState } from "react";
import { 
  Layout, Button, Modal, Table, Form, Input, Card, 
  Typography, Space, Row, Col, Avatar, ConfigProvider, message, 
  Tag
} from "antd";
import { 
  PlusOutlined, MinusOutlined, ArrowUpOutlined, 
  ArrowDownOutlined, WalletOutlined 
} from "@ant-design/icons";
import api from "../../config/axios";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";

const { Content } = Layout;
const { Title, Text } = Typography;

const ViewWallet = () => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [transactionType, setTransactionType] = useState("");
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const response = await api.get("/user/wallet/balance");
      setBalance(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    try {
      const response = await api.get("/user/wallet/transactions");
      setTransactions(response.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  // Fetch all wallet data
  const fetchWalletData = () => {
    fetchBalance();
    fetchTransactions();
  };

  useEffect(() => {
    // Load dữ liệu lần đầu
    fetchWalletData();

    // Tạo BroadcastChannel để nhận thông báo từ tab callback
    const channel = new BroadcastChannel('wallet_channel');
    
    channel.onmessage = (event) => {
      if (event.data.type === 'PAYMENT_SUCCESS') {
        // Reload dữ liệu khi thanh toán thành công
        fetchWalletData();
        message.success('Nạp tiền thành công!');
      }
    };

    // Cleanup khi component unmount
    return () => {
      channel.close();
    };
  }, []);

  const showModal = (type) => {
    setTransactionType(type);
    setIsModalVisible(true);
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();

      if (transactionType === "deposit") {
        const response = await api.post('/user/wallet/deposit', {
          amount: parseFloat(values.amount)
        });

        if (response.data.success) {
          // Mở trang VNPay trong tab mới
          window.open(response.data.data, '_blank');
          
          setIsModalVisible(false);
          form.resetFields();
          message.info("Vui lòng hoàn tất thanh toán trên tab mới");
        }
      } else {
        await api.post('/user/wallet/withdraw', {
          amount: parseFloat(values.amount)
        });

        setIsModalVisible(false);
        form.resetFields();
        message.success("Rút tiền thành công!");
        
        // Reload dữ liệu sau khi rút tiền
        fetchWalletData();
      }

    } catch (error) {
      console.log('Error:', error.response?.data);
      message.error(error.response?.data?.message || "Giao dịch thất bại!");
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

 const columns = [
  {
    title: "Thời gian",
    dataIndex: "createdAt",
    key: "createdAt",
    width: 180,
    render: (date) => new Date(date).toLocaleString('vi-VN')
  },
  {
    title: "Loại giao dịch",
    dataIndex: "type",
    key: "type",
    width: 160,
    render: (type) => (
      <Space>
        {type === "DEPOSIT" ? (
          <>
            {/* NẠP TIỀN - Icon mũi tên LÊN */}
            <Avatar 
              size={32} 
              style={{ backgroundColor: '#e6f7e6', color: '#52c41a' }}
              icon={<ArrowUpOutlined />}
            />
            <Text>Nạp tiền</Text>
          </>
        ) : (
          <>
            {/* RÚT TIỀN - Icon mũi tên XUỐNG */}
            <Avatar 
              size={32} 
              style={{ backgroundColor: '#ffe6e6', color: '#ff4d4f' }}
              icon={<ArrowDownOutlined />}
            />
            <Text>Rút tiền</Text>
          </>
        )}
      </Space>
    )
  },
  {
    title: "Mô tả",
    dataIndex: "description",
    key: "description",
  },
  {
    title: "Trạng thái",
    dataIndex: "status",
    key: "status",
    width: 120,
    render: (status) => {
      let color = 'default';
      let text = status;
      
      if (status === 'SUCCESS') {
        color = 'success';
        text = 'Thành công';
      } else if (status === 'PENDING') {
        color = 'processing';
        text = 'Đang xử lý';
      } else if (status === 'FAILED') {
        color = 'error';
        text = 'Thất bại';
      }
      
      return <Tag color={color}>{text}</Tag>;
    }
  },
  {
    title: "Số tiền",
    dataIndex: "amount",
    key: "amount",
    width: 150,
    align: 'right',
    render: (amount, record) => (
      <Text strong style={{ color: record.type === "DEPOSIT" ? '#52c41a' : '#ff4d4f' }}>
        {record.type === "DEPOSIT" ? '+' : '-'}{amount.toLocaleString()} VND
      </Text>
    ),
  }
];


  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5B93FF',
          colorBgContainer: '#ffffff',
          borderRadius: 16,
          fontSize: 15,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#F7F9FC' }}>
        <Content style={{ padding: "32px" }}>
          <div style={{ maxWidth: 1400, margin: "0 auto" }}>
            <Space direction="vertical" size={24} style={{ width: '100%' }}>
              <Button 
                        icon={<Home />}
                        onClick={() => navigate("/")}
                        size="large"
                        style={{ 
                          background: 'rgba(79, 126, 32, 0.88)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          height: 48,
                          paddingLeft: 24,
                          paddingRight: 24,
                          fontSize: 16,
                          fontWeight: 500
                        }}
                      >
                        HOME
                      </Button>
              {/* Balance Card */}
              <Card 
                style={{ 
                  borderRadius: 20,
                  border: 'none',
                  background: 'linear-gradient(135deg, #2d5e3eff 0%, #204e287e 100%)',
                  boxShadow: '0 8px 24px rgba(102, 126, 234, 0.25)'
                }}
              >
                <Row align="middle" justify="space-between">
                  <Col>
                    <Space direction="vertical" size={4}>
                      <Text style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16 }}>
                        Ví của bạn
                      </Text>
                      <Title level={1} style={{ color: 'white', margin: 0, fontSize: 48, fontWeight: 600 }}>
                        {balance.toLocaleString()} VND
                      </Title>
                    </Space>
                  </Col>
                  <Col>
                    <Space size="middle">
                      <Button 
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => showModal("deposit")}
                        size="large"
                        style={{ 
                          background: 'white',
                          color: '#667eea',
                          border: 'none',
                          height: 48,
                          paddingLeft: 24,
                          paddingRight: 24,
                          fontSize: 16,
                          fontWeight: 500,
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}
                      >
                        Nạp tiền
                      </Button>
                      <Button 
                        icon={<MinusOutlined />}
                        onClick={() => navigate("/")}
                        size="large"
                        style={{ 
                          background: 'rgba(255,255,255,0.2)',
                          color: 'white',
                          border: '1px solid rgba(255,255,255,0.3)',
                          height: 48,
                          paddingLeft: 24,
                          paddingRight: 24,
                          fontSize: 16,
                          fontWeight: 500
                        }}
                      >
                        Rút tiền
                      </Button>
                      
                    </Space>
                  </Col>
                </Row>
              </Card>

              {/* Transaction History */}
              <Card 
                title={
                  <Title level={4} style={{ margin: 0, fontWeight: 600 }}>
                    Lịch sử giao dịch
                  </Title>
                }
                style={{ 
                  borderRadius: 16,
                  border: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                }}
              >
                <Table 
                  columns={columns} 
                  dataSource={transactions} 
                  pagination={{ 
                    pageSize: 6,
                    position: ['bottomCenter'],
                    showSizeChanger: false
                  }}
                  rowKey="key"
                  style={{ marginTop: 16 }}
                />
              </Card>
            </Space>
          </div>

          {/* Modal */}
          <Modal
            title={
              <Title level={4} style={{ margin: 0 }}>
                {transactionType === "deposit" ? "Nạp tiền" : "Rút tiền"}
              </Title>
            }
            open={isModalVisible}
            onOk={handleOk}
            onCancel={handleCancel}
            centered
            okText="Xác nhận"
            cancelText="Hủy"
            width={500}
            styles={{
              body: { paddingTop: 24 }
            }}
          >
            <Form form={form} layout="vertical">
              <Form.Item
                name="amount"
                label="Số tiền (VND)"
                rules={[
                  { required: true, message: "Vui lòng nhập số tiền!" },
                  { 
                    pattern: /^[0-9]+$/, 
                    message: "Vui lòng nhập số hợp lệ!" 
                  }
                ]}
              >
                <Input 
                  placeholder="0" 
                  size="large"
                  style={{ fontSize: 18 }}
                />
              </Form.Item>
              
              {transactionType === "withdraw" && (
                <div style={{ 
                  padding: 16, 
                  background: '#f5f5f5', 
                  borderRadius: 8,
                  marginTop: 8
                }}>
                  <Text type="secondary">
                    Số dư khả dụng: <strong>{balance.toLocaleString()} VND</strong>
                  </Text>
                </div>
              )}
            </Form>
          </Modal>
        </Content>
      </Layout>
    </ConfigProvider>
  );
};

export default ViewWallet;
