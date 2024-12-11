import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, tableCellClasses, Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { privateAxios } from "../../middleware/axiosInstance";
import { styled } from "@mui/material/styles";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { SelectChangeEvent } from '@mui/material/Select';
import { Transaction } from "../../common/interfaces/transaction.interface";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#c66a7a',
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'REM',
    fontSize: '1rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#000',
    fontFamily: 'REM',
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#fff',
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffe3d842',
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
}));

const ManageWallet: React.FC = () => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [transactionType, setTransactionType] = useState<string>('ALL');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await privateAxios.get("/transactions/all");
        const formattedTransactions = response.data.map((transaction: Transaction) => ({
          date: new Date(transaction.createdAt).toLocaleDateString("vi-VN"),
          originalCreatedAt: transaction.createdAt,
          userName: transaction.user?.name || "N/A",
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
          amount: `${transaction.type === "ADD" ? "+" : "-"
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
                  // ? `Nhận tiền đơn hàng (${transaction.note})`
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
        console.log("Trans", formattedTransactions);

      } catch (error) {
        console.error("Error fetching transactions:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      default:
        return {
          color: "#000",
          backgroundColor: "#eee",
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

  const getAmountStyle = (amount: number, type: string) => {
    if (type === "Nạp Tiền") {
      return {
        color: "#4caf50",
      };
    } else {
      return {
        color: "#e91e63",
      };
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleTransactionTypeChange = (event: SelectChangeEvent<string>) => {
    setTransactionType(event.target.value as string);
  };

  const filteredWallet = transactions.filter((transaction) =>
    (transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.type.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (transactionType === 'ALL' ||
      (transactionType === 'Nạp Tiền' && transaction.type === "Nạp tiền") ||
      (transactionType === 'Nhận Tiền' && transaction.type === "Nhận tiền") ||
      (transactionType === 'Rút Tiền' && transaction.type === "Rút tiền") ||
      (transactionType === 'Thanh Toán' && transaction.type === "Thanh toán"))
  )
    .sort((a, b) => {
      return new Date(b.originalCreatedAt).getTime() - new Date(a.originalCreatedAt).getTime();
    });

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        {/* Search Box */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm theo tên người dùng hoặc loại giao dịch..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{ backgroundColor: '#c66a7a', borderRadius: '4px', color: '#fff', width: '455px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            style: { color: '#fff', fontFamily: 'REM' },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Filter theo trạng thái */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px' }}>
            Trạng Thái:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <Select
              value={transactionType}
              onChange={handleTransactionTypeChange}
              sx={{ fontFamily: 'REM' }}
            >
              <MenuItem sx={{ fontFamily: 'REM' }} value="ALL">Tất cả</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="Nạp Tiền">Nạp Tiền</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="Nhận Tiền">Nhận Tiền</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="Rút Tiền">Rút Tiền</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="Thanh Toán">Thanh Toán</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Typography
        variant="h5"
        sx={{ marginBottom: "20px", fontWeight: "bold", fontFamily: "REM", color: "#71002b" }}
      >
        Quản lý giao dịch
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Ngày giao dịch</StyledTableCell>
                <StyledTableCell align="left">Tên Người Dùng</StyledTableCell>
                <StyledTableCell align="left">Loại giao dịch</StyledTableCell>
                <StyledTableCell align="right">Số Tiền</StyledTableCell>
                <StyledTableCell align="right">Trạng Thái</StyledTableCell>
                <StyledTableCell align="right">Ghi Chú</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <StyledTableCell colSpan={6} align="center">
                    Loading...
                  </StyledTableCell>
                </TableRow>
              ) : (
                filteredWallet.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((transaction, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>{transaction.date}</StyledTableCell>
                    <StyledTableCell align="left">{transaction.userName}</StyledTableCell>
                    <StyledTableCell align="left">{transaction.type}</StyledTableCell>
                    <StyledTableCell align="right" >
                      <span style={{
                        fontFamily: "REM",
                        color: transaction.amount.toString().startsWith("+")
                          ? "green"
                          : "red",
                      }}>
                        {transaction.amount}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <span style={getStatusChipStyles(transaction.status)}>
                        {translateStatus(transaction.status)}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">{transaction.note}</StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 15]}
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
          count={transactions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  );
};

export default ManageWallet;
