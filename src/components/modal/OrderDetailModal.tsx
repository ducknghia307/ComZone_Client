import React from 'react';
import { Modal, Box, Typography, Divider, IconButton, SxProps, Theme, Chip, Stack, useTheme, alpha, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, styled } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Grid from '@mui/material/Grid2';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';

interface OrderDetailsModalProps {
    open: boolean;
    onClose: () => void;
    order: any;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ open, onClose, order }) => {
    if (!order) return null;

    const getStatusChipStyle = (status: string): SxProps<Theme> => {
        switch (status) {
            case "PENDING":
                return {
                    color: '#f89b28', backgroundColor: '#fff2c9', borderRadius: '8px', padding: '4px 12px', fontWeight: 'bold', display: 'inline-block', fontFamily: "REM", fontSize: '16px'
                };
            case "PACKAGING":
                return {
                    color: '#ff6b1c', backgroundColor: '#ffe8db', borderRadius: '8px', padding: '4px 12px', fontWeight: 'bold', display: 'inline-block', fontFamily: "REM", fontSize: '16px'
                };
            case "DELIVERING":
                return {
                    color: '#52a7bf', backgroundColor: '#daf4ff', borderRadius: '8px', padding: '4px 12px', fontWeight: 'bold', display: 'inline-block', fontFamily: "REM", fontSize: '16px'
                };
            case "DELIVERED":
                return {
                    color: '#ffffff', backgroundColor: '#4CAF50', borderRadius: '8px', padding: '4px 12px', fontWeight: 'bold', display: 'inline-block', fontFamily: "REM", fontSize: '16px'
                };
            case "COMPLETED":
                return {
                    color: '#fef6c7', backgroundColor: '#395f18', borderRadius: '8px', padding: '4px 12px', fontWeight: 'bold', display: 'inline-block', fontFamily: "REM", fontSize: '16px'
                };
            case "CANCELED":
                return {
                    color: '#e91e63', backgroundColor: '#fce4ec', borderRadius: '8px', padding: '4px 12px', fontWeight: 'bold', display: 'inline-block', fontFamily: "REM", fontSize: '16px'
                };
            case "SUCCESSFUL":
                return {
                    color: "#4caf50",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                    fontFamily: "REM",
                };
            case "FAILED":
                return {
                    color: "#ffffff",
                    backgroundColor: "#d32f2f",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                    fontFamily: "REM",
                };
            default:
                return {};
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PENDING": return "Chờ xử lí";
            case "PACKAGING": return "Đang đóng gói";
            case "DELIVERING": return "Đang giao hàng";
            case "DELIVERED": return "Đã giao thành công";
            case "COMPLETED": return "Hoàn tất";
            case "CANCELED": return "Bị hủy";
            case "SUCCESSFUL":
                return "Hoàn tất";
            case "FAILED":
                return "Thất bại";
            default: return "Tất cả";
        }
    };

    const InfoRow = ({ label, value, paymentMethod }: { label: string; value: string | number; paymentMethod?: string; }) => {
        const theme = useTheme();

        const paymentStatusColor =
        paymentMethod === "WALLET" ? "#32CD32" : paymentMethod === "COD" ? "#ff9800" : "#000";

        return (
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                px={3}
                sx={{
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                        borderRadius: 1
                    }
                }}
            >
                <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{
                        whiteSpace: 'nowrap', fontWeight: 'bold', color: '#000', fontSize: '16px', fontFamily: "REM"
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{
                        paddingLeft: 2,
                        color: paymentMethod ? paymentStatusColor : '#000',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                        fontFamily: "REM"
                    }}

                >
                    {value}
                </Typography>
            </Box>
        );
    };

    const StyledPaper = styled(Paper)(({ theme }) => ({
        padding: theme.spacing(3),
        backgroundColor: theme.palette.background.paper,
        borderRadius: theme.spacing(2),
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
            // transform: 'translateY(-2px)',
            boxShadow: theme.shadows[4]
        }
    }));


    return (
        <Modal open={open} onClose={onClose} BackdropProps={{
            style: { backgroundColor: 'rgba(0, 0, 0, 0.1)', boxShadow: '24' },
        }}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 1000,
                    maxHeight: '90vh',
                    bgcolor: 'background.paper',
                    boxShadow: 'none',
                    p: 4,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography sx={getStatusChipStyle(order.status)}>
                        {getStatusText(order.status)}
                    </Typography>
                    <Typography
                        gutterBottom
                        textAlign="center"
                        sx={{ fontWeight: 'bold', fontSize: '24px', fontFamily: "REM", }}
                    >
                        Chi tiết đơn hàng {order.productName}
                    </Typography>
                    <IconButton onClick={onClose} >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '10px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '0px', color: 'rgba(0, 0, 0, 0.4)' }}>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'REM'
                            }}
                        >
                            Ngày tạo đơn hàng: {new Date(order.createdAt).toLocaleString()}
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{
                                fontFamily: 'REM'
                            }}
                        >
                            Mã đơn hàng: {order.delivery.deliveryTrackingCode}
                        </Typography>
                    </div>
                </Box>
                <Box sx={{ maxHeight: '60vh', overflowY: 'auto' }}>
                    <Grid size={12} sx={{ borderTop: `1px solid rgba(0, 0, 0, 0.12)`, paddingTop: '10px', paddingBottom: '10px' }}>
                        <Stack divider={<Divider />} spacing={2} direction="row" justifyContent="space-between" padding={'10px 20px'}>
                            <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                <Chip
                                    label="Thông tin người bán"
                                    sx={{
                                        fontSize: '18px',
                                        fontWeight: 'bold',
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        padding: '18px 25px',
                                        fontFamily: "REM",
                                        border: '2px solid black',
                                    }}
                                />
                                <InfoRow label="Họ tên" value={order.delivery.from.name} />
                                <InfoRow label="Số điện thoại" value={order.delivery.from.phone} />
                                <InfoRow label="Địa chỉ" value={order.delivery.from.address} />
                            </Box>

                            <Divider orientation="vertical" flexItem />

                            <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                <Chip
                                    label="Thông tin thanh toán"
                                    sx={{
                                        fontSize: '18px', fontWeight: 'bold', backgroundColor: '#fff', color: '#000', padding: '18px 25px', fontFamily: "REM", border: '2px solid black',
                                    }}
                                />
                                {/* <InfoRow label="Tổng tiền" value={`${order.totalPrice.toLocaleString()} đ`} />
                                <InfoRow label="Phí vận chuyển" value={`${order.deliveryFee.toLocaleString()} đ`} /> */}
                                <InfoRow label="Phương thức thanh toán" value={order.paymentMethod === 'WALLET' ? 'Ví Comzone' : order.paymentMethod} />
                                <InfoRow
                                    label="Trạng thái thanh toán"
                                    value={
                                        order.paymentMethod === "WALLET" ? "Đã thanh toán" : "Chưa thanh toán"
                                    }
                                    paymentMethod={order.paymentMethod}
                                />
                            </Box>
                        </Stack>

                        <Grid size={12} sx={{ paddingLeft: '20px', paddingRight: '20px', borderTop: `1px solid rgba(0, 0, 0, 0.12)`, paddingTop: '20px' }}>
                            <Chip
                                label="Thông tin sản phẩm"
                                sx={{
                                    fontSize: '18px', fontWeight: 'bold', backgroundColor: '#fff', color: '#000', padding: '18px 25px', fontFamily: "REM", border: '2px solid black', marginBottom: '20px'
                                }}
                            />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                                            <TableCell sx={{ color: 'black', fontSize: '16px', fontFamily: "REM" }}>Ảnh truyện</TableCell>
                                            <TableCell sx={{ color: 'black', fontSize: '16px', fontFamily: "REM" }}>Tên truyện</TableCell>
                                            <TableCell sx={{ color: 'black', fontSize: '16px', fontFamily: "REM" }}>Tác giả</TableCell>
                                            <TableCell sx={{ color: 'black', fontSize: '16px', fontFamily: "REM" }}>Giá (đ)</TableCell>
                                            <TableCell sx={{ color: 'black', fontSize: '16px', fontFamily: "REM" }}>Tập/Bộ</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        {order.items.map((item: any, index: number) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    <img
                                                        src={item.comics.coverImage}
                                                        alt={item.comics.title}
                                                        style={{ width: 50, height: 'auto', margin: 'auto' }}
                                                    />
                                                </TableCell>
                                                <TableCell sx={{ fontFamily: "REM" }}>{item.comics.title}</TableCell>
                                                <TableCell sx={{ fontFamily: "REM" }}>{item.comics.author || 'N/A'}</TableCell>
                                                <TableCell sx={{ fontFamily: "REM" }}>{item.comics.price.toLocaleString()} đ</TableCell>
                                                <TableCell sx={{ fontFamily: "REM" }}>{item.comics.quantity > 1 ? 'Bộ truyện' : 'Tập Truyện'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                    <Grid size={12} sx={{ paddingLeft: '20px', paddingRight: '20px', paddingTop: '10px', paddingBottom: '10px' }}>
                        {/* {orderDetail.note && ( */}
                        <StyledPaper sx={{ padding: '16px', backgroundColor: 'rgba(0, 0, 0, 0.05)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                                <EditOutlinedIcon sx={{ fontSize: '16px' }} />
                                <Typography fontSize='16px' fontWeight="bold" fontFamily="REM">
                                    Ghi chú từ người mua:
                                </Typography>
                            </div>

                            <Typography variant="body1" marginTop={'5px'} fontFamily="REM">
                                {order.note}
                            </Typography>
                        </StyledPaper>
                    </Grid>
                </Box>

                <Divider sx={{ my: 2 }} />
                <Box
                    sx={{
                        display: 'flex',
                        marginLeft: 'auto',
                        mt: 1,
                        gap: '10px',
                        flexDirection: 'column',
                    }}
                >
                    <div style={{
                        display: "flex", gap: "10px", backgroundColor: "#fff", alignItems: "center", marginLeft: 'auto',
                    }}>
                        <Typography sx={{ fontSize: "15px", fontFamily: "REM", color: "text.secondary" }}>Phí vận chuyển: </Typography>
                        <Typography sx={{ fontSize: "15px", color: "text.secondary", fontFamily: "REM" }}>
                            {Number(order.delivery.deliveryFee).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </Typography>
                    </div>
                    <div style={{
                        display: "flex", gap: "10px", backgroundColor: "#fff", alignItems: "center", marginLeft: 'auto',
                    }}>
                        <Typography sx={{ fontSize: "18px", fontFamily: "REM" }}>Tổng tiền: </Typography>
                        <Typography sx={{ fontSize: "22px", color: "#f77157", fontFamily: "REM" }}>
                            {Number(order.totalPrice).toLocaleString("vi-VN", {
                                style: "currency",
                                currency: "VND",
                            })}
                        </Typography>
                    </div>
                </Box>

            </Box>
        </Modal>
    );
};

export default OrderDetailsModal;
