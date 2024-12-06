import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button, Chip, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import Loading from "../loading/Loading";
import { useAppSelector } from "../../redux/hooks";
import EmptyIcon from "../../assets/notFound/empty.png";

const renderer = ({ days, hours, minutes, seconds }: any) => {
  return (
    <div className="countdown">
      <div className="time-box">
        <span className="time1">{days.toString().padStart(2, "0")}</span>
        <span className="label">Ngày</span>
      </div>
      <div className="time-box">
        <span className="time1">{hours.toString().padStart(2, "0")}</span>
        <span className="label">Giờ</span>
      </div>
      <div className="time-box">
        <span className="time1">{minutes.toString().padStart(2, "0")}</span>
        <span className="label">Phút</span>
      </div>
      <div className="time-box">
        <span className="time1">{seconds.toString().padStart(2, "0")}</span>
        <span className="label">Giây</span>
      </div>
    </div>
  );
};

const AllAuctions = ({
  filteredGenres,
  filteredAuthors,
  filteredConditions,
}: any) => {
  const navigate = useNavigate();
  const [ongoingComics, setOngoingComics] = useState<any[]>([]);
  const [upcomingComics, setUpcomingComics] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ONGOING");

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await publicAxios.get("/auction");
        const data = response.data;
        console.log("Available Comics:", data);

        const ongoingComics = data.filter(
          (auction: any) => auction.status === "ONGOING"
        );
        setOngoingComics(ongoingComics);

        const upcomingComics = data.filter(
          (auction: any) => auction.status === "UPCOMING"
        );

        setUpcomingComics(upcomingComics);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  const handleDetailClick = (comicId: string) => {
    navigate(`/auctiondetail/${comicId}`);
  };

  const filteredComics = (comics: any[]) => {
    return comics.filter((comic) => {
      // Genre Match (AND Logic)
      const genreMatch =
        filteredGenres.length === 0 ||
        filteredGenres.every((genre) =>
          comic.comics.genres?.some(
            (comicGenre: any) => comicGenre.name === genre
          )
        );

      // Author Match (AND Logic)
      const authorMatch =
        filteredAuthors.length === 0 ||
        filteredAuthors.every((author) => comic.comics.author.includes(author));

      // Condition Match
      const conditionMatch =
        filteredConditions.length === 0 ||
        filteredConditions.includes(comic.comics.condition);

      return genreMatch && authorMatch && conditionMatch;
    });
  };

  if (loading) return <Loading />;

  return (
    <div className="mb-10 REM">
      <div className="auction-section flex justify-between items-center">
        <h2 className="text-2xl font-bold">Các Cuộc Đấu Giá Ở ComZone</h2>
      </div>

      <div className="flex justify-around border-b mb-3">
        <button
          className={`w-1/3 py-5 text-center font-bold text-lg ${
            activeTab === "ONGOING"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("ONGOING")}
        >
          <Badge>Đang diễn ra</Badge>
        </button>
        <button
          className={`w-1/3 py-5 text-center font-bold text-lg ${
            activeTab === "UPCOMING"
              ? "text-blue-500 border-b-2 border-blue-500"
              : "text-gray-600"
          }`}
          onClick={() => setActiveTab("UPCOMING")}
        >
          <Badge>Sắp diễn ra</Badge>
        </button>
      </div>

      {/* Ongoing or Upcoming Auctions Section */}

      {filteredComics(activeTab === "ONGOING" ? ongoingComics : upcomingComics)
        .length > 0 ? (
        <div className="auction-cards mt-4">
          {filteredComics(
            activeTab === "ONGOING" ? ongoingComics : upcomingComics
          ).map((comic) => (
            <div className="auction-card" key={comic.id}>
              <img
                src={comic.comics.coverImage}
                alt={comic.comics.title}
                className="object-cover mx-auto"
              />
              <p className="title">{comic.comics.title}</p>
              <Chip
                label={comic.comics.condition}
                icon={<ChangeCircleOutlinedIcon />}
                size="medium"
              />
              {activeTab === "ONGOING" ? (
                <>
                  <p className="endtime">KẾT THÚC TRONG</p>
                  <Countdown
                    date={new Date(comic.endTime)}
                    renderer={renderer}
                  />
                </>
              ) : (
                <p className="text-center m-2 REM bg-orange-200 rounded-xl">
                  SẮP DIỄN RA
                </p>
              )}
              <Button
                className="detail-button"
                onClick={() => handleDetailClick(comic.id)}
                variant="contained"
              >
                Xem Chi Tiết
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-gray-500 p-4">
          <img
            className="h-64 w-full object-contain"
            src={EmptyIcon}
            alt="No Announcements"
          />
          <p>Không có dữ liệu phù hợp</p>
        </div>
      )}
    </div>
  );
};

export default AllAuctions;
