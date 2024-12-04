import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import { privateAxios } from "../middleware/axiosInstance";
import Loading from "../components/loading/Loading";
import { convertToVietnameseDate } from "../utils/convertDateVietnamese";
import { useNavigate } from "react-router-dom";
import OrderIcon from "../assets/announcement-icons/orderIcon.png";

const AnnouncementOrder = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnounce, setUnreadAnnounce] = useState(0);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Function to mark an announcement as read
  const markAsRead = async (announcementId: string, isRead) => {
    try {
      console.log(isRead);

      navigate("/sellermanagement/order");

      if (isRead === false) {
        await privateAxios.post(`/announcements/${announcementId}/read`);
        setAnnouncements((prevAnnouncements) =>
          prevAnnouncements.map((announcement) =>
            announcement.id === announcementId
              ? { ...announcement, isRead: true }
              : announcement
          )
        );

        setUnreadAnnounce((prevUnread) => prevUnread - 1);
      }
    } catch (error) {
      console.error("Error marking announcement as read:", error);
    }
  };

  const getUserAnnouncement = async () => {
    setLoading(true);
    try {
      const response = await privateAxios.get(`/announcements/user`);
      const data = response.data || [];

      // Filter announcements of type 'ORDER'
      const orderAnnouncements = data.filter((item) => item.type === "ORDER");

      setAnnouncements(orderAnnouncements);
      setUnreadAnnounce(
        orderAnnouncements.filter((item) => !item.isRead).length
      );
    } catch (error) {
      console.error("Error fetching announcements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserAnnouncement();
  }, []);
  if (loading) return <Loading />;
  return (
    <div className="account-user-container w-full">
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={9} className="announcement-content">
          <div className="p-6 bg-white shadow-lg rounded-lg">
            {announcements.length > 0 ? (
              announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className={`border-b rounded-lg p-4 cursor-pointer transition-colors duration-300 flex align-middle ${
                    announcement.isRead ? "bg-white" : "bg-gray-100"
                  } hover:bg-custom-blue`}
                  onClick={() =>
                    markAsRead(announcement.id, announcement.isRead)
                  }
                >
                  {announcement.type === "ORDER" && (
                    <div className="flex mt-1 space-x-2 mr-2">
                      <img
                        src={OrderIcon}
                        alt="Thông báo"
                        className="w-24 h-28 rounded-md object-cover"
                        style={{ objectFit: "fill" }}
                      />
                    </div>
                  )}
                  <div className="flex-col mt-4 ">
                    <p className={`font-semibold text-lg "text-gray-700`}>
                      {announcement.title}
                    </p>
                    <p className={`text-gray-700 text-opacity-75 `}>
                      {announcement.message}
                    </p>
                    <p className={`text-sm"text-gray-500 `}>
                      Lúc {convertToVietnameseDate(announcement.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500">No announcements available.</p>
            )}
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AnnouncementOrder;
