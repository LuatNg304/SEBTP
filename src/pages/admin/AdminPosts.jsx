import { Form, Input, Button, Space } from "antd";
import CrudTemp from "../../components/Crud_temp/temp";
import api from "../../config/axios";
import { toast } from "react-toastify";

const AdminPosts = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tiêu đề", dataIndex: "title", key: "title" },
    { title: "Người đăng", dataIndex: "author", key: "author" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        const s = status?.toLowerCase();
        const colorMap = {
          approved: "bg-green-500",
          pending: "bg-yellow-500",
          rejected: "bg-red-500",
        };
        const textMap = {
          approved: "Đã duyệt",
          pending: "Đang chờ duyệt",
          rejected: "Bị từ chối",
        };
        return (
          <span
            className={`px-3 py-1 text-white rounded font-semibold ${
              colorMap[s] || "bg-gray-400"
            }`}
          >
            {textMap[s] || "Không xác định"}
          </span>
        );
      },
    },
    { title: "Ngày đăng", dataIndex: "date", key: "date" },
  ];

  const formItems = [
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <div className="border rounded-lg p-3 bg-gray-50 space-y-3">
        <Form.Item label="Tiêu đề" name="title">
          <Input readOnly  className="font-semibold bg-white" />
        </Form.Item>
        <Form.Item label="Người đăng" name="author">
          <Input readOnly  className="font-semibold bg-white" />
        </Form.Item>
        <Form.Item label="Nội dung" name="description">
          <Input.TextArea rows={4} readOnly  className="font-medium bg-white" />
        </Form.Item>
        <Form.Item label="Trạng thái" name="status">
          <Input readOnly  className="font-semibold text-blue-600 bg-white" />
        </Form.Item>
      </div>
    </>,
  ];

  const actions = [
    // 👉 Nút xem chi tiết
    {
      label: "Xem chi tiết",
      onClick: (record, form, setShowModal, fetchData, setModalFooter) => {
        setShowModal(true);
        form.setFieldsValue(record);

        const status = record.status?.toLowerCase();

        if (status === "pending") {
          setModalFooter(
            <Space>
              <Button
                className="bg-green-500 hover:bg-green-600 text-white font-semibold"
                onClick={async () => {
                  try {
                    await api.put(`cake/${record.id}`, { status: "approved" });
                    fetchData();
                    toast.success("✅ Bài đăng đã được duyệt");
                    setShowModal(false);
                  } catch {
                    toast.error("Lỗi khi duyệt bài");
                  }
                }}
              >
                Duyệt
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                onClick={async () => {
                  try {
                    await api.put(`cake/${record.id}`, { status: "rejected" });
                    fetchData();
                    toast.success("❌ Bài đăng đã bị từ chối");
                    setShowModal(false);
                  } catch {
                    toast.error("Lỗi khi từ chối bài");
                  }
                }}
              >
                Từ chối
              </Button>
            </Space>
          );
        } else {
          setModalFooter(null);
        }
      },
      className: "bg-blue-500 hover:bg-blue-600 text-white",
    },

    // 👉 Nút DUYỆT (hiện khi status === pending)
    {
      label: "Duyệt",
      showIf: (record) => record.status?.toLowerCase() === "pending",
      onClick: async (record, form, setShowModal, fetchData) => {
        try {
          await api.put(`cake/${record.id}`, { status: "approved" });
          fetchData();
          toast.success("✅ Bài đăng đã được duyệt");
        } catch {
          toast.error("Lỗi khi duyệt bài");
        }
      },
      className: "bg-green-500 hover:bg-green-600 text-white font-semibold",
    },

    // 👉 Nút TỪ CHỐI (hiện khi status === pending)
    {
      label: "Từ chối",
      showIf: (record) => record.status?.toLowerCase() === "pending",
      onClick: async (record, form, setShowModal, fetchData) => {
        try {
          await api.put(`cake/${record.id}`, { status: "rejected" });
          fetchData();
          toast.success("❌ Bài đăng đã bị từ chối");
        } catch {
          toast.error("Lỗi khi từ chối bài");
        }
      },
      className: "bg-red-500 hover:bg-red-600 text-white font-semibold",
    },
  ];

  return (
    <CrudTemp
      columns={columns}
      formItems={formItems}
      path="cake"
      actions={actions}
      modalTitle="Chi tiết bài đăng"
    />
  );
};

export default AdminPosts;
