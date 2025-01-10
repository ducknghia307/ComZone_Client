import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid2";
import "../ui/AuctionDetail.css";
import { Avatar, Button, Chip, Divider, Typography } from "@mui/material";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import ComicsDescription from "../comic/comicDetails/ComicsDescription";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import socket, { connectSocket } from "../../services/socket";
import ErrorOutlineSharpIcon from "@mui/icons-material/ErrorOutlineSharp";
import {
  setAuctionData,
  setHighestBid,
} from "../../redux/features/auction/auctionSlice";
import CountdownFlipNumbers from "./CountDown";
import CountUp from "react-countup";
import Loading from "../loading/Loading";
import ConfettiExplosion from "react-confetti-explosion";
import { Modal, notification } from "antd";
import { auctionAnnouncement } from "../../redux/features/notification/announcementSlice";
import AuctionPublisher from "./AuctionPublisher";
import { Auction } from "../../common/base.interface";
import { AuctionResult } from "./AuctionResult";
import ModalDeposit from "../modal/ModalDeposit";
import { Popconfirm } from "antd";

interface HighestBid {
  user: {
    id: string;
  };
  price: number; // Assuming there's a price field
  timestamp?: string; // Add other fields as necessary
}
interface AuctionAnnounce {
  id: string;
  status: string;
  title: string;
  auction: Auction;
  message: string;
}
const ComicAuction = () => {
  const { id } = useParams<Record<string, string>>();
  const [comic, setComic] = useState<any>(null);
  const [users, setUsers] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [mainImage, setMainImage] = useState<string>("");
  const auctionData = useAppSelector((state: any) => state.auction.auctionData);
  const [previewChapter, setPreviewChapter] = useState<string[]>([]);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isBidDisabled, setIsBidDisabled] = useState(false);
  const userId = useAppSelector((state) => state.auth.userId);
  const [auctionEnded, setAuctionEnded] = useState(false);
  const highestBid: HighestBid | null = useAppSelector(
    (state: any) => state.auction.highestBid
  );
  const [bids, setBids] = useState([]);
  const uniqueParticipantsCount = new Set(bids.map((bid) => bid?.user.id)).size;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [winner, setWinner] = useState<boolean | null>(null);
  const [isHighest, setIsHighest] = useState<boolean | null>(null);
  const [error, setError] = useState<string>("");
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [hasDeposited, setHasDeposited] = useState(false);
  const navigate = useNavigate();
  const auctionAnnounce = useAppSelector<AuctionAnnounce | null>(
    (state) => state.annoucement.auctionAnnounce
  );

  const handleAuctionEnd = (ended: boolean) => {
    console.log(`Auction ended: ${ended}`);
    setAuctionEnded(ended);
  };

  const handleBidActionDisabled = (disabled: boolean) => {
    setIsBidDisabled(disabled);
  };

  const handleDepositSuccess = () => {
    setHasDeposited(true);
    notification.success({
      key: "success",
      message: "Thành công",
      description: "Cọc tiền thành công!",
      duration: 5,
    });
  };
  const handleBuy = (auctionData: Auction, price: any, type: string) => {
    if (!auctionData) return;
    sessionStorage.setItem(
      "selectedComics",
      JSON.stringify({
        [auctionData.comics?.sellerId?.id]: {
          sellerName: auctionData.comics?.sellerId?.name,
          comics: [
            {
              comic: auctionData.comics,
              currentPrice: price,
              auctionId: auctionData.id,
              depositAmount: auctionData.depositAmount,
              quantity: 1,
              type,
            },
          ],
        },
      })
    );
    navigate("/checkout");
  };

  const handleModalClose = () => {
    privateAxios
      .post(`/announcements/${auctionAnnounce?.id}/read`)
      .then(() => {
        console.log("Announcement marked as read.");
        // fetchComicDetails();
      })
      .catch((error) => {
        console.error("Error marking announcement as read:", error);
      });
    if (auctionAnnounce?.status === "SUCCESSFUL") {
      setWinner(true);
      console.log("123");
    } else {
      setWinner(false);
      console.log("456");
    }
    setIsModalVisible(false);
  };

  const dispatch = useAppDispatch();

  useEffect(() => {
    const checkDepositStatus = async () => {
      try {
        const response = await privateAxios.get(`deposits/auction/user/${id}`);
        console.log("RESPONSE1", response.data);

        if (response.data) {
          setHasDeposited(true); // Set true if deposit exists
        } else {
          setHasDeposited(false); // Revert to false if no deposit
        }
      } catch (error) {
        console.error("Error checking deposit status:", error);
        setHasDeposited(false); // Handle errors gracefully
      }
    };

    checkDepositStatus();
  }, [id]);

  useEffect(() => {
    fetchUnreadAnnouncementForAuction();
  }, [auctionData]);

  useEffect(() => {
    if (highestBid?.user?.id === userId) {
      setIsHighest(true);
    } else {
      setIsHighest(false);
    }
  }, [highestBid, userId]);

  useEffect(() => {
    const handleAuctionUpdated = (data) => {
      dispatch(setAuctionData(data));
      dispatch(setHighestBid(data.bids[0].price));
    };

    socket.on("auctionUpdated", handleAuctionUpdated);

    return () => {
      socket.off("auctionUpdated", handleAuctionUpdated);
    };
  }, [dispatch]);

  const fetchUnreadAnnouncementForAuction = async () => {
    try {
      const response = await privateAxios.get(
        `/announcements/auction/${auctionData?.id}/unread`
      );
      if (response.data !== "") {
        dispatch(auctionAnnouncement(response.data));
      }
    } catch (error) {
      console.error("Failed to fetch unread announcement:", error);
    }
  };
  useEffect(() => {
    const fetchComicDetails = async () => {
      try {
        const response = await publicAxios.get(`/auction/${id}`);
        const comicData = response.data.comics;
        setUsers(comicData.sellerId);
        setComic(comicData);
        setMainImage(comicData.coverImage);
        setPreviewChapter(comicData.previewChapter || []);
        dispatch(setAuctionData(response.data));

        console.log(response.data);
      } catch (error) {
        console.error("Error fetching comic details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComicDetails();
  }, [id, auctionAnnounce?.id, dispatch]);
  const fetchBisOfAuction = async () => {
    try {
      const responseBid = await publicAxios.get(`/bids/auction/${id}`);
      console.log("1", responseBid);
      const bidData = responseBid.data;
      setBids(bidData);
      dispatch(setHighestBid(responseBid.data[0]));
    } catch (error) {
      console.error("Error fetching comic details:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bids on component mount or when auction ID changes
  useEffect(() => {
    fetchBisOfAuction();
  }, [id, auctionAnnounce?.id, dispatch]);

  useEffect(() => {
    if (!userId) {
      setWinner(null);
      return;
    }

    let userParticipated = false;

    // Kiểm tra nếu người dùng đã tham gia bid
    if (bids?.length > 0) {
      userParticipated = bids.some((bid) => bid.user.id === userId);
    }

    if (
      auctionData?.status === "SUCCESSFUL" ||
      auctionData?.status === "COMPLETED"
    ) {
      if (auctionData.winner?.id === userId) {
        setWinner(true); // Người dùng là người thắng
      } else if (userParticipated) {
        setWinner(false); // Người dùng không thắng nhưng có tham gia
      } else {
        setWinner(null); // Người dùng không liên quan
      }
    } else {
      setWinner(null); // Trạng thái không xác định hoặc không liên quan
    }
  }, [auctionData?.status, auctionData?.winner, userId, bids]);

  useEffect(() => {
    if (userId) {
      setIsModalVisible(true);
    }
  }, [userId]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }
    socket.on("bidUpdate", (data: any) => {
      console.log("123", data);
      if (data.placeBid.auction.id === id) {
        dispatch(setHighestBid(data.placeBid));
        dispatch(setAuctionData(data.placeBid.auction));
        fetchBisOfAuction();
      }
    });
    return () => {
      socket.off("bidUpdate");
    };
  }, [userId, auctionData?.id, dispatch]);

  if (loading) return <Loading />;
  if (!comic) return <p>Comic not found.</p>;

  const handleImageClick = (imageSrc: string) => {
    setMainImage(imageSrc);
  };

  const handleBidInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setBidAmount(value);
    if (parseFloat(value) < auctionData.maxPrice) {
      setError("");
    } else if (
      parseFloat(value) >=
      auctionData.currentPrice + auctionData.priceStep
    ) {
      setError("");
    }
  };

  const handlePlaceBid = async () => {
    if (parseFloat(bidAmount) >= auctionData.maxPrice) {
      setError(" Không ra giá lớn hơn hoặc bằng giá mua ngay.");
      return;
    } else if (
      parseFloat(bidAmount) <
      auctionData?.currentPrice + auctionData?.priceStep
    ) {
      setError("Yêu cầu ra giá tối thiểu hoặc cao hơn.");
      return;
    }
    setError("");
    setBidAmount("");

    const bidPayload = {
      auctionId: auctionData.id,
      userId: userId,
      price: parseFloat(bidAmount),
    };

    socket.emit("placeBid", bidPayload);
  };

  const handleOpenDepositModal = () => {
    setIsDepositModalOpen(true);
  };

  const handleCloseDepositModal = () => {
    setIsDepositModalOpen(false);
  };

  return (
    <div className="REM border border-gray-300 bg-gray-100 text-[50px] relative px-4 lg:px-16">
      <AuctionResult isWinner={winner} auctionStatus={auctionData?.status} />
      {auctionAnnounce && auctionAnnounce.auction?.id === id && (
        <>
          {auctionAnnounce.status === "SUCCESSFUL" && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <ConfettiExplosion
                force={0.8}
                duration={5000}
                particleCount={400}
                width={1600}
              />
            </div>
          )}
          <Modal
            title={`${auctionAnnounce?.title}`}
            open={isModalVisible}
            onOk={handleModalClose}
            onCancel={handleModalClose}
            centered
            cancelButtonProps={{ style: { display: "none" } }}
            width={600}
            styles={{
              body: {
                paddingTop: "10px",
                paddingBottom: "20px",
                fontSize: "18px",
              },
            }}
            okButtonProps={{
              style: {
                color: "white",
                backgroundColor: "black",
                fontWeight: "bold",
                fontSize: "16px",
              },
            }}
          >
            <Typography
              style={{
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center",
                color:
                  auctionAnnounce.status === "SUCCESSFUL" ? "green" : "red",
                lineHeight: "1.5",
              }}
            >
              {auctionAnnounce?.message}{" "}
              {auctionAnnounce.status === "SUCCESSFUL" ? "🎊" : ""}
            </Typography>
          </Modal>
        </>
      )}
      <div className="grid grid-cols-12 items-stretch bg-white text-black font-bold border-b-2 border-gray-200">
        <p className="col-span-12 lg:col-span-7 text-[1.5rem] font-bold px-8 py-2 uppercase text-center lg:text-start lg:line-clamp-1">
          {comic.title}
        </p>
        <div
          className="hidden lg:flex items-center h-full px-4 py-2 col-span-5 bg-[#333] text-white font-medium"
          style={{
            fontFamily: "REM",
            textShadow: "3px 3px #000",
            fontSize: "23px",
          }}
        >
          {comic.author}
        </div>
      </div>

      <div className="grid grid-cols-12">
        <div className="col-span-12 lg:col-span-7 comic-info">
          <div className="flex flex-col lg:flex-row items-stretch justify-center gap-4">
            <div className="grow">
              <img
                src={mainImage}
                alt="Main Comic Cover"
                className="w-full aspect-[2/3] object-cover rounded-md"
              />
            </div>

            <div className="lg:basis-1/3 w-full flex flex-row lg:flex-col gap-2.5 max-h-[15em] overflow-y-auto p-2.5 small-images">
              {[comic?.coverImage, ...previewChapter].map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`Preview ${index + 1}`}
                  className="max-w-[5rem] lg:max-w-full w-full aspect-[2/3] cursor-pointer"
                  onClick={() => handleImageClick(img)}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 auction-info">
          <div className="timer">
            <CountdownFlipNumbers
              auction={auctionData}
              onBidActionDisabled={handleBidActionDisabled}
              onAuctionEnd={handleAuctionEnd}
            />
            <div
              className="current-price"
              style={{
                display: "flex",
                justifyContent: "space-around",
                padding: "10px 15px",
              }}
            >
              <div className="flex flex-col gap-5 items-center justify-center">
                <div className="flex flex-col justify-start">
                  <p className="lg:text-lg">Giá hiện tại:</p>
                  <CountUp
                    style={{
                      fontFamily: "REM",
                      fontSize: "24px",
                      fontWeight: "bold",
                      textShadow: "4px 4px #000",
                    }}
                    start={
                      auctionData.currentPrice > 0
                        ? auctionData.currentPrice -
                          auctionData.currentPrice / 2
                        : auctionData.reservePrice -
                          auctionData.reservePrice / 2
                    }
                    end={
                      auctionData.currentPrice > 0
                        ? auctionData.currentPrice
                        : auctionData.reservePrice
                    }
                    duration={1}
                    separator="."
                    decimals={0}
                    suffix="₫"
                  />
                </div>
                <div className="flex flex-col justify-start">
                  <p className="lg:text-lg">Lượt ra giá:</p>
                  <CountUp
                    style={{
                      fontFamily: "REM",
                      fontSize: "24px",
                      fontWeight: "bold",
                      textShadow: "4px 4px #000",
                    }}
                    start={bids?.length}
                    end={bids?.length}
                    duration={1}
                    separator="."
                    decimals={0}
                  />
                </div>
              </div>
              <Divider
                sx={{ border: "1px solid grey" }}
                orientation="vertical"
                flexItem
              />
              <div className="flex flex-col gap-5 items-center justify-center">
                <div className="flex flex-col justify-start">
                  <p className="lg:text-lg">Bước giá tối thiểu</p>
                  <h3
                    style={{
                      fontFamily: "REM",
                      fontSize: "24px",
                      fontWeight: "bold",
                      textShadow: "4px 4px #000",
                    }}
                  >
                    {auctionData.priceStep.toLocaleString("vi-VN")}&#8363;
                  </h3>
                </div>
                <div className="flex flex-col justify-start">
                  <p className="lg:text-lg">Người tham gia</p>
                  <h3
                    style={{
                      fontFamily: "REM",
                      fontSize: "24px",
                      fontWeight: "bold",
                      textShadow: "4px 4px #000",
                    }}
                  >
                    {uniqueParticipantsCount}
                  </h3>
                </div>
              </div>
            </div>
          </div>

          <div className="shop-info">
            <div className="flex justify-between mt-2 mb-2">
              <Chip
                avatar={
                  <Avatar
                    src={users?.avatar}
                    alt="Vendor Avatar"
                    style={{ width: "30px", height: "30px" }}
                  />
                }
                onClick={() =>
                  navigate(`/seller/shop/all/${auctionData.comics.sellerId.id}`)
                }
                label={
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      fontSize: "16px",
                      maxWidth: "150px", // Set a max width for truncation
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {users?.name}
                    <StoreOutlinedIcon
                      style={{ fontSize: "24px", color: "#000" }}
                    />
                  </div>
                }
                style={{
                  cursor: "pointer",
                  fontFamily: "REM",
                  fontWeight: "500",
                  fontSize: "20px",
                  padding: "20px 5px",
                  borderRadius: "8px",
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid black",
                  boxShadow: "4px 4px #ccc",
                }}
              />
            </div>
            {auctionData.status === "ONGOING" && hasDeposited && (
              <>
                {/* If the user is the highest bidder, don't display anything */}
                {isHighest ? null : (
                  <>
                    {/* Display the minimum bid if it's still valid */}
                    {auctionData.currentPrice + auctionData.priceStep <
                    auctionData.maxPrice ? (
                      <p
                        style={{
                          fontSize: "17px",
                          paddingTop: "10px",
                          fontFamily: "REM",
                          fontWeight: "400",
                        }}
                      >
                        Giá đấu tối thiểu tiếp theo:{" "}
                        {auctionData && (
                          <span style={{ fontWeight: "bold" }}>
                            {(
                              auctionData.currentPrice + auctionData.priceStep
                            ).toLocaleString("vi-VN")}
                            đ
                          </span>
                        )}
                      </p>
                    ) : (
                      /* Display the error if the bid exceeds max price */
                      <p
                        className="bg-red-100 rounded-md p-4"
                        style={{
                          fontSize: "17px",
                          paddingTop: "10px",
                          marginBottom: "10px",
                          fontFamily: "REM",
                          fontWeight: "400",
                          color: "red",
                        }}
                      >
                        <ErrorOutlineSharpIcon className="mr-1  " />
                        Chỉ có thể mua ngay với giá{" "}
                        {auctionData.maxPrice.toLocaleString("vi-VN")}đ. Không
                        thể ra giá nữa vì giá tối thiểu lớn hơn giá mua ngay.
                      </p>
                    )}
                  </>
                )}
              </>
            )}

            {auctionData.comics.sellerId.id !== userId && (
              <>
                {!hasDeposited ? (
                  <div>
                    {auctionData.currentPrice + auctionData.priceStep >=
                      auctionData.maxPrice && (
                      <p
                        className="bg-red-100 rounded-md p-4"
                        style={{
                          fontSize: "17px",
                          paddingTop: "10px",
                          fontFamily: "REM",
                          fontWeight: "400",
                          color: "red",
                        }}
                      >
                        <ErrorOutlineSharpIcon className="mr-1 " />
                        Chỉ có thể mua ngay với giá{" "}
                        {auctionData.maxPrice.toLocaleString("vi-VN")}đ. Không
                        thể ra giá nữa vì giá tối thiểu lớn hơn giá mua ngay.
                      </p>
                    )}
                    <div className="flex flex-col phone:flex-row items-center justify-between gap-4 mt-4">
                      <p
                        style={{
                          fontSize: "17px",
                          fontFamily: "REM",
                          fontWeight: "400",
                        }}
                      >
                        Số tiền cần cọc:{" "}
                        <span style={{ fontWeight: "bold" }}>
                          {typeof auctionData?.depositAmount === "number" &&
                            auctionData?.depositAmount.toLocaleString("vi-VN")}
                          &#8363;
                        </span>
                      </p>
                      {!auctionEnded && auctionData.status !== "UPCOMING" && (
                        <Chip
                          label="Đặt cọc tại đây"
                          onClick={handleOpenDepositModal}
                          style={{
                            backgroundColor: "#fff",
                            color: "#000",
                            fontFamily: "REM",
                            border: "1px solid black",
                            boxShadow: "2px 2px",
                          }}
                        />
                      )}
                    </div>
                  </div>
                ) : isHighest ? (
                  <div className="highest-bid-message REM mt-4">
                    Bạn là người có giá cao nhất!
                  </div>
                ) : (
                  !auctionEnded &&
                  auctionData.currentPrice + auctionData.priceStep <
                    auctionData.maxPrice && (
                    <div className="bid-row">
                      <input
                        type="text"
                        placeholder="đ"
                        className="bid-input REM"
                        value={
                          bidAmount
                            ? parseFloat(bidAmount).toLocaleString("vi-VN")
                            : bidAmount
                        }
                        onChange={(event) => {
                          let inputValue = event.target.value;

                          // Loại bỏ mọi ký tự không phải là số
                          inputValue = inputValue.replace(/[^\d]/g, "");

                          handleBidInputChange({
                            ...event,
                            target: {
                              ...event.target,
                              value: inputValue,
                            },
                          });
                        }}
                        disabled={isBidDisabled}
                        min={0}
                      />
                      <Popconfirm
                        title={
                          <Typography
                            style={{ fontSize: "18px", fontWeight: "500" }}
                          >
                            Bạn có chắc chắn muốn ra giá{" "}
                            <span style={{ fontWeight: "bold" }}>
                              {parseFloat(bidAmount).toLocaleString("vi-VN")}₫
                            </span>{" "}
                            không?
                          </Typography>
                        }
                        onConfirm={handlePlaceBid}
                        onCancel={() => console.log("Bid canceled")}
                        okText="Xác nhận"
                        cancelText="Hủy"
                        overlayStyle={{
                          width: "450px",
                          borderRadius: "12px",
                          padding: "20px",
                        }}
                        okButtonProps={{
                          style: {
                            backgroundColor: "#000",
                            color: "#fff",
                            fontSize: "18px",
                            fontWeight: "bold",
                            padding: "15px 30px",
                            borderRadius: "10px",
                            marginRight: "15px",
                          },
                        }}
                        cancelButtonProps={{
                          style: {
                            backgroundColor: "#fff",
                            color: "#000",
                            fontSize: "18px",
                            fontWeight: "bold",
                            padding: "15px 30px",
                            border: "2px solid #000",
                            borderRadius: "10px",
                          },
                        }}
                      >
                        <Button
                          variant="contained"
                          className="bid-button "
                          sx={{
                            width: "250px",
                            height: "60px",
                            fontSize: "20px",
                            fontWeight: "bold",
                          }}
                          disabled={isBidDisabled || !bidAmount || error !== ""}
                        >
                          <p className="REM">RA GIÁ</p>
                        </Button>
                      </Popconfirm>
                    </div>
                  )
                )}
              </>
            )}

            {error && <div className="REM error-message">{error}</div>}
            <div className="flex flex-col justify-between mt-4 mb-2">
              <div className="w-full px-5">
                {auctionData.status === "ONGOING" && hasDeposited ? (
                  <button
                    className="w-full text-white py-2 flex justify-center items-center bg-black rounded-lg"
                    onClick={() =>
                      handleBuy(auctionData, auctionData.maxPrice, "maxPrice")
                    }
                  >
                    <span className="flex items-center gap-2">
                      <p className="text-sm font-semibold leading-none REM">
                        MUA NGAY:
                      </p>
                      <p className="!text-2xl font-bold leading-none REM">
                        {auctionData.maxPrice.toLocaleString("vi-VN")} đ
                      </p>
                    </span>
                  </button>
                ) : auctionData.winner?.id === userId &&
                  auctionData.status === "SUCCESSFUL" ? (
                  <Button
                    variant="contained"
                    style={{
                      color: "#fff",
                      backgroundColor: "#000",
                      fontWeight: "500",
                      fontSize: "18px",
                      fontFamily: "REM",
                      marginTop: "-40px",
                    }}
                    className="w-full"
                    onClick={() =>
                      handleBuy(
                        auctionData,
                        auctionData?.currentPrice,
                        "currentPrice"
                      )
                    }
                  >
                    Thanh toán ngay
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          <AuctionPublisher comic={comic} />
        </div>

        <div className="my-4 col-span-12">
          <ComicsDescription currentComics={comic} fontSize="1rem" />
        </div>
      </div>
      <ModalDeposit
        open={isDepositModalOpen}
        onClose={handleCloseDepositModal}
        depositAmount={auctionData?.depositAmount}
        onDepositSuccess={handleDepositSuccess}
        auctionId={auctionData?.id}
      />
    </div>
  );
};
export default ComicAuction;
