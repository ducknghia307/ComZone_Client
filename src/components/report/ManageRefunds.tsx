import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { Box, Typography, IconButton, Tooltip, TextField, InputAdornment, CircularProgress } from '@mui/material';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import RefundModal from '../modal/RefundModal';
import { privateAxios } from '../../middleware/axiosInstance';

interface Order {
    id: string;
    cancelReason: string | null;
    createdAt: string;
    deletedAt: string | null;
    isFeedback: boolean;
    isPaid: boolean;
    note: string;
    paymentMethod: string;
    status: string;
    totalPrice: number;
    type: string;
    updatedAt: string;
}

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    balance: number;
    role: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface RefundRequest {
    id: string;
    createdAt: string;
    updatedAt: string;
    reason: string;
    rejectedReason: string | null;
    status: string;
    description: string;
    attachedImages: string[] | null;
    order: Order;
    user: User;
    images: string[];
}

interface RefundDetails {
    name: string;
    orderId: string;
    reason: string;
    images: string[] | null;
    description: string;
    createdAt: string;
}

interface RefundModalProps {
    open: boolean;
    onClose: () => void;
    refundDetails: RefundDetails | null;
    onApprove: () => void;
    onReject: (reason: string) => void;
}

const StyledTableCell = styled(TableCell)(() => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#c66a7a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
        fontFamily: 'REM',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        fontFamily: 'REM',
        color: '#000',
    },
}));

const StyledTableRow = styled(TableRow)(() => ({
    backgroundColor: '#fff',
    '&:nth-of-type(odd)': {
        backgroundColor: '#ffe3d842',
    },
}));

const StyledTablePagination = styled(TablePagination)(() => ({
    backgroundColor: '#fff',
    color: '#000',
}));

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Asia/Ho_Chi_Minh',
    }).format(date);
};


const ManageRefunds: React.FC = () => {
    const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [selectedRefund, setSelectedRefund] = useState<RefundRequest | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch data from API
    useEffect(() => {
        const fetchRefundRequests = async () => {
            try {
                const response = await privateAxios.get('/refund-requests/all');
                setRefundRequests(response.data);
                console.log("refunds", response)
            } catch (err) {
                console.error('Error fetching refund requests:', err);
                setError('Không thể tải danh sách yêu cầu hoàn tiền');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRefundRequests();
    }, []);

    const handleOpenModal = (refund: RefundRequest) => {
        setSelectedRefund(refund);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedRefund(null);
    };

    const handleApprove = () => {
        handleCloseModal();
    };

    const handleReject = (reason: string) => {
        handleCloseModal();
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    if (isLoading) {
        return <CircularProgress sx={{ display: 'block', margin: '50px auto' }} />;
    }

    if (error) {
        return <Typography sx={{ color: 'red', textAlign: 'center', marginTop: '50px' }}>{error}</Typography>;
    }

    return (
        <div style={{ paddingBottom: '40px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm..."
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
            <Typography
                variant="h5"
                sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM', color: '#71002b' }}
            >
                Quản lý hoàn tiền
            </Typography>
            <Paper>
                <TableContainer>
                    <Table sx={{ minWidth: 700 }} aria-label="refunds table">
                        <TableHead>
                            <TableRow>
                                <StyledTableCell>Tên Người Dùng</StyledTableCell>
                                <StyledTableCell>Mã Đơn Hàng</StyledTableCell>
                                <StyledTableCell align="right">Ngày Yêu Cầu</StyledTableCell>
                                <StyledTableCell align="right">Lý Do</StyledTableCell>
                                <StyledTableCell align="right">Chi Tiết Lý Do (nếu có)</StyledTableCell>
                                <StyledTableCell align="right">Hình Ảnh</StyledTableCell>
                                <StyledTableCell align="right">Chỉnh Sửa</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {refundRequests.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((refund) => (
                                <StyledTableRow key={refund.id}>
                                    <StyledTableCell>{refund.user.name}</StyledTableCell>
                                    <StyledTableCell>{refund.order?.id}</StyledTableCell>
                                    <StyledTableCell align="right">{formatDateTime(refund.createdAt)}</StyledTableCell>
                                    <StyledTableCell align="right">{refund.reason}</StyledTableCell>
                                    <StyledTableCell align="right">{refund.description}</StyledTableCell>
                                    <StyledTableCell align="right">
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            {refund.images?.length > 0 ? (
                                                refund.images.map((image, index) => (
                                                    <img
                                                        key={index}
                                                        src={image}
                                                        alt={`Refund Image ${index + 1}`}
                                                        style={{
                                                            width: '50px',
                                                            height: '50px',
                                                            objectFit: 'cover',
                                                            borderRadius: '4px',
                                                            border: '1px solid #ccc',
                                                        }}
                                                    />
                                                ))
                                            ) : (
                                                <span style={{ fontStyle: 'italic', color: '#999' }}>Không có hình ảnh</span>
                                            )}
                                        </div>
                                    </StyledTableCell>
                                    <StyledTableCell align="right">
                                        <IconButton color="primary" onClick={() => handleOpenModal(refund)}>
                                            <EditOutlinedIcon />
                                        </IconButton>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <StyledTablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    count={refundRequests.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                />
            </Paper>
            <RefundModal
                open={isModalOpen}
                onClose={handleCloseModal}
                refundDetails={
                    selectedRefund
                        ? {
                            name: selectedRefund.user.name,
                            orderId: selectedRefund.order?.id,
                            reason: selectedRefund.reason,
                            images: selectedRefund.images,
                            createdAt: selectedRefund.createdAt,
                            description: selectedRefund.description
                        }
                        : null
                }
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

export default ManageRefunds;