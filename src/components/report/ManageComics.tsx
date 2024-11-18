import * as React from 'react';
import { useState, useEffect } from 'react';
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
import { Comic } from '../../common/base.interface';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BanComicModal from '../modal/BanComicModal';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

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
  backgroundColor: '#fff', // Background color for rows
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffe3d842', // Alternate rows with light pink shade
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  backgroundColor: '#fff',
  color: '#000',
}));

const ManageComics: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openBanModal, setOpenBanModal] = useState(false);
  const [selectedComicId, setSelectedComicId] = useState<number | null>(null);

  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await privateAxios.get('/comics');
        setComics(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching comics data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchComics();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNAVAILABLE":
        return { color: '#e91e63', backgroundColor: '#fce4ec', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "AVAILABLE":
        return { color: '#4caf50', backgroundColor: '#e8f5e9', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "AUCTION":
        return { color: '#ff9800', backgroundColor: '#fff3e0', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "EXCHANGE":
        return { color: '#52a7bf', backgroundColor: '#daf4ff', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "EXCHANGE_OFFER":
        return { color: '#673ab7', backgroundColor: '#ede7f6', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "SOLD":
        return { color: '#757575', backgroundColor: '#eeeeee', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "REMOVED":
        return { color: '#f44336', backgroundColor: '#ffebee', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
    }
  };

  const handleOpenBanModal = (comicId: number) => {
    setSelectedComicId(comicId);
    setOpenBanModal(true);
  };

  const handleBanComic = (reason: string) => {
    if (selectedComicId !== null) {
      console.log(`Banning comic ID: ${selectedComicId} for reason: ${reason}`);
      // privateAxios.post(`/comics/${selectedComicId}/ban`, { reason });
    }
  };

  return (
    <div style={{paddingBottom:'40px'}}>
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
        Quản lý truyện tranh
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Ảnh Bìa</StyledTableCell>
                <StyledTableCell>Tên Truyện</StyledTableCell>
                <StyledTableCell align="right">Tác Giả</StyledTableCell>
                <StyledTableCell align="right">Trạng Thái</StyledTableCell>
                <StyledTableCell align="right">Tập/Bộ</StyledTableCell>
                <StyledTableCell align="right">Chỉnh Sửa</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                comics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((comic) => (
                  <StyledTableRow key={comic.id}>
                    <StyledTableCell>
                      <img style={{ width: '80px', height: '120px' }} src={comic.coverImage} alt={comic.title} />
                    </StyledTableCell>
                    <StyledTableCell>{comic.title}</StyledTableCell>
                    <StyledTableCell align="right">{comic.author}</StyledTableCell>
                    <StyledTableCell align="right">
                      <span style={getStatusColor(comic.status)}>
                        {comic.status}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {comic.quantity > 1 ? 'Bộ Truyện' : 'Tập Truyện'}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <IconButton color="error" onClick={() => handleOpenBanModal(comic.id)}>
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
          count={comics.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <BanComicModal
        open={openBanModal}
        onClose={() => setOpenBanModal(false)}
        onBan={handleBanComic}
      />
    </div>
  );
};

export default ManageComics;
