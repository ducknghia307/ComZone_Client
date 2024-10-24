import React from 'react';
import { Modal, Box, Typography, Button, Divider, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface OrderDetailsModalProps {
    open: boolean;
    onClose: () => void;
    order: any;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ open, onClose, order }) => {
    if (!order) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    maxHeight: '80vh', 
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: '8px',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                {/* Modal Header */}
                <div style={{ fontWeight: 'bold', fontSize: '28px' }}>
                    <Typography
                        gutterBottom
                        textAlign="center"
                        sx={{ fontWeight: 'bold', fontSize: '24px' }}
                    >
                        Chi tiết đơn hàng {order.productName}
                    </Typography>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', right: 25, top: 30 }}>
                        <CloseIcon />
                    </IconButton>
                </div>


                {/* Scrollable */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        pr: 2,
                        pt:3
                    }}
                >
                    {order.items.map((item: any, index: number) => (
                        <div
                            key={index}
                            style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}
                        >
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
                                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                    {item.comics.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Tác giả:</strong> {item.comics.author || 'N/A'}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    <strong>Mô tả:</strong> {item.comics.description || 'No description available'}
                                </Typography>
                            </div>

                            {/* Price and Quantity */}
                            <div style={{ textAlign: 'right', paddingLeft: '40px' }}>
                                <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {Number(item.comics.price).toLocaleString('vi-VN', {
                                        style: 'currency',
                                        currency: 'VND',
                                    })}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                    SL: {item.quantity}
                                </Typography>
                            </div>
                        </div>
                    ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        alignItems: 'center',
                        mt: 2,
                        gap: '10px',
                    }}
                >
                    {/* Total Price */}
                    <Typography sx={{ fontSize: '20px', fontWeight: 'bold', color: '#f77157' }}>
                        Tổng tiền: {Number(order.total_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </Typography>
                </Box>
            </Box>
        </Modal>
    );
};

export default OrderDetailsModal;
