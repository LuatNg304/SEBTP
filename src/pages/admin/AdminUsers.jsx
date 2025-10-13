
import { Form, Input, Tag } from "antd";
import CrudTemp from "../../components/Crud_temp/temp";
import api from "../../config/axios";
import { toast } from "react-toastify";



const AdminUsers = () => {
  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên người dùng", dataIndex: "fullname", key: "fullname" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Kích hoạt" : "Vô hiệu hóa"}
        </Tag>
      ),
    },
  ];
  const formItems = [
    <>
      <Form.Item name="id" hidden>
        <Input />
      </Form.Item>
      <Form.Item label="Tên người dùng" name="fullname">
        <Input />
      </Form.Item>
      <Form.Item label="Email" name="email">
        <Input />
      </Form.Item>
      <Form.Item label="Role" name="role">
        <Input />
      </Form.Item>
      <Form.Item label="Status" name="status">
        <Input />
      </Form.Item>
    </>,
  ];
 const userActions = [
   {
     label: "Xem",
     onClick: (record, form, setShowModal) => {
       setShowModal(true);
       form.setFieldsValue(record);
     },
     className: "bg-blue-500 hover:bg-blue-600 text-white",
   },
   {
     label: (record) =>
       record.status === "active" ? "Vô hiệu hóa" : "Kích hoạt",
     onClick: async (record, form, setShowModal, fetchData) => {
       try {
         const newStatus = record.status === "active" ? "unactive" : "active";
         await api.put(`Category/${record.id}`, { status: newStatus });
         fetchData();
         toast.success("Cập nhật trạng thái thành công");
       } catch (err) {
         toast.error(
           err.response?.data?.message || "Lỗi khi cập nhật trạng thái"
         );
       }
     },
     className: (record) =>
       record.status === "active"
         ? "bg-red-500 hover:bg-red-600 text-white"
         : "bg-green-500 hover:bg-green-600 text-white",
   },
 ];




 
  return (
    <CrudTemp
      columns={columns}
      formItems={formItems}
      path="Category"
      actions={userActions}
    />
  );
};

export default AdminUsers;
