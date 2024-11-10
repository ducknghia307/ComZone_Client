import React from 'react';
import { Modal, Box, Typography, Divider, IconButton, SxProps, Theme } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

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
                    color: '#f89b28',
                    backgroundColor: '#fff2c9',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: "REM",
                    fontSize: '16px'
                };
            case "PACKAGING":
                return {
                    color: '#ff6b1c',
                    backgroundColor: '#ffe8db',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: "REM",
                    fontSize: '16px'
                };
            case "DELIVERING":
                return {
                    color: '#52a7bf',
                    backgroundColor: '#daf4ff',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: "REM",
                    fontSize: '16px'
                };
            case "DELIVERED":
                return {
                    color: '#ffffff',
                    backgroundColor: '#4CAF50',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: "REM",
                    fontSize: '16px'
                };
            case "COMPLETED":
                return {
                    color: '#fef6c7',
                    backgroundColor: '#395f18',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: "REM",
                    fontSize: '16px'
                };
            case "CANCELED":
                return {
                    color: '#e91e63',
                    backgroundColor: '#fce4ec',
                    borderRadius: '8px',
                    padding: '4px 12px',
                    fontWeight: 'bold',
                    display: 'inline-block',
                    fontFamily: "REM",
                    fontSize: '16px'
                };
            default:
                return {};
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case "PENDING":
                return "Chờ xử lí";
            case "PACKAGING":
                return "Đang đóng gói";
            case "DELIVERING":
                return "Đang giao hàng";
            case "DELIVERED":
                return "Đã giao thành công";
            case "COMPLETED":
                return "Hoàn tất";
            case "CANCELED":
                return "Bị hủy";
            default:
                return "Tất cả";
        }
    };

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
                    width: 800,
                    maxHeight: '80vh',
                    bgcolor: 'background.paper',
                    boxShadow: '24',
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

                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        pr: 2,
                        pt: 3
                    }}
                >
                    {order.items.map((item: any, index: number) => (
                        <React.Fragment key={index}>
                            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                {/* Comic Image */}
                                <img
                                    src={item.comics.coverImage || 'https://via.placeholder.com/150'}
                                    alt={item.comics.title}
                                    style={{
                                        width: '100px',
                                        height: '140px',
                                        objectFit: 'cover',
                                        marginRight: '15px',
                                    }}
                                />

                                {/* Comic Information */}
                                <div style={{ flex: 1 }}>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold', fontFamily: "REM" }}>
                                        {item.comics.title}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: "REM" }}>
                                        <strong>Tác giả:</strong> {item.comics.author || 'N/A'}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: "REM" }}>
                                        <strong>Mô tả:</strong> {item.comics.description ? item.comics.description.slice(0, 100) + (item.comics.description.length > 100 ? '...' : '') : 'No description available'}
                                    </Typography>

                                </div>

                                {/* Price and Quantity */}
                                <div style={{ textAlign: 'right', paddingLeft: '40px' }}>
                                    <Typography variant="body1" sx={{ fontWeight: 'bold', fontFamily: "REM" }}>
                                        {Number(item.comics.price).toLocaleString('vi-VN', {
                                            style: 'currency',
                                            currency: 'VND',
                                        })}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, fontFamily: "REM" }}>
                                        SL: x1
                                    </Typography>
                                </div>
                            </div>
                            {index < order.items.length - 1 && <Divider sx={{ my: 2 }} />}
                        </React.Fragment>
                    ))}
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
                        <Typography sx={{ fontSize: "14px", fontFamily: "REM", color: "text.secondary" }}>Phí vận chuyển: </Typography>
                        <Typography sx={{ fontSize: "14px", color: "text.secondary", fontFamily: "REM" }}>
                            {Number(order.totalPrice).toLocaleString("vi-VN", {
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
