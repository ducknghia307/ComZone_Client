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
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import RefundModal from "../modal/RefundModal";
import { privateAxios } from "../../middleware/axiosInstance";
import { RefundRequest } from "../../common/interfaces/refund-request.interface";
import { Avatar } from "antd";

interface Order {
  id: string;
  cancelReason: string | null;
  createdAt: string;
  deletedAt: string | null;
  isFeedback: boolean;
  isPaid: boolean;
  note: string;
  paymentMethod: string;
  status: string;
  totalPrice: number;
  type: string;
  updatedAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  balance: number;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface RefundDetails {
  name: string;
  orderId: string;
  reason: string;
  images: string[] | null;
  description: string;
  createdAt: string;
  exchangeId: string;
  requestId: string;
}

interface RefundModalProps {
  open: boolean;
  onClose: () => void;
  refundDetails: RefundDetails | null;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#c66a7a",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "1rem",
    fontFamily: "REM",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    fontFamily: "REM",
    color: "#000",
  },
}));

const StyledTableRow = styled(TableRow)(() => ({
  backgroundColor: "#fff",
  "&:nth-of-type(odd)": {
    backgroundColor: "#ffe3d842",
  },
}));

const StyledTablePagination = styled(TablePagination)(() => ({
  backgroundColor: "#fff",
  color: "#000",
}));

const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "Asia/Ho_Chi_Minh",
  }).format(date);
};

const ManageRefunds: React.FC = () => {
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");

  const fetchRefundRequests = async () => {
    try {
      const response = await privateAxios.get("/refund-requests/all");
      setRefundRequests(response.data);
      console.log("refunds", response.data);
    } catch (err) {
      console.error("Error fetching refund requests:", err);
      setError("Không thể tải danh sách yêu cầu hoàn tiền");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRefundRequests();
  }, []);

  const handleOpenModal = (refund: RefundRequest) => {
    setSelectedRefund(refund);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedRefund(null);
  };

  const handleApprove = () => {
    handleCloseModal();
    fetchRefundRequests();
  };

  const handleReject = (reason: string) => {
    handleCloseModal();
    fetchRefundRequests();
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return <CircularProgress sx={{ display: "block", margin: "50px auto" }} />;
  }

  if (error || !refundRequests) {
    return (
      <Typography sx={{ color: "red", textAlign: "center", marginTop: "50px" }}>
        {error}
      </Typography>
    );
  }

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredRefunds = refundRequests.filter((refundRequest) =>
    refundRequest.user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case "APPROVED":
        return {
          color: "#4caf50",
          backgroundColor: "#e8f5e9",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "PENDING":
        return {
          color: "#ff9800",
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "REJECTED":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "Thành công";
      case "PENDING":
        return "Đang xử lí";
      case "REJECTED":
        return "Bị từ chối";
      default:
        return status;
    }
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
          placeholder="Tìm kiếm theo tên người dùng..."
          value={searchTerm}
          onChange={handleSearch}
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
        Quản lý hoàn tiền
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="refunds table">
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                  Loại
                </StyledTableCell>
                <StyledTableCell sx={{ whiteSpace: "nowrap" }}>
                  Tên Người Dùng
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  Thời Gian
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  Lý Do
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  Chi Tiết Lý Do
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  Hình Ảnh
                </StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                  Trạng Thái
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  sx={{ whiteSpace: "nowrap" }}
                ></StyledTableCell>
              </TableRow>
            </TableHead>
            {/* <TableBody>
              {filteredRefunds.length > 0 &&
                filteredRefunds
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((refund) => (
                    <StyledTableRow key={refund.id}>
                      <StyledTableCell>
                        {refund.order
                          ? `Đơn hàng #${refund.order.code}`
                          : "Trao đổi truyện"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Avatar src={refund.user.avatar} alt="" />{" "}
                        {refund.user.name}
                      </StyledTableCell>
                      <StyledTableCell
                        align="right"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        {formatDateTime(refund.createdAt?.toString())}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {refund.reason.length > 50
                          ? `${refund.reason.substring(0, 50)}...`
                          : refund.reason}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {refund.description.length > 50
                          ? `${refund.description.substring(0, 50)}...`
                          : refund.description}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <div style={{ textAlign: "center" }}>
                          {refund.attachedImages?.length > 0 ? (
                            <span>{refund.attachedImages.length} ảnh</span>
                          ) : (
                            <span
                              style={{ fontStyle: "italic", color: "#999" }}
                            >
                              Không có hình ảnh
                            </span>
                          )}
                        </div>
                      </StyledTableCell>

                      <StyledTableCell
                        align="right"
                        sx={{ whiteSpace: "nowrap" }}
                      >
                        <span style={getStatusChipStyles(refund.status)}>
                          {translateStatus(refund.status)}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <button
                          onClick={() => handleOpenModal(refund)}
                          className="min-w-fit relative"
                        >
                          <p className="REM lg:whitespace-nowrap border border-gray-400 rounded-md px-2 py-1 duration-200 hover:bg-gray-100">
                            Xem chi tiết
                          </p>

                          {refund.status === "PENDING" && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full translate-x-0.5 -translate-y-0.5"></span>
                          )}
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
            </TableBody> */}
            <TableBody>
              {filteredRefunds.length > 0 ? (
                filteredRefunds
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((refund) => (
                    <StyledTableRow key={refund.id}>
                      <StyledTableCell>
                        {refund.order
                          ? `Đơn hàng #${refund.order.code}`
                          : "Trao đổi truyện"}
                      </StyledTableCell>
                      <StyledTableCell>
                        <Avatar src={refund.user.avatar} alt="" /> {refund.user.name}
                      </StyledTableCell>
                      <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        {formatDateTime(refund.createdAt?.toString())}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {refund.reason.length > 50
                          ? `${refund.reason.substring(0, 50)}...`
                          : refund.reason}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {refund.description.length > 50
                          ? `${refund.description.substring(0, 50)}...`
                          : refund.description}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <div style={{ textAlign: "center" }}>
                          {refund.attachedImages?.length > 0 ? (
                            <span>{refund.attachedImages.length} ảnh</span>
                          ) : (
                            <span style={{ fontStyle: "italic", color: "#999" }}>
                              Không có hình ảnh
                            </span>
                          )}
                        </div>
                      </StyledTableCell>

                      <StyledTableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                        <span style={getStatusChipStyles(refund.status)}>
                          {translateStatus(refund.status)}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <button
                          onClick={() => handleOpenModal(refund)}
                          className="min-w-fit relative"
                        >
                          <p className="REM lg:whitespace-nowrap border border-gray-400 rounded-md px-2 py-1 duration-200 hover:bg-gray-100">
                            Xem chi tiết
                          </p>

                          {refund.status === "PENDING" && (
                            <span className="absolute top-0 right-0 w-2 h-2 bg-red-600 rounded-full translate-x-0.5 -translate-y-0.5"></span>
                          )}
                        </button>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))
              ) : (
                <TableRow>
                  <StyledTableCell colSpan={8} align="center" style={{ fontFamily: "REM", color: "#555" }}>
                    Không có yêu cầu hoàn tiền nào.
                  </StyledTableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 15]}
          count={refundRequests.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        />
      </Paper>
      <RefundModal
        open={isModalOpen}
        onClose={handleCloseModal}
        refundRequest={selectedRefund}
        onApprove={handleApprove}
        onReject={handleReject}
        fetchRefundRequests={fetchRefundRequests}
      />
    </div>
  );
};

export default ManageRefunds;
