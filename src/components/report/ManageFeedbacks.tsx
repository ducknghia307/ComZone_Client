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
  FormControl,
  InputLabel,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { tableCellClasses } from '@mui/material/TableCell';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import ModalFeedback from './ModalFeedback';
import Select, { SelectChangeEvent } from '@mui/material/Select';
interface Feedback {
  id: string;
  user: { name: string };
  seller: { name: string };
  createdAt: string;
  comment: string;
  rating: number;
  attachedImages: string[];
  isApprove: boolean;
}

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
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [ratingFilter, setRatingFilter] = useState<number | string>('ALL');

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

  // Hàm cập nhật feedback trong danh sách
  const updateFeedback = (updatedFeedback: Feedback) => {
    setFeedbacks((prevFeedbacks) =>
      prevFeedbacks.map((feedback) =>
        feedback.id === updatedFeedback.id ? updatedFeedback : feedback
      )
    );
  };

  const getStatusColor = (isApprove: boolean) => {
    return isApprove
      ? { color: '#4caf50', backgroundColor: '#e8f5e9', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' }
      : { color: '#e91e63', backgroundColor: '#fce4ec', padding: '10px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px' };
  };

  const getStatusText = (isApprove: boolean) => {
    return isApprove ? "Đã duyệt" : "Chưa duyệt";
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
  };

  const handleRatingFilterChange = (event: SelectChangeEvent<string>) => {
    setRatingFilter(event.target.value);
  };

  const filteredFeedbacks = feedbacks.filter((feedback) => {
    return (
      (feedback.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        feedback.seller.name.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === 'ALL' || (statusFilter === 'APPROVED' ? feedback.isApprove : !feedback.isApprove)) &&
      (ratingFilter === 'ALL' || feedback.rating === Number(ratingFilter))
    );
  });

  const paginatedData = filteredFeedbacks.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
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
            style: { color: '#fff', fontFamily: 'REM' },
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {/* Status Filter */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px' }}>
            Trạng Thái:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150, borderRadius: '4px' }}>
            <Select
              value={statusFilter}
              onChange={handleStatusFilterChange}
              sx={{ color: '#000' }}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value="APPROVED">Đã duyệt</MenuItem>
              <MenuItem value="PENDING">Chưa duyệt</MenuItem>
            </Select>
          </FormControl>

          {/* Rating Filter */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px', paddingLeft: '20px' }}>
            Đánh giá:
          </Typography>
          <FormControl size="small" sx={{ minWidth: 150, borderRadius: '4px' }}>
            <Select
              value={ratingFilter}
              onChange={handleRatingFilterChange}
              sx={{ color: '#000' }}
            >
              <MenuItem value="ALL">Tất cả</MenuItem>
              <MenuItem value={1}>1 ⭐</MenuItem>
              <MenuItem value={2}>2 ⭐</MenuItem>
              <MenuItem value={3}>3 ⭐</MenuItem>
              <MenuItem value={4}>4 ⭐</MenuItem>
              <MenuItem value={5}>5 ⭐</MenuItem>
            </Select>
          </FormControl>
        </Box>
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
                <StyledTableCell style={{ whiteSpace: 'nowrap' }}>Thời Gian</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Người Mua</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Người Bán</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Nội Dung</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Đánh Giá</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Ảnh Đính Kèm</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Trạng Thái</StyledTableCell>
                <StyledTableCell align="center" style={{ whiteSpace: 'nowrap' }}>Chi Tiết</StyledTableCell>
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
                    <StyledTableCell align="center">
                      {feedback.comment.length > 50 ? feedback.comment.substring(0, 50) + '...' : feedback.comment}
                    </StyledTableCell>

                    <StyledTableCell align="center">
                      {feedback.rating} ⭐
                    </StyledTableCell>
                    <StyledTableCell align="center">{feedback.attachedImages.length} ảnh</StyledTableCell>
                    <StyledTableCell style={{ whiteSpace: 'nowrap' }} align="center">
                      <span style={getStatusColor(feedback.isApprove)}>
                        {getStatusText(feedback.isApprove)}
                      </span>
                    </StyledTableCell>

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
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-end',
          }}
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
        onUpdateFeedback={updateFeedback}
      />
    </div>
  );
};

export default ManageFeedbacks;
