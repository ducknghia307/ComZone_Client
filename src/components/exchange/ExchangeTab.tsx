import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

interface TabProps {
  label: string;
  path: string;
  isActive: boolean;
}

const Tab: React.FC<TabProps> = ({ label, path, isActive }) => {
  return (
    <Link
      to={`${path}`}
      className={`flex duration-200 items-center justify-between px-4 py-2 rounded-lg cursor-pointer 
      ${
        isActive
          ? "bg-blue-700 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span>{label}</span>
    </Link>
  );
};

const ExchangeTab: React.FC = () => {
  const tabs = [
    { label: "Tất cả", path: "/exchange/all" },
    { label: "Đang chờ", path: "/exchange/pending-request" },
    { label: "Đã gửi", path: "/exchange/sent-request" },
    { label: "Đang trao đổi", path: "/exchange/in-progress" },
    { label: "Đang vận chuyển", path: "/exchange/in-delivery" },
    { label: "Đã giao hàng", path: "/exchange/finished-delivery" },
    { label: "Thành công", path: "/exchange/successful" },
    { label: "Bị hủy", path: "/exchange/canceled" },
  ];

  const location = useLocation();

  return (
    <div className="flex justify-center space-x-4 REM w-full">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          path={tab.path}
          isActive={location.pathname === tab.path}
        />
      ))}
    </div>
  );
};

export default ExchangeTab;
