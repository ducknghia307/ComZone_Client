import React from "react";
import Exchange from "../components/exchange/Exchange";
import { Tabs } from "antd";
import CurrentUserComicExchange from "../components/exchange/CurrentUserComicExchange";
import { useNavigate } from "react-router-dom";

export default function ExchangeManagement() {
  const navigate = useNavigate();
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
          if (key === "1") navigate("/exchange/list/all");
          else if (key === "2") navigate("/exchange/comics-collection");
        }}
      />
    </div>
  );
}
