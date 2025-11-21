// File: src/components/Upload/MultiImageUpload.jsx

import React from "react";
import { Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
// Giả định getBase64 nằm trong file utility riêng,


// Helper để tạo Base64 Data URL (cần cho preview ảnh mới)
const getBase64 = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file.originFileObj);
    reader.onload = () => resolve(reader.result);
  });

export default function ImageUpload({
  fileList,
  setFileList,
  maxCount = 10,
}) {
  const handlePreview = async (file) => {
    if (!file.url && !file.preview && file.originFileObj) {
      // Nếu là file mới, tạo Data URL và gán vào file.preview
      file.preview = await getBase64(file);
    }
    // Ant Design Upload sẽ tự mở Gallery khi file.url hoặc file.preview được gán.
  };

  return (
    <div className="space-y-2">
      <label className="block text-gray-700 dark:text-gray-300">
        Hình ảnh sản phẩm
      </label>
      <Upload
        listType="picture-card"
        fileList={fileList}
        multiple
        accept="image/*"
        beforeUpload={() => false}
        onRemove={(file) => {
          const updatedList = fileList.filter((f) => f.uid !== file.uid);
          setFileList(updatedList);
        }}
        onChange={({ fileList: newFileList }) => {
          setFileList(newFileList);
        }}
        onPreview={handlePreview}
      >
        {fileList.length < maxCount && (
          <div>
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Tải ảnh lên</div>
          </div>
        )}
      </Upload>
      <p className="text-xs text-gray-500 dark:text-gray-500">
        Tối đa {maxCount} ảnh (Bấm vào **+** để chọn, bấm vào ảnh để xem lớn)
      </p>
    </div>
  );
}
