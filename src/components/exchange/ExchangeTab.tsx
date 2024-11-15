import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

interface TabProps {
  label: string;
  path: string;
  isActive: boolean;
}

const Tab: React.FC<TabProps> = ({ label, path, isActive }) => {
  return (
    <Link
      to={`${path}`}
      className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer 
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
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const tabs = [
    { label: "Đang chờ", path: "/exchange/waiting" },
    { label: "Yêu cầu đã gửi", path: "/exchange/request-send" },
    { label: "Đang trao đổi", path: "/exchange/dealing" },
    { label: "Đang chờ giao hàng", path: "/exchange/delivering" },
    { label: "Đã hoàn tất", path: "/exchange/successful" },
    { label: "Đã hủy", path: "/exchange/cancel" },
  ];

  useEffect(() => {
    const handlePathChange = () => {
      setCurrentPath(window.location.pathname);
    };

    window.addEventListener("popstate", handlePathChange);
    return () => {
      window.removeEventListener("popstate", handlePathChange);
    };
  }, []);

  return (
    <div className="flex space-x-4 REM lg:w-2/3 w-full">
      {tabs.map((tab, index) => (
        <Tab
          key={index}
          label={tab.label}
          path={tab.path}
          isActive={currentPath === tab.path}
        />
      ))}
    </div>
  );
};

export default ExchangeTab;
