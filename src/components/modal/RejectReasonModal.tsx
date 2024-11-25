import React, { useState } from 'react';
import { Box, Modal, Typography, TextField, Button, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { notification } from 'antd';
import { privateAxios } from '../../middleware/axiosInstance';

interface RejectReasonModalProps {
    open: boolean;
    onClose: () => void;
    orderId: string;
    onConfirm: (reason: string) => void;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({ open, onClose, orderId }) => {
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!reason.trim()) {
            alert('Vui lòng nhập lý do từ chối.');
            return;
        }

        setLoading(true);
        try {
            await privateAxios.patch(`/refund-requests/reject/order/${orderId}`, {
                rejectReason: reason.trim(),
            });

            notification.success({
                message: 'Thành công',
                description: 'Yêu cầu hoàn tiền đã bị từ chối.',
                placement: 'topRight',
            });

            setReason(''); // Reset textfield
            onClose();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Đã xảy ra lỗi khi từ chối yêu cầu hoàn tiền. Vui lòng thử lại.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setReason(''); // Reset lý do khi đóng
        onClose();
    };

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="reject-reason-modal-title"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    bgcolor: '#fff',
                    p: 4,
                    width: '400px',
                    borderRadius: '12px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
                    border: '2px solid #c66a7a',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 2,
                    }}
                >
                    <Typography
                        id="reject-reason-modal-title"
                        variant="h6"
                        sx={{ color: '#71002b', fontWeight: 'bold' }}
                    >
                        Nhập lý do từ chối
                    </Typography>
                    <IconButton
                        onClick={handleClose}
                        sx={{
                            color: '#c66a7a',
                            '&:hover': {
                                color: '#71002b',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Lý do từ chối"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    sx={{
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': { borderColor: '#c66a7a' },
                            '&:hover fieldset': { borderColor: '#71002b' },
                        },
                        '& .MuiInputLabel-root': { color: '#c66a7a' },
                    }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Button
                        variant="contained"
                        onClick={handleConfirm}
                        disabled={loading}
                        sx={{
                            flex: 1,
                            bgcolor: '#c66a7a',
                            color: '#fff',
                            '&:hover': { bgcolor: '#71002b' },
                            '&.Mui-disabled': {
                                bgcolor: '#c66a7a80',
                            },
                        }}
                    >
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={handleClose}
                        disabled={loading}
                        sx={{
                            flex: 1,
                            borderColor: '#c66a7a',
                            color: '#c66a7a',
                            '&:hover': {
                                borderColor: '#71002b',
                                color: '#71002b',
                            },
                        }}
                    >
                        Hủy
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default RejectReasonModal;
