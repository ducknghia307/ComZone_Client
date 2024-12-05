import { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import EmptyNotification from "../../assets/announcement-icons/no-notification.jpg";
import OrderIcon from "../../assets/announcement-icons/orderIcon.png";
import AuctionIcon from "../../assets/announcement-icons/auction-icon.png";
import NewExchangeRequestIcon from "../../assets/announcement-icons/exchange-icon.png";
import ApproveExchangeIcon from "../../assets/announcement-icons/approve-icon.png";
import RejectExchangeIcon from "../../assets/announcement-icons/reject-icon.png";
import NewDealExchangeIcon from "../../assets/announcement-icons/deal-icon.png";
import ExchangeWalletPayIcon from "../../assets/announcement-icons/wallet-icon.png";
import ExchangeDeliveryIcon from "../../assets/announcement-icons/truck-icon.png";
import DeliveryReturnIcon from "../../assets/announcement-icons/delivery-return-icon.png";
import PackageIcon from "../../assets/announcement-icons/package-icon.png";
import DefaultIcon from "../../assets/announcement-icons/notification-icon-462x512-tqwyit2p.png";
import { useNavigate } from "react-router-dom";
import { Badge } from "antd";
import { useAppDispatch } from "../../redux/hooks";
import { setUnreadAnnounce } from "../../redux/features/notification/announcementSlice";
import { AnnouncementType } from "../../common/enums/announcementType.enum";
import "../ui/Notification.css";

const NotificationDropdown = ({ announcements: initialAnnouncements }) => {
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  console.log("2", announcements);
  const [activeTab, setActiveTab] = useState("USER");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [role, setRole] = useState(false);
  const [unreadUser, setUnreadUser] = useState(0);
  const [unreadSeller, setUnreadSeller] = useState(0);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();
  useEffect(() => {
    setAnnouncements(initialAnnouncements);
  }, [initialAnnouncements]);

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
  }, [announcements, activeTab, dispatch]);
  const navigateToAll = () => {
    navigate("/accountmanagement/announcement/orders");
  };
  const navigateTo = async (item) => {
    if (item.type === "ORDER" && item.order)
      navigate("/sellermanagement/order");

    if (item.exchange)
      navigate(`/exchange/detail/${item.exchange.id || item.exchange}`);
    console.log(item);

    try {
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

  const getAnnouncementIcon = (item: any, type: AnnouncementType) => {
    switch (type) {
      case AnnouncementType.ORDER:
        return OrderIcon;
      case AnnouncementType.AUCTION:
        return item.auction?.comics?.coverImage || AuctionIcon;
      case AnnouncementType.EXCHANGE_NEW_REQUEST:
        return NewExchangeRequestIcon;
      case AnnouncementType.EXCHANGE_APPROVED:
      case AnnouncementType.EXCHANGE_SUCCESSFUL:
      case AnnouncementType.DELIVERY_FINISHED_SEND:
      case AnnouncementType.DELIVERY_FINISHED_RECEIVE:
        return ApproveExchangeIcon;
      case AnnouncementType.EXCHANGE_REJECTED:
      case AnnouncementType.EXCHANGE_FAILED:
      case AnnouncementType.DELIVERY_FAILED_RECEIVE:
      case AnnouncementType.DELIVERY_FAILED_SEND:
        return RejectExchangeIcon;
      case AnnouncementType.EXCHANGE_NEW_DEAL:
        return NewDealExchangeIcon;
      case AnnouncementType.EXCHANGE_PAY_AVAILABLE:
        return ExchangeWalletPayIcon;
      case AnnouncementType.DELIVERY_PICKING:
        return PackageIcon;
      case AnnouncementType.EXCHANGE_DELIVERY:
      case AnnouncementType.DELIVERY_ONGOING:
        return ExchangeDeliveryIcon;
      case AnnouncementType.DELIVERY_RETURN:
        return DeliveryReturnIcon;
      default:
        return DefaultIcon;
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
                className={`relative my-2 p-4 rounded-lg transition duration-200 flex items-start gap-2 ${
                  item.isRead
                    ? "bg-white border-gray-300"
                    : "border-black hover:bg-gray-100"
                } hover:shadow-lg border cursor-pointer`}
                onClick={() => navigateTo(item)}
              >
                {!item.isRead && (
                  <span className="w-3 h-3 bg-red-600 absolute top-0 right-0 rounded-full -translate-y-1/2" />
                )}
                <div className="shrink-0 space-x-2">
                  <img
                    src={getAnnouncementIcon(item, item.type)}
                    alt="Thông báo"
                    className="w-16 h-12 rounded-md object-contain"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <h5
                    className={`${
                      item.isRead ? "font-semibold" : "font-bold"
                    } text-gray-700 uppercase`}
                  >
                    {item.title}
                  </h5>
                  <p
                    className={`${
                      item.isRead ? "font-light" : "font-medium"
                    } text-sm text-gray-600`}
                  >
                    {item.message}
                  </p>
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
        <button
          className="text-blue-500 text-sm font-semibold hover:underline"
          onClick={navigateToAll}
        >
          Xem tất cả
        </button>
      </div>
    </div>
  );
};

export default NotificationDropdown;
