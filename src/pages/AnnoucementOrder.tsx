import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import { privateAxios } from "../middleware/axiosInstance";
import Loading from "../components/loading/Loading";

const AnnouncementOrder = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [unreadAnnounce, setUnreadAnnounce] = useState(0);
  const [loading, setLoading] = useState(false);

  // Function to mark an announcement as read
  const markAsRead = async (announcementId: string) => {
    try {
      // API call to mark the announcement as read
      await privateAxios.post(`/announcements/${announcementId}/read`);

      // Update the local state to mark this announcement as read
      setAnnouncements((prevAnnouncements) =>
        prevAnnouncements.map((announcement) =>
          announcement.id === announcementId
            ? { ...announcement, isRead: true }
            : announcement
        )
      );

      // Decrease unread announcements count
      setUnreadAnnounce((prevUnread) => prevUnread - 1);
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
                  className={`border-b rounded-lg p-4 cursor-pointer transition-colors duration-300 ${
                    announcement.isRead ? "bg-white" : "bg-gray-100"
                  } hover:bg-custom-blue`} // Using the custom color
                  // Added hover effect
                  onClick={() =>
                    !announcement.isRead && markAsRead(announcement.id)
                  } // Mark as read on click
                >
                  <p
                    className={`font-semibold text-lg ${
                      announcement.isRead ? "text-gray-700" : "text-gray-500"
                    }`}
                  >
                    {announcement.title}
                  </p>
                  <p
                    className={`text-gray-700 ${
                      announcement.isRead
                        ? "text-opacity-75"
                        : "text-opacity-50"
                    }`}
                  >
                    {announcement.message}
                  </p>
                  <p
                    className={`text-sm ${
                      announcement.isRead ? "text-gray-500" : "text-gray-400"
                    }`}
                  >
                    {announcement.date}
                  </p>
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
