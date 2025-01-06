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
} from "@mui/material";
import {
  EditOutlined as EditOutlinedIcon,
  DoNotDisturbOutlined as DoNotDisturbOutlinedIcon,
  VisibilityOutlined as EyeOutlined,
} from "@mui/icons-material";
import { Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";
import { privateAxios } from "../../middleware/axiosInstance";

const AuctionRequestManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [auctionRequest, setAuctionRequest] = useState([]);

  const paginatedData = auctionRequest.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  useEffect(() => {
    const fetchAuctionRequest = async () => {
      try {
        const response = await privateAxios.get("/auction-request");
        console.log("1", response.data);

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

  const handleOpenDetail = (auctionRequest) => {
    console.log("Detail opened for:", auctionRequest);
  };

  return (
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
                }}
                align="center"
                title={auctionRequest.comic.title}
              >
                <p className="my-auto font-semibold">
                  {auctionRequest.comic.title}
                </p>
              </TableCell>

              <TableCell align="center">
                {auctionRequest?.duration} Ngày
              </TableCell>
              <TableCell align="center">
                {auctionRequest.reservePrice.toLocaleString()} đ
              </TableCell>
              <TableCell align="center">
                {auctionRequest.priceStep.toLocaleString()} đ
              </TableCell>
              <TableCell align="center">
                {auctionRequest.maxPrice?.toLocaleString()} đ
              </TableCell>
              <TableCell align="center">
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
  );
};

export default AuctionRequestManagement;
