import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Descriptions,
  Space,
  Empty,
  Spin,
  Card,
  Input,
  Form,
  Select,
  Upload,
  message,
} from "antd";
import {
  ShoppingCartOutlined,
  EyeOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  TruckOutlined,
  DollarOutlined,
  CloseCircleOutlined,
  FileTextOutlined,
  PlusOutlined,
} from "@ant-design/icons";

import api from "../../config/axios";
import { toast } from "react-toastify";
import Header from "../../components/header";
import { useNavigate } from "react-router-dom";
import { uploadFile } from "../../utils/upload";

const { TextArea } = Input;

const Orders = () => {
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [cancelForm] = Form.useForm();
  const [contractList, setContractList] = useState([]);
  const [deliveryList, setDeliveryList] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [isComplainModalVisible, setIsComplainModalVisible] = useState(false);
  const [complainForm] = Form.useForm();
  const [complainLoading, setComplainLoading] = useState(false);

  const navigate = useNavigate();

  // Fetch danh sách delivery
  const fetchDeliveries = async () => {
    try {
      const response = await api.get("/buyer/order-deliveries");
      setDeliveryList(response.data.data || []);
      console.log("✅ Deliveries:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching deliveries:", error);
    }
  };

  // Fetch danh sách hợp đồng
  const fetchContracts = async () => {
    try {
      const response = await api.get("/buyer/contracts");
      setContractList(response.data.data || []);
      console.log("✅ Contracts:", response.data.data);
    } catch (error) {
      console.error("❌ Error fetching contracts:", error);
    }
  };

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await api.get("/buyer/orders");

      const sortedOrders = (response.data.data || []).sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setOrderList(sortedOrders);
      console.log("✅ Orders:", sortedOrders);
    } catch (error) {
      console.error("❌ Error:", error);
      toast.error(
        error.response?.data?.message || "Không thể tải danh sách đơn hàng"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchContracts();
    fetchDeliveries();
  }, []);

  const hasContract = (orderId) => {
    return contractList.some((contract) => contract.orderId === orderId);
  };

  const getContractId = (orderId) => {
    const contract = contractList.find((c) => c.orderId === orderId);
    return contract?.id;
  };

  const getDeliveryStatus = (orderId) => {
    const delivery = deliveryList.find(
      (d) => d.orderId.toString() === orderId.toString()
    );
    return delivery?.status;
  };

  const handleViewDetail = (orderId) => {
    navigate(`/delivery/${orderId}`);
  };

  const getStatusConfig = (status) => {
    const statusMap = {
      PENDING: { text: "Chờ xác nhận", color: "orange" },
      REJECTED: { text: "Đã từ chối", color: "red" },
      APPROVED: { text: "Đã xác nhận", color: "blue" },
      DONE: { text: "Hoàn thành", color: "green" },
      DEPOSITED: { text: "Đã đặt cọc", color: "cyan" },
      CANCELED: { text: "Đã hủy", color: "default" },
    };
    return statusMap[status] || { text: status, color: "default" };
  };

  const getDeliveryMethod = (method) => {
    const deliveryMap = {
      GHN: "Giao hàng nhanh",
      SELLER_DELIVERY: "Người bán giao",
      BUYER_PICKUP: "Tự đến lấy",
    };
    return deliveryMap[method] || method;
  };

  // ✅ CẬP NHẬT: Hàm hiển thị hình thức thanh toán dựa vào wantDeposit
  const getPaymentTypeDisplay = (wantDeposit) => {
    return wantDeposit ? "Đặt cọc trước" : "Thanh toán toàn bộ khi nhận hàng";
  };

  const showOrderDetail = (record) => {
    setSelectedOrder(record);
    setIsModalVisible(true);
  };

  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedOrder(null);
  };

  const showCancelModal = (record) => {
    setSelectedOrder(record);
    setIsCancelModalVisible(true);
    cancelForm.resetFields();
  };

  const handleCancelModalClose = () => {
    setIsCancelModalVisible(false);
    setSelectedOrder(null);
    cancelForm.resetFields();
  };

  const handleCancelOrder = async () => {
    try {
      const values = await cancelForm.validateFields();
      setCancelLoading(true);

      await api.patch("/buyer/orders/cancel", {
        orderId: selectedOrder.id,
        reason: values.reason,
      });

      toast.success("Hủy đơn hàng thành công!");
      setIsCancelModalVisible(false);
      cancelForm.resetFields();

      await fetchOrder();
    } catch (error) {
      if (error.errorFields) {
        toast.error("Vui lòng nhập lý do hủy đơn!");
      } else {
        console.error("❌ Error:", error);
        toast.error(error.response?.data?.message || "Không thể hủy đơn hàng");
      }
    } finally {
      setCancelLoading(false);
    }
  };

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "id",
      key: "id",
      width: 100,
      sorter: (a, b) => a.id - b.id,
      render: (id) => (
        <a onClick={() => showOrderDetail(orderList.find((o) => o.id === id))}>
          #{id}
        </a>
      ),
    },
    {
      title: "Sản phẩm",
      key: "product",
      width: 250,
      sorter: (a, b) => {
        const nameA = a.vehicleBrand || a.batteryBrand || "";
        const nameB = b.vehicleBrand || b.batteryBrand || "";
        return nameA.localeCompare(nameB);
      },
      render: (_, record) => (
        <div>
          <div className="font-semibold">
            {record.productType === "VEHICLE" ? "Xe cộ" : "Ắc quy/Pin"}
          </div>
          {record.vehicleBrand && (
            <div className="text-sm text-gray-600">
              {record.vehicleBrand} {record.model}
            </div>
          )}
          {record.batteryBrand && (
            <div className="text-sm text-gray-600">
              {record.batteryBrand} - {record.batteryType}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Tổng tiền",
      key: "total",
      width: 150,
      sorter: (a, b) => a.price + a.shippingFee - (b.price + b.shippingFee),
      render: (_, record) => {
        const total = record.price + record.shippingFee;
        return (
          <span className="font-bold text-green-600">
            {total.toLocaleString("vi-VN")} VNĐ
          </span>
        );
      },
    },
    {
      title: "Ngày đặt",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      defaultSortOrder: "descend",
      render: (date) => (
        <div className="text-sm">
          <ClockCircleOutlined className="mr-2 text-gray-500" />
          {new Date(date).toLocaleString("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 150,
      sorter: (a, b) => {
        const statusOrder = {
          PENDING: 1,
          REJECTED: 2,
          APPROVED: 3,
          DEPOSITED: 4,
          DONE: 5,
          CANCELED: 6,
        };
        return statusOrder[a.status] - statusOrder[b.status];
      },
      filters: [
        { text: "Chờ xác nhận", value: "PENDING" },
        { text: "Đã từ chối", value: "REJECTED" },
        { text: "Đã xác nhận", value: "APPROVED" },
        { text: "Đã đặt cọc", value: "DEPOSITED" },
        { text: "Hoàn thành", value: "DONE" },
        { text: "Đã hủy", value: "CANCELED" },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        const config = getStatusConfig(status);
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Hành động",
      key: "action",
      width: 250,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record.id)}
          >
            Tình trạng giao hàng
          </Button>

          {hasContract(record.id) && (
            <Button
              type="default"
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => navigate(`/contract/${getContractId(record.id)}`)}
            >
              Hợp đồng
            </Button>
          )}

          {record.status === "PENDING" && (
            <Button
              danger
              size="small"
              icon={<CloseCircleOutlined />}
              onClick={() => showCancelModal(record)}
            >
              Hủy
            </Button>
          )}

          {getDeliveryStatus(record.id)?.includes("RECEIVED") && (
            <Button
              danger
              size="small"
              icon={<FileTextOutlined />}
              onClick={() => showComplainModal(record)}
            >
              Khiếu nại
            </Button>
          )}
        </Space>
      ),
    },
  ];

  const showComplainModal = (record) => {
    setSelectedOrder(record);
    setIsComplainModalVisible(true);
    complainForm.resetFields();
    setFileList([]);
  };

  const handleComplainModalClose = () => {
    setIsComplainModalVisible(false);
    setSelectedOrder(null);
    complainForm.resetFields();
    setFileList([]);
  };

  const handleUploadChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
  };

  const beforeUpload = (file) => {
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error("File phải nhỏ hơn 5MB!");
      return Upload.LIST_IGNORE;
    }
    return false;
  };

  const handleSubmitComplain = async () => {
    try {
      const values = await complainForm.validateFields();
      setComplainLoading(true);

      const imageUrls = [];
      for (const file of fileList) {
        if (file.originFileObj) {
          try {
            const url = await uploadFile(file.originFileObj);
            imageUrls.push(url);
          } catch (error) {
            console.error("❌ Error uploading file:", error);
            toast.error(`Không thể upload ảnh ${file.name}`);
          }
        }
      }

      const complainData = {
        orderId: selectedOrder.id,
        complaintType: values.complainType,
        description: values.description,
        complaintImages: imageUrls,
      };

      console.log("📤 Complain data:", complainData);

      const response = await api.post("/buyer/complaints/create", complainData);

      toast.success(
        "Gửi khiếu nại thành công! Chúng tôi sẽ xử lý trong 24-48h."
      );
      setIsComplainModalVisible(false);
      complainForm.resetFields();
      setFileList([]);
    } catch (error) {
      if (error.errorFields) {
        toast.error("Vui lòng điền đầy đủ thông tin!");
      } else {
        console.error("❌ Error:", error);
        toast.error(error.response?.data?.message || "Không thể gửi khiếu nại");
      }
    } finally {
      setComplainLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        className="overflow-x-hidden"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }}
      >
        <Header />
        <div
          className="flex justify-center items-center"
          style={{ minHeight: "80vh" }}
        >
          <Spin size="large" tip="Đang tải đơn hàng..." />
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
      }}
    >
      <Header />

      <div className="max-w-[1400px] mx-auto px-4 py-8">
        <Card
          bordered={false}
          className="shadow-2xl rounded-xl"
          title={
            <div className="flex items-center gap-3">
              <span className="text-2xl">Đơn hàng của tôi</span>
              <Tag color="blue" className="ml-2">
                {orderList.length} đơn hàng
              </Tag>
              <Button
                type="default"
                danger
                onClick={() => navigate("/complain")}
              >
                Complain
              </Button>
            </div>
          }
          extra={
            <Button
              type="default"
              icon={<ShoppingCartOutlined />}
              onClick={() => navigate("/")}
            >
              Tiếp tục mua sắm
            </Button>
          }
        >
          {orderList.length === 0 ? (
            <Empty
              description="Bạn chưa có đơn hàng nào"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate("/")}
              >
                Mua sắm ngay
              </Button>
            </Empty>
          ) : (
            <Table
              columns={columns}
              dataSource={orderList}
              rowKey="id"
              showSorterTooltip={false}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Tổng ${total} đơn hàng`,
              }}
            />
          )}
        </Card>
      </div>

      {/* ✅ Modal chi tiết đơn hàng - CẬP NHẬT */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <ShoppingCartOutlined className="text-blue-600" />
            <span>Chi tiết đơn hàng #{selectedOrder?.id}</span>
          </div>
        }
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="close" onClick={handleModalClose}>
            Đóng
          </Button>,
        ]}
        width={700}
      >
        {selectedOrder && (
          <Descriptions bordered column={2} size="middle">
            <Descriptions.Item label="Mã đơn hàng" span={2}>
              <span className="font-bold text-blue-600">
                #{selectedOrder.id}
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Loại sản phẩm" span={2}>
              <Tag color="blue">
                {selectedOrder.productType === "VEHICLE"
                  ? "Xe cộ"
                  : "Ắc quy/Pin"}
              </Tag>
            </Descriptions.Item>

            {selectedOrder.vehicleBrand && (
              <>
                <Descriptions.Item label="Hãng xe">
                  {selectedOrder.vehicleBrand}
                </Descriptions.Item>
                <Descriptions.Item label="Model">
                  {selectedOrder.model}
                </Descriptions.Item>
              </>
            )}

            {selectedOrder.batteryBrand && (
              <>
                <Descriptions.Item label="Hãng ắc quy">
                  {selectedOrder.batteryBrand}
                </Descriptions.Item>
                <Descriptions.Item label="Loại ắc quy">
                  {selectedOrder.batteryType}
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="Giá sản phẩm">
              <span className="font-semibold text-blue-600">
                {selectedOrder.price?.toLocaleString("vi-VN")} VNĐ
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Phí vận chuyển">
              <span className="font-semibold text-orange-600">
                {selectedOrder.shippingFee?.toLocaleString("vi-VN")} VNĐ
              </span>
            </Descriptions.Item>

            <Descriptions.Item label="Phương thức giao hàng" span={2}>
              <Tag color="blue" icon={<TruckOutlined />}>
                {getDeliveryMethod(selectedOrder.deliveryMethod)}
              </Tag>
            </Descriptions.Item>

            {/* ✅ CẬP NHẬT: Hiển thị hình thức thanh toán dựa vào wantDeposit */}
            <Descriptions.Item label="Hình thức thanh toán" span={2}>
              <Tag
                color={selectedOrder.wantDeposit ? "gold" : "green"}
                icon={<DollarOutlined />}
              >
                {getPaymentTypeDisplay(selectedOrder.wantDeposit)}
              </Tag>
            </Descriptions.Item>

            {/* ✅ Chỉ hiển thị thông tin đặt cọc nếu wantDeposit = true */}
            {selectedOrder.wantDeposit && (
              <>
                <Descriptions.Item label="Phần trăm đặt cọc" span={2}>
                  {(selectedOrder.depositPercentage * 100).toFixed(0)}%
                </Descriptions.Item>
                <Descriptions.Item label="Số tiền đặt cọc" span={2}>
                  <span className="font-semibold text-green-600">
                    {(
                      selectedOrder.price * selectedOrder.depositPercentage
                    ).toLocaleString("vi-VN")}{" "}
                    VNĐ
                  </span>
                </Descriptions.Item>
                <Descriptions.Item label="Trạng thái đặt cọc" span={2}>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    Đã đặt cọc
                  </Tag>
                </Descriptions.Item>
              </>
            )}

            <Descriptions.Item label="Trạng thái đơn hàng" span={2}>
              <Tag color={getStatusConfig(selectedOrder.status).color}>
                {getStatusConfig(selectedOrder.status).text}
              </Tag>
            </Descriptions.Item>

            <Descriptions.Item label="Ngày đặt hàng" span={2}>
              <ClockCircleOutlined className="mr-2" />
              {new Date(selectedOrder.createdAt).toLocaleString("vi-VN", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Descriptions.Item>

            <Descriptions.Item label="Tổng thanh toán" span={2}>
              <div className="text-xl font-bold text-green-600">
                {(
                  selectedOrder.price + selectedOrder.shippingFee
                ).toLocaleString("vi-VN")}{" "}
                VNĐ
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Modal hủy đơn hàng */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <CloseCircleOutlined className="text-red-600" />
            <span>Hủy đơn hàng #{selectedOrder?.id}</span>
          </div>
        }
        open={isCancelModalVisible}
        onCancel={handleCancelModalClose}
        onOk={handleCancelOrder}
        okText="Xác nhận hủy"
        cancelText="Đóng"
        confirmLoading={cancelLoading}
        okButtonProps={{ danger: true }}
        width={500}
      >
        <Form form={cancelForm} layout="vertical">
          <p className="mb-4 text-gray-600">
            Bạn có chắc chắn muốn hủy đơn hàng này? Vui lòng nhập lý do hủy:
          </p>
          <Form.Item
            name="reason"
            label="Lý do hủy đơn"
            rules={[
              { required: true, message: "Vui lòng nhập lý do hủy đơn!" },
              { min: 10, message: "Lý do phải có ít nhất 10 ký tự!" },
              { max: 500, message: "Lý do không được quá 500 ký tự!" },
            ]}
          >
            <TextArea
              rows={4}
              placeholder="Ví dụ: Tôi muốn đổi sản phẩm khác, Đặt nhầm địa chỉ..."
              showCount
              maxLength={500}
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal Khiếu nại đơn hàng */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <FileTextOutlined className="text-orange-600" />
            <span>Khiếu nại đơn hàng #{selectedOrder?.id}</span>
          </div>
        }
        open={isComplainModalVisible}
        onCancel={handleComplainModalClose}
        onOk={handleSubmitComplain}
        okText="Gửi khiếu nại"
        cancelText="Hủy"
        confirmLoading={complainLoading}
        okButtonProps={{ danger: true }}
        width={600}
      >
        <Form form={complainForm} layout="vertical">
          <p className="mb-4 text-gray-600">
            Vui lòng mô tả chi tiết vấn đề bạn gặp phải với đơn hàng này. Chúng
            tôi sẽ xem xét và phản hồi trong vòng 24-48 giờ.
          </p>

          <Form.Item
            name="complainType"
            label="Loại khiếu nại"
            rules={[
              { required: true, message: "Vui lòng chọn loại khiếu nại!" },
            ]}
          >
            <Select placeholder="Chọn loại khiếu nại" size="large">
              <Select.Option value="DAMAGED_PRODUCT">
                Sản phẩm bị hư hỏng
              </Select.Option>
              {/* <Select.Option value="WRONG_ITEM">Sai sản phẩm</Select.Option> */}
              <Select.Option value="NOT_AS_DESCRIBED">
                Không đúng như mô tả
              </Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả chi tiết"
            rules={[
              { required: true, message: "Vui lòng mô tả vấn đề chi tiết!" },
              { min: 20, message: "Mô tả phải có ít nhất 20 ký tự!" },
              { max: 1000, message: "Mô tả không được quá 1000 ký tự!" },
            ]}
          >
            <TextArea
              rows={6}
              placeholder="Mô tả chi tiết vấn đề: thời gian phát hiện, tình trạng sản phẩm, những gì bạn mong muốn..."
              showCount
              maxLength={1000}
            />
          </Form.Item>

          <Form.Item label="File minh chứng (tối đa 5 file)">
            <Upload
              listType="picture-card"
              fileList={fileList}
              onChange={handleUploadChange}
              beforeUpload={beforeUpload}
              maxCount={5}
            >
              {fileList.length >= 5 ? null : (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Tải lên</div>
                </div>
              )}
            </Upload>
            <p className="text-xs text-gray-500 mt-2">Tối đa 5MB/file</p>
          </Form.Item>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mt-4">
            <p className="text-sm text-yellow-800">
              <strong>Lưu ý:</strong> Khiếu nại sẽ được gửi đến bộ phận hỗ trợ.
              File minh chứng sẽ giúp chúng tôi xử lý nhanh hơn.
            </p>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Orders;
