import React, { useState } from 'react';
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
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ModalDelivery from '../modal/ModalDelivery';

const deliveryData = [
    {
        orderId: 'abcbd129e3455',
        comicName: 'Thám tử lừng danh Conan Tập 1',
        buyerName: 'Thanh Mai',
        orderDate: '02/10/2024',
        deliveryStatus: 'DELIVERING',
        deliveryImage: '',
        cancelReason: ''
    },
    {
        orderId: 'abcbd129e3455',
        comicName: 'Thám tử lừng danh Conan Tập 1',
        buyerName: 'Thanh Mai',
        orderDate: '02/10/2024',
        deliveryStatus: 'COMPLETED',
        deliveryImage: 'https://media.tapchitaichinh.vn/w1480/images/upload/buituananh/05072019/meo-ship-hang-an-toan-cho-cac-shop-online.jpg',
        cancelReason: ''
    },
    {
        orderId: 'abcbd129e3455',
        comicName: 'Thám tử lừng danh Conan Tập 1',
        buyerName: 'Thanh Mai',
        orderDate: '02/10/2024',
        deliveryStatus: 'CANCELED',
        deliveryImage: '',
        cancelReason: 'Khách hàng yêu cầu hủy'
    },
    {
        orderId: 'abcbd129e3455',
        comicName: 'Thám tử lừng danh Conan Tập 1',
        buyerName: 'Thanh Mai',
        orderDate: '02/10/2024',
        deliveryStatus: 'PENDING',
        deliveryImage: '',
        cancelReason: ''
    },
    {
        orderId: 'abcbd129e3455',
        comicName: 'Thám tử lừng danh Conan Tập 1',
        buyerName: 'Thanh Mai',
        orderDate: '02/10/2024',
        deliveryStatus: 'PACKAGING',
        deliveryImage: '',
        cancelReason: ''
    }
];

const getStatusChipStyles = (status: string) => {
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
        case 'PACKAGING':
            return {
                color: '#4caf50',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'DELIVERING':
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
    }
};

const DeliveryManagement = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = (order: any) => {
        setSelectedOrder(order);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedOrder(null);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = deliveryData.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" className="content-header">Quản lí trạng thái giao hàng</Typography>
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
                    }} size='small' placeholder="Tìm kiếm một đơn hàng..." variant="outlined" />
                </div>
            </Box>
            <TableContainer component={Paper} sx={{ border: '1px solid black' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Mã Đơn Hàng</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Tên Truyện</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Tên Người Mua</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Ngày Đặt Hàng</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Trạng Thái Đơn Hàng</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Giao hàng thành công</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Lý do hủy đơn hàng</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Chi tiết</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedData.map((row, index) => (
                            <TableRow key={index}>
                                <TableCell align="center">{row.orderId}</TableCell>
                                <TableCell align="center">{row.comicName}</TableCell>
                                <TableCell align="center">{row.buyerName}</TableCell>
                                <TableCell align="center">{row.orderDate}</TableCell>
                                <TableCell align="center">
                                    <span style={getStatusChipStyles(row.deliveryStatus)}>
                                        {row.deliveryStatus}
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    {row.deliveryImage ? (
                                        <img
                                            src={row.deliveryImage}
                                            alt="Delivery"
                                            style={{ width: '100%', height: 100 }}
                                        />
                                    ) : (
                                        '-'
                                    )}
                                </TableCell>
                                <TableCell align="center">
                                    {row.cancelReason || '-'}
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => handleOpenModal(row)}>
                                        <InfoOutlinedIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={deliveryData.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {/* Hiển thị Modal */}
            {selectedOrder && (
                <ModalDelivery
                    open={openModal}
                    onClose={handleCloseModal}
                    deliveryStatus={selectedOrder.deliveryStatus}
                    orderId={selectedOrder.orderId}
                    comicName={selectedOrder.comicName}
                    buyerName={selectedOrder.buyerName}
                    orderDate={selectedOrder.orderDate}
                    cancelReason={selectedOrder.cancelReason}
                    deliveryImage={selectedOrder.deliveryImage}
                />
            )}
        </div>
    );
};

export default DeliveryManagement;
