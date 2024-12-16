import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button, Chip, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import Loading from "../loading/Loading";
import EmptyIcon from "../../assets/notFound/empty.png";
import SellIcon from "@mui/icons-material/Sell";

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
        <div
          className={`mt-4 REM grid justify-center grid-cols-[repeat(auto-fill,14em)] gap-4`}
        >
          {filteredComics(
            activeTab === "ONGOING" ? ongoingComics : upcomingComics
          ).map((comic) => (
            <div
              className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md cursor-pointer"
              key={comic.id}
              onClick={() => handleDetailClick(comic.id)}
            >
              <img
                src={comic.comics.coverImage}
                alt={comic.comics.title}
                className="object-cover w-full h-80"
              />
              <div className="px-3 py-2">
                <div
                  className={`flex flex-row justify-between w-full gap-2 pb-2 min-h-[2em] mt-2`}
                >
                  {comic.comics.condition === "SEALED" && (
                    <span className="flex items-center gap-1 basis-1/2 px-2 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="10"
                        height="10"
                        fill="currentColor"
                      >
                        <path d="M12 1L20.2169 2.82598C20.6745 2.92766 21 3.33347 21 3.80217V13.7889C21 15.795 19.9974 17.6684 18.3282 18.7812L12 23L5.6718 18.7812C4.00261 17.6684 3 15.795 3 13.7889V3.80217C3 3.33347 3.32553 2.92766 3.78307 2.82598L12 1ZM12 3.04879L5 4.60434V13.7889C5 15.1263 5.6684 16.3752 6.7812 17.1171L12 20.5963L17.2188 17.1171C18.3316 16.3752 19 15.1263 19 13.7889V4.60434L12 3.04879ZM16.4524 8.22183L17.8666 9.63604L11.5026 16L7.25999 11.7574L8.67421 10.3431L11.5019 13.1709L16.4524 8.22183Z"></path>
                      </svg>
                      NGUYÊN SEAL
                    </span>
                  )}
                </div>
                <p className="font-semibold line-clamp-2 h-[3rem]">
                  {comic.comics.title}
                </p>
                <p className="font-semibold my-4 flex items-center justify-center">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full shadow-sm flex items-center gap-1 text-sm flex-nowrap whitespace-nowrap max-w-full">
                    <SellIcon sx={{ fontSize: 12 }} />
                    Giá hiện tại:{" "}
                    <span className="font-bold">
                      {comic.currentPrice.toLocaleString("vi-VN")}đ
                    </span>
                  </span>
                </p>

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
              </div>
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
