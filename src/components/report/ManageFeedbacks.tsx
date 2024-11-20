import React, { useState, useEffect } from 'react';
import {
  Box,
  IconButton,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import ModalFeedback from './ModalFeedback';

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

const ManageFeedbacks: React.FC = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await privateAxios.get('/seller-feedback');
        setFeedbacks(response.data);
        console.log("feedbacks", response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openModal = (feedback: any) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const paginatedData = feedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <div style={{ paddingBottom: '40px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <TextField
          variant="outlined"
          placeholder="Tìm kiếm đánh giá..."
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
        sx={{
          marginBottom: '20px',
          fontWeight: 'bold',
          fontFamily: 'REM',
          color: '#71002b',
        }}
      >
        Quản lý đánh giá
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Thời Gian</StyledTableCell>
                <StyledTableCell align="center">Người Mua</StyledTableCell>
                <StyledTableCell align="center">Người Bán</StyledTableCell>
                <StyledTableCell align="center">Nội Dung</StyledTableCell>
                <StyledTableCell align="center">Đánh Giá</StyledTableCell>
                <StyledTableCell align="center">Ảnh Đính Kèm</StyledTableCell>
                <StyledTableCell align="center">Chi Tiết</StyledTableCell>
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
                paginatedData.map((feedback, index) => (
                  <StyledTableRow key={index}>
                    <StyledTableCell>
                      {new Date(feedback.createdAt).toLocaleString()}
                    </StyledTableCell>
                    <StyledTableCell align="center">{feedback.user?.name || 'Unknown'}</StyledTableCell>
                    <StyledTableCell align="center">{feedback.seller?.name || 'Unknown'}</StyledTableCell>
                    <StyledTableCell align="center">{feedback.comment}</StyledTableCell>
                    <StyledTableCell align="center">
                      {feedback.rating} ⭐
                    </StyledTableCell>
                    <StyledTableCell align="center">{feedback.attachedImages.length} ảnh</StyledTableCell>
                    <StyledTableCell align="center">
                      <IconButton color="primary" onClick={() => openModal(feedback)}>
                        <EditOutlinedIcon />
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
          count={feedbacks.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <ModalFeedback
        isOpen={isModalOpen}
        feedback={selectedFeedback}
        onClose={closeModal}
      />
    </div>
  );
};

export default ManageFeedbacks;
