import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form, Popconfirm } from "antd";
import { toast } from "react-toastify";
import api from "../../config/axios";

const CrudTemp = ({
  columns,
  formItems,
  path,
  actions,
  modalTitle = "Chi tiết",
}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalFooter, setModalFooter] = useState(null);
  const [form] = Form.useForm();

  // 🧠 Hàm lấy dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(path);
      setData(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tải dữ liệu");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (path) fetchData();
  }, [path]);

  // 🧩 Định nghĩa cột hành động
  const tableColumns = [
    ...columns,
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {actions?.map((action, idx) => {
            // Nếu có điều kiện hiển thị, check trước
            if (action.showIf && !action.showIf(record)) return null;

            const button = (
              <Button
                key={`${action.label}-${record.id}-${idx}`}
                className={
                  typeof action.className === "function"
                    ? action.className(record)
                    : action.className
                }
                danger={action.danger}
                type={action.type || "default"}
                onClick={() => {
                  if (typeof action.onClick === "function") {
                    action.onClick(
                      record,
                      form,
                      setShowModal,
                      fetchData,
                      setModalFooter
                    );
                  } else {
                    console.warn(
                      `⚠️ Action "${action.label}" không có hàm onClick`
                    );
                  }
                }}
              >
                {typeof action.label === "function"
                  ? action.label(record)
                  : action.label}
              </Button>
            );

            // ✅ Nếu có xác nhận (confirm), bọc Popconfirm
            if (action.confirm) {
              return (
                <Popconfirm
                  key={`${action.label}-${record.id}-confirm`}
                  title={
                    typeof action.confirm.title === "function"
                      ? action.confirm.title(record)
                      : action.confirm.title || "Xác nhận"
                  }
                  description={
                    typeof action.confirm.description === "function"
                      ? action.confirm.description(record)
                      : action.confirm.description
                  }
                  okText={action.confirm.okText || "OK"}
                  cancelText={action.confirm.cancelText || "Hủy"}
                  okType={action.confirm.okType || "primary"}
                  onConfirm={() => {
                    if (typeof action.onClick === "function") {
                      action.onClick(
                        record,
                        form,
                        setShowModal,
                        fetchData,
                        setModalFooter
                      );
                    }
                  }}
                >
                  {button}
                </Popconfirm>
              );
            }

            // Không có confirm -> trả về nút bình thường
            return button;
          })}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div
        style={{
          maxWidth: "90%",
          margin: "0 auto",
          background: "#fff",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        }}
      >
        <Table
          columns={tableColumns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 5 }}
        />

        {/* Modal hiển thị form chi tiết / sửa nhanh */}
        <Modal
          open={showModal}
          onCancel={() => setShowModal(false)}
          title={modalTitle}
          footer={modalFooter}
        >
          <Form
            form={form}
            layout="vertical"
            className="space-y-3 text-base font-medium"
          >
            {formItems}
          </Form>
        </Modal>
      </div>
    </div>
  );
};

export default CrudTemp;
