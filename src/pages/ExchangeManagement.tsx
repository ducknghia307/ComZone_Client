import React from "react";
import Exchange from "../components/exchange/Exchange";
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
      <Tabs
        defaultActiveKey={
          window.location.pathname.includes("/exchange/comics-collection")
            ? "2"
            : "1"
        }
        centered
        items={tabItems}
        onChange={(key) => {
          if (key === "1")
            window.history.pushState(null, "", "/exchange/list/all");
          else if (key === "2")
            window.history.pushState(null, "", "/exchange/comics-collection");
        }}
      />
    </div>
  );
}
