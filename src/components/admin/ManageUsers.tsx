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
import { Box, IconButton, InputAdornment, Menu, MenuItem, TextField, Typography } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BanUserModal from '../modal/BanUserModal';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#c66a7a', // Màu nền tiêu đề bảng
    color: '#fff', // Màu chữ tiêu đề
    fontWeight: 'bold',
    fontFamily: 'REM',
    fontSize: '1rem',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: '#000', // Màu chữ nội dung bảng
    fontFamily: 'REM',
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#fff', // Màu nền hàng
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffe3d842', // Màu nền hàng xen kẽ
  },
}));


const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openBanModal, setOpenBanModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await privateAxios.get('/users');
        setUsers(response.data);
        console.log(response.data);

      } catch (error) {
        console.error("Error fetching users data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenBanModal = (userId: number) => {
    setSelectedUserId(userId);
    setOpenBanModal(true);
  };

  const handleBanUser = (reason: string) => {
    if (selectedUserId !== null) {
      console.log(`Banning user ID: ${selectedUserId} for reason: ${reason}`);
      // Call API to ban the user with the reason
      // privateAxios.post(`/users/${selectedUserId}/ban`, { reason });
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "BANNED":
        return { color: '#e91e63', backgroundColor: '#fce4ec', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "AVAILABLE":
        return { color: '#4caf50', backgroundColor: '#e8f5e9', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "BANNED": return "Không Hoạt Động";
      case "AVAILABLE": return "Hoạt Động";
    }
  };

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        {/* Search Box */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm..."
          // value={searchTerm}
          // onChange={handleSearch}
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

      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM', color:'#71002b' }}>
        Quản lí người dùng
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ fontFamily: 'REM' }}>Ảnh</StyledTableCell>
                <StyledTableCell style={{ fontFamily: 'REM' }}>Tên Người Dùng</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Email</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Trạng thái</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Chỉnh Sửa</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                users.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                  <StyledTableRow key={user.id}>
                    <StyledTableCell align="center" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                      <img style={{ width: '50px', height: '50px', borderRadius: '50%' }} src={user.avatar || '/placeholder.png'} alt={user.name} />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" style={{ fontFamily: 'REM' }}>
                      {user.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" style={{ fontFamily: 'REM' }}>
                      {user.email}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                      <span style={getStatusColor(user.status)}>
                        {getStatusText(user.status)}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton color="error" onClick={() => handleOpenBanModal(user.id)}>
                        <DeleteOutlineOutlinedIcon />
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <StyledTablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <BanUserModal
        open={openBanModal}
        onClose={() => setOpenBanModal(false)}
        onBan={handleBanUser}
      />
    </div>
  );
};

export default ManageUsers;
