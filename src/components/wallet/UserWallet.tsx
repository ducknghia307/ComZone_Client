/* eslint-disable react-hooks/exhaustive-deps */
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
import displayPastTimeFromNow from "../../utils/displayPastTimeFromNow";
import { notification, Tooltip } from "antd";
import WithdrawalForm from "./WithdrawalForm";
const UserWallet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [showSOFs, setShowSOFs] = useState(false);
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
      console.log(data);
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
      console.log("1", data);
      const formattedTransactions = data.map((transaction: Transaction) => ({
        code: transaction.code,
        createdAt: transaction.createdAt,
        type:
          (transaction.type === "ADD" &&
            (transaction.walletDeposit
              ? "Nạp tiền"
              : transaction.order
              ? "Nhận tiền"
              : "")) ||
          (transaction.withdrawal &&
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
              ? `Thanh toán đơn hàng`
              : transaction.exchange
              ? `Thanh toán trao đổi`
              : transaction.deposit?.exchange
              ? `Tiền cọc trao đổi`
              : transaction.deposit?.auction
              ? `Tiền cọc đấu giá`
              : transaction.sellerSubscription
              ? `Mua gói bán ComZone`
              : transaction.withdrawal
              ? `Rút tiền về tài khoản ngân hàng`
              : "Thông tin giao dịch không có sẵn"
            : transaction.type === "ADD"
            ? transaction.order
              ? `Nhận tiền đơn hàng`
              : transaction.exchange
              ? `Thanh toán tiền bù trao đổi`
              : transaction.deposit?.exchange
              ? `Hoàn trả cọc`
              : transaction.deposit?.auction &&
                transaction.deposit.status === "REFUNDED"
              ? `Hoàn trả cọc đấu giá`
              : transaction.deposit?.auction &&
                transaction.deposit.status === "SEIZED"
              ? `Hoàn trả cọc đấu giá do người dùng không thanh toán`
              : transaction.walletDeposit
              ? "Nạp tiền vào ví"
              : "Thông tin giao dịch không có sẵn"
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
          fontWeight: "bold",
          display: "inline-block",
          fontSize: "12px",
        };
      case "PENDING":
        return {
          color: "#ff9800",
          fontWeight: "bold",
          display: "inline-block",
          fontSize: "12px",
        };
      case "FAILED":
        return {
          color: "#ff0000",
          fontWeight: "bold",
          display: "inline-block",
          fontSize: "12px",
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

  if (!userInfo) return;

  return (
    <div className="wallet-container">
      {showDepositForm && userInfo ? (
        <DepositForm
          onBack={() => {
            fetchUserInfo();
            fetchUserTransactions();
            setShowDepositForm(false);
          }}
          userInfo={userInfo}
        />
      ) : showWithdrawForm ? (
        <WithdrawalForm
          onBack={() => {
            fetchUserInfo();
            fetchUserTransactions();
            setShowWithdrawForm(false);
          }}
          user={userInfo}
        />
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
            {/* <Box> */}
            {/* {userInfo.role === "SELLER" && (
                <div
                  style={{
                    display: "flex",
                    marginRight: "20px",
                    alignItems: "center",
                  }}
                >
                  <Typography variant="h6" mr={2} sx={{ fontFamily: "REM" }}>
                    Số dư chưa thể sử dụng:
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ color: "#FF8A00", fontFamily: "REM" }}
                  >
                    {isVisible
                      ? `${
                          userInfo.nonWithdrawableAmount > 0
                            ? CurrencySplitter(userInfo.nonWithdrawableAmount)
                            : 0
                        } đ`
                      : "****** đ"}
                  </Typography>
                  <IconButton onClick={() => setIsVisible(!isVisible)}>
                    <VisibilityOffIcon />
                  </IconButton>

                  {userInfo.nonWithdrawableAmount > 0 && (
                    <Tooltip
                      trigger={"hover"}
                      title={
                        <p className="REM text-black">
                          Bạn đang có đơn hàng chưa xác nhận thành công, hệ
                          thống sẽ giữ khoản tiền bằng tổng giá trị đơn hàng cho
                          tới khi đơn hàng được người mua xác nhận.
                        </p>
                      }
                      color="white"
                      className="ml-4"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"></path>
                      </svg>
                    </Tooltip>
                  )}
                </div>
              )} */}
            {/* </Box> */}

            <div className="REM flex flex-row-reverse items-stretch gap-1 py-2">
              <button
                onClick={() => setIsVisible(!isVisible)}
                className="px-4 border border-gray-500 rounded-md duration-200 hover:bg-gray-100"
              >
                {isVisible
                  ? `SỐ DƯ KHẢ DỤNG: ${
                      userInfo.balance > 0
                        ? CurrencySplitter(userInfo.balance)
                        : 0
                    }đ`
                  : "XEM SỐ DƯ KHẢ DỤNG"}
              </button>

              <button
                onClick={() => {
                  setShowWithdrawForm(true);
                }}
                className="px-4 border border-gray-500 rounded-md duration-200 hover:bg-gray-100"
              >
                RÚT TIỀN
              </button>

              <button
                onClick={() => setShowDepositForm(true)}
                className="px-4 bg-black text-white uppercase py-2 rounded-md duration-200 hover:bg-gray-800"
              >
                Nạp Tiền Vào Ví
              </button>
            </div>
          </Box>

          {transactions.length > 0 ? (
            <TableContainer
              component={Paper}
              className="wallet-table-container"
            >
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
                      Mã giao dịch
                    </TableCell>
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
                          #{transaction.code}
                        </TableCell>
                        <TableCell sx={{ fontFamily: "REM" }} align="center">
                          {displayPastTimeFromNow(transaction.createdAt)}
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
          ) : (
            <p className="w-full text-center REM uppercase text-xl font-light opacity-50 py-[10vh]">
              Chưa có giao dịch nào
            </p>
          )}
        </>
      )}
    </div>
  );
};

export default UserWallet;
