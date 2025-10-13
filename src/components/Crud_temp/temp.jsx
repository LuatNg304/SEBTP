import React, { useState, useEffect } from "react";
import { Table, Button, Space, Modal, Form } from "antd";
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

  // Fetch API
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await api.get(path);
      setData(res.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Lỗi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const tableColumns = [
    ...columns,
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          {actions?.map((action) => {
            if (action.showIf && !action.showIf(record)) return null;

            return (
              <Button
                key={action.label + record.id}
                className={
                  typeof action.className === "function"
                    ? action.className(record)
                    : action.className
                }
                onClick={() =>
                  // ✅ Truyền thêm setModalFooter vào đây
                  action.onClick(
                    record,
                    form,
                    setShowModal,
                    fetchData,
                    setModalFooter
                  )
                }
              >
                {typeof action.label === "function"
                  ? action.label(record)
                  : action.label}
              </Button>
            );
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
