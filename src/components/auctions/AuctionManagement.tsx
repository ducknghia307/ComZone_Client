import React, { useEffect, useState } from "react";
import "../ui/AuctionManagement.css";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DoNotDisturbOutlinedIcon from "@mui/icons-material/DoNotDisturbOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { privateAxios } from "../../middleware/axiosInstance";
import AuctionModalEdit from "../comic/sellerManagement/AuctionModalEdit";
import { Auction } from "../../common/base.interface";
import { Modal, notification, Popconfirm } from "antd";
import {
  CheckCircleOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import AuctionDetailModalSeller from "../modal/AuctionDetailModalSeller";
import EmptyImage from "../../assets/notFound/emptybox.png";

const getStatusChipStyles = (status: string) => {
  switch (status) {
    case "SUCCESSFUL":
      return {
        color: "#4caf50",
        backgroundColor: "#e8f5e9",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "PENDING_APPROVAL":
      return {
        color: "#a64dff",
        backgroundColor: "#f2e6ff",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "UPCOMING":
      return {
        color: "#6226EF",
        backgroundColor: "#EDE7F6",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "PROCESSING":
      return {
        color: "#ff9800",
        backgroundColor: "#fff3e0",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "ONGOING":
      return {
        color: "#2196f3",
        backgroundColor: "#e3f2fd",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "FAILED":
      return {
        color: "#e91e63",
        backgroundColor: "#fce4ec",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "CANCELED":
      return {
        color: "#f44336",
        backgroundColor: "#ffebee",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    case "COMPLETED":
      return {
        color: "#009688",
        backgroundColor: "#e0f2f1",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
  }
};

const translateStatus = (status: string) => {
  switch (status) {
    case "SUCCESSFUL":
      return "Thành công";
    case "PENDING_APPROVAL":
      return "Chờ duyệt";
    case "UPCOMING":
      return "Sắp diễn ra";
    case "PROCESSING":
      return "Đang xử lí";
    case "ONGOING":
      return "Đang diễn ra";
    case "FAILED":
      return "Thất bại";
    case "CANCELED":
      return "Bị hủy";
    case "COMPLETED":
      return "Hoàn thành";
    default:
      return status;
  }
};

const AuctionManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState(null);
  const [openDetail, setOpenDetail] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  console.log(selectedAuction);

  const handleOpenDetail = (auction) => {
    setSelectedAuction(auction);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedAuction(null);
    setOpenDetail(false);
  };
  useEffect(() => {
    privateAxios
      .get("/auction/seller")
      .then((response) => {
        console.log("Auctions:", response.data);
        setAuctions(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEditClick = (auction: Auction) => {
    setSelectedAuction(auction);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAuction(null);
  };

  const handleModalSuccess = (updatedAuctionData: Auction) => {
    setAuctions((prevAuctions) =>
      prevAuctions.map((auction) =>
        auction.id === updatedAuctionData.id
          ? { ...auction, ...updatedAuctionData }
          : auction
      )
    );
    handleModalClose();
  };

  const handleStopAuctioning = async (auctionId: string) => {
    if (!auctionId) {
      notification.error({
        message: "Lỗi",
        description: "Không tìm thấy đấu giá để dừng.",
        duration: 5,
      });
      return;
    }

    try {
      // Stop the auction for the comic
      await privateAxios.patch(`/auction/${auctionId}/stop-auction`);

      // Update the seller subscription for stopping the auction
      await privateAxios.patch("seller-subscriptions/auction/stop", {
        quantity: 1,
      });

      // Notify success
      notification.success({
        key: "success",
        message: "Đã dừng đấu giá truyện",
        description: (
          <p>
            Truyện {selectedAuction?.comics?.title} đã được dừng đấu giá khỏi
            các trang tìm kiếm.
          </p>
        ),
        duration: 5,
      });

      // Fetch the updated auction list after stopping the auction
      const response = await privateAxios.get("/auction/seller");
      setAuctions(response.data); // Update auctions with the new data

      // Optionally, you can reset pagination to the first page
      setPage(0);
    } catch (error) {
      // Handle errors and notify the user
      console.error("Lỗi khi dừng bán truyện:", error);
      notification.error({
        message: "Lỗi",
        description: "Không thể dừng bán truyện. Vui lòng thử lại.",
        duration: 5,
      });
    }
  };

  const filteredAuctions = auctions.filter((auction) =>
    auction.comics.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const paginatedData = filteredAuctions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="REM w-full bg-white p-4 rounded-lg drop-shadow-lg flex flex-col">
      {auctions.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <img src={EmptyImage} alt="" className="w-32 bg-white" />
          <p>Bạn chưa đăng ký cuộc đấu giá nào!</p>
        </div>
      ) : (
        <>
          <Box sx={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <TextField
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                size="small"
                placeholder="Tìm kiếm theo tên truyện đấu giá..."
                variant="outlined"
                sx={{
                  width: "340px",
                  "& input::placeholder": {
                    fontFamily: "REM",
                  },
                }}
                slotProps={{
                  input: {
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchOutlinedIcon />
                      </InputAdornment>
                    ),
                  },
                }}
              />
            </div>
          </Box>
          <TableContainer
            component={Paper}
            className="auction-table-container"
            sx={{ border: "1px solid black" }}
          >
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "black" }}>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Ảnh Chính
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Tên Truyện
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Thời Gian Bắt Đầu
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Thời Gian Kết Thúc
                  </TableCell>

                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Giá Khởi Điểm
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Bước Giá Tối Thiểu
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Giá Hiện Tại
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  >
                    Trạng Thái Đấu Giá
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      whiteSpace: "nowrap",
                      fontFamily: "REM",
                    }}
                  ></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedData.map((auction, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">
                      <img
                        src={auction.comics.coverImage}
                        alt="Cover"
                        style={{ width: 70, height: 110, margin: "auto" }}
                      />
                    </TableCell>
                    <TableCell
                      style={{
                        whiteSpace: "normal",
                        width: "300px",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        wordWrap: "break-word",
                        fontFamily: "REM",
                      }}
                      align="center"
                      title={auction.comics.title}
                    >
                      <p
                        className="my-auto font-semibold"
                        style={{ whiteSpace: "nowrap" }}
                      >
                        {truncateText(auction.comics.title, 12)}
                      </p>
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                    >
                      {auction.startTime
                        ? new Date(auction.startTime).toLocaleString()
                        : "Chưa có"}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                    >
                      {auction.endTime
                        ? new Date(auction.endTime).toLocaleString()
                        : "Chưa có"}
                    </TableCell>

                    <TableCell align="center" sx={{ fontFamily: "REM" }}>
                      {auction?.reservePrice?.toLocaleString()} đ
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: "REM" }}>
                      {auction?.priceStep?.toLocaleString()} đ
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: "REM" }}>
                      {auction.currentPrice?.toLocaleString()} đ
                    </TableCell>
                    <TableCell align="center" sx={{ fontFamily: "REM" }}>
                      <span style={getStatusChipStyles(auction.status)}>
                        {translateStatus(auction.status)}
                      </span>
                    </TableCell>
                    <TableCell align="center">
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        {/* {auction.status === "CANCELED" && (
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(auction)}
                          >
                            <EditOutlinedIcon />
                          </IconButton>
                        )} */}

                        {auction.status === "UPCOMING" && (
                          <Popconfirm
                            title="Dừng phiên đấu giá"
                            description="Bạn có thực sự muốn dừng phiên đấu giá này?"
                            icon={
                              <QuestionCircleOutlined
                                style={{ color: "red" }}
                              />
                            }
                            onConfirm={() => handleStopAuctioning(auction.id)}
                            okText="Dừng"
                            cancelText="Thoát"
                            overlayClassName="custom-popconfirm"
                          >
                            <IconButton color="error">
                              <DoNotDisturbOutlinedIcon
                                onClick={() => {
                                  setSelectedAuction(auction);
                                }}
                              />
                            </IconButton>
                          </Popconfirm>
                        )}
                        <IconButton
                          color="primary"
                          onClick={() => handleOpenDetail(auction)}
                        >
                          <EyeOutlined />
                        </IconButton>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              component="div"
              count={auctions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}

      {selectedAuction && (
        <AuctionModalEdit
          open={isModalOpen}
          onCancel={handleModalClose}
          comic={selectedAuction.comics}
          auctionData={{
            id: selectedAuction.id,
            shopName: selectedAuction.shopName,
            productName: selectedAuction.productName,
            status: selectedAuction.status,
            imgUrl: selectedAuction.imgUrl,
            reservePrice: selectedAuction.reservePrice,
            depositAmount: selectedAuction.depositAmount,
            maxPrice: selectedAuction.maxPrice,
            priceStep: selectedAuction.priceStep,
            startTime: selectedAuction.startTime,
            endTime: selectedAuction.endTime,
            comics: selectedAuction.comics,
            createdAt: selectedAuction.createdAt,
          }}
          onSuccess={handleModalSuccess}
        />
      )}
      <AuctionDetailModalSeller
        open={openDetail}
        onClose={handleCloseDetail}
        auction={selectedAuction}
      />
    </div>
  );
};

export default AuctionManagement;
