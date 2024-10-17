import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "../ui/GenreSidebar.css";
import { Link, useLocation } from "react-router-dom";
import Countdown from "react-countdown";
import { Button, Chip } from "@mui/material";


const Genres = ({ filteredGenres, filteredAuthors }) => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("asc");
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const searchQuery = params.get('query');

  const renderer = ({ days, hours, minutes, seconds }) => {
    return (
      <div className="countdown">
        <div className="time-box">
          <span className="time">{days.toString().padStart(2, '0')}</span>
          <span className="label">D</span>
        </div>
        <div className="time-box">
          <span className="time">{hours.toString().padStart(2, '0')}</span>
          <span className="label">H</span>
        </div>
        <div className="time-box">
          <span className="time">{minutes.toString().padStart(2, '0')}</span>
          <span className="label">M</span>
        </div>
        <div className="time-box">
          <span className="time">{seconds.toString().padStart(2, '0')}</span>
          <span className="label">S</span>
        </div>
      </div>
    );
  };

  const token = sessionStorage.getItem("accessToken");

  useEffect(() => {
    // Gọi API để lấy danh sách comics có status là 'available'
    fetch("http://localhost:3000/comics/status/available", {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Available Comics:', data);
        setComics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comics:", error);
        setLoading(false);
      });
  }, []);


  const filteredComics = comics.filter((comic) => {
    const genreMatch =
      filteredGenres.length > 0
        ? comic.genres && comic.genres.some((genre) => filteredGenres.includes(genre.name))
        : true;
    const authorMatch =
      filteredAuthors.length > 0 ? filteredAuthors.includes(comic.author) : true;
    const titleMatch = searchQuery
      ? comic.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return genreMatch && authorMatch && titleMatch;
  });

  const sortedComics = [...filteredComics].sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  const auctionComics = sortedComics.filter((comic) => comic.isAuction);
  const nonAuctionComics = sortedComics.filter((comic) => !comic.isAuction);

  const formatPrice = (price) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value === "Giá cao đến thấp" ? "desc" : "asc");
  };


  return (
    <div className="mb-10">
      {/* Tất Cả Thể Loại */}
      <div className="all-genres-section flex justify-between items-center">
        <h2 className="text-2xl font-bold">{searchQuery ? `Kết quả tìm kiếm cho: "${searchQuery}"` : "Tất cả thể loại"}</h2>
        <div className="flex items-center">
          <span className="mr-2">Sắp xếp: </span>
          <select className="border rounded p-1" onChange={handleSortChange}>
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
                fontSize: '20px',
                padding: '20px 16px',
                marginBottom: 2,
                borderRadius: '20px',
                marginLeft: '20px'
              }}
            />
            <div className="all-genres-cards">
              {auctionComics.length > 0 ? (
                auctionComics.map((comic) => (
                  <div className="auction-card" key={comic.id}>
                    <img
                      src={comic.coverImage}
                      alt={comic.title}
                      className=" object-cover mx-auto"
                    />
                    <p className="title">{comic.title}</p>
                    <p className="condition">{comic.condition}</p>
                    <p className="endtime">KẾT THÚC TRONG</p>
                    <Countdown
                      date={Date.now() + 100000000}
                      renderer={renderer}
                    />
                    <Button
                      className="detail-button"
                      // onClick={() => handleDetailClick(comic.id)}
                      variant="contained"

                    >
                      Xem Chi Tiết
                    </Button>
                  </div>
                ))
              ) : (
                <p className="no-auction-comics">Không có comics đấu giá nào phù hợp</p>
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
                fontSize: '20px',
                padding: '20px 16px',
                marginBottom: 2,
                borderRadius: '20px',
                marginLeft: '20px'
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
                <p className="no-regular-comics">Không có comics thông thường nào phù hợp</p>
              )}
            </div>
          </div>
        </>
      ) : (
        // Show all comics together if no search query
        <div className="all-genres-cards mt-4">
          {sortedComics.length > 0 ? (
            sortedComics.map((comic) => (
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
                    <p className="sold-info">Đã bán {comic.sold}</p>
                  </div>
                  {/* {comic.isAuction && (
                    <span className="auction-label">Đấu Giá</span>
                  )} */}
                </Link>
              </div>
            ))
          ) : (
            <p>Không có comics nào</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Genres;