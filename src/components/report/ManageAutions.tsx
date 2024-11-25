import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { privateAxios } from "../../middleware/axiosInstance";
import {
  Box,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AuctionDetailMod from "../modal/AuctionDetailMod";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Auction, UserInfo } from "../../common/base.interface";
interface Order {
  id: number;
  customerName: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: string;
}

interface SelectedAuction extends Auction {
  sellerInfo: UserInfo;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#c66a7a",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fff",
  "&:nth-of-type(odd)": {
    backgroundColor: "#ffe3d842", // Alternate rows with light pink shade
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const ManageAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  // const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] =
    useState<SelectedAuction | null>(null);

  // const openOrderDetail = (orderId: string) => {
  //   setSelectedOrderId(orderId);
  // };

  // const closeOrderDetail = () => {
  //   setSelectedOrderId(null);
  // };

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      try {
        const response = await privateAxios.get("/auction");
        const auctionsData = response.data;

        // Check if auctionsData is an array and has expected data
        if (!Array.isArray(auctionsData) || auctionsData.length === 0) {
          console.error("No auctions data or unexpected format:", auctionsData);
          setLoading(false);
          return;
        }

        setAuctions(auctionsData);
        console.log("Auctions:", auctionsData);
      } catch (error) {
        console.error("Error fetching auctions:", error);
      } finally {
        // Ensure loading is set to false after fetch completes or if an error occurs
        setLoading(false);
      }
    };

    fetchOrdersWithItems();
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

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAuction(null);
  };

  const handleEditClick = (auction: SelectedAuction) => {
    setSelectedAuction({
      ...auction,
      sellerInfo: auction.comics.sellerId ? auction.sellerInfo : null,
      comics: auction.comics,
    });
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    // Refresh or update the auctions data if necessary
    handleModalClose();
  };

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
      case "UPCOMING":
        return {
          color: "#6226EF",
          backgroundColor: "#EDE7F6",
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
      case "REJECTED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
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
      case "COMPLETED":
        return "Hoàn thành";
      case "UPCOMING":
        return "Sắp diễn ra";
      case "PROCESSING":
        return "Đang xử lí";
      case "ONGOING":
        return "Đang diễn ra";
      case "FAILED":
        return "Thất bại";
      case "REJECTED":
        return "Bị từ chối";
      default:
        return status;
    }
  };

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };

  return (
    <div style={{ paddingBottom: "40px" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        {/* Search Box */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          // value={searchTerm}
          // onChange={handleSearch}
          size="small"
          sx={{
            backgroundColor: "#c66a7a",
            borderRadius: "4px",
            color: "#fff",
            width: "300px",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: "#fff" }} />
              </InputAdornment>
            ),
            style: { color: "#fff" },
          }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "20px",
          fontWeight: "bold",
          fontFamily: "REM",
          color: "#71002b",
        }}
      >
        Quản lý đấu giá
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ fontFamily: "REM" }}>
                  Người Bán
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                >
                  Tên Truyện
                </StyledTableCell>
                <StyledTableCell
                  align="left"
                  style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                >
                  Trạng Thái Đấu Giá
                </StyledTableCell>
                {/* <StyledTableCell align="right" style={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Thời Gian Bắt Đầu</StyledTableCell>
                <StyledTableCell align="right" style={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Thời Gian Kết Thúc</StyledTableCell> */}
                <StyledTableCell
                  align="right"
                  style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                >
                  Giá Khởi Điểm
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                >
                  Bước Giá
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                >
                  Giá Hiện Tại
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                >
                  Chi Tiết
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                auctions
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((auction) => (
                    <React.Fragment key={auction.id}>
                      <StyledTableRow>
                        <StyledTableCell style={{ fontFamily: "REM" }}>
                          {auction.comics.sellerId.name}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ whiteSpace: "nowrap", fontFamily: "REM" }}
                        >
                          {truncateText(auction.comics.title, 20)}
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ fontFamily: "REM" }}
                        >
                          <span style={getStatusChipStyles(auction.status)}>
                            {translateStatus(auction.status)}
                          </span>
                        </StyledTableCell>
                        {/* <StyledTableCell align="left" style={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>
                        {new Date(auction.startTime).toLocaleString()}
                      </StyledTableCell>
                      <StyledTableCell align="left" style={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>
                        {new Date(auction.endTime).toLocaleString()}
                      </StyledTableCell> */}
                        <StyledTableCell
                          align="left"
                          style={{ fontFamily: "REM" }}
                        >
                          {auction.reservePrice.toLocaleString()} đ
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ fontFamily: "REM" }}
                        >
                          {auction.priceStep.toLocaleString()} đ
                        </StyledTableCell>
                        <StyledTableCell
                          align="left"
                          style={{ fontFamily: "REM" }}
                        >
                          {auction.currentPrice?.toLocaleString()} đ
                        </StyledTableCell>
                        <StyledTableCell align="left">
                          <IconButton
                            color="default"
                            onClick={() =>
                              handleEditClick(auction as SelectedAuction)
                            }
                          >
                            <InfoOutlinedIcon />
                          </IconButton>
                        </StyledTableCell>
                      </StyledTableRow>
                    </React.Fragment>
                  ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={auctions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {selectedAuction && (
        <AuctionDetailMod
          // onClose={onclose}
          open={isModalOpen}
          onCancel={handleModalClose}
          comic={selectedAuction.comics}
          auctionData={{
            reservePrice: selectedAuction.reservePrice,
            maxPrice: selectedAuction.maxPrice,
            priceStep: selectedAuction.priceStep,
            startTime: selectedAuction.startTime,
            endTime: selectedAuction.endTime,
            currentPrice: selectedAuction.currentPrice,
            sellerInfo: selectedAuction.sellerInfo,
            status: selectedAuction.status,
          }}
          onSuccess={handleModalSuccess}
        />
      )}
    </div>
  );
};

export default ManageAuctions;
