/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../ui/GenreSidebar.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Countdown from "react-countdown";
import { Button, Chip, CircularProgress } from "@mui/material";
import { Auction, Comic, UserInfo } from "../../common/base.interface";
import { publicAxios } from "../../middleware/axiosInstance";
import ChangeCircleOutlinedIcon from "@mui/icons-material/ChangeCircleOutlined";
import Loading from "../loading/Loading";
import moment from "moment/min/moment-with-locales";
import LazyLoad from "react-lazyload";
import InfiniteScroll from "react-infinite-scroll-component";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { Tooltip } from "antd";
import EmptyIcon from "../../assets/notFound/empty.png";
import SellIcon from "@mui/icons-material/Sell";
import displayPastTimeFromNow from "../../utils/displayPastTimeFromNow";
import { convertToVietnameseDate } from "../../utils/convertDateVietnamese";
import CurrencySplitter from "../../assistants/Spliter";

interface GenresProps {
  filteredGenres: string[];
  filteredAuthors: string[];
  filteredConditions: string[];
}

interface Seller {
  seller: {
    id: string;
    name: string;
    [key: string]: any;
  };
  comics: Comic[];
}

const Genres: React.FC<GenresProps> = ({
  filteredGenres,
  filteredAuthors,
  filteredConditions,
}) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [totalComicsQuantity, setTotalComicsQuantity] = useState<number>(0);
  const [auctionComics, setAuctionComics] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [sortOrder, setSortOrder] = useState<"new" | "asc" | "desc">("new");
  const location = useLocation();
  const navigate = useNavigate();
  const [countTimes, setCountTimes] = useState<{ [key: string]: string }>({});

  const comicsEachLoad = 20;
  const [currentLoaded, setCurrentLoaded] = useState<number>(comicsEachLoad);

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

  const fetchComics = async (comicsCount?: number) => {
    try {
      if (searchQuery) {
        // Fetch from the new search API
        const response = await publicAxios.get(`/comics/search/home`, {
          params: { key: searchQuery },
        });
        console.log("Search API Response:", response.data);

        // Destructure the response
        const {
          comics: regularComics = [],
          auctions: auctionComicsData = [],
          sellers: sellersData = [],
        } = response.data;

        console.log("All auction comics:", auctionComicsData);

        const filteredAuctionComics = auctionComicsData.filter(
          (auction: Auction) => {
            const isValidStatus =
              auction.status === "ONGOING" || auction.status === "UPCOMING";
            console.log(
              `Auction ${auction.id} status: ${auction.status}, Valid: ${isValidStatus}`
            );
            return isValidStatus;
          }
        );

        // Update state variables
        setComics(regularComics);
        setAuctionComics(filteredAuctionComics);
        console.log("Filtered Auction Comics:", filteredAuctionComics);
        setSellers(sellersData);
        console.log("Sellers Data:", sellers);
      } else {
        // Existing logic for fetching comics without a search query
        const response = await publicAxios.get(
          `/comics/count/status/available?load=${comicsCount || comicsEachLoad}`
        );

        const fetchedComics = Array.isArray(response.data[0])
          ? response.data[0]
          : [];
        setComics(fetchedComics);

        const auctionComics = await publicAxios.get<Auction[]>("/auction");
        setAuctionComics(
          Array.isArray(auctionComics.data) ? auctionComics.data : []
        );
      }
    } catch (error) {
      console.error("Error fetching comics:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterRegularComics = (comic: Comic) => {
    const matchesSearchQuery = searchQuery
      ? comic.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

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

    return matchesSearchQuery && genreMatch && authorMatch;
  };

  const filterAuctionComics = (auction: Auction) => {
    const matchesSearchQuery = searchQuery
      ? auction.comics.title.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    const genreMatch =
      filteredGenres.length > 0
        ? filteredGenres.every((genre) =>
            auction.comics.genres.some(
              (comicGenre) => comicGenre.name === genre
            )
          )
        : true;

    const authorMatch =
      filteredAuthors.length > 0
        ? filteredAuthors.every((author) =>
            auction.comics.author.includes(author)
          )
        : true;

    const statusMatch =
      auction.status &&
      (auction.status === "ONGOING" || auction.status === "UPCOMING");

    return matchesSearchQuery && genreMatch && authorMatch && statusMatch;
  };

  const filteredAuctionComics = auctionComics.filter((auction) =>
    filterAuctionComics(auction)
  );

  // Apply the filter to each list separately
  const filteredRegularComics = comics.filter((comic) =>
    filterRegularComics(comic)
  );

  const sortComics = (
    comics: Comic[] | Auction[],
    type: "regular" | "auction"
  ) => {
    return [...comics].sort((a, b) => {
      if (sortOrder === "new") {
        const dateA =
          type === "regular"
            ? new Date(a.createdAt).getTime()
            : new Date((a as Auction).startTime).getTime();
        const dateB =
          type === "regular"
            ? new Date(b.createdAt).getTime()
            : new Date((b as Auction).startTime).getTime();
        return dateB - dateA;
      }

      if (type === "regular") {
        return sortOrder === "asc"
          ? (b as Comic).price - (a as Comic).price
          : (a as Comic).price - (b as Comic).price;
      } else {
        return sortOrder === "asc"
          ? (b as Auction).currentPrice - (a as Auction).currentPrice
          : (a as Auction).currentPrice - (b as Auction).currentPrice;
      }
    });
  };

  const sortedRegularComics = sortComics(
    filteredRegularComics,
    "regular"
  ) as Comic[];
  const sortedAuctionComics = sortComics(
    filteredAuctionComics,
    "auction"
  ) as Auction[];
  const formatPrice = (price: number | null | undefined) => {
    if (price == null) {
      return "N/A"; // Handle null or undefined price gracefully
    }
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as "new" | "asc" | "desc");
  };

  const handleDetailClick = (comicId: string) => {
    navigate(`/auctiondetail/${comicId}`);
  };

  const updateCountTimes = () => {
    const newCountTimes: { [key: string]: string } = {};
    comics.forEach((comic) => {
      newCountTimes[comic.id] = moment(comic.onSaleSince).fromNow();
    });

    setCountTimes(newCountTimes);
  };

  useEffect(() => {
    moment.locale("vi");
    updateCountTimes();
  }, [comics]);

  useEffect(() => {
    fetchComics();
  }, []);

  const sortedComics = sortComics(filteredRegularComics, "regular") as Comic[];

  return (
    <div className="mb-10">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex justify-between md:items-center gap-3 items-start w-full bg-white p-5 rounded-lg shadow-md md:flex-row flex-col lg:max-w-screen-xl mx-auto REM">
            <h2 className="text-2xl font-bold uppercase break-words w-fit">
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
                <option value="new">Mới nhất</option>
                <option value="desc">Giá thấp đến cao</option>
                <option value="asc">Giá cao đến thấp</option>
              </select>
            </div>
          </div>

          {searchQuery ? (
            comics.length === 0 &&
            auctionComics.length === 0 &&
            // sellers.length === 0 ? (
            sellers.filter((sellerObj) => sellerObj.comics.length > 0)
              .length === 0 ? (
              <div className="text-center py-10">
                <img
                  className="h-40 w-auto object-contain mx-auto"
                  src={EmptyIcon}
                  alt="No Results"
                />
                <p className="text-xl text-gray-500 mt-4">
                  Không tìm thấy kết quả phù hợp cho "{searchQuery}"
                </p>
              </div>
            ) : (
              <>
                {/* Auction Comics Section */}
                {sortedAuctionComics.length > 0 ? (
                  <div className="auction-comics-section mt-4">
                    <Chip
                      label="Sản phẩm đấu giá"
                      color="primary"
                      variant="outlined"
                      sx={{
                        fontSize: "20px",
                        padding: "20px 16px",
                        marginBottom: 2,
                        borderRadius: "20px",
                        marginLeft: "20px",
                        fontFamily: "REM",
                      }}
                    />
                    <div className="mt-4 grid sm:justify-start justify-items-center gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(12em,1fr))] md:gap-6 lg:gap-4">
                      {sortedAuctionComics.map((auction) => (
                        <div
                          onClick={() => handleDetailClick(auction.id)}
                          className={`bg-white rounded-lg w-fit overflow-hidden border drop-shadow-md cursor-pointer`}
                          key={auction.id}
                        >
                          <img
                            src={auction.comics.coverImage}
                            alt={auction.comics.title}
                            className="object-cover w-full h-80"
                          />
                          <div className="px-3 py-2">
                            <div
                              className={`hidden sm:flex items-center justify-between min-h-[1.2em] w-full gap-2 my-2`}
                            >
                              {auction.comics.condition === 10 && (
                                <span className="flex items-center gap-1 basis-1/2 px-2 py-1 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
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
                              {auction.comics.edition.isSpecial && (
                                <span
                                  className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl bg-red-800 text-white text-[0.5em] font-light text-nowrap justify-center`}
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
                                  {auction.comics.edition.name}
                                </span>
                              )}
                            </div>
                            <p className="font-semibold line-clamp-2 h-[3rem]">
                              {auction.comics.title}
                            </p>

                            <p className="font-semibold mt-2 mb-2 flex items-center justify-center">
                              <span
                                style={{ fontSize: "12px" }}
                                className="bg-green-100 text-green-800 px-4 py-1 rounded-full shadow-sm flex items-center gap-1 flex-nowrap whitespace-nowrap max-w-full"
                              >
                                <SellIcon sx={{ fontSize: 12 }} />
                                {auction.status === "UPCOMING"
                                  ? "Giá khởi điểm: "
                                  : "Giá hiện tại: "}
                                <span className="font-bold">
                                  {auction.status === "UPCOMING"
                                    ? auction.reservePrice.toLocaleString(
                                        "vi-VN"
                                      )
                                    : auction.currentPrice.toLocaleString(
                                        "vi-VN"
                                      )}
                                  đ
                                </span>
                              </span>
                            </p>

                            {auction.status === "ONGOING" ? (
                              <>
                                <p className="font-normal mt-3">
                                  KẾT THÚC TRONG
                                </p>
                                <Countdown
                                  date={new Date(auction.endTime)}
                                  renderer={renderer}
                                />
                              </>
                            ) : (
                              <div>
                                <p className="text-center m-2 REM bg-orange-200 rounded-xl">
                                  SẮP DIỄN RA
                                </p>
                                {/* <p className="">
                                  Lúc{" "}
                                  {convertToVietnameseDate(auction.startTime)}
                                </p> */}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Non-Auction Comics Section */}
                {sortedRegularComics.length > 0 ? (
                  <div className="regular-comics-section mt-8">
                    <Chip
                      label="Truyện thông thường"
                      color="secondary"
                      variant="outlined"
                      sx={{
                        fontSize: "20px",
                        padding: "20px 16px",
                        marginBottom: 2,
                        borderRadius: "20px",
                        marginLeft: "20px",
                        fontFamily: "REM",
                      }}
                    />
                    <div className="mt-4 grid sm:justify-start justify-items-center gap-4 grid-cols-1 md:grid-cols-4 lg:grid-cols-5  md:gap-6 lg:gap-4">
                      {sortedRegularComics.map((comic) => (
                        <div
                          className={`bg-white rounded-lg w-fit overflow-hidden border drop-shadow-md`}
                          key={comic.id}
                        >
                          <Link to={`/detail/${comic.id}`}>
                            <img
                              src={comic.coverImage || "/default-cover.jpg"}
                              alt={comic.title}
                              className="object-cover w-full h-80"
                            />
                            <div className="px-3 py-2">
                              <p className=" font-bold text-xl text-red-500">
                                {formatPrice(comic.price)}
                              </p>
                              <p className="font-light text-sm">
                                {comic.author.toUpperCase()}
                              </p>
                              <p className="font-semibold line-clamp-3 h-[4.5em]">
                                {comic.title}
                              </p>
                              <div className="w-full flex justify-start gap-1 items-center font-light text-xs mt-2">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="currentColor"
                                  width={12}
                                  height={12}
                                >
                                  <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                                </svg>
                                <p className="count-time">
                                  Đăng bán từ {countTimes[comic.id]}
                                </p>
                              </div>
                            </div>
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}

                {/* Seller Section */}
                {sellers.some(
                  (sellerObj) =>
                    sellerObj.seller?.name
                      .toLowerCase()
                      .includes(searchQuery.toLowerCase()) &&
                    sellerObj.comics.length > 0
                ) ? (
                  <div className="author-section mt-8">
                    <Chip
                      label="Người Bán"
                      variant="outlined"
                      sx={{
                        fontSize: "20px",
                        padding: "20px 16px",
                        marginBottom: 2,
                        borderRadius: "20px",
                        marginLeft: "20px",
                        fontFamily: "REM",
                        borderColor: "#000",
                      }}
                    />
                    <div className="space-y-4">
                      {sellers
                        .filter(
                          (sellerObj) =>
                            sellerObj.seller &&
                            sellerObj.seller.name &&
                            sellerObj.comics.length > 0 &&
                            sellerObj.seller.name
                              .toLowerCase()
                              .includes(searchQuery.toLowerCase())
                        )
                        .map((sellerObj) => (
                          <div
                            key={sellerObj.seller.id}
                            className="author-card bg-white shadow-lg rounded-lg p-6 mx-4 border border-gray-200"
                          >
                            <div className="flex justify-between items-center mb-6">
                              {/* Wrap the Chip with Tooltip if comics length is 0 */}
                              {sellerObj.comics.length > 0 ? (
                                <Chip
                                  avatar={
                                    <img
                                      src={
                                        sellerObj.seller.avatar ||
                                        "/default-avatar.jpg"
                                      }
                                      alt={`${sellerObj.seller.name}'s avatar`}
                                      className="w-8 h-8 rounded-full"
                                    />
                                  }
                                  label={
                                    <div className="flex items-center gap-2">
                                      <span className="text-base font-medium text-black">
                                        {sellerObj.seller.name}
                                      </span>
                                      <StoreOutlinedIcon
                                        className={`transition-colors duration-200 ${
                                          sellerObj.comics.length > 0
                                            ? "text-black"
                                            : "group-hover:text-red-500 text-black"
                                        }`}
                                        style={{ fontSize: "20px" }}
                                      />
                                    </div>
                                  }
                                  sx={{
                                    fontFamily: "REM",
                                    fontWeight: "500",
                                    fontSize: "16px",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    backgroundColor: "#fff",
                                    color: "#000",
                                    border: "1px solid #000",
                                    boxShadow: "2px 2px #ccc",
                                    transition: "all 0.3s ease-in-out",
                                    cursor:
                                      sellerObj.comics.length > 0
                                        ? "pointer"
                                        : "not-allowed",
                                  }}
                                  onClick={() => {
                                    if (sellerObj.comics.length > 0) {
                                      navigate(
                                        `/seller/shop/all/${sellerObj.seller.id}`
                                      );
                                    }
                                  }}
                                />
                              ) : (
                                <Tooltip
                                  title={
                                    <span style={{ whiteSpace: "nowrap" }}>
                                      Người bán này chưa bán truyện nào
                                    </span>
                                  }
                                  placement="top"
                                >
                                  <Chip
                                    avatar={
                                      <img
                                        src={
                                          sellerObj.seller.avatar ||
                                          "/default-avatar.jpg"
                                        }
                                        alt={`${sellerObj.seller.name}'s avatar`}
                                        className="w-8 h-8 rounded-full"
                                      />
                                    }
                                    label={
                                      <div className="flex items-center gap-2">
                                        <span className="text-base font-medium text-black">
                                          {sellerObj.seller.name}
                                        </span>
                                        <StoreOutlinedIcon
                                          className={`transition-colors duration-200 ${
                                            sellerObj.comics.length > 0
                                              ? "text-black"
                                              : "group-hover:text-red-500 text-black"
                                          }`}
                                          style={{ fontSize: "20px" }}
                                        />
                                      </div>
                                    }
                                    sx={{
                                      fontFamily: "REM",
                                      fontWeight: "500",
                                      fontSize: "16px",
                                      padding: "8px 12px",
                                      borderRadius: "8px",
                                      backgroundColor: "#fff",
                                      color: "#000",
                                      border: "1px solid #000",
                                      boxShadow: "2px 2px #ccc",
                                      transition: "all 0.3s ease-in-out",
                                      cursor: "not-allowed",
                                    }}
                                  />
                                </Tooltip>
                              )}

                              {sellerObj.comics.length > 0 && (
                                <button
                                  className="text-blue-500 text-sm hover:underline"
                                  onClick={() =>
                                    navigate(
                                      `/seller/shop/all/${sellerObj.seller.id}`
                                    )
                                  }
                                >
                                  Xem tất cả
                                </button>
                              )}
                            </div>

                            {/* Comics seller */}
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                              {sellerObj.comics &&
                              sellerObj.comics.length > 0 ? (
                                sellerObj.comics.slice(0, 5).map((comic) => (
                                  <Link
                                    to={`/detail/${comic.id}`}
                                    key={comic.id}
                                    className="rounded-lg bg-white shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-200"
                                  >
                                    <div>
                                      <img
                                        src={
                                          comic.coverImage ||
                                          "/default-cover.jpg"
                                        }
                                        alt={comic.title}
                                        className="w-full h-40 object-cover rounded-t-lg"
                                      />
                                      <div className="p-4 flex flex-col items-center">
                                        <div className="h-12">
                                          <p className="font-medium text-gray-800 text-center line-clamp-2 REM">
                                            {comic.title}
                                          </p>
                                        </div>
                                        <p className="font-bold text-[#ef4444] text-center mt-2 REM">
                                          {comic.price.toLocaleString()} đ
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                ))
                              ) : (
                                <p className="text-sm text-gray-500 col-span-full text-center">
                                  Người bán này chưa bán truyện nào
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ) : null}
              </>
            )
          ) : (
            <InfiniteScroll
              dataLength={sortedComics.length}
              next={() => {
                setCurrentLoaded(currentLoaded + comicsEachLoad);
                fetchComics(currentLoaded + comicsEachLoad);
              }}
              hasMore={currentLoaded < totalComicsQuantity}
              loader={
                <div className="REM w-full flex items-center justify-center gap-4 py-8 font-light italic">
                  <CircularProgress size={20} color="inherit" />
                  Đang tải thêm truyện...
                </div>
              }
            >
              <div className="mt-4 grid grid-cols-3 sm:grid-cols-[repeat(auto-fill,13.85em)] justify-center gap-1 sm:gap-4 REM">
                {sortedComics.length > 0 ? (
                  sortedComics.map((comic) => (
                    <div
                      className="bg-white rounded-lg w-full overflow-hidden border drop-shadow-md"
                      key={comic.id}
                    >
                      <Link to={`/detail/${comic.id}`}>
                        <img
                          src={comic.coverImage || "/default-cover.jpg"}
                          alt={comic.title}
                          className="object-cover w-full aspect-[2/3]"
                        />
                        <div className="px-1 phone:px-3 py-2">
                          <div
                            className={`hidden sm:flex items-center justify-between w-full gap-2 min-h-[2em]`}
                          >
                            {comic.condition === 10 && (
                              <span className="flex items-center gap-1 basis-1/2 px-2 py-1 rounded-2xl bg-sky-800 text-white text-[0.5em] font-light text-nowrap justify-center">
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
                            {comic.edition.isSpecial && (
                              <span
                                className={`flex items-center gap-1 px-2 basis-1/2 py-1 rounded-2xl bg-red-800 text-white text-[0.5em] font-light text-nowrap justify-center`}
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
                                {comic.edition.name}
                              </span>
                            )}
                          </div>
                          <p className="font-bold text-sm sm:text-lg text-red-500">
                            {CurrencySplitter(comic.price)}đ
                          </p>
                          <p className="font-light text-[0.5rem] sm:text-base uppercase">
                            {comic.author}
                          </p>
                          <p className="font-semibold text-sm sm:text-xl line-clamp-3 h-[4.4em]">
                            {comic.title}
                          </p>

                          <div className="w-full flex justify-start gap-1 items-center font-light text-xs mt-2">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              width={12}
                              height={12}
                            >
                              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM13 12H17V14H11V7H13V12Z"></path>
                            </svg>
                            <p className="count-time">
                              Đăng bán từ{" "}
                              {displayPastTimeFromNow(
                                comic.onSaleSince || new Date(),
                                null,
                                true
                              )}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))
                ) : (
                  <p>Không có truyện nào</p>
                )}
              </div>
            </InfiniteScroll>
          )}
        </>
      )}
    </div>
  );
};

export default Genres;
