import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "../ui/GenreSidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { Comic } from "../../common/base.interface";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import Loading from "../loading/Loading";

interface GenresProps {
  filteredGenres: string[];
  filteredAuthors: string[];
  filteredConditions: string[];
}

const Genres: React.FC<GenresProps> = ({
  filteredGenres,
  filteredAuthors,
  filteredConditions,
}) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [auctionComics, setAuctionComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query");

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

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = isLoggedIn
          ? await privateAxios.get("/comics/except-seller/available") // For logged-in users
          : await publicAxios.get("/comics/status/available"); // For guests
        const auctionComics = await publicAxios.get<Comic[]>("/auction");

        setComics(response.data);
        console.log("comics", response.data);

        setAuctionComics(auctionComics.data);
        console.log("auction comics", auctionComics.data);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  // const filteredRegularComics = comics.filter((comic) => {
  //   if (searchQuery) {
  //     return comic.title.toLowerCase().includes(searchQuery.toLowerCase());
  //   } else if (comic.status === "AVAILABLE") {
  //     const genreMatch = filteredGenres.length > 0
  //       ? comic.genres && comic.genres.some((genre) => filteredGenres.includes(genre.name))
  //       : true;
  //     const authorMatch = filteredAuthors.length > 0
  //       ? filteredAuthors.includes(comic.author)
  //       : true;
  //     const conditionMatch = filteredConditions.length > 0
  //       ? filteredConditions.includes(comic.condition)
  //       : true;

  //     return genreMatch && authorMatch && conditionMatch;
  //   }
  //   return false;
  // });

  // const filteredAuctionComics = auctionComics.filter((comic) => {
  //   return searchQuery
  //     ? comic.comics.title.toLowerCase().includes(searchQuery.toLowerCase())
  //     : true;
  // });

  const filterRegularComics = (comic: Comic) => {
    const matchesSearchQuery = searchQuery
      ? comic.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const genreMatch =
      filteredGenres.length > 0
        ? comic.genres &&
          comic.genres.some((genre) => filteredGenres.includes(genre.name))
        : true;
    const authorMatch =
      filteredAuthors.length > 0
        ? filteredAuthors.includes(comic.author)
        : true;
    const conditionMatch =
      filteredConditions.length > 0
        ? filteredConditions.includes(comic.condition)
        : true;

    return matchesSearchQuery && genreMatch && authorMatch && conditionMatch;
  };

  const filterAuctionComics = (comic: Comic) => {
    const matchesSearchQuery = searchQuery
      ? comic.comics.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const genreMatch =
      filteredGenres.length > 0
        ? comic.comics.genres &&
          comic.comics.genres.some((genre) =>
            filteredGenres.includes(genre.name)
          )
        : true;
    const authorMatch =
      filteredAuthors.length > 0
        ? filteredAuthors.includes(comic.comics.author)
        : true;
    const conditionMatch =
      filteredConditions.length > 0
        ? filteredConditions.includes(comic.comics.condition)
        : true;

    return matchesSearchQuery && genreMatch && authorMatch && conditionMatch;
  };

  // Apply the filter to each list separately
  const filteredRegularComics = comics.filter((comic) =>
    filterRegularComics(comic)
  );
  const filteredAuctionComics = auctionComics.filter((comic) =>
    filterAuctionComics(comic)
  );

  const sortedComics = [...filteredRegularComics].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const sortedRegularComics = [...filteredRegularComics].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const sortedAuctionComics = [...filteredAuctionComics].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  // const auctionComics = sortedComics.filter(
  //   (comic) => comic.status === "AUCTION"
  // );
  const nonAuctionComics = sortedComics.filter(
    (comic) => comic.status !== "AUCTION"
  );

  const formatPrice = (price: number | null | undefined) => {
    if (price == null) {
      return "N/A"; // Handle null or undefined price gracefully
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value === "Giá cao đến thấp" ? "desc" : "asc");
  };

  const handleDetailClick = (comicId: string) => {
    navigate(`/auctiondetail/${comicId}`); // Điều hướng với ID comic
  };

  return (
    <div className="mb-10">
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* Tất Cả Thể Loại */}
          <div className="all-genres-section flex justify-between items-center REM">
            <h2 className="text-2xl font-bold">
              {searchQuery
                ? `Kết quả tìm kiếm cho: "${searchQuery}"`
                : "Tất cả thể loại"}
            </h2>
            <div className="flex items-center">
              <span className="mr-2">Sắp xếp: </span>
              <select
                className="border rounded p-1"
                onChange={handleSortChange}
              >
                <option>Giá thấp đến cao</option>
                <option>Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          {searchQuery ? (
            <>
              {/* Auction Comics Section */}
              <div className="auction-comics-section mt-4">
                <Chip
                  label="Comics Đấu Giá"
                  color="primary"
                  variant="outlined"
                  sx={{
                    fontSize: "20px",
                    padding: "20px 16px",
                    marginBottom: 2,
                    borderRadius: "20px",
                    marginLeft: "20px",
                  }}
                />
                <div className="all-genres-cards">
                  {sortedAuctionComics.length > 0 ? (
                    sortedAuctionComics.map((comic) => (
                      <div className="auction-card" key={comic.id}>
                        <img
                          src={comic.comics.coverImage}
                          alt={comic.comics.title}
                          className=" object-cover mx-auto"
                        />
                        <p className="title">{comic.comics.title}</p>
                        <Chip
                          label={comic.comics.condition}
                          icon={<ChangeCircleOutlinedIcon />}
                          size="medium"
                        />
                        <p className="endtime">KẾT THÚC TRONG</p>
                        <Countdown
                          date={Date.now() + 100000000}
                          renderer={renderer}
                        />
                        <Button
                          className="detail-button"
                          variant="contained"
                          onClick={() => handleDetailClick(comic.id)}
                        >
                          Xem Chi Tiết
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="no-auction-comics">
                      Không có comics đấu giá nào phù hợp
                    </p>
                  )}
                </div>
              </div>

              {/* Non-Auction Comics Section */}
              <div className="regular-comics-section mt-2">
                <Chip
                  label="Comics Thông Thường"
                  color="secondary"
                  variant="outlined"
                  sx={{
                    fontSize: "20px",
                    padding: "20px 16px",
                    marginBottom: 2,
                    borderRadius: "20px",
                    marginLeft: "20px",
                  }}
                />
                <div className="all-genres-cards">
                  {sortedRegularComics.length > 0 ? (
                    sortedRegularComics.map((comic) => (
                      <div className="hot-comic-card" key={comic.id}>
                        <Link to={`/detail/${comic.id}`}>
                          <img
                            src={comic.coverImage || "/default-cover.jpg"}
                            alt={comic.title}
                            className="object-cover mx-auto"
                          />
                          <p className="price">{formatPrice(comic.price)}</p>
                          <p className="author">{comic.author.toUpperCase()}</p>
                          <p className="title">{comic.title}</p>
                        </Link>
                      </div>
                    ))
                  ) : (
                    <p className="no-regular-comics">
                      Không có comics thông thường nào phù hợp
                    </p>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="all-genres-cards mt-4 REM">
              {sortedComics.length > 0 ? (
                sortedComics.map((comic) => (
                  <div className="hot-comic-card" key={comic.id}>
                    <Link to={`/detail/${comic.id}`}>
                      <img
                        src={comic.coverImage || "/default-cover.jpg"}
                        alt={comic.title}
                        className="object-cover mx-auto"
                      />
                      <p className="price">{formatPrice(comic.price)}</p>
                      <p className="author">{comic.author.toUpperCase()}</p>
                      <p className="title">{comic.title}</p>
                      <div className="rating-sold-comic">
                        <p className="rating">
                          {[...Array(5)].map((_, index) => (
                            <StarIcon
                              key={index}
                              style={{ width: "20px", color: "#ffc107" }}
                            />
                          ))}
                        </p>
                        <div className="divider"></div>
                        <p className="sold-info">Đã bán 123</p>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <p>Không có comics nào</p>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Genres;
