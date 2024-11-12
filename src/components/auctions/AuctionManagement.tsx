import React, { useEffect, useState } from 'react';
import "../ui/AuctionManagement.css";
import {
    Box, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import DoNotDisturbOutlinedIcon from '@mui/icons-material/DoNotDisturbOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import AuctionModalEdit from '../comic/sellerManagement/AuctionModalEdit';
import { Auction } from '../../common/base.interface';
import { Popconfirm } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';

const getStatusChipStyles = (status: string) => {
    switch (status) {
        case 'SUCCESSFUL':
            return { color: '#4caf50', backgroundColor: '#e8f5e9', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
        case 'UPCOMING':
            return { color: '#6226EF', backgroundColor: '#EDE7F6', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
        case 'PROCESSING':
            return { color: '#ff9800', backgroundColor: '#fff3e0', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block', };
        case 'ONGOING':
            return { color: '#2196f3', backgroundColor: '#e3f2fd', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
        case 'FAILED':
            return { color: '#e91e63', backgroundColor: '#fce4ec', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
        case 'REJECTED':
            return { color: '#f44336', backgroundColor: '#ffebee', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
    }
};

const translateStatus = (status: string) => {
    switch (status) {
        case 'SUCCESSFUL':
            return 'Thành công';
        case 'UPCOMING':
            return 'Sắp diễn ra';
        case 'PROCESSING':
            return 'Đang xử lí';
        case 'ONGOING':
            return 'Đang diễn ra';
        case 'FAILED':
            return 'Thất bại';
        case 'REJECTED':
            return 'Bị từ chối';
        default:
            return status;
    }
};


const AuctionManagement = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState<Auction | null>(null);

    useEffect(() => {
        privateAxios.get("/auction")
            .then((response) => {
                console.log("Auctions:", response.data);
                setAuctions(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClick = (auction: Auction) => {
        setSelectedAuction(auction);
        setIsModalOpen(true);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedAuction(null);
    };

    const handleModalSuccess = (updatedAuctionData: Auction) => {
        setAuctions((prevAuctions) =>
            prevAuctions.map((auction) =>
                auction.id === updatedAuctionData.id ? { ...auction, ...updatedAuctionData } : auction
            )
        );
        handleModalClose();
    };

    const handleStopAuction = async (auctionId: string) => {
        try {
            // await privateAxios.put(`/auction/${auctionId}/stop`);
            // setAuctions((prevAuctions) =>
            //     prevAuctions.map((auction) =>
            //         auction.id === auctionId ? { ...auction, status: 'STOPPED' } : auction
            //     )
            // );
            console.log(`Auction with ID ${auctionId} has been stopped.`);
        } catch (error) {
            console.error("Error stopping the auction:", error);
        }
    };

    const paginatedData = auctions.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const truncateText = (text: string, maxLength: number) => {
        return text.length > maxLength ? text.slice(0, maxLength) + '...' : text;
    };

    if (loading) return <p>Loading...</p>;

    return (

        <div className='seller-container' style={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" className="content-header">Quản lí đấu giá</Typography>
            <Box sx={{ marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <TextField
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchOutlinedIcon />
                                    </InputAdornment>
                                ),
                            },
                        }}
                        size='small'
                        placeholder="Tìm kiếm truyện đấu giá..."
                        variant="outlined"
                    />
                </div>
            </Box>
            <TableContainer component={Paper} className="auction-table-container" sx={{ border: '1px solid black' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Ảnh Chính</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Tên Truyện</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Thời Gian Bắt Đầu</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Thời Gian Kết Thúc</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Giá Khởi Điểm</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Bước Giá</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Giá Hiện Tại</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Trạng Thái Đấu Giá</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((auction, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">
                                    <img src={auction.comics.coverImage} alt="Cover" style={{ width: 70, height: 110, margin: 'auto' }} />
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} align="center" title={auction.comics.title}>
                                    {truncateText(auction.comics.title, 20)}
                                </TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} align="center">{new Date(auction.startTime).toLocaleString()}</TableCell>
                                <TableCell style={{ whiteSpace: 'nowrap' }} align="center">{new Date(auction.endTime).toLocaleString()}</TableCell>
                                <TableCell align="center">{auction.reservePrice.toLocaleString()} đ</TableCell>
                                <TableCell align="center">{auction.priceStep.toLocaleString()} đ</TableCell>
                                <TableCell align="center">{auction.currentPrice?.toLocaleString()} đ</TableCell>
                                <TableCell align="center">
                                    <span style={getStatusChipStyles(auction.status)}>
                                        {translateStatus(auction.status)}
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    <div style={{ display: 'flex' }}>
                                        {auction.status === 'FAILED' && (
                                            <IconButton color="primary" onClick={() => handleEditClick(auction)}>
                                                <EditOutlinedIcon />
                                            </IconButton>
                                        )}
                                        <Popconfirm
                                            title="Dừng phiên đấu giá"
                                            description="Bạn có thực sự muốn dừng phiên đấu giá này?"
                                            icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                                            onConfirm={() => handleStopAuction(auction.id)}
                                            okText="Hủy"
                                            cancelText="Thoát"
                                            overlayClassName="custom-popconfirm"
                                        >
                                            <IconButton color="error">
                                                <DoNotDisturbOutlinedIcon />
                                            </IconButton>
                                        </Popconfirm>

                                    </div>

                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={auctions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {selectedAuction && (
                <AuctionModalEdit
                    open={isModalOpen}
                    onCancel={handleModalClose}
                    comic={selectedAuction.comics}
                    auctionData={{
                        id: selectedAuction.id,
                        shopName: selectedAuction.shopName,
                        productName: selectedAuction.productName,
                        status: selectedAuction.status,
                        imgUrl: selectedAuction.imgUrl,
                        reservePrice: selectedAuction.reservePrice,
                        maxPrice: selectedAuction.maxPrice,
                        priceStep: selectedAuction.priceStep,
                        startTime: selectedAuction.startTime,
                        endTime: selectedAuction.endTime,
                        comics: selectedAuction.comics
                    }}
                    onSuccess={handleModalSuccess}
                />
            )}
        </div>
    );
};

export default AuctionManagement;
