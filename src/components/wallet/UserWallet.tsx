import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
  Box,
  IconButton,
  TablePagination,
  TextField,
} from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../ui/UserWallet.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DepositForm from "./DepositForm";
import { privateAxios } from "../../middleware/axiosInstance";
import { UserInfo } from "../../common/base.interface";
import CurrencySplitter from "../../assistants/Spliter";
import { useAppSelector } from "../../redux/hooks";
import { Transaction } from "../../common/interfaces/transaction.interface";
const UserWallet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [transactions, setTransactions] = useState([]);
  const userId = useAppSelector((state) => state.auth.userId);
  console.log("userid", userId);

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("/users/profile");
      const data = await response.data;
      setUserInfo(data);
    } catch {
      console.log("...");
    }
  };
  const fetchUserTransactions = async () => {
    try {
      const response = await privateAxios.get(`/transactions/user`, {
        params: { userId },
      });
      const data = await response.data;
      const formattedTransactions = data.map((transaction: Transaction) => ({
        date: new Date(transaction.createdAt ?? new Date()).toLocaleDateString(
          "vi-VN"
        ),
        type:
          (transaction.type === "ADD" &&
            (transaction.walletDeposit
              ? "Nạp tiền"
              : transaction.order
              ? "Nhận tiền"
              : "")) ||
          (transaction.walletDeposit &&
            transaction.type === "SUBTRACT" &&
            "Rút tiền") ||
          "Thanh toán",
        amount: `${
          transaction.type === "ADD" ? "+" : "-"
        }${transaction.amount.toLocaleString("vi-VN")} đ`,
        status: transaction.status,
        note:
          transaction.type === "SUBTRACT"
            ? transaction.order
              ? `Thanh toán đơn hàng #${transaction.code}`
              : transaction.exchange
              ? `Thanh toán trao đổi #${transaction.code}`
              : transaction.deposit
              ? `Tiền cọc trao đổi #${transaction.code}`
              : "Thông tin giao dịch không có sẵn"
            : transaction.type === "ADD"
            ? transaction.order
              ? `Nhận tiền đơn hàng #${transaction.code} (${transaction.note})`
              : transaction.exchange
              ? `Thanh toán tiền bù trao đổi #${transaction.code}`
              : transaction.deposit
              ? `Hoàn trả cọc #${transaction.code}`
              : transaction.walletDeposit
              ? "Nạp tiền vào ví"
              : "Thông tin giao dịch không có sẵn"
            : transaction.type === "SUBTRACT" && transaction.walletDeposit
            ? "Rút tiền từ ví"
            : "Thông tin giao dịch không có sẵn",
      }));
      setTransactions(formattedTransactions);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChangePage = (newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  useEffect(() => {
    fetchUserInfo();
    fetchUserTransactions();
  }, []);

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return {
          color: "#4caf50",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontSize: "12px",
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
      case "FAILED":
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
      case "SUCCESSFUL":
        return "Thành công";
      case "PENDING":
        return "Đang xử lí";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
    }
  };
  console.log(transactions);

  return (
    <div className="wallet-container">
      {showDepositForm && userInfo ? (
        <DepositForm
          onBack={() => setShowDepositForm(false)}
          userInfo={userInfo}
        />
      ) : showWithdrawForm ? (
        <Box>
          <IconButton onClick={() => setShowWithdrawForm(false)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h4"
            gutterBottom
            textAlign="center"
            fontWeight="bold"
          >
            RÚT TIỀN RA KHỎI VÍ
          </Typography>
          <div style={{ width: "600px", margin: "auto", paddingTop: "40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Số dư hiện tại:</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ color: "#FF8A00" }}>
                  {isVisible ? "1.000.000 đ" : "******** đ"}
                </Typography>
                <IconButton onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Box>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h6">Số dư có thể rút:</Typography>
              <Box display="flex" alignItems="center">
                <Typography variant="h6" sx={{ color: "#FF8A00" }}>
                  {isVisible ? "900.000 đ" : "****** đ"}
                </Typography>
                <IconButton onClick={() => setIsVisible(!isVisible)}>
                  {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
                </IconButton>
              </Box>
            </div>
            <Typography sx={{ color: "#FF8A00", textAlign: "center" }}>
              (Một phần số dư của bạn đang bị giữ lại do khoản cọc trong giao
              dịch.)
            </Typography>

            <div style={{ paddingTop: "20px" }}>
              <Typography sx={{ paddingBottom: "10px", fontWeight: "bold" }}>
                Nhập số tiền muốn rút:
              </Typography>
              <TextField
                variant="outlined"
                fullWidth
                InputProps={{
                  startAdornment: <Typography>đ</Typography>,
                }}
              />
            </div>
            <Typography
              sx={{
                paddingBottom: "10px",
                fontWeight: "bold",
                paddingTop: "20px",
              }}
            >
              Chọn phương thức rút tiền:
            </Typography>
            <Box display="flex" gap={3} sx={{ paddingLeft: "20px" }}>
              <img
                style={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  width: "70px",
                  height: "70px",
                }}
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                alt="ZaloPay"
              />
              <img
                style={{
                  border: "1px solid black",
                  borderRadius: "10px",
                  width: "70px",
                  height: "70px",
                }}
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLeYoMVenMbgWL1FxDJPKuQvJD6R0KdnXE7A&s"
                alt="VNPay"
                width={100}
              />
            </Box>
            <Button
              sx={{
                marginTop: 3,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
                color: "#fff",
                backgroundColor: "#000",
                padding: "5px 20px",
                fontSize: "16px",
              }}
            >
              TIẾN HÀNH RÚT TIỀN
            </Button>
          </div>
        </Box>
      ) : (
        <>
          <Typography
            sx={{
              fontSize: "30px",
              fontWeight: "bold",
              textAlign: "center",
              paddingBottom: "20px",
              fontFamily: "REM",
            }}
          >
            VÍ COMZONE
          </Typography>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={3}
          >
            <Box>
              <div style={{ display: "flex", marginRight: "20px" }}>
                <Typography variant="h6" mr={2} sx={{ fontFamily: "REM" }}>
                  Số dư hiện tại:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#FF8A00", fontFamily: "REM" }}
                >
                  {isVisible
                    ? `${CurrencySplitter(userInfo?.balance ?? 0)} đ`
                    : "****** đ"}
                </Typography>
                <IconButton onClick={() => setIsVisible(!isVisible)}>
                  <VisibilityOffIcon />
                </IconButton>
              </div>
              <div style={{ display: "flex", marginRight: "20px" }}>
                <Typography variant="h6" mr={2} sx={{ fontFamily: "REM" }}>
                  Hiện có thể rút:
                </Typography>
                <Typography
                  variant="h6"
                  sx={{ color: "#FF8A00", fontFamily: "REM" }}
                >
                  {isVisible
                    ? `${CurrencySplitter(
                        (userInfo?.balance ?? 0) -
                          (userInfo?.nonWithdrawableAmount ?? 0)
                      )} đ`
                    : "****** đ"}
                </Typography>
                <IconButton onClick={() => setIsVisible(!isVisible)}>
                  <VisibilityOffIcon />
                </IconButton>
              </div>
            </Box>

            <Box display="flex" gap={2}>
              <Button
                sx={{
                  backgroundColor: "#fff",
                  color: "#000",
                  border: "1px solid black",
                  padding: "5px 20px",
                  fontFamily: "REM",
                }}
                onClick={() => setShowWithdrawForm(true)}
              >
                Rút Tiền
              </Button>
              <Button
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  padding: "5px 20px",
                  fontFamily: "REM",
                }}
                onClick={() => setShowDepositForm(true)}
              >
                Nạp Tiền Vào Ví
              </Button>
            </Box>
          </Box>

          <TableContainer component={Paper} className="wallet-table-container">
            <Table>
              <TableHead>
                <TableRow style={{ backgroundColor: "black" }}>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "REM",
                    }}
                  >
                    Ngày giao dịch
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "REM",
                    }}
                  >
                    Loại giao dịch
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "REM",
                    }}
                  >
                    Số Tiền (đ)
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "REM",
                    }}
                  >
                    Trạng Thái
                  </TableCell>
                  <TableCell
                    style={{
                      color: "white",
                      textAlign: "center",
                      fontFamily: "REM",
                    }}
                  >
                    Ghi Chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map(
                  (transaction: Transaction, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ fontFamily: "REM" }} align="center">
                        {transaction.date}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "REM" }} align="center">
                        {transaction.type}
                      </TableCell>
                      <TableCell
                        sx={{
                          fontFamily: "REM",
                          color: transaction.amount.toString().startsWith("+")
                            ? "green"
                            : "red",
                        }}
                        align="center"
                      >
                        {transaction.amount}
                      </TableCell>

                      <TableCell sx={{ fontFamily: "REM" }} align="center">
                        <span style={getStatusChipStyles(transaction.status)}>
                          {translateStatus(transaction.status).toUpperCase()}
                        </span>
                      </TableCell>
                      <TableCell sx={{ fontFamily: "REM" }} align="center">
                        {transaction.note}
                      </TableCell>
                    </TableRow>
                  )
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[20, 50]}
              component="div"
              count={transactions.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </TableContainer>
        </>
      )}
    </div>
  );
};

export default UserWallet;
