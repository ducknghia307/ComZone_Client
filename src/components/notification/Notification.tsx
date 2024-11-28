import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import EmptyNotification from "../../assets/no-notification.jpg";

const NotificationDropdown = ({ announcements, setUnreadAnnouce }) => {
  const [activeTab, setActiveTab] = useState("USER");
  const [filteredAnnouncements, setFilteredAnnouncements] = useState([]);
  const [role, setRole] = useState(false);
  const [comicsData, setComicsData] = useState([]);
  console.log(filteredAnnouncements);

  useEffect(() => {
    const hasSellerAnnouncements = announcements.some(
      (item) => item.recipientType === "SELLER"
    );
    setRole(hasSellerAnnouncements);
    setFilteredAnnouncements(
      announcements.filter((item) => item.recipientType === activeTab)
    );

    // Fetch order items for each announcement that has an order
    // announcements.forEach((announcement) => {
    //   if (announcement.order && announcement.order.id) {
    //     fetchOrderItems(announcement.order.id);
    //   }
    // });
  }, [announcements, activeTab]);

  // Mark notifications as read
  const markAsRead = async (id) => {
    try {
      await privateAxios.put(`/announcements/${id}/read`);
      setFilteredAnnouncements((prev) =>
        prev.map((item) => (item.id === id ? { ...item, isRead: true } : item))
      );
      setUnreadAnnouce((prev) => Math.max(0, prev - 1));
    } catch (error) {
      console.error("Failed to mark as read:", error);
    }
  };

  // const fetchOrderItems = async (orderId) => {
  //   try {
  //     const response = await privateAxios.get(`/order-items/order/${orderId}`);
  //     if (Array.isArray(response.data)) {
  //       response.data.forEach((item) => {
  //         if (item.comics && typeof item.comics === "object") {
  //           setComicsData((prevData) => {
  //             // Prevent adding duplicates based on the comic title
  //             if (
  //               !prevData.some((comic) => comic.title === item.comics.title)
  //             ) {
  //               return [...prevData, item.comics];
  //             }
  //             return prevData;
  //           });
  //         }
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Failed to fetch order items:", error);
  //   }
  // };

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
              Người dùng
            </button>
            <button
              className={`w-1/2 py-2 text-center font-bold ${
                activeTab === "SELLER"
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-600"
              }`}
              onClick={() => setActiveTab("SELLER")}
            >
              Người bán
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
                className={`mb-2 p-4 rounded-lg transition duration-200 flex ${
                  item.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-zinc-200 hover:bg-gray-200"
                } hover:shadow-lg border border-gray-300 cursor-pointer`}
                onClick={() => markAsRead(item.id)}
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
                {item.type === "ORDER" &&
                  item.orderItems[0].comics.coverImage && (
                    <div className="flex mt-1 space-x-2 mr-2">
                      <img
                        src={item.orderItems[0].comics.coverImage}
                        alt="Thông báo"
                        className="w-16 h-12 rounded-md object-cover"
                        style={{ objectFit: "fill" }}
                      />
                    </div>
                  )}

                {/* Display the associated comic image only once per announcement */}
                {/* {associatedComic && (
                  <div key={associatedComic.title} className="comic-item">
                    <img
                      src={associatedComic.coverImage}
                      alt={associatedComic.title}
                      className="comic-cover"
                    />
                    <h5>{associatedComic.title}</h5>
                  </div>
                )} */}

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
