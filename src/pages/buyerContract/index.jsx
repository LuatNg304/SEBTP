import React, { useState, useEffect } from 'react';
import Header from '../../components/header';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../config/axios';
import { toast } from 'react-toastify';
import {
  Card,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Form,
  Spin,
  Empty,
} from 'antd';
import {
  FileTextOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EditOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
} from '@ant-design/icons';

const BuyerContract = () => {
  const [contract, setContract] = useState(null);
  const [loading, setLoading] = useState(true);
  const [otpModalVisible, setOtpModalVisible] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [otpForm] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  // Fetch contract details
  const fetchContract = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/buyer/contracts/${id}`);
      setContract(response.data.data);
      console.log('✅ Contract:', response.data.data);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(
        error.response?.data?.message || 'Không thể tải thông tin hợp đồng'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContract();
  }, [id]);

  // Gửi OTP
  const handleSendOtp = async () => {
    try {
      setSendingOtp(true);
      await api.patch(`/buyer/contracts/${id}/sign/send-otp`);
      toast.success('Mã OTP đã được gửi đến số điện thoại của bạn!');
      setOtpModalVisible(true);
      otpForm.resetFields();
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error(error.response?.data?.message || 'Không thể gửi mã OTP');
    } finally {
      setSendingOtp(false);
    }
  };

  // Verify OTP và ký hợp đồng
  const handleVerifyOtp = async () => {
    try {
      const values = await otpForm.validateFields();
      setVerifyingOtp(true);

      await api.patch('/buyer/contracts/sign/verify', {
        contractId: parseInt(id),
        otp: values.otp,
      });

      toast.success('Ký hợp đồng thành công!');
      setOtpModalVisible(false);
      otpForm.resetFields();

      // Reload lại thông tin hợp đồng
      await fetchContract();
    } catch (error) {
      if (error.errorFields) {
        toast.error('Vui lòng nhập mã OTP!');
      } else {
        console.error('❌ Error:', error);
        toast.error(
          error.response?.data?.message || 'Mã OTP không hợp lệ hoặc đã hết hạn'
        );
      }
    } finally {
      setVerifyingOtp(false);
    }
  };

  // Hủy hợp đồng
  const handleCancelContract = () => {
    Modal.confirm({
      title: 'Xác nhận hủy hợp đồng',
      content:
        'Bạn có chắc chắn muốn hủy hợp đồng này? Hành động này không thể hoàn tác.',
      okText: 'Xác nhận hủy',
      cancelText: 'Đóng',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          setCancelLoading(true);
          await api.patch(`/buyer/contracts/${id}/cancel`);
          toast.success('Hủy hợp đồng thành công!');

          // Quay lại trang orders
          navigate('/orders');
        } catch (error) {
          console.error('❌ Error:', error);
          toast.error(
            error.response?.data?.message || 'Không thể hủy hợp đồng'
          );
        } finally {
          setCancelLoading(false);
        }
      },
    });
  };

  // In hợp đồng
  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div
        className="overflow-x-hidden"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      >
        <Header />
        <div
          className="flex justify-center items-center"
          style={{ minHeight: '80vh' }}
        >
          <Spin size="large" tip="Đang tải hợp đồng..." />
        </div>
      </div>
    );
  }

  if (!contract) {
    return (
      <div
        className="overflow-x-hidden"
        style={{
          backgroundImage: "url('/background.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat',
          minHeight: '100vh',
        }}
      >
        <Header />
        <div className="max-w-[1200px] mx-auto px-4 py-8">
          <Card>
            <Empty description="Không tìm thấy hợp đồng" />
            <div className="text-center mt-4">
              <Button type="primary" onClick={() => navigate('/orders')}>
                Quay lại đơn hàng
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-hidden"
      style={{
        backgroundImage: "url('/background.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
      }}
    >
      <Header />

      <div className="max-w-[1200px] mx-auto px-4 py-8">
        {/* Nút hành động phía trên */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <Button
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate('/orders')}
            size="large"
          >
            Quay lại đơn hàng
          </Button>

          <Space size="large">
            {/* Chỉ hiện nút ký nếu chưa ký và trạng thái PENDING */}
            {!contract.buyerSigned && contract.status === 'PENDING' && (
              <Button
                type="primary"
                size="large"
                icon={<EditOutlined />}
                loading={sendingOtp}
                onClick={handleSendOtp}
              >
                Ký hợp đồng
              </Button>
            )}

            {/* Chỉ hiện nút hủy nếu trạng thái PENDING */}
            {contract.status === 'PENDING' && (
              <Button
                danger
                size="large"
                icon={<CloseCircleOutlined />}
                loading={cancelLoading}
                onClick={handleCancelContract}
              >
                Hủy hợp đồng
              </Button>
            )}

            <Button
              type="default"
              size="large"
              icon={<PrinterOutlined />}
              onClick={handlePrint}
            >
              In hợp đồng
            </Button>
          </Space>
        </div>

        {/* Tờ giấy A4 - Hợp đồng */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden print:shadow-none">
          <div
            className="mx-auto bg-white"
            style={{
              width: '210mm',
              minHeight: '297mm',
              padding: '20mm',
              boxSizing: 'border-box',
              fontFamily: 'Times New Roman, serif',
              lineHeight: '1.6',
              color: '#000',
            }}
          >
            {/* === PHẦN TIÊU ĐỀ === */}
            <div className="text-center mb-1">
              <div style={{ fontSize: '13pt', fontWeight: 'bold' }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </div>
            </div>

            <div className="text-center mb-3">
              <div style={{ fontSize: '12pt', fontWeight: 'bold' }}>
                Độc lập – Tự do – Hạnh phúc
              </div>
            </div>

            {/* Đường gạch ngang dưới phần tiêu đề */}
            <div className="flex justify-center mb-6">
              <div style={{ width: '80px', borderTop: '3px solid #000' }}></div>
            </div>

            {/* === MÃ HỢP ĐỒNG + NGÀY THÁNG === */}
            <div className="grid grid-cols-2 gap-8 mb-6">
              <div>
                <div style={{ fontSize: '11pt' }}>
                  <span style={{ fontWeight: 'bold' }}>Số hợp đồng:</span>{' '}
                  {contract.contractCode}
                </div>
              </div>
              <div className="text-right">
                <div style={{ fontSize: '11pt', fontStyle: 'italic' }}>
                  Ngày {new Date().getDate()} tháng{' '}
                  {new Date().getMonth() + 1} năm {new Date().getFullYear()}
                </div>
              </div>
            </div>

            {/* === TIÊU ĐỀ HỢP ĐỒNG === */}
            <div className="text-center mb-6">
              <div style={{ fontSize: '16pt', fontWeight: 'bold' }}>
                HỢP ĐỒNG MUA BÁN
              </div>
              <div style={{ fontSize: '12pt', marginTop: '4pt' }}>
                (
                {contract.productType === 'VEHICLE'
                  ? 'Phương tiện giao thông'
                  : 'Pin/Ắc quy điện'}
                )
              </div>
            </div>

            {/* === THÂN HỢP ĐỒNG === */}

            {/* 1. Các bên tham gia */}
            <div className="mb-4" style={{ fontSize: '11pt' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8pt',
                  textTransform: 'uppercase',
                }}
              >
                Điều 1: Các bên tham gia hợp đồng
              </div>

              <div className="mb-3">
                <div style={{ fontWeight: 'bold' }}>Bên A (Người bán):</div>
                <div className="ml-4">
                  <div>
                    - Họ và tên:{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {contract.sellerName}
                    </span>
                  </div>
                  <div>- Địa chỉ: {contract.sellerAddress}</div>
                  <div>- Số điện thoại: {contract.sellerPhone}</div>
                </div>
              </div>

              <div>
                <div style={{ fontWeight: 'bold' }}>Bên B (Người mua):</div>
                <div className="ml-4">
                  <div>
                    - Họ và tên:{' '}
                    <span style={{ fontWeight: 'bold' }}>
                      {contract.buyerName}
                    </span>
                  </div>
                  <div>- Địa chỉ: {contract.buyerAddress}</div>
                  <div>- Số điện thoại: {contract.buyerPhone}</div>
                </div>
              </div>
            </div>

            {/* 2. Đối tượng hợp đồng */}
            <div className="mb-4" style={{ fontSize: '11pt' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8pt',
                  textTransform: 'uppercase',
                }}
              >
                Điều 2: Đối tượng hợp đồng
              </div>

              <div className="ml-4">
                <div>
                  Bên A đồng ý bán và Bên B đồng ý mua sản phẩm với thông tin
                  như sau:
                </div>

                {contract.productType === 'VEHICLE' ? (
                  <div className="mt-2">
                    <div>
                      - Loại sản phẩm:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        Phương tiện giao thông
                      </span>
                    </div>
                    <div>
                      - Hãng xe:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.vehicleBrand}
                      </span>
                    </div>
                    <div>
                      - Model:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.model}
                      </span>
                    </div>
                    <div>
                      - Năm sản xuất:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.yearOfManufacture}
                      </span>
                    </div>
                    <div>
                      - Màu sắc:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.color}
                      </span>
                    </div>
                    <div>
                      - Số Km đã đi:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.mileage?.toLocaleString('vi-VN')} km
                      </span>
                    </div>
                    <div>
                      - Trọng lượng:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.weight?.toLocaleString('vi-VN')} kg
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2">
                    <div>
                      - Loại sản phẩm:{' '}
                      <span style={{ fontWeight: 'bold' }}>Pin/Ắc quy</span>
                    </div>
                    <div>
                      - Loại pin:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.batteryType}
                      </span>
                    </div>
                    <div>
                      - Thương hiệu:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.batteryBrand}
                      </span>
                    </div>
                    <div>
                      - Dung lượng:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.capacity} Ah
                      </span>
                    </div>
                    <div>
                      - Điện áp:{' '}
                      <span style={{ fontWeight: 'bold' }}>
                        {contract.voltage} V
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. Giá trị hợp đồng */}
            <div className="mb-4" style={{ fontSize: '11pt' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8pt',
                  textTransform: 'uppercase',
                }}
              >
                Điều 3: Giá trị hợp đồng
              </div>

              <div className="ml-4">
                <div>
                  - Giá sản phẩm:{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {contract.price?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div>
                  - Phí vận chuyển:{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {contract.shippingFee?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
                <div style={{ marginTop: '8pt', fontSize: '12pt' }}>
                  - <span style={{ fontWeight: 'bold' }}>Tổng giá trị:</span>{' '}
                  <span
                    style={{
                      fontWeight: 'bold',
                      color: '#d32f2f',
                      fontSize: '13pt',
                    }}
                  >
                    {contract.totalFee?.toLocaleString('vi-VN')} VNĐ
                  </span>
                </div>
              </div>
            </div>

            {/* 4. Phương thức thanh toán */}
            <div className="mb-4" style={{ fontSize: '11pt' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8pt',
                  textTransform: 'uppercase',
                }}
              >
                Điều 4: Phương thức thanh toán
              </div>

              <div className="ml-4">
                <div>
                  {contract.paymentType === 'FULL' &&
                    'Bên B thanh toán toàn bộ giá trị hợp đồng cho Bên A.'}
                  {contract.paymentType === 'DEPOSIT' &&
                    `Bên B thanh toán đặt cọc ${contract.depositPercentage}% giá trị hợp đồng, phần còn lại thanh toán khi nhận hàng.`}
                  {contract.paymentType === 'COD' &&
                    'Bên B thanh toán khi nhận hàng (COD).'}
                </div>
              </div>
            </div>

            {/* 5. Giao nhận hàng hóa */}
            <div className="mb-6" style={{ fontSize: '11pt' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8pt',
                  textTransform: 'uppercase',
                }}
              >
                Điều 5: Giao nhận hàng hóa
              </div>

              <div className="ml-4">
                <div>
                  - Phương thức giao hàng:{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {contract.deliveryMethod === 'GHN' &&
                      'Giao hàng nhanh (GHN)'}
                    {contract.deliveryMethod === 'SELLER_DELIVERY' &&
                      'Người bán trực tiếp giao hàng'}
                    {contract.deliveryMethod === 'BUYER_PICKUP' &&
                      'Người mua tự đến lấy hàng'}
                  </span>
                </div>
                <div>
                  - Địa chỉ giao hàng:{' '}
                  <span style={{ fontWeight: 'bold' }}>
                    {contract.buyerAddress}
                  </span>
                </div>
              </div>
            </div>

            {/* 6. Cam kết */}
            <div className="mb-8" style={{ fontSize: '11pt' }}>
              <div
                style={{
                  fontWeight: 'bold',
                  marginBottom: '8pt',
                  textTransform: 'uppercase',
                }}
              >
                Điều 6: Cam kết của các bên
              </div>

              <div className="ml-4">
                <div>
                  - Bên A cam kết sản phẩm đúng như mô tả trong hợp đồng.
                </div>
                <div>
                  - Bên B cam kết thanh toán đầy đủ theo thỏa thuận.
                </div>
                <div>
                  - Hai bên cam kết thực hiện đúng các điều khoản trong hợp
                  đồng.
                </div>
              </div>
            </div>

            {/* === PHẦN KÝ DUYỆT === */}
            <div className="grid grid-cols-2 gap-16 mt-16">
              {/* Bên bán */}
              <div className="text-center">
                <div
                  style={{
                    fontSize: '11pt',
                    fontWeight: 'bold',
                    marginBottom: '6pt',
                  }}
                >
                  ĐẠI DIỆN BÊN A
                </div>
                <div style={{ fontSize: '10pt', marginBottom: '50pt' }}>
                  (Ký và ghi rõ họ tên)
                </div>
                {contract.sellerSigned ? (
                  <div>
                    <div
                      style={{
                        fontSize: '12pt',
                        fontWeight: 'bold',
                        color: '#4caf50',
                      }}
                    >
                      ✓ Đã ký
                    </div>
                    {contract.sellerSignedAt && (
                      <div style={{ fontSize: '9pt', marginTop: '4pt' }}>
                        {new Date(contract.sellerSignedAt).toLocaleString(
                          'vi-VN'
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      height: '50pt',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '150px',
                        borderBottom: '1px solid #000',
                      }}
                    ></div>
                  </div>
                )}
              </div>

              {/* Bên mua */}
              <div className="text-center">
                <div
                  style={{
                    fontSize: '11pt',
                    fontWeight: 'bold',
                    marginBottom: '6pt',
                  }}
                >
                  ĐẠI DIỆN BÊN B
                </div>
                <div style={{ fontSize: '10pt', marginBottom: '50pt' }}>
                  (Ký và ghi rõ họ tên)
                </div>
                {contract.buyerSigned ? (
                  <div>
                    <div
                      style={{
                        fontSize: '12pt',
                        fontWeight: 'bold',
                        color: '#4caf50',
                      }}
                    >
                      ✓ Đã ký
                    </div>
                    {contract.buyerSignedAt && (
                      <div style={{ fontSize: '9pt', marginTop: '4pt' }}>
                        {new Date(contract.buyerSignedAt).toLocaleString(
                          'vi-VN'
                        )}
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    style={{
                      height: '50pt',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    <div
                      style={{
                        width: '150px',
                        borderBottom: '1px solid #000',
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Trạng thái hợp đồng bên dưới */}
        <div className="mt-6 print:hidden">
          <Card>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <FileTextOutlined className="text-3xl text-blue-600" />
                <div>
                  <div className="text-lg font-bold">
                    Trạng thái hợp đồng:{' '}
                    <Tag
                      color={
                        contract.status === 'PENDING'
                          ? 'orange'
                          : contract.status === 'SIGNED'
                          ? 'green'
                          : 'red'
                      }
                    >
                      {contract.status === 'PENDING' && 'Chờ ký'}
                      {contract.status === 'SIGNED' && 'Đã ký'}
                      {contract.status === 'CANCELLED' && 'Đã hủy'}
                    </Tag>
                  </div>
                  <div className="text-sm text-gray-600 mt-1">
                    {!contract.buyerSigned && !contract.sellerSigned && (
                      <span>Chưa có bên nào ký hợp đồng</span>
                    )}
                    {contract.buyerSigned && !contract.sellerSigned && (
                      <span>Bạn đã ký, đang chờ người bán ký</span>
                    )}
                    {!contract.buyerSigned && contract.sellerSigned && (
                      <span>Người bán đã ký, đang chờ bạn ký</span>
                    )}
                    {contract.buyerSigned && contract.sellerSigned && (
                      <span className="text-green-600 font-semibold">
                        ✓ Cả hai bên đã ký hợp đồng
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal nhập OTP */}
      <Modal
        title={
          <div className="flex items-center gap-2">
            <EditOutlined className="text-blue-600" />
            <span>Xác nhận ký hợp đồng</span>
          </div>
        }
        open={otpModalVisible}
        onCancel={() => {
          setOtpModalVisible(false);
          otpForm.resetFields();
        }}
        onOk={handleVerifyOtp}
        okText="Xác nhận"
        cancelText="Đóng"
        confirmLoading={verifyingOtp}
        width={500}
      >
        <Form form={otpForm} layout="vertical">
          <p className="mb-4 text-gray-600">
            Mã OTP đã được gửi đến số điện thoại{' '}
            <strong>{contract.buyerPhone}</strong>. Vui lòng nhập mã OTP để xác
            nhận ký hợp đồng:
          </p>
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[
              { required: true, message: 'Vui lòng nhập mã OTP!' },
              { len: 6, message: 'Mã OTP phải có 6 số!' },
              { pattern: /^\d+$/, message: 'Mã OTP chỉ chứa số!' },
            ]}
          >
            <Input
              size="large"
              placeholder="Nhập 6 số OTP"
              maxLength={6}
              autoFocus
            />
          </Form.Item>
          <p className="text-sm text-gray-500">
            Không nhận được mã?{' '}
            <a
              onClick={handleSendOtp}
              className="text-blue-600 cursor-pointer hover:underline"
            >
              Gửi lại OTP
            </a>
          </p>
        </Form>
      </Modal>

      {/* CSS for Print */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
            background: white !important;
          }

          .print\\:hidden {
            display: none !important;
          }

          .print\\:shadow-none {
            box-shadow: none !important;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default BuyerContract;
