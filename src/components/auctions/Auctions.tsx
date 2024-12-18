import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button, Chip, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
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
  const [sortOrder, setSortOrder] = useState("asc");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("ONGOING");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(
      e.target.value === "Giá cao đến thấp"
        ? "desc"
        : e.target.value === "Lượt đấu giá nhiều"
        ? "bids"
        : "asc"
    );
  };
  useEffect(() => {
    const fetchComics = async () => {
      try {
        // Fetch the auctions and get the one with the most bids
        const response = await publicAxios.get("/auction/most-bids");
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

  const getSortedComics = (comics: any[]) => {
    // Sort the comics by currentPrice or number of bids if needed
    const sortedComics = comics.sort((a, b) => {
      if (sortOrder === "asc") {
        return a.currentPrice - b.currentPrice;
      } else if (sortOrder === "desc") {
        return b.currentPrice - a.currentPrice;
      } else if (sortOrder === "bids") {
        return b.bids.length - a.bids.length;
      } else {
        return 0;
      }
    });

    // Now apply the filtering logic
    return sortedComics.filter((comic) => {
      const genreMatch =
        filteredGenres.length === 0 ||
        filteredGenres.every((genre) =>
          comic.comics.genres?.some(
            (comicGenre: any) => comicGenre.name === genre
          )
        );

      const authorMatch =
        filteredAuthors.length === 0 ||
        filteredAuthors.every((author) => comic.comics.author.includes(author));

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
        <div className="flex items-center">
          <span className="mr-2">Sắp xếp: </span>
          <select className="border rounded p-1" onChange={handleSortChange}>
            <option>Giá thấp đến cao</option>
            <option>Giá cao đến thấp</option>
            <option>Lượt đấu giá nhiều</option>
          </select>
        </div>
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
      {getSortedComics(activeTab === "ONGOING" ? ongoingComics : upcomingComics)
        .length > 0 ? (
        <div className="mt-4 REM grid justify-center grid-cols-[repeat(auto-fill,14em)] gap-4">
          {getSortedComics(
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
                <div className="flex flex-row justify-between w-full gap-2 pb-2 min-h-[1.5em] mt-2">
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
                  {comic.comics.edition !== "REGULAR" && (
                    <span
                      className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl ${
                        comic.comics?.edition === "SPECIAL"
                          ? "bg-yellow-600"
                          : "bg-red-800"
                      } text-white text-[0.5em] font-light text-nowrap justify-center`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="10"
                        height="10"
                        fill="currentColor"
                      >
                        <path d="M10.6144 17.7956C10.277 18.5682 9.20776 18.5682 8.8704 17.7956L7.99275 15.7854C7.21171 13.9966 5.80589 12.5726 4.0523 11.7942L1.63658 10.7219C.868536 10.381.868537 9.26368 1.63658 8.92276L3.97685 7.88394C5.77553 7.08552 7.20657 5.60881 7.97427 3.75892L8.8633 1.61673C9.19319.821767 10.2916.821765 10.6215 1.61673L11.5105 3.75894C12.2782 5.60881 13.7092 7.08552 15.5079 7.88394L17.8482 8.92276C18.6162 9.26368 18.6162 10.381 17.8482 10.7219L15.4325 11.7942C13.6789 12.5726 12.2731 13.9966 11.492 15.7854L10.6144 17.7956ZM4.53956 9.82234C6.8254 10.837 8.68402 12.5048 9.74238 14.7996 10.8008 12.5048 12.6594 10.837 14.9452 9.82234 12.6321 8.79557 10.7676 7.04647 9.74239 4.71088 8.71719 7.04648 6.85267 8.79557 4.53956 9.82234ZM19.4014 22.6899 19.6482 22.1242C20.0882 21.1156 20.8807 20.3125 21.8695 19.8732L22.6299 19.5353C23.0412 19.3526 23.0412 18.7549 22.6299 18.5722L21.9121 18.2532C20.8978 17.8026 20.0911 16.9698 19.6586 15.9269L19.4052 15.3156C19.2285 14.8896 18.6395 14.8896 18.4628 15.3156L18.2094 15.9269C17.777 16.9698 16.9703 17.8026 15.956 18.2532L15.2381 18.5722C14.8269 18.7549 14.8269 19.3526 15.2381 19.5353L15.9985 19.8732C16.9874 20.3125 17.7798 21.1156 18.2198 22.1242L18.4667 22.6899C18.6473 23.104 19.2207 23.104 19.4014 22.6899ZM18.3745 19.0469 18.937 18.4883 19.4878 19.0469 18.937 19.5898 18.3745 19.0469Z"></path>
                      </svg>
                      {comic.comics.edition === "SPECIAL"
                        ? "BẢN ĐẶC BIỆT"
                        : "BẢN GIỚI HẠN"}
                    </span>
                  )}
                </div>
                <p className="font-bold line-clamp-3 h-[4.5em]">
                  {comic.comics.title}
                </p>

                <p className="font-semibold mt-2 mb-2 flex items-center justify-center">
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
                    <p className="font-medium">KẾT THÚC TRONG</p>
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
