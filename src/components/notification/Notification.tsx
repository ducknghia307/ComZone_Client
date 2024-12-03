import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import EmptyNotification from "../../assets/no-notification.jpg";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";

const NotificationDropdown = ({ announcements, setUnreadAnnounce }) => {
  const [activeTab, setActiveTab] = useState("USER");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [role, setRole] = useState(false);
  const [unreadUser, setUnreadUser] = useState(0);
  const [unreadSeller, setUnreadSeller] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const hasSellerAnnouncements = announcements.some(
      (item) => item.recipientType === "SELLER"
    );
    setRole(hasSellerAnnouncements);

    // Filter announcements based on active tab (USER or SELLER)
    const filtered = announcements.filter(
      (item) => item.recipientType === activeTab
    );
    setFilteredAnnouncements(filtered);

    // Calculate unread counts for each tab
    const unreadUserCount = announcements.filter(
      (item) => item.recipientType === "USER" && !item.isRead
    ).length;
    const unreadSellerCount = announcements.filter(
      (item) => item.recipientType === "SELLER" && !item.isRead
    ).length;

    setUnreadAnnounce(unreadUserCount + unreadSellerCount);
    setUnreadUser(unreadUserCount);
    setUnreadSeller(unreadSellerCount);
  }, [announcements, activeTab, setUnreadAnnounce]);

  const navigateTo = async (item) => {
    if (item.type === "ORDER") navigate("/sellermanagement/order");
    try {
      await privateAxios.post(`/announcements/${item?.id}/read`);
      console.log("Announcement marked as read.");
      setFilteredAnnouncements((prev) =>
        prev.map((announcement) =>
          announcement.id === item.id
            ? { ...announcement, isRead: true }
            : announcement
        )
      );
      // Recalculate unread count
      const unreadCount = announcements.filter(
        (announcement) => announcement.id !== item.id && !announcement.isRead
      ).length;
      setUnreadAnnounce(unreadCount);
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  return (
    <div className="relative max-h-96 w-96 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white">
        <div className="mb-2 pb-2 border-b">
          <h4 className="font-bold text-gray-800 text-center">
            Thông Báo Mới Nhận
          </h4>
        </div>

        {/* Tabs */}
        {role && (
          <div className="flex justify-around border-b">
            <button
              className={`w-1/2 py-2 text-center font-bold ${
                activeTab === "USER"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("USER")}
            >
              {/* Apply dot badge for unread notifications */}
              <Badge dot={unreadUser > 0}>Người dùng</Badge>
            </button>
            <button
              className={`w-1/2 py-2 text-center font-bold ${
                activeTab === "SELLER"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("SELLER")}
            >
              {/* Apply dot badge for unread notifications */}
              <Badge dot={unreadSeller > 0}>Người bán</Badge>
            </button>
          </div>
        )}
      </div>

      {/* Notifications */}
      <div className="mb-2">
        {filteredAnnouncements.length > 0 ? (
          filteredAnnouncements.map((item, index) => {
            return (
              <div
                key={index}
                className={`my-2 p-4 rounded-lg transition duration-200 flex ${
                  item.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-zinc-200 hover:bg-gray-200"
                } hover:shadow-lg border border-gray-300 cursor-pointer`}
                onClick={() => navigateTo(item)}
              >
                {item.type === "AUCTION" &&
                  item.auction?.comics?.coverImage && (
                    <div className="flex mt-1 space-x-2 mr-2">
                      <img
                        src={item.auction.comics.coverImage}
                        alt="Thông báo"
                        className="w-16 h-12 rounded-md object-cover"
                        style={{ objectFit: "fill" }}
                      />
                    </div>
                  )}
                <div className="flex-col">
                  <h5 className="font-semibold text-gray-700">{item.title}</h5>
                  <p className="text-sm text-gray-600">{item.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center text-gray-500 p-4">
            <img
              className="h-52 w-full object-contain"
              src={EmptyNotification}
              alt="No Announcements"
            />
            <p>Không có thông báo nào</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t p-1 text-center sticky bottom-0 bg-white z-10">
        <button className="text-blue-500 text-sm font-semibold hover:underline">
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
