import React from 'react';
import { Button, Space } from 'antd';
import { PrinterOutlined } from '@ant-design/icons';

const ContractDocument = ({ contract }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="flex justify-end gap-3 mb-4">
        <Space>
          <Button 
            type="primary" 
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            In hợp đồng
          </Button>
        </Space>
      </div>

      {/* A4 Paper Container */}
      <div className="bg-white rounded-lg shadow-2xl overflow-hidden print:shadow-none">
        {/* A4 Size: 210mm x 297mm */}
        <div 
          className="mx-auto bg-white"
          style={{
            width: '210mm',
            height: '297mm',
            padding: '20mm',
            boxSizing: 'border-box',
            fontFamily: 'Times New Roman, serif',
            lineHeight: '1.6',
            color: '#000',
          }}
        >
          {/* === PHẦN TIÊU ĐỀ === */}
          {/* Dòng 1: Cộng Hòa Xã Hội Chủ Nghĩa Việt Nam */}
          <div className="text-center mb-1">
            <div style={{ fontSize: '13pt', fontWeight: 'bold' }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
            </div>
          </div>

          {/* Dòng 2: Độc lập - Tự do - Hạnh phúc */}
          <div className="text-center mb-3">
            <div style={{ fontSize: '12pt', fontWeight: 'bold' }}>
              Độc lập – Tự do – Hạnh phúc
            </div>
          </div>

          {/* Đường gạch ngang */}
          <div className="border-t-2 border-black mb-6"></div>

          {/* === MÃ HỢP ĐỒNG + NGÀY THÁNG (2 cột) === */}
          <div className="grid grid-cols-2 gap-8 mb-6">
            <div>
              <div style={{ fontSize: '11pt' }}>
                <span style={{ fontWeight: 'bold' }}>Mã hợp đồng:</span> {contract?.contractCode}
              </div>
            </div>
            <div className="text-right">
              <div style={{ fontSize: '11pt' }}>
                Ngày {new Date(contract?.createdAt).getDate()} tháng {new Date(contract?.createdAt).getMonth() + 1} năm {new Date(contract?.createdAt).getFullYear()}
              </div>
            </div>
          </div>

          {/* === TIÊU ĐỀ HỢP ĐỒNG === */}
          <div className="text-center mb-6">
            <div style={{ fontSize: '14pt', fontWeight: 'bold' }}>
              HỢP ĐỒNG MUA BÁN
            </div>
            <div style={{ fontSize: '11pt' }}>
              ({contract?.productType === 'VEHICLE' ? 'Phương tiện giao thông' : 'Pin/Ắc quy điện'})
            </div>
          </div>

          {/* === THÂN HỢP ĐỒNG === */}
          
          {/* 1. Các bên tham gia */}
          <div className="mb-4" style={{ fontSize: '11pt' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8pt' }}>I. CÁC BÊN THAM GIA HỢP ĐỒNG:</div>
            
            <div className="ml-4 mb-4">
              <div style={{ fontWeight: 'bold' }}>1. Bên mua (Người mua):</div>
              <div className="ml-4">
                <div>Tên: <span style={{ fontWeight: 'bold' }}>{contract?.buyerName}</span></div>
                <div>Địa chỉ: {contract?.buyerAddress}</div>
                <div>Số điện thoại: {contract?.buyerPhone}</div>
              </div>
            </div>

            <div className="ml-4">
              <div style={{ fontWeight: 'bold' }}>2. Bên bán (Người bán):</div>
              <div className="ml-4">
                <div>Tên: <span style={{ fontWeight: 'bold' }}>{contract?.sellerName}</span></div>
                <div>Địa chỉ: {contract?.sellerAddress}</div>
                <div>Số điện thoại: {contract?.sellerPhone}</div>
              </div>
            </div>
          </div>

          {/* 2. Thông tin sản phẩm */}
          <div className="mb-4" style={{ fontSize: '11pt' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8pt' }}>II. THÔNG TIN SẢN PHẨM:</div>
            
            <div className="ml-4">
              <div>Loại sản phẩm: <span style={{ fontWeight: 'bold' }}>
                {contract?.productType === 'VEHICLE' ? 'Phương tiện giao thông' : 'Pin/Ắc quy điện'}
              </span></div>

              {contract?.productType === 'VEHICLE' ? (
                <>
                  <div>Hãng xe: <span style={{ fontWeight: 'bold' }}>{contract?.vehicleBrand}</span></div>
                  <div>Model: <span style={{ fontWeight: 'bold' }}>{contract?.model}</span></div>
                  <div>Năm sản xuất: <span style={{ fontWeight: 'bold' }}>{contract?.yearOfManufacture}</span></div>
                  <div>Màu sắc: <span style={{ fontWeight: 'bold' }}>{contract?.color}</span></div>
                  <div>Số Km đã đi: <span style={{ fontWeight: 'bold' }}>{contract?.mileage?.toLocaleString('vi-VN')} km</span></div>
                  <div>Trọng lượng: <span style={{ fontWeight: 'bold' }}>{contract?.weight?.toLocaleString('vi-VN')} kg</span></div>
                </>
              ) : (
                <>
                  <div>Loại pin: <span style={{ fontWeight: 'bold' }}>{contract?.batteryType}</span></div>
                  <div>Thương hiệu: <span style={{ fontWeight: 'bold' }}>{contract?.batteryBrand}</span></div>
                  <div>Dung lượng: <span style={{ fontWeight: 'bold' }}>{contract?.capacity} Ah</span></div>
                  <div>Điện áp: <span style={{ fontWeight: 'bold' }}>{contract?.voltage} V</span></div>
                </>
              )}
            </div>
          </div>

          {/* 3. Giá trị hợp đồng */}
          <div className="mb-4" style={{ fontSize: '11pt' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8pt' }}>III. GIÁ TRỊ HỢP ĐỒNG:</div>
            
            <div className="ml-4">
              <div>Giá sản phẩm: <span style={{ fontWeight: 'bold' }}>{contract?.price?.toLocaleString('vi-VN')} VNĐ</span></div>
              <div>Phí vận chuyển: <span style={{ fontWeight: 'bold' }}>{contract?.shippingFee?.toLocaleString('vi-VN')} VNĐ</span></div>
              <div style={{ fontWeight: 'bold', marginTop: '8pt' }}>
                Tổng giá trị: <span style={{ fontSize: '12pt', color: '#d32f2f' }}>
                  {contract?.totalFee?.toLocaleString('vi-VN')} VNĐ
                </span>
              </div>
            </div>
          </div>

          {/* 4. Hình thức thanh toán */}
          <div className="mb-4" style={{ fontSize: '11pt' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8pt' }}>IV. HÌNH THỨC THANH TOÁN:</div>
            
            <div className="ml-4">
              <div>
                {contract?.paymentType === 'FULL' && 'Thanh toán toàn bộ'}
                {contract?.paymentType === 'DEPOSIT' && `Thanh toán đặt cọc (${contract?.depositPercentage}%)`}
                {contract?.paymentType === 'COD' && 'Thanh toán khi nhận hàng'}
              </div>
            </div>
          </div>

          {/* 5. Phương thức giao hàng */}
          <div className="mb-6" style={{ fontSize: '11pt' }}>
            <div style={{ fontWeight: 'bold', marginBottom: '8pt' }}>V. PHƯƠNG THỨC GIAO HÀNG:</div>
            
            <div className="ml-4">
              <div>
                {contract?.deliveryMethod === 'GHN' && 'Giao hàng nhanh (GHN)'}
                {contract?.deliveryMethod === 'SELLER_DELIVERY' && 'Người bán trực tiếp giao'}
                {contract?.deliveryMethod === 'BUYER_PICKUP' && 'Người mua tự đến lấy'}
              </div>
            </div>
          </div>

          {/* === KÝ DUYỆT === */}
          <div className="grid grid-cols-2 gap-12 mt-12">
            {/* Bên mua */}
            <div className="text-center">
              <div style={{ fontSize: '11pt', marginBottom: '30pt' }}>
                <span style={{ fontWeight: 'bold' }}>Người mua</span>
                <br />
                (Ký và ghi rõ họ tên)
              </div>
              {contract?.buyerSigned ? (
                <div>
                  <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>✓ Đã ký</div>
                  <div style={{ fontSize: '10pt' }}>
                    {contract?.buyerSignedAt && new Date(contract.buyerSignedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ) : (
                <div style={{ height: '40pt', borderBottom: '1px solid #000' }}></div>
              )}
            </div>

            {/* Bên bán */}
            <div className="text-center">
              <div style={{ fontSize: '11pt', marginBottom: '30pt' }}>
                <span style={{ fontWeight: 'bold' }}>Người bán</span>
                <br />
                (Ký và ghi rõ họ tên)
              </div>
              {contract?.sellerSigned ? (
                <div>
                  <div style={{ fontSize: '11pt', fontWeight: 'bold' }}>✓ Đã ký</div>
                  <div style={{ fontSize: '10pt' }}>
                    {contract?.sellerSignedAt && new Date(contract.sellerSignedAt).toLocaleString('vi-VN')}
                  </div>
                </div>
              ) : (
                <div style={{ height: '40pt', borderBottom: '1px solid #000' }}></div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* CSS for Print */}
      <style>{`
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
          
          .bg-white {
            background: white !important;
          }

          button {
            display: none;
          }

          @page {
            size: A4;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
};

export default ContractDocument;
