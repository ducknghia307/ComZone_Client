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
import { IconButton, Typography } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BanUserModal from '../modal/BanUserModal';

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
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
      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Quản lí người dùng
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
              <StyledTableCell>Ảnh</StyledTableCell>
                <StyledTableCell>Tên Người Dùng</StyledTableCell>
                <StyledTableCell align="right">Email</StyledTableCell>
                <StyledTableCell align="right">Trạng thái</StyledTableCell>
                <StyledTableCell align="right">Chỉnh Sửa</StyledTableCell>
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
                    <StyledTableCell component="th" scope="row">
                      {user.name}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {user.email}
                    </StyledTableCell>
                    <StyledTableCell align="right">
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
        <TablePagination
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
