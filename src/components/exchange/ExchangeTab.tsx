import React from "react";
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
      className={`flex duration-200 items-center justify-between px-4 py-2 rounded-lg text-sm cursor-pointer
      ${
        isActive
          ? "bg-sky-700 text-white"
          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      }`}
    >
      <span>{label}</span>
    </Link>
  );
};

const ExchangeTab: React.FC = () => {
  const tabs = [
    { label: "Tất cả", path: "/exchange/list/all" },
    { label: "Yêu cầu nhận được", path: "/exchange/list/pending-request" },
    { label: "Yêu cầu đã gửi đi", path: "/exchange/list/sent-request" },
    { label: "Đang trao đổi", path: "/exchange/list/in-progress" },
    { label: "Đang vận chuyển", path: "/exchange/list/in-delivery" },
    { label: "Đã giao hàng", path: "/exchange/list/finished-delivery" },
    { label: "Thành công", path: "/exchange/list/successful" },
    { label: "Thất bại", path: "/exchange/list/failed" },
    { label: "Bị từ chối", path: "/exchange/list/rejected" },
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
