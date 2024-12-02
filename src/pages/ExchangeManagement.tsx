import React from "react";
import Exchange from "./Exchange";
import { Tabs } from "antd";
import CurrentUserComicExchange from "./CurrentUserComicExchange";

export default function ExchangeManagement() {
  const tabItems = [
    {
      key: "1",
      label: `Cuộc trao đổi của bạn`,
      children: <Exchange />,
    },
    {
      key: "2",
      label: `Truyện trao đổi`,
      children: <CurrentUserComicExchange />,
    },
  ];
  return (
    <div className="py-8">
      <Tabs defaultActiveKey="1" centered items={tabItems} />
    </div>
  );
}
