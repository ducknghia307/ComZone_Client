import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { privateAxios } from '../../middleware/axiosInstance';
import { Avatar, Box, FormControl, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModalExchangeDetail from '../modal/ModalExchangeDetail';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { UserInfo } from '../../common/base.interface';
import ModalExchangeUser from '../modal/ModalExchangeUser';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#c66a7a',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#fff',
}));

const ManageExchanges: React.FC = () => {
  const [exchanges, setExchanges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedExchangeId, setSelectedExchangeId] = useState<string | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRequester, setFilterRequester] = useState('ALL');
  const [filterPoster, setFilterPoster] = useState('ALL');
  const [filterExchangeStatus, setFilterExchangeStatus] = useState('ALL');
  const [filterPostStatus, setFilterPostStatus] = useState('ALL');
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);

  const openExchangeDetail = async (exchangeId: string) => {
    try {
      const response = await privateAxios.get(`/exchanges/${exchangeId}`);
      setSelectedExchange(response.data);
      setSelectedExchangeId(exchangeId);
      console.log("Selected exchange", response.data);

    } catch (error) {
      console.error('Error fetching exchange details:', error);
    }
  };

  const closeExchangeDetail = () => {
    setSelectedExchangeId(null);
    setSelectedExchange(null);
  };

  useEffect(() => {
    const fetchExchanges = async () => {
      try {
        const response = await privateAxios.get("/exchanges/all");
        const exchangesData = response.data;

        if (!Array.isArray(exchangesData)) {
          console.error("Unexpected response format:", exchangesData);
          setLoading(false);
          return;
        }

        setExchanges(exchangesData);
        console.log("Exchanges", exchangesData);

      } catch (error) {
        console.error("Error fetching exchanges:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExchanges();
  }, []);

  const formatCurrency = (amount: number | string) => {
    if (amount === null || amount === undefined) return "Không có";
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(Number(amount));
    return `${formattedAmount} đ`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return {
          color: '#f89b28',
          backgroundColor: '#fff2c9',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "DEALING":
        return {
          color: '#ff6b1c',
          backgroundColor: '#ffe8db',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "DELIVERING":
        return {
          color: '#52a7bf',
          backgroundColor: '#daf4ff',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "SUCCESSFUL":
        return {
          color: '#fef6c7',
          backgroundColor: '#395f18',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "FAILED":
        return {
          color: '#e91e63',
          backgroundColor: '#fce4ec',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "REJECTED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "AVAILABLE":
        return {
          color: '#4CAF50',
          backgroundColor: '#e8f5e9',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "UNAVAILABLE":
        return {
          color: '#FF9800',
          backgroundColor: '#FFF3E0',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "DONE":
        return {
          color: '#2196F3',
          backgroundColor: '#e3f2fd',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      default:
        return {
          color: '#000',
          backgroundColor: '#fff',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lí";
      case "DEALING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang giao hàng";
      case "SUCCESSFUL":
        return "Hoàn tất";
      case "REJECTED":
        return "Bị từ chối";
      case "FAILED":
        return "Thất bại";
      case "AVAILABLE":
        return "Đang được đăng";
      case "UNAVAILABLE":
        return "Không được đăng";
      case "DONE":
        return "Đã xong";
      default:
        return "Tất cả";
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const filteredExchanges = exchanges.filter((exchange) => {
    // Apply exchange status filter
    const exchangeStatusMatch =
      filterExchangeStatus === 'ALL' || exchange.status === filterExchangeStatus;

    // Apply post status filter
    const postStatusMatch =
      filterPostStatus === 'ALL' || exchange.post.status === filterPostStatus;

    // Apply search term filter
    const searchMatch =
      exchange.requestUser.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exchange.post.user.name.toLowerCase().includes(searchTerm.toLowerCase());

    // Return exchange only if all filters match
    return exchangeStatusMatch && postStatusMatch && searchMatch;
  })
    .sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const openUserDetail = (user: UserInfo) => {
    setSelectedUser(user);
  };

  const closeUserDetail = () => {
    setSelectedUser(null);
  };

  return (
    <div style={{ paddingBottom: '40px' }}>
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
          placeholder="Tìm kiếm theo tên..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{
            backgroundColor: "#c66a7a",
            borderRadius: "4px",
            color: "#fff",
            width: "220px",
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: "#fff" }} />
              </InputAdornment>
            ),
            style: { color: '#fff', fontFamily: 'REM' },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Filter theo trạng thái trao đổi */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px' }}>
            Trạng Thái Trao Đổi:
          </Typography>
          <FormControl size="small" sx={{ width: '180px' }}>
            <Select
              value={filterExchangeStatus}
              onChange={(e) => setFilterExchangeStatus(e.target.value)}
              sx={{ fontFamily: 'REM' }}
            >
              <MenuItem sx={{ fontFamily: 'REM' }} value="ALL">Tất cả</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="PENDING">Chờ xử lí</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="DEALING">Đang đóng gói</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="DELIVERING">Đang giao hàng</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="SUCCESSFUL">Hoàn tất</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="FAILED">Thất bại</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="REJECTED">Bị từ chối</MenuItem>
            </Select>
          </FormControl>

          {/* Filter theo trạng thái bài post */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px', paddingLeft: '20px' }}>
            Trạng Thái Bài Post:
          </Typography>
          <FormControl size="small" sx={{ width: '180px' }}>
            <Select
              value={filterPostStatus}
              onChange={(e) => setFilterPostStatus(e.target.value)}
              sx={{ fontFamily: 'REM' }}
            >
              <MenuItem sx={{ fontFamily: 'REM' }} value="ALL">Tất cả</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="AVAILABLE">Đang được đăng</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="UNAVAILABLE">Không được đăng</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="DONE">Đã xong</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM', color: '#71002b' }}>
        Quản lý trao đổi
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                {/* <StyledTableCell>ID</StyledTableCell> */}
                <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Nội dung</StyledTableCell>
                <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Người gửi yêu cầu</StyledTableCell>
                <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Người đăng bài</StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Tiền chênh lệch</StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Trạng thái trao đổi</StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Trạng thái bài post</StyledTableCell>
                <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>Chi tiết</StyledTableCell>
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
                filteredExchanges.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((exchange) => (
                  <StyledTableRow key={exchange.id}>
                    {/* <StyledTableCell>{exchange.id}</StyledTableCell> */}
                    {/* <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>{exchange.post.postContent.length > 25 ? exchange.post.postContent.substring(0, 25) + '...' : exchange.post.postContent}</StyledTableCell> */}
                    <StyledTableCell align="left" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>
                      {exchange.post && exchange.post.postContent
                        ? exchange.post.postContent.length > 25
                          ? exchange.post.postContent.substring(0, 25) + '...'
                          : exchange.post.postContent
                        : 'No Content'}
                    </StyledTableCell>

                    <StyledTableCell align="left">
                      <Box display="flex" alignItems="center" justifyContent='center'>
                        <Avatar onClick={() => openUserDetail(exchange.requestUser)} alt={exchange.requestUser.name} src={exchange.requestUser.avatar} sx={{ width: 24, height: 24, marginRight: 1.5 }} />
                        <Typography onClick={() => openUserDetail(exchange.requestUser)}>{exchange.requestUser.name}</Typography>
                      </Box>
                    </StyledTableCell>
                    {/* <StyledTableCell align="left">
                      <Box display="flex" alignItems="center" justifyContent='center'>
                        <Avatar onClick={() => openUserDetail(exchange.post.user)} alt={exchange.post.user.avatar} src={exchange.post.user.avatar} sx={{ width: 24, height: 24, marginRight: 1.5 }} />
                        <Typography onClick={() => openUserDetail(exchange.post.user)}>{exchange.post.user.name}</Typography>
                      </Box>
                    </StyledTableCell> */}
                    <StyledTableCell align="left">
                      <Box display="flex" alignItems="center" justifyContent="center">
                        {exchange.post && exchange.post.user ? (
                          <>
                            <Avatar
                              onClick={() => openUserDetail(exchange.post.user)}
                              alt={exchange.post.user.avatar || 'User Avatar'}
                              src={exchange.post.user.avatar}
                              sx={{ width: 24, height: 24, marginRight: 1.5 }}
                            />
                            <Typography onClick={() => openUserDetail(exchange.post.user)}>
                              {exchange.post.user.name || 'Unknown User'}
                            </Typography>
                          </>
                        ) : (
                          <Typography>No User Info</Typography>
                        )}
                      </Box>
                    </StyledTableCell>

                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap', fontFamily: 'REM' }}>
                      {formatCurrency(exchange.compensationAmount)}
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {/* <span style={getStatusColor(exchange.status)}>{getStatusText(exchange.status)}</span> */}
                      <span style={getStatusColor(exchange.status)}>
                        {exchange.status ? getStatusText(exchange.status) : 'Unknown Status'}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                      {/* <span style={getStatusColor(exchange.post.status)}>{getStatusText(exchange.post.status)}</span> */}
                      <span style={getStatusColor(exchange.post?.status)}>
                        {exchange.post?.status ? getStatusText(exchange.post.status) : 'Unknown Post Status'}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton color="default" onClick={() => openExchangeDetail(exchange.id)}>
                        <InfoOutlinedIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={exchanges.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      <ModalExchangeDetail
        isOpen={!!selectedExchangeId}
        exchange={selectedExchange}
        onClose={closeExchangeDetail}
      />

      <ModalExchangeUser
        open={!!selectedUser}
        onClose={closeUserDetail}
        user={selectedUser}
      />
    </div>
  );
};

export default ManageExchanges;
