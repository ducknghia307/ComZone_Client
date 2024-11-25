import { useEffect, useState } from 'react';
import "../ui/ExchangeHistory.css"
import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import { useAppSelector } from '../../redux/hooks';

const exchangeData = [
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Đang chờ xử lí',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Từ chối',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
    {
        date: '01/10/2024',
        user: 'Thanh Mai',
        provided: ['Conan Tập 102', 'Conan Tập 1', 'Conan Tập 2'],
        received: ['One Piece Tập 15', 'One Piece Tập 21', 'One Piece Tập 3'],
        status: 'Thành công',
    },
];

const ExchangeHistory = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [exchangeRequest, setExchangeRequest] = useState([]);
    const [exchangeOffer, setExchangeOffer] = useState([]);

    const userId = useAppSelector((state) => state.auth.userId);
    console.log("userid", userId);

    const fetchUserExchangeRequest = async () => {
        try {
            const response = await privateAxios.get(`/exchange-requests/user`, {
                params: { userId },
            });
            setExchangeRequest(response.data);
            console.log("exchange requests", response.data);
        } catch (error) {
            console.error("Error fetching exchange requests:", error);
        }
    };

    const fetchUserExchangeOffer = async () => {
        try {
            const response = await privateAxios.get(`/exchange-offers/comics/user`, {
                params: { userId },
            });
            setExchangeOffer(response.data);
            console.log("exchange offers", response.data);
        } catch (error) {
            console.error("Error fetching exchange offers:", error);
        }
    };

    useEffect(() => {
        fetchUserExchangeRequest();
        fetchUserExchangeOffer();
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    // const combinedData = [
    //     ...exchangeRequest.map((req) => ({
    //         date: new Date(req.createdAt).toLocaleDateString("vi-VN"),
    //         user: req.user?.name || "N/A",
    //         provided: req.requestComics?.map((comic) => comic.title) || [],
    //         received: [], // Adjust as necessary
    //         status: req.status,
    //         note: req.postContent || "Không có ghi chú",
    //     })),
    //     ...exchangeOffer.map((offer) => ({
    //         date: new Date(offer.createdAt).toLocaleDateString("vi-VN"),
    //         user: offer.sellerId?.name || "N/A",
    //         provided: [offer.title],
    //         received: [], // Adjust as necessary
    //         status: offer.status,
    //         note: offer.description || "Không có ghi chú",
    //     })),
    // ];

    const paginatedData = exchangeData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden', padding: '20px 50px' }}>
            <Typography variant="h5" align="center" sx={{ margin: 2, fontWeight: 'bold' }}>
                LỊCH SỬ TRAO ĐỔI TRUYỆN
            </Typography>
            <TableContainer component={Paper} className="wallet-table-container">
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Ngày giao dịch</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Người trao đổi với</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Truyện cung cấp</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Truyện nhận được</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Trạng thái giao dịch</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Ghi Chú</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.date}</TableCell>
                                <TableCell align="center">{row.user}</TableCell>
                                <TableCell align="center">{row.provided.map((book, idx) => (
                                    <div key={idx}>{book}</div>
                                ))}</TableCell>
                                <TableCell align="center">{row.received.map((book, idx) => (
                                    <div key={idx}>{book}</div>
                                ))}</TableCell>
                                <TableCell align="center">{row.status}</TableCell>
                                <TableCell align="center">
                                    <IconButton>
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10]}
                    component="div"
                    count={exchangeData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Paper>
    );
};

export default ExchangeHistory;