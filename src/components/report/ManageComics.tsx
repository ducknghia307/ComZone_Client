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
import { IconButton, Typography } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BanComicModal from '../modal/BanComicModal';

// Styling for table cells and rows
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

export default function CustomizedTables() {
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

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "SEALED":
        return { color: '#1e88e5', backgroundColor: '#e3f2fd', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
      case "USED":
        return { color: '#757575', backgroundColor: '#eeeeee', padding: '8px 20px', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' };
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case "SEALED": return "Truyện Nguyên Seal";
      case "USED": return "Truyện Đã Sử Dụng";
    }
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

  const getStatusText = (status: string) => {
    switch (status) {
      case "UNAVAILABLE": return "Không còn hàng";
      case "AVAILABLE": return "Còn hàng";
      case "AUCTION": return "Đấu giá";
      case "EXCHANGE": return "Trao đổi";
      case "EXCHANGE_OFFER": return "Đề nghị trao đổi";
      case "SOLD": return "Đã bán";
      case "REMOVED": return "Đã gỡ";
      default: return "Không xác định";
    }
  };

  const handleOpenBanModal = (comicId: number) => {
    setSelectedComicId(comicId);
    setOpenBanModal(true);
    console.log(comicId);
  };

  const handleBanComic = (reason: string) => {
    if (selectedComicId !== null) {
      console.log(`Banning comic ID: ${selectedComicId} for reason: ${reason}`);
      // Call API to ban the comic with the reason
      // privateAxios.post(`/comics/${selectedComicId}/ban`, { reason });
    }
  };

  return (
    <div>
      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM' }}>
        Quản lí truyện tranh
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ fontFamily: 'REM' }}>Ảnh Bìa</StyledTableCell>
                <StyledTableCell style={{ fontFamily: 'REM' }}>Tên Truyện</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Tác giả</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Tình Trạng</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Tập/Bộ</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Trạng thái</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Chỉnh Sửa</StyledTableCell>
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
                    <StyledTableCell align="right">
                      <img style={{ width: '100px', height: '140px' }} src={comic.coverImage} alt={comic.title} />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row" style={{ fontFamily: 'REM' }}>
                      {comic.title}
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>{comic.author}</StyledTableCell>
                    <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                      <span style={getConditionColor(comic.condition)}>
                        {getConditionText(comic.condition)}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                      {comic.quantity > 1 ? 'Bộ Truyện' : 'Tập Truyện'}
                    </StyledTableCell>

                    <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                      <span style={getStatusColor(comic.status)}>
                        {getStatusText(comic.status)}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {(comic.status === "AVAILABLE" || comic.status === "AUCTION" || comic.status === "EXCHANGE" || comic.status === "EXCHANGE_OFFER") && (
                        <IconButton color="error" onClick={() => handleOpenBanModal(comic.id)}>
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
        <TablePagination
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
}
