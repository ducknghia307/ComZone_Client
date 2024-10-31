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
        frontImage: "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg",
        backImage: "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_4_tap_102.jpg",
        title: 'Conan Tập 102',
        duration: '6 ngày',
        publisher: 'Marvel',
        price: '100.000 đ',
        registrationStatus: 'PENDING',
        auctionStatus: 'INCOMING'
    },
    {
        frontImage: "https://cdn0.fahasa.com/media/catalog/product/m/a/marvel_spider_man_spider_man_platinum_collection_sa_marvel_1_2020_07_09_14_06_31.jpg",
        backImage: "https://cdn0.fahasa.com/media/catalog/product/m/a/marvel_spider_man_spider_man_platinum_collection_sa_marvel_4_2020_07_09_14_06_31.jpg?_gl=1*efy2vr*_gcl_aw*R0NMLjE3Mjk3MzU2MDQuQ2owS0NRand2ZUs0QmhENEFSSXNBS3k2cE1MWFNFQ0ZoRUo4dG10Y1d3Sm1LdzZ2YnZtcFJuZUZ2TEhldGhXcWJaRkpuZXhRdjNtN0FoTWFBbXcyRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyOTk1MzY3Ny40My4xLjE3Mjk5NTM3NjYuMzEuMC4xNTg0NDgzMDg2",
        title: 'Spider Man Tập 2',
        duration: '6 ngày',
        publisher: 'Marvel',
        price: '100.000 đ',
        registrationStatus: 'APPROVED',
        auctionStatus: 'ONGOING'
    },
];

const getStatusChipStyles = (status : string) => {
    switch (status) {
        case 'PENDING':
            return {
                color: '#ff9800',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'INCOMING':
            return {
                color: '#673ab7',
                backgroundColor: '#ede7f6',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'APPROVED':
            return {
                color: '#4caf50',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'ONGOING':
            return {
                color: '#2196f3',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'COMPLETED':
            return {
                color: '#009688',
                backgroundColor: '#e0f2f1',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'CANCELED':
            return {
                color: '#e91e63',
                backgroundColor: '#fce4ec',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'REJECTED':
            return {
                color: '#f44336',
                backgroundColor: '#ffebee',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
    }
};

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
            <TableContainer component={Paper} className="auction-table-container" sx={{ border: '1px solid black' }}>
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
                                    <img src={row.frontImage} alt="Front" style={{ width: 70, height: 110, margin:'auto' }} />
                                </TableCell>
                                <TableCell align="center">
                                    <img src={row.backImage} alt="Back" style={{ width: 70, height: 110, margin:'auto' }} />
                                </TableCell>
                                <TableCell align="center">{row.title}</TableCell>
                                <TableCell align="center">{row.duration}</TableCell>
                                <TableCell align="center">{row.publisher}</TableCell>
                                <TableCell align="center">{row.price}</TableCell>
                                <TableCell align="center">
                                    <span style={getStatusChipStyles(row.registrationStatus)}>
                                        {row.registrationStatus}
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    <span style={getStatusChipStyles(row.auctionStatus)}>
                                        {row.auctionStatus}
                                    </span>
                                </TableCell>
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
