import React, { useState } from 'react';
// import "../ui/AuctionManagement.css";
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
    TablePagination,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const auctionData = [
    {
        frontImage: "https://link_to_front_image",
        backImage: "https://link_to_back_image",
        title: 'Spider Man Tập 1',
        duration: '6 ngày',
        publisher: 'Marvel',
        price: '100.000 đ',
        registrationStatus: 'PENDING',
        auctionStatus: 'INCOMING'
    },
    {
        frontImage: "https://link_to_front_image",
        backImage: "https://link_to_back_image",
        title: 'Spider Man Tập 2',
        duration: '6 ngày',
        publisher: 'Marvel',
        price: '100.000 đ',
        registrationStatus: 'APPROVED',
        auctionStatus: 'ONGOING'
    },
    // Add more sample data if needed
];

const AuctionManagement = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = auctionData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" className="content-header">Quản lí đấu giá</Typography>
            <Box sx={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchOutlinedIcon />
                                </InputAdornment>
                            ),
                        },
                    }} size='small' placeholder="Tìm kiếm truyện đấu giá..." variant="outlined" />
                </div>
            </Box>
            <TableContainer component={Paper} className="auction-table-container" sx={{border:'1px solid black'}}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Ảnh Mặt Trước</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Ảnh Mặt Sau</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Tên Truyện</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Thời Hạn Đấu Giá</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>NXB</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Bước Giá</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Trạng Thái Đăng Ký</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Trạng Thái Đấu Giá</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    <img src={row.frontImage} alt="Front" style={{ width: 50, height: 70 }} />
                                </TableCell>
                                <TableCell align="center">
                                    <img src={row.backImage} alt="Back" style={{ width: 50, height: 70 }} />
                                </TableCell>
                                <TableCell align="center">{row.title}</TableCell>
                                <TableCell align="center">{row.duration}</TableCell>
                                <TableCell align="center">{row.publisher}</TableCell>
                                <TableCell align="center">{row.price}</TableCell>
                                <TableCell align="center">{row.registrationStatus}</TableCell>
                                <TableCell align="center">{row.auctionStatus}</TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary">
                                        <EditOutlinedIcon />
                                    </IconButton>
                                    <IconButton color='error'>
                                        <DeleteOutlineOutlinedIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={auctionData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </div>
    );
};

export default AuctionManagement;
