import React, { useEffect, useState } from "react";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TablePagination,
  IconButton,
  TextField,
  InputAdornment,
  Box,
} from "@mui/material";
import {
  EditOutlined as EditOutlinedIcon,
  DoNotDisturbOutlined as DoNotDisturbOutlinedIcon,
  VisibilityOutlined as EyeOutlined,
} from "@mui/icons-material";
import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { privateAxios } from "../../middleware/axiosInstance";
import AuctionRequestModalSeller from "../modal/AuctionRequestModalSeller";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const AuctionRequestManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [auctionRequest, setAuctionRequest] = useState([]);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedAuctionRequest, setSelectedAuctionRequest] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");

  const filteredAuctions = auctionRequest.filter((auction) =>
    auction.comic.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const paginatedData = filteredAuctions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const fetchAuctionRequest = async () => {
      try {
        const response = await privateAxios.get("/auction-request");
        console.log("auction-request", response.data);

        setAuctionRequest(response.data);
      } catch (error) {
        console.error("Failed to fetch auction requests:", error);
      }
    };
    fetchAuctionRequest();
  }, []);

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case "REJECTED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "PENDING":
        return {
          color: "#a64dff",
          backgroundColor: "#f2e6ff",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };

      case "APPROVED":
        return {
          color: "#3f51b5",
          backgroundColor: "#e8eaf6",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "REJECTED":
        return "Bị từ chối";
      case "PENDING":
        return "Chờ duyệt";
      case "APPROVED":
        return "Đã duyệt";
      default:
        return status;
    }
  };
  const truncateText = (text: string, maxLength: number) => {
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // const handleOpenDetail = (auctionRequest) => {
  //   console.log("Detail opened for:", auctionRequest);
  // };

  const handleOpenDetail = (auctionRequest) => {
    setSelectedAuctionRequest(auctionRequest);
    setOpenDetail(true);
  };

  const handleCloseDetail = () => {
    setSelectedAuctionRequest(null);
    setOpenDetail(false);
  };

  return (
    <div className="REM w-full bg-white p-4 rounded-lg drop-shadow-lg flex flex-col">
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
              {[
                "Ảnh Chính",
                "Tên Truyện",
                "Thời Lượng",
                "Giá Khởi Điểm",
                "Bước Giá Tối Thiểu",
                "Giá Mua Ngay",
                "Trạng Thái",
                "",
              ].map((header, index) => (
                <TableCell
                  key={index}
                  style={{
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                    fontFamily: "REM"
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((auctionRequest, index) => (
              <TableRow key={index}>
                <TableCell align="center">
                  <img
                    src={auctionRequest.comic.coverImage}
                    alt="Cover"
                    style={{ width: 70, height: 100, margin: "auto" }}
                  />
                </TableCell>
                <TableCell
                  style={{
                    whiteSpace: "normal",
                    width: "300px",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    wordWrap: "break-word",
                    fontFamily: "REM"
                  }}
                  align="center"
                  title={auctionRequest.comic.title}
                >
                  <p className="my-auto font-semibold">
                    {truncateText(auctionRequest.comic.title, 20)}
                  </p>
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "REM" }}>
                  {auctionRequest?.duration} Ngày
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "REM" }}>
                  {auctionRequest.reservePrice?.toLocaleString()} đ
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "REM" }}>
                  {auctionRequest.priceStep?.toLocaleString()} đ
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "REM" }}>
                  {auctionRequest.maxPrice?.toLocaleString()} đ
                </TableCell>
                <TableCell align="center" sx={{ fontFamily: "REM" }}>
                  <span style={getStatusChipStyles(auctionRequest.status)}>
                    {translateStatus(auctionRequest.status)}
                  </span>
                </TableCell>
                <TableCell align="center">
                  <div style={{ display: "flex", justifyContent: "center" }}>
                    <IconButton
                      color="primary"
                      onClick={() => handleOpenDetail(auctionRequest)}
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
          count={auctionRequest.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {selectedAuctionRequest && (
        <AuctionRequestModalSeller
          open={openDetail}
          onClose={handleCloseDetail}
          auctionRequest={selectedAuctionRequest}
        />
      )}
    </div>
  );
};

export default AuctionRequestManagement;
