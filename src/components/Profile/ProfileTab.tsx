import React, { useState } from "react";

const ProfileTab: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    "HOẠT ĐỘNG GẦN ĐÂY",
    "TRUYỆN ĐANG BÁN",
    "BÀI ĐĂNG TRAO ĐỔI",
    "TRUYỆN ĐỂ TRAO ĐỔI",
    "LỊCH SỬ TRAO ĐỔI",
  ];

  return (
    <div className="flex">
      {tabs.map((tab, index) => (
        <button
          key={index}
          onClick={() => setActiveTab(index)}
          className={`flex-1 px-4 py-2 text-center duration-200 hover:opacity-70 text-nowrap text-sm ${
            activeTab === index
              ? "border-b-2 border-black"
              : "bg-white text-black"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

export default ProfileTab;
