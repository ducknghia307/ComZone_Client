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
import { BaseInterface } from "../../common/base.interface";

const transactions = [
  {
    date: "01/10/2024",
    type: "Nạp Tiền",
    amount: "+ 100.000",
    status: "Đang xử lý",
    note: "Nạp qua VNPay",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 100.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 50.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Nạp Tiền",
    amount: "+ 250.000",
    status: "Hoàn Tất",
    note: "Nạp qua ZaloPay",
  },
  {
    date: "01/10/2024",
    type: "Nạp Tiền",
    amount: "+ 500.000",
    status: "Hoàn Tất",
    note: "Nạp qua ZaloPay",
  },
  {
    date: "01/10/2024",
    type: "Nạp Tiền",
    amount: "+ 300.000",
    status: "Hoàn Tất",
    note: "Nạp qua VNPay",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 70.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 70.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 70.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 70.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 70.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
  {
    date: "01/10/2024",
    type: "Rút Tiền",
    amount: "- 70.000",
    status: "Hoàn Tất",
    note: "Rút về tài khoản ngân hàng",
  },
];
interface Wallet extends BaseInterface {
  balance: number;
  nonWithdrawableAmount: number;
  status: number;
}
const UserWallet = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [showDepositForm, setShowDepositForm] = useState(false);
  const [showWithdrawForm, setShowWithdrawForm] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [userWallet, setUserWallet] = useState<Wallet | null>(null);
  const fetchUserWallet = async () => {
    try {
      const response = await privateAxios("/wallets/user");
      const data = await response.data;
      setUserWallet(data);
    } catch {
      console.log("...");
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
    fetchUserWallet();
  }, []);
  return (
    <div className="wallet-container">
      {showDepositForm ? (
        <DepositForm
          onBack={() => setShowDepositForm(false)}
          userWallet={userWallet}
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
                <Typography variant="h6" mr={2}>
                  Số dư hiện tại:
                </Typography>
                <Typography variant="h6" sx={{ color: "#FF8A00" }}>
                  {isVisible ? "1.000.000 đ" : "****** đ"}
                </Typography>
                <IconButton onClick={() => setIsVisible(!isVisible)}>
                  <VisibilityOffIcon />
                </IconButton>
              </div>
              <div style={{ display: "flex", marginRight: "20px" }}>
                <Typography variant="h6" mr={2}>
                  Hiện có thể rút:
                </Typography>
                <Typography variant="h6" sx={{ color: "#FF8A00" }}>
                  {isVisible ? "500.000 đ" : "****** đ"}
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
                }}
                onClick={() => setShowWithdrawForm(true)}
              >
                Rút Tiền
              </Button>
              <Button
                sx={{
                  backgroundColor: "#004F7A",
                  color: "#fff",
                  padding: "5px 20px",
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
                  <TableCell style={{ color: "white", textAlign: "center" }}>
                    Ngày giao dịch
                  </TableCell>
                  <TableCell style={{ color: "white", textAlign: "center" }}>
                    Loại giao dịch
                  </TableCell>
                  <TableCell style={{ color: "white", textAlign: "center" }}>
                    Số Tiền (đ)
                  </TableCell>
                  <TableCell style={{ color: "white", textAlign: "center" }}>
                    Trạng Thái
                  </TableCell>
                  <TableCell style={{ color: "white", textAlign: "center" }}>
                    Ghi Chú
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedTransactions.map((transaction, index) => (
                  <TableRow key={index}>
                    <TableCell align="center">{transaction.date}</TableCell>
                    <TableCell align="center">{transaction.type}</TableCell>
                    <TableCell align="center">{transaction.amount}</TableCell>
                    <TableCell align="center">{transaction.status}</TableCell>
                    <TableCell align="center">{transaction.note}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[5, 10]}
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
