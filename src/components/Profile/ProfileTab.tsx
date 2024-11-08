import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface ProfileTabProp {
  currentUrl: string;
}

const ProfileTab: React.FC<ProfileTabProp> = ({ currentUrl }) => {
  const [activeTab, setActiveTab] = useState(0);
  const navigate = useNavigate();
  const tabs = [
    { label: "HOẠT ĐỘNG GẦN ĐÂY", path: "/profile/recentActivities" },
    { label: "TRUYỆN ĐANG BÁN", path: "/profile/comicSelling" },
    { label: "BÀI ĐĂNG TRAO ĐỔI", path: "/profile/postExchange" },
    { label: "TRUYỆN ĐỂ TRAO ĐỔI", path: "/profile/comicExchange" },
    { label: "LỊCH SỬ TRAO ĐỔI", path: "/profile/historyExchange" },
  ];

  useEffect(() => {
    const currentIndex = tabs.findIndex((tab) => tab.path === currentUrl);
    if (currentIndex !== -1) {
      setActiveTab(currentIndex);
    }
  }, [currentUrl, tabs]);

  return (
    <div className="flex">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => {
            setActiveTab(index);
            navigate(tab.path);
          }}
          className={`flex-1 px-4 py-2 text-center duration-200 hover:opacity-70 text-nowrap text-sm ${
            activeTab === index
              ? "border-b-2 border-black"
              : "bg-white text-black"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default ProfileTab;
