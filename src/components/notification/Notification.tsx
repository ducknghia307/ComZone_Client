/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import EmptyNotification from "../../assets/announcement-icons/no-notification.jpg";
import OrderIcon from "../../assets/announcement-icons/orderIcon.png";
import NewExchangeRequestIcon from "../../assets/announcement-icons/exchange-icon.png";
import ApproveExchangeIcon from "../../assets/announcement-icons/approve-icon.png";
import RejectExchangeIcon from "../../assets/announcement-icons/reject-icon.png";
import NewDealExchangeIcon from "../../assets/announcement-icons/deal-icon.png";
import EmptyNotification from "../../assets/announcement-icons/no-notification.jpg";
import OrderIcon from "../../assets/announcement-icons/orderIcon.png";
import NewExchangeRequestIcon from "../../assets/announcement-icons/exchange-icon.png";
import ApproveExchangeIcon from "../../assets/announcement-icons/approve-icon.png";
import RejectExchangeIcon from "../../assets/announcement-icons/reject-icon.png";
import NewDealExchangeIcon from "../../assets/announcement-icons/deal-icon.png";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setUnreadAnnounce } from "../../redux/features/notification/announcementSlice";
import { AnnouncementType } from "../../common/enums/announcementType.enum";
import "../ui/Notification.css"

const NotificationDropdown = ({ announcements: initialAnnouncements }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [activeTab, setActiveTab] = useState("USER");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [role, setRole] = useState(false);
  const [unreadUser, setUnreadUser] = useState(0);
  const [unreadSeller, setUnreadSeller] = useState(0);
  const dispatch = useAppDispatch();
  const unreadAnnounce = useAppSelector(
    (state) => state.annoucement.unReadAnnounce
  );

  const navigate = useNavigate();

  useEffect(() => {
    const hasSellerAnnouncements = announcements.some(
      (item) => item.recipientType === "SELLER"
    );
    setRole(hasSellerAnnouncements);

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

    dispatch(setUnreadAnnounce(unreadUserCount + unreadSellerCount));
    setUnreadUser(unreadUserCount);
    setUnreadSeller(unreadSellerCount);
  }, [announcements, activeTab]);

  const navigateTo = async (item) => {
    if (item.type === "ORDER") navigate("/sellermanagement/order");
    if (item.type === "EXCHANGE" && item.exchange)
      navigate(`/exchange/detail/${item.exchange.id}`);
    else console.log(item);
    if (item.type === "EXCHANGE" && item.exchange)
      navigate(`/exchange/detail/${item.exchange.id}`);
    else console.log(item);
    try {
      if (item.isRead === true) return;

      if (item.isRead === true) return;

      await privateAxios.post(`/announcements/${item?.id}/read`);
      console.log("Announcement marked as read.");

      // Update the announcements state
      const updatedAnnouncements = announcements.map((announcement) =>
        announcement.id === item.id
          ? { ...announcement, isRead: true }
          : announcement
      );

      setAnnouncements(updatedAnnouncements); // Update the local state

      // Update filtered announcements for the active tab
      const filtered = updatedAnnouncements.filter(
        (announcement) => announcement.recipientType === activeTab
      );
      setFilteredAnnouncements(filtered);
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
                className={`my-2 p-4 rounded-lg transition duration-200 flex items-start gap-2 ${
                className={`my-2 p-4 rounded-lg transition duration-200 flex items-start gap-2 ${
                  item.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-zinc-200 hover:bg-gray-200"
                } hover:shadow-lg border border-gray-300 cursor-pointer`}
                onClick={() => navigateTo(item)}
              >
                {/* ICON */}
                <div className="shrink-0 space-x-2">
                  {item.type === AnnouncementType.AUCTION &&
                    item.auction?.comics?.coverImage && (
                {/* ICON */}
                <div className="shrink-0 space-x-2">
                  {item.type === AnnouncementType.AUCTION &&
                    item.auction?.comics?.coverImage && (
                      <img
                        src={item.auction.comics.coverImage}
                        alt="Thông báo"
                        className="w-16 h-12 rounded-md object-contain"
                        className="w-16 h-12 rounded-md object-contain"
                      />
                    )}

                  {item.type === AnnouncementType.ORDER && (
                    )}

                  {item.type === AnnouncementType.ORDER && (
                    <img
                      src={OrderIcon}
                      alt="Thông báo"
                      className="w-16 h-12 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_NEW_REQUEST && (
                    <img
                      src={NewExchangeRequestIcon}
                      alt="Thông báo"
                      className="w-16 h-12 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_APPROVED && (
                    <img
                      src={ApproveExchangeIcon}
                      alt="Thông báo"
                      className="w-12 h-8 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_REJECTED && (
                    <img
                      src={RejectExchangeIcon}
                      alt="Thông báo"
                      className="w-12 h-8 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_NEW_DEAL && (
                    <img
                      src={NewDealExchangeIcon}
                      alt="Thông báo"
                      className="w-12 h-8 rounded-md object-contain"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h5 className="font-semibold text-gray-700 uppercase">
                    {item.title}
                  </h5>
                      className="w-16 h-12 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_NEW_REQUEST && (
                    <img
                      src={NewExchangeRequestIcon}
                      alt="Thông báo"
                      className="w-16 h-12 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_APPROVED && (
                    <img
                      src={ApproveExchangeIcon}
                      alt="Thông báo"
                      className="w-12 h-8 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_REJECTED && (
                    <img
                      src={RejectExchangeIcon}
                      alt="Thông báo"
                      className="w-12 h-8 rounded-md object-contain"
                    />
                  )}

                  {item.type === AnnouncementType.EXCHANGE_NEW_DEAL && (
                    <img
                      src={NewDealExchangeIcon}
                      alt="Thông báo"
                      className="w-12 h-8 rounded-md object-contain"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <h5 className="font-semibold text-gray-700 uppercase">
                    {item.title}
                  </h5>
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
