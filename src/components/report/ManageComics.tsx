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
import { Box, FormControl, IconButton, InputAdornment, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import BanComicModal from '../modal/BanComicModal';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

// Styled Components for Moderator
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#c66a7a",
    color: "#fff",
    fontWeight: "bold",
    fontFamily: "REM",
    fontSize: "1rem",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: "#000",
    fontFamily: "REM",
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#fff",
  "&:nth-of-type(odd)": {
    backgroundColor: "#ffe3d842",
  },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
  backgroundColor: "#fff",
  color: "#000",
}));

const ManageComics: React.FC = () => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openBanModal, setOpenBanModal] = useState(false);
  const [selectedComicId, setSelectedComicId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');


  useEffect(() => {
    const fetchComics = async () => {
      try {
        const response = await privateAxios.get("/comics");
        
        const sortedComics = response.data.sort((a: Comic, b: Comic) => {
          // Ensure createdAt exists and is a valid date
          const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          
          return dateB - dateA;
        });

        setComics(sortedComics);
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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UNAVAILABLE":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
      case "AVAILABLE":
        return {
          color: "#4caf50",
          backgroundColor: "#e8f5e9",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
      case "AUCTION":
        return {
          color: "#ff9800",
          backgroundColor: "#fff3e0",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
      case "EXCHANGE":
        return {
          color: "#52a7bf",
          backgroundColor: "#daf4ff",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
      case "EXCHANGE_OFFER":
        return {
          color: "#673ab7",
          backgroundColor: "#ede7f6",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
      case "SOLD":
        return {
          color: "#757575",
          backgroundColor: "#eeeeee",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
      case "REMOVED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "UNAVAILABLE":
        return "Không khả dụng";
      case "AVAILABLE":
        return "Có sẵn";
      case "AUCTION":
        return "Đang đấu giá";
      case "EXCHANGE":
        return "Trao đổi";
      case "PRE_ORDER":
        return "Đang được đặt trước";
      case "SOLD":
        return "Đã bán";
      default:
        return status;
    }
  };

  const handleOpenBanModal = (comicId: string) => {
    setSelectedComicId(comicId);
    setOpenBanModal(true);
  };

  const handleBanComic = async (reason: string) => {
    if (selectedComicId !== null) {
      try {
        await privateAxios.delete(`/comics/soft/${selectedComicId}`);
        console.log(
          `Comic ID: ${selectedComicId} đã bị xóa với lý do: ${reason}`
        );
      } catch (error) {
        console.error("Lỗi khi cập nhật trạng thái:", error);
      } finally {
        setOpenBanModal(false);
      }
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  // Lọc theo status
  const filterByStatus = (comic: Comic) => {
    if (statusFilter === 'ALL') return true;
    return comic.status === statusFilter;
  };

  // Lọc theo tập/bộ
  const filterByType = (comic: Comic) => {
    if (typeFilter === 'ALL') return true;
    if (typeFilter === 'TAP' && comic.quantity === 1) return true;
    if (typeFilter === 'BO' && comic.quantity > 1) return true;
    return false;
  };

  // search và filter
  const filteredComics = comics.filter((comic) => {
    // Apply status and type filters
    const statusMatch = filterByStatus(comic);
    const typeMatch = filterByType(comic);

    // Apply search term filter
    const searchMatch =
      comic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comic.author.toLowerCase().includes(searchTerm.toLowerCase());

    // Return comic only if all filters match
    return statusMatch && typeMatch && searchMatch;
  });

  return (
    <div style={{ paddingBottom: "40px" }}>
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
          placeholder="Tìm kiếm theo tên hoặc tác giả..."
          value={searchTerm}
          onChange={handleSearch}
          size="small"
          sx={{
            backgroundColor: "#c66a7a",
            borderRadius: "4px",
            color: "#fff",
            width: "320px",
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
          {/* Filter theo trạng thái */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px' }}>
            Trạng Thái:
          </Typography>
          <FormControl size="small" sx={{ width: '180px' }}>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              sx={{ fontFamily: 'REM' }}
            >
              <MenuItem sx={{ fontFamily: 'REM' }} value="ALL">Tất cả</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="AVAILABLE">Có sẵn</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="UNAVAILABLE">Không khả dụng</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="AUCTION">Đang đấu giá</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="EXCHANGE">Trao đổi</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="EXCHANGE_OFFER">Đề xuất trao đổi</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="SOLD">Đã bán</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="REMOVED">Đã gỡ</MenuItem>
            </Select>
          </FormControl>

          {/* Filter theo Tập/Bộ */}
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM', paddingRight: '10px', paddingLeft: '20px' }}>
            Tập/Bộ:
          </Typography>
          <FormControl size="small" sx={{ width: '180px' }}>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              sx={{ fontFamily: 'REM' }}
            >
              <MenuItem sx={{ fontFamily: 'REM' }} value="ALL">Tất cả</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="TAP">Tập Truyện</MenuItem>
              <MenuItem sx={{ fontFamily: 'REM' }} value="BO">Bộ Truyện</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>
      <Typography
        variant="h5"
        sx={{
          marginBottom: "20px",
          fontWeight: "bold",
          fontFamily: "REM",
          color: "#71002b",
        }}
      >
        Quản lý truyện tranh
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  Ảnh Bìa
                </StyledTableCell>
                <StyledTableCell style={{ whiteSpace: "nowrap" }}>
                  Tên Truyện
                </StyledTableCell>
                <StyledTableCell align="right" style={{ whiteSpace: "nowrap" }}>
                  Tác Giả
                </StyledTableCell>
                <StyledTableCell align="right" style={{ whiteSpace: "nowrap" }}>
                  Trạng Thái
                </StyledTableCell>
                <StyledTableCell align="right" style={{ whiteSpace: "nowrap" }}>
                  Tập/Bộ
                </StyledTableCell>
                <StyledTableCell align="right" style={{ whiteSpace: "nowrap" }}>
                  Chỉnh Sửa
                </StyledTableCell>
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
                filteredComics.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((comic) => (
                  <StyledTableRow key={comic.id}>
                    <StyledTableCell>
                      <img style={{ width: '80px', height: '120px' }} src={comic.coverImage} alt={comic.title} />
                    </StyledTableCell>
                    <StyledTableCell>{comic.title}</StyledTableCell>
                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap' }}>{comic.author}</StyledTableCell>
                    <StyledTableCell align="right">
                      <span style={getStatusColor(comic.status)}>
                        {translateStatus(comic.status)}
                      </span>
                    </StyledTableCell>
                    <StyledTableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
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
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
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
