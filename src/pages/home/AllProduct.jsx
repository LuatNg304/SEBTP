import React from "react";
import { Tabs } from "antd";
import ForYou from "./propose/ForYou";
import News from "./propose/News";

const AllProduct = () => {
  const items = [
    {
      label: <span className="font-semibold text-green-700">Đề xuất</span>,
      key: "1",
      children: <ForYou />,
    },
    {
      label: <span className="font-semibold text-green-700">Mới nhất</span>,
      key: "2",
      children: <News />,
    },
  ];

  return (
    <Tabs
      type="card"
      defaultActiveKey="1"
      items={items}
      className="custom-tabs"
    />
  );
};

export default AllProduct;
