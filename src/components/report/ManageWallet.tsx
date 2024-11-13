import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, Button, Box, IconButton, TablePagination, TextField, } from "@mui/material";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "../ui/UserWallet.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { privateAxios } from "../../middleware/axiosInstance";
import { BaseInterface, UserInfo } from "../../common/base.interface";
import CurrencySplitter from "../../assistants/Spliter";
import { useAppSelector } from "../../redux/hooks";
const ManageWallet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [transactions, setTransactions] = useState([]);
  const userId = useAppSelector((state) => state.auth.userId);
  console.log("userid", userId);

  const fetchUserTransactions = async () => {
    try {
      const response = await privateAxios.get("/transactions/all");
      const data = await response.data;
      // Transform the API response data to match table columns
      const formattedTransactions = data.map((transaction) => ({
        date: new Date(transaction.createdAt).toLocaleDateString("vi-VN"),
        userName: transaction.user?.name,
        type: transaction.amount > 0 ? "Nạp Tiền" : "Rút Tiền",
        amount: `${transaction.amount > 0 ? "+" : ""}${transaction.amount.toLocaleString("vi-VN")} đ`,
        status: transaction.status,
        note: transaction.note || "Không có ghi chú",
      }));
      setTransactions(formattedTransactions);
      console.log("transactions", response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedTransactions = transactions.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  useEffect(() => {
    fetchUserTransactions()
  }, []);

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case 'SUCCESSFUL':
        return { color: '#4caf50', backgroundColor: '#e8f5e9', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
      case 'PENDING':
        return { color: '#ff9800', backgroundColor: '#fff3e0', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block', };
      case 'FAILED':
        return { color: '#e91e63', backgroundColor: '#fce4ec', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case 'SUCCESSFUL': return 'Thành công';
      case 'PENDING': return 'Đang xử lí';
      case 'FAILED': return 'Thất bại';
      default: return status;
    }
  };

  return (
    <div className="wallet-container">
      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM' }}>
        Quản lý đấu giá
      </Typography>
      <TableContainer component={Paper} className="wallet-table-container">
        <Table>
          <TableHead>
            <TableRow style={{ backgroundColor: "black" }}>
              <TableCell style={{ color: "white", textAlign: "center", fontFamily: 'REM' }}>
                Ngày giao dịch
              </TableCell>
              <TableCell style={{ color: "white", textAlign: "center", fontFamily: 'REM' }}>
                Tên Người Dùng
              </TableCell>
              <TableCell style={{ color: "white", textAlign: "center", fontFamily: 'REM' }}>
                Loại giao dịch
              </TableCell>
              <TableCell style={{ color: "white", textAlign: "center", fontFamily: 'REM' }}>
                Số Tiền (đ)
              </TableCell>
              <TableCell style={{ color: "white", textAlign: "center", fontFamily: 'REM' }}>
                Trạng Thái
              </TableCell>
              <TableCell style={{ color: "white", textAlign: "center", fontFamily: 'REM' }}>
                Ghi Chú
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedTransactions.map((transaction, index) => (
              <TableRow key={index}>
                <TableCell sx={{ fontFamily: 'REM' }} align="center">{transaction.date}</TableCell>
                <TableCell sx={{ fontFamily: 'REM' }} align="center">{transaction.userName}</TableCell>
                <TableCell sx={{ fontFamily: 'REM' }} align="center">{transaction.type}</TableCell>
                <TableCell sx={{ fontFamily: 'REM' }} align="center">{transaction.amount}</TableCell>
                <TableCell sx={{ fontFamily: 'REM' }} align="center">
                  <span style={getStatusChipStyles(transaction.status)}>
                    {translateStatus(transaction.status)}
                  </span>
                </TableCell>
                <TableCell sx={{ fontFamily: 'REM' }} align="center">{transaction.note}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 20]}
          component="div"
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </div>
  )
}


export default ManageWallet;
