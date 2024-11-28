import React, { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Typography, TablePagination, tableCellClasses, Box, TextField, InputAdornment } from "@mui/material";
import { privateAxios } from "../../middleware/axiosInstance";
import { styled } from "@mui/material/styles";
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

// Styled Components
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

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await privateAxios.get("/transactions/all");
        const formattedTransactions = response.data.map((transaction: any) => ({
          date: new Date(transaction.createdAt).toLocaleDateString("vi-VN"),
          userName: transaction.user?.name || "N/A",
          // type: transaction.amount > 0 ? "Nạp Tiền" : "Rút Tiền",
          type: transaction.type === "ADD" ? "Nạp Tiền" : "Thanh Toán",
          // amount: `${transaction.amount > 0 ? "+" : ""}${transaction.amount.toLocaleString("vi-VN")} đ`,
          // amount: `${transaction.type === "ADD" ? "+" : "-"}${Math.abs(transaction.amount).toLocaleString("vi-VN")} đ`,
          amount: transaction.amount,
          status: transaction.status,
          note: transaction.note || "Không có ghi chú",
        }));
        setTransactions(formattedTransactions);
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

  const filteredWallet = transactions.filter((transaction) =>
    transaction.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        {/* Search Box */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{ backgroundColor: '#c66a7a', borderRadius: '4px', color: '#fff', width: '300px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            style: { color: '#fff' },
          }}
        />
      </Box>
      <Typography
        variant="h5"
        sx={{ marginBottom: "20px", fontWeight: "bold", fontFamily: "REM", color: "#71002b" }}
      >
        Quản lý ví
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
                    <StyledTableCell align="right" style={getAmountStyle(transaction.amount, transaction.type)}>
                      {transaction.type === "Nạp Tiền" ? `+${transaction.amount.toLocaleString("vi-VN")}` : `-${Math.abs(transaction.amount).toLocaleString("vi-VN")}`} đ
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
