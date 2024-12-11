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
import { IconButton, Typography, Box, TextField, InputAdornment, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BanUserModal from '../modal/BanUserModal';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { SelectChangeEvent } from '@mui/material/Select';
interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  avatar?: string;
  role: string;
  createdAt: Date;
}

// Styled Components for Moderator
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

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openBanModal, setOpenBanModal] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await privateAxios.get('/users');
        // const filteredUsers = response.data.filter((user: User) => user.role !== 'ADMIN' && user.role !== 'MODERATOR');
        const filteredUsers = response.data
          .filter((user: User) => user.role !== 'ADMIN' && user.role !== 'MODERATOR')
          .sort((a: User, b: User) => {
            const dateA = new Date(a.createdAt).getTime();
            const dateB = new Date(b.createdAt).getTime();
            return dateB - dateA;
          });
        setUsers(filteredUsers);
        // setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users data:', error);
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

  const handleBanUser = async (reason: string) => {
    if (selectedUserId !== null) {
      try {
        const response = await privateAxios.patch(`/users/${selectedUserId}/ban`, { reason });
        if (response.status === 200) {
          setUsers((prevUsers) =>
            prevUsers.map((user) =>
              user.id === selectedUserId ? { ...user, status: 'BANNED' } : user
            )
          );
        }
      } catch (error) {
        console.error('Error banning user:', error);
      } finally {
        setOpenBanModal(false);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BANNED':
        return {
          color: '#e91e63',
          backgroundColor: '#fce4ec',
          padding: '8px 20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
        };
      case 'AVAILABLE':
        return {
          color: '#4caf50',
          backgroundColor: '#e8f5e9',
          padding: '8px 20px',
          borderRadius: '8px',
          fontWeight: 'bold',
          fontSize: '16px',
        };
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'BANNED':
        return 'Không Hoạt Động';
      case 'AVAILABLE':
        return 'Hoạt Động';
    }
  };

  const getRoleStyle = (role: string) => {
    switch (role) {
      case "ADMIN":
        return { color: '#d32f2f', backgroundColor: '#fdecea', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' };
      case "MODERATOR":
        return { color: '#3f51b5', backgroundColor: '#e8eaf6', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' };
      case "SELLER":
        return { color: '#ff9800', backgroundColor: '#fff3e0', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' };
      case "MEMBER":
        return { color: '#2196f3', backgroundColor: '#e3f2fd', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' };
      default:
        return { color: '#000', backgroundColor: '#fff', padding: '8px 20px', borderRadius: '8px', fontWeight: 'normal', fontSize: '14px' };
    }
  };

  const translateRole = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "Quản trị viên";
      case "MODERATOR":
        return "Giám sát viên";
      case "SELLER":
        return "Người Bán";
      case "MEMBER":
        return "Thành Viên";
      default:
        return role;
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleRoleFilterChange = (event: SelectChangeEvent<string>) => {
    setRoleFilter(event.target.value);
  };

  // const filteredUsers = users.filter((user) =>
  //   user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //   user.role.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredUsers = users.filter((user) => {
    const matchesSearchTerm =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRoleFilter = roleFilter === 'ALL' || user.role === roleFilter;

    return matchesSearchTerm && matchesRoleFilter;
  });

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        {/* Search Box */}
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{ backgroundColor: '#c66a7a', borderRadius: '4px', color: '#fff', width: '320px' }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon sx={{ color: '#fff' }} />
              </InputAdornment>
            ),
            style: { color: '#fff', fontFamily: 'REM' },
          }}
        />
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography variant="subtitle2" sx={{ marginRight: '10px', fontWeight: 'bold', color: '#71002b', fontFamily: 'REM' }}>
            Phân Loại:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150 }}>
            <Select
              value={roleFilter}
              onChange={handleRoleFilterChange}
              sx={{
                // backgroundColor: '#c66a7a',
                color: '#000',
                borderRadius: '4px',
                fontFamily: 'REM',
              }}
            >
              <MenuItem sx={{ fontFamily: 'REM' }} value="ALL">Tất cả</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="MEMBER">Thành Viên</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="SELLER">Người Bán</MenuItem>
            </Select>
          </FormControl>
        </Box>

      </Box>
      <Typography
        variant="h5"
        sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM', color: '#71002b' }}
      >
        Quản lý người dùng
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Ảnh</StyledTableCell>
                <StyledTableCell>Tên Người Dùng</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Vai trò</StyledTableCell>
                <StyledTableCell align="right">Trạng Thái</StyledTableCell>
                <StyledTableCell align="right">Chỉnh Sửa</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((user) => (
                    <StyledTableRow key={user.id}>
                      <StyledTableCell>
                        <img
                          style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                          src={user.avatar || '/placeholder.png'}
                          alt={user.name}
                        />
                      </StyledTableCell>
                      <StyledTableCell>{user.name}</StyledTableCell>
                      <StyledTableCell align="right">{user.email}</StyledTableCell>
                      <StyledTableCell component="th" scope="row" style={{ fontFamily: 'REM' }}>
                        <span style={getRoleStyle(user.role)}>
                          {translateRole(user.role)}
                        </span>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <span style={getStatusColor(user.status)}>{getStatusText(user.status)}</span>
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        {user.status === 'BANNED' ? (
                          <IconButton color="primary" >
                            <InfoOutlinedIcon />
                          </IconButton>
                        ) : (
                          <IconButton color="error" onClick={() => handleOpenBanModal(user.id)}>
                            <DeleteOutlineOutlinedIcon />
                          </IconButton>
                        )}
                      </StyledTableCell>
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
