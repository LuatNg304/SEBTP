import React, { useEffect, useState } from "react";
import { Card, Table, Typography, Tag, Spin, Alert, Carousel } from "antd";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";
import api from "../../config/axios";
import { toast } from "react-toastify";

const { Title, Text } = Typography;

const Compare = ({ postId1, postId2, onClose }) => {
  const [compareData, setCompareData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompareData = async () => {
      try {
        setLoading(true);
        const response = await api.get(
          `/buyer/posts/compare?postId1=${postId1}&postId2=${postId2}`
        );
        setCompareData(response.data.data);
        console.log("✅ So sánh thành công:", response.data);
      } catch (error) {
        console.log("❌ Lỗi so sánh:", error);
        toast.error(
          error.response?.data?.message || "Không thể so sánh sản phẩm"
        );
      } finally {
        setLoading(false);
      }
    };

    if (postId1 && postId2) {
      fetchCompareData();
    }
  }, [postId1, postId2]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Spin size="large" tip="Đang tải dữ liệu so sánh..." />
      </div>
    );
  }

  if (!compareData) {
    return (
      <Alert
        message="Không thể tải dữ liệu so sánh"
        type="error"
        showIcon
        className="m-4"
      />
    );
  }

  const { post1, post2, comparisonResult } = compareData;

  // Format giá
  const formatPrice = (price) => {
    return price ? `${price.toLocaleString("vi-VN")} VNĐ` : "Liên hệ";
  };

  // Render tag trusted
  const renderTrustedTag = (trusted) => {
    return trusted ? (
      <Tag color="green" icon={<CheckCircleOutlined />}>
        Đã kiểm duyệt
      </Tag>
    ) : (
      <Tag color="default" icon={<CloseCircleOutlined />}>
        Chưa kiểm duyệt
      </Tag>
    );
  };

  // Tạo dữ liệu cho bảng so sánh
  const getComparisonRows = () => {
    const rows = [
      {
        key: "title",
        label: "Tên sản phẩm",
        post1: post1.title,
        post2: post2.title,
      },
      {
        key: "price",
        label: "Giá bán",
        post1: formatPrice(post1.price),
        post2: formatPrice(post2.price),
      },
      {
        key: "trusted",
        label: "Trạng thái",
        post1: renderTrustedTag(post1.trusted),
        post2: renderTrustedTag(post2.trusted),
      },
      {
        key: "productType",
        label: "Loại sản phẩm",
        post1: post1.productType === "VEHICLE" ? "Xe cộ" : "Ắc quy/Pin",
        post2: post2.productType === "VEHICLE" ? "Xe cộ" : "Ắc quy/Pin",
      },
    ];

    // Thêm thông số xe cộ
    if (post1.productType === "VEHICLE" || post2.productType === "VEHICLE") {
      rows.push(
        {
          key: "vehicleBrand",
          label: "Thương hiệu xe",
          post1: post1.vehicleBrand || "N/A",
          post2: post2.vehicleBrand || "N/A",
        },
        {
          key: "model",
          label: "Model",
          post1: post1.model || "N/A",
          post2: post2.model || "N/A",
        },
        {
          key: "yearOfManufacture",
          label: "Năm sản xuất",
          post1: post1.yearOfManufacture || "N/A",
          post2: post2.yearOfManufacture || "N/A",
        },
        {
          key: "color",
          label: "Màu sắc",
          post1: post1.color ? post1.color : "N/A",
          post2: post2.color ? post2.color : "N/A",
        },
        {
          key: "mileage",
          label: "Số Km đã đi",
          post1: post1.mileage
            ? `${post1.mileage.toLocaleString("vi-VN")} km`
            : "N/A",
          post2: post2.mileage
            ? `${post2.mileage.toLocaleString("vi-VN")} km`
            : "N/A",
        }
      );
    }

    // Thêm thông số pin/ắc quy
    if (post1.productType !== "VEHICLE" || post2.productType !== "VEHICLE") {
      rows.push(
        {
          key: "batteryType",
          label: "Loại pin",
          post1: post1.batteryType || "N/A",
          post2: post2.batteryType || "N/A",
        },
        {
          key: "batteryBrand",
          label: "Thương hiệu pin",
          post1: post1.batteryBrand || "N/A",
          post2: post2.batteryBrand || "N/A",
        },
        {
          key: "capacity",
          label: "Dung lượng",
          post1: post1.capacity ? `${post1.capacity} Ah` : "N/A",
          post2: post2.capacity ? `${post2.capacity} Ah` : "N/A",
        },
        {
          key: "voltage",
          label: "Điện áp",
          post1: post1.voltage ? `${post1.voltage} V` : "N/A",
          post2: post2.voltage ? `${post2.voltage} V` : "N/A",
        }
      );
    }

    // Thông tin người bán
    rows.push(
      //   {
      //     key: "seller",
      //     label: "Người bán",
      //     post1: post1.user.storeName || post1.user.fullName,
      //     post2: post2.user.storeName || post2.user.fullName,
      //   },
      {
        key: "phone",
        label: "Số điện thoại",
        post1: post1.user.phone,
        post2: post2.user.phone,
      },
      {
        key: "address",
        label: "Địa chỉ",
        post1: post1.user.address || "N/A",
        post2: post2.user.address || "N/A",
      }
    );

    return rows;
  };

  const columns = [
    {
      title: "Thông số",
      dataIndex: "label",
      key: "label",
      width: "30%",
      className: "font-semibold bg-gray-50",
    },
    {
      title: (
        <div className="text-center">
          <Text strong className="text-blue-600">
            Sản phẩm hiện tại
          </Text>
        </div>
      ),
      dataIndex: "post1",
      key: "post1",
      width: "35%",
      className: "bg-blue-50",
    },
    {
      title: (
        <div className="text-center">
          <Text strong className="text-green-600">
            Sản phẩm so sánh
          </Text>
        </div>
      ),
      dataIndex: "post2",
      key: "post2",
      width: "35%",
      className: "bg-green-50",
    },
  ];

  return (
    <div className="compare-container ">
      {/* Hình ảnh sản phẩm */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Sản phẩm 1 */}
        <Card className="shadow-md border-2 border-blue-200">
          <div className="mb-3 text-center">
            <Text strong className="text-lg text-blue-600">
              Sản phẩm hiện tại
            </Text>
          </div>
          {post1.images && post1.images.length > 0 ? (
            <Carousel arrows autoplay>
              {post1.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={`${post1.title} - ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
              <Text type="secondary">Không có hình ảnh</Text>
            </div>
          )}
        </Card>

        {/* Sản phẩm 2 */}
        <Card className="shadow-md border-2 border-green-200">
          <div className="mb-3 text-center">
            <Text strong className="text-lg text-green-600">
              Sản phẩm so sánh
            </Text>
          </div>
          {post2.images && post2.images.length > 0 ? (
            <Carousel arrows autoplay>
              {post2.images.map((img, index) => (
                <div key={index}>
                  <img
                    src={img}
                    alt={`${post2.title} - ${index + 1}`}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              ))}
            </Carousel>
          ) : (
            <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg">
              <Text type="secondary">Không có hình ảnh</Text>
            </div>
          )}
        </Card>
      </div>

      {/* Bảng so sánh */}
      <Table
        columns={columns}
        dataSource={getComparisonRows()}
        pagination={false}
        bordered
        size="middle"
        className="comparison-table mb-6"
      />

      {/* Kết quả so sánh từ AI */}
      {comparisonResult && (
        <Card
          bordered={true}
          className="mt-6 border-green-300"
          style={{ backgroundColor: "#EBFDE0" }}
        >
          <Title level={5} className="mb-3">
            💡 Phân tích so sánh
          </Title>
          <Text className="whitespace-pre-line text-gray-700 block leading-relaxed">
            {comparisonResult}
          </Text>
        </Card>
      )}
    </div>
  );
};

export default Compare;
