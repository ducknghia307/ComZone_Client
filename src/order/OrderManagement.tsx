import React, { useEffect, useState } from 'react';
import {
    IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography
} from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import { privateAxios } from '../middleware/axiosInstance';
import OrderDetailSeller from './OrderDetailSeller';
import { OrderDetailData } from '../common/base.interface';

const OrderManagement = () => {
    const [orders, setOrders] = useState<OrderDetailData[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await privateAxios.get('/orders/seller');

                // Check if response data is an array, or access the array within the response object
                const data = Array.isArray(response.data) ? response.data : response.data.orders;

                if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    console.error("API did not return an array of orders.");
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchOrders();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedOrders = orders.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const openOrderDetail = (orderId: string) => {
        setSelectedOrderId(orderId);
    };

    const closeOrderDetail = () => {
        setSelectedOrderId(null);
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Đang chờ xử lý';
            case 'DELIVERED':
                return 'Đã giao hàng';
            case 'PACKAGING':
                return 'Đang đóng gói';
            case 'DELIVERING':
                return 'Đang giao hàng';
            default:
                return status;
        }
    };

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
            case 'DELIVERED':
                return {
                    color: '#32CD32',
                    backgroundColor: '#ccfccc',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                };
            case 'PACKAGING':
                return {
                    color: '#ff6b1c',
                    backgroundColor: '#ffe8db',
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
        }
    };

    return (
        <div style={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" className="content-header">Quản Lý Đơn Hàng</Typography>
            <TableContainer component={Paper} className="order-table-container" sx={{ border: '1px solid black' }}>
                <Table>
                    <TableHead>
                        <TableRow style={{ backgroundColor: 'black' }}>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Mã Vận Đơn</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Tên Người Đặt</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Email</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Số Điện Thoại</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Tổng Tiền</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Phương Thức Thanh Toán</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Trạng Thái</TableCell>
                            <TableCell style={{ color: 'white', textAlign: 'center' }}>Chi Tiết</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {paginatedOrders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell align="center">{order.deliveryTrackingCode || 'N/A'}</TableCell>
                                <TableCell align="center">{order.toName}</TableCell>
                                <TableCell align="center">{order.user.email}</TableCell>
                                <TableCell align="center">{order.toPhone}</TableCell>
                                <TableCell align="center">{order.totalPrice.toLocaleString()} đ</TableCell>
                                <TableCell align="center">
                                    {order.paymentMethod === 'WALLET' ? 'Ví Comzone' : order.paymentMethod}
                                </TableCell>
                                <TableCell align="center">
                                    <span style={getStatusChipStyles(order.status)}>
                                        {translateStatus(order.status)}
                                    </span>
                                </TableCell>
                                <TableCell align="center">
                                    <IconButton color="primary" onClick={() => openOrderDetail(order.id)}>
                                        <EditOutlinedIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>

            {selectedOrderId && (
                <OrderDetailSeller
                    open={Boolean(selectedOrderId)}
                    onClose={closeOrderDetail}
                    orderId={selectedOrderId}
                />
            )}
        </div>
    );
};

export default OrderManagement;
