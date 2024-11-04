import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "../ui/GenreSidebar.css";
import { Link, useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { Comic } from "../../common/base.interface";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";

interface GenresProps {
  filteredGenres: string[];
  filteredAuthors: string[];
}

const Genres: React.FC<GenresProps> = ({
  filteredGenres,
  filteredAuthors,
  filteredConditions,
}) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();
  const isLoggedIn = useAppSelector((state) => state.auth.isLoggedIn);

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
        // const auctionComics = await publicAxios.get<Comic[]>("/auction");

        setComics(response.data);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  const filteredComics = comics.filter((comic) => {
    if (searchQuery) {
      // Nếu có searchQuery, tìm kiếm trong cả AVAILABLE và AUCTION comics
      return comic.title.toLowerCase().includes(searchQuery.toLowerCase());
    } else {
      // Nếu không có searchQuery, chỉ áp dụng bộ lọc cho AVAILABLE comics
      if (comic.status === "AVAILABLE") {
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
        return genreMatch && authorMatch && conditionMatch;
      }
      return false;
    }
  });

  const sortedComics = [...filteredComics].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const auctionComics = sortedComics.filter(
    (comic) => comic.status === "AUCTION"
  );
  const nonAuctionComics = sortedComics.filter(
    (comic) => comic.status !== "AUCTION"
  );
  console.log("truyện đấu giá", auctionComics);
  console.log("truyện không đấu giá", nonAuctionComics);

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value === "Giá cao đến thấp" ? "desc" : "asc");
  };

  return (
    <div className="mb-10">
      {loading ? (
        <div className="loading-indicator">Đang tải dữ liệu...</div>
      ) : (
        <>
          {/* Tất Cả Thể Loại */}
          <div className="all-genres-section flex justify-between items-center">
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
                  {auctionComics.length > 0 ? (
                    auctionComics.map((comic) => (
                      <div className="auction-card" key={comic.id}>
                        <img
                          src={comic.coverImage?.[0] || "/default-cover.jpg"}
                          alt={comic.title}
                          className=" object-cover mx-auto"
                        />
                        <p className="title">{comic.title}</p>
                        <Chip
                          label={comic.condition}
                          icon={<ChangeCircleOutlinedIcon />}
                          size="medium"
                        />
                        <p className="endtime">KẾT THÚC TRONG</p>
                        <Countdown
                          date={Date.now() + 100000000}
                          renderer={renderer}
                        />
                        <Button className="detail-button" variant="contained">
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
              <div className="regular-comics-section mt-8">
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
                  {nonAuctionComics.length > 0 ? (
                    nonAuctionComics.map((comic) => (
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
            <div className="all-genres-cards mt-4">
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
