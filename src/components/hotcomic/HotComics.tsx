import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "../ui/GenreSidebar.css";
import { Link, useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";
import { Comic } from "../../common/base.interface";
import { publicAxios } from "../../middleware/axiosInstance";

interface GenresProps {
  filteredGenres: string[];
  filteredAuthors: string[];
}

const HotComics: React.FC<GenresProps> = ({
  filteredGenres,
  filteredAuthors,
}) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get("query");

  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div className="countdown">
        <div className="time-box">
          <span className="time">{days.toString().padStart(2, "0")}</span>
          <span className="label">Ngày</span>
        </div>
        <div className="time-box">
          <span className="time">{hours.toString().padStart(2, "0")}</span>
          <span className="label">Giờ</span>
        </div>
        <div className="time-box">
          <span className="time">{minutes.toString().padStart(2, "0")}</span>
          <span className="label">Phút</span>
        </div>
        <div className="time-box">
          <span className="time">{seconds.toString().padStart(2, "0")}</span>
          <span className="label">Giây</span>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await publicAxios.get("/comics/status/available");
        const data = response.data;

        const hotComics = data.filter(
          (comic: any) => comic.condition === "SEALED"
        );
        console.log("hot comics", hotComics);
        setComics(hotComics);
      } catch (error) {
        console.error("Error fetching comics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComics();
  }, []);

  const filteredComics = comics.filter((comic) => {
    const genreMatch =
      filteredGenres.length > 0
        ? filteredGenres.every((genre) =>
          comic.genres.some((comicGenre) => comicGenre.name === genre)
        )
        : true;

    const authorMatch =
      filteredAuthors.length > 0
        ? filteredAuthors.every((author) => comic.author.includes(author))
        : true;

    const titleMatch = searchQuery
      ? comic.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return genreMatch && authorMatch && titleMatch;
  });

  const sortedComics = [...filteredComics].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const auctionComics = sortedComics.filter(
    (comic) => comic.type === "AUCTION"
  );
  const nonAuctionComics = sortedComics.filter(
    (comic) => comic.type !== "AUCTION"
  );

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
          <div className="all-genres-section flex justify-between items-center">
            <h2 className="text-2xl font-bold">Truyện Tranh Nguyên Seal</h2>
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
                          src={comic.coverImage || "/default-cover.jpg"}
                          alt={comic.title}
                          className=" object-cover mx-auto"
                        />
                        <p className="title">{comic.title}</p>
                        <p className="condition">9/10</p>
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
                            src={comic.coverImage}
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
            <div className="mt-4 REM grid justify-center grid-cols-[repeat(auto-fill,14em)] gap-4">
              {sortedComics.length > 0 ? (
                sortedComics.map((comic) => (
                  <div className="bg-white rounded-lg w-[14em] overflow-hidden border drop-shadow-md" key={comic.id}>
                    <Link to={`/detail/${comic.id}`}>
                      <img
                        src={comic.coverImage}
                        alt={comic.title}
                        className="object-cover w-full h-80"
                      />
                      <div className="px-3 py-2">
                        <p className=" font-bold text-xl text-red-500">{formatPrice(comic.price)}</p>
                        <p className="font-light text-sm">{comic.author.toUpperCase()}</p>
                        <p className="font-semibold line-clamp-3 h-[4.5em]">{comic.title}</p>
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

export default HotComics;
