import React, { useEffect, useState } from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import Loading from "../loading/Loading";
import { useAppSelector } from "../../redux/hooks";

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
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [ongoingComics, setOngoingComics] = useState<any[]>([]);
  const [upcomingComics, setUpcomingComics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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
        // console.log();

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
      const genreMatch =
        filteredGenres.length === 0 ||
        (comic.comics.genres &&
          comic.comics.genres.some((genre: any) =>
            filteredGenres.includes(genre.name)
          ));

      const authorMatch =
        filteredAuthors.length === 0 ||
        filteredAuthors.includes(comic.comics.author);

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

      {/* Ongoing Auctions Section */}
      <div className="auction-section-detail1 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Đang diễn ra</h2>
      </div>

      <div className="auction-cards mt-4">
        {filteredComics(ongoingComics).length > 0 ? (
          filteredComics(ongoingComics).map((comic) => (
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
              <p className="endtime">KẾT THÚC TRONG</p>
              <Countdown date={new Date(comic.endTime)} renderer={renderer} />
              <Button
                className="detail-button"
                onClick={() => handleDetailClick(comic.id)}
                variant="contained"
              >
                Xem Chi Tiết
              </Button>
            </div>
          ))
        ) : (
          <p>Không tìm thấy kết quả phù hợp</p>
        )}
      </div>

      {/* Upcoming Auctions Section */}
      <div className="auction-section-detail2 flex justify-between items-center">
        <h2 className="text-2xl font-bold">Sắp diễn ra</h2>
      </div>

      <div className="auction-cards mt-4">
        {filteredComics(upcomingComics).length > 0 ? (
          filteredComics(upcomingComics).map((comic) => (
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
              <p className="text-center m-2 REM bg-orange-200 rounded-xl">SẮP DIỄN RA</p>

              <Button
                className="detail-button"
                onClick={() => handleDetailClick(comic.id)}
                variant="contained"
              >
                Xem Chi Tiết
              </Button>
            </div>
          ))
        ) : (
          <p>Không tìm thấy kết quả phù hợp</p>
        )}
      </div>
    </div>
  );
};

export default AllAuctions;
