import React, { useEffect, useState } from 'react';
import {
    Box,
    Modal,
    Typography,
    Button,
    TextField,
    Divider,
    IconButton,
    Chip,
} from '@mui/material';
import { notification } from 'antd';
import CloseIcon from '@mui/icons-material/Close';
import { privateAxios } from '../../middleware/axiosInstance';
import RejectReasonModal from './RejectReasonModal';

interface RefundModalProps {
    open: boolean;
    onClose: () => void;
    refundDetails: {
        name: string;
        orderId?: string; // Có thể không có nếu là exchange
        // exchangeId?: string; // Có thể không có nếu là order
        reason: string;
        attachedImages: string[];
        description: string;
        createdAt: string;
        requestId?: string;
        status: string;
    } | null;
    onApprove: () => void;
    onReject: (reason: string) => void;
}

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

const RefundModal: React.FC<RefundModalProps> = ({
    open,
    onClose,
    refundDetails,
    onApprove,
    onReject,
}) => {
    const [loading, setLoading] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);

    useEffect(() => {
        if (refundDetails) {
            console.log('Refund Details:', refundDetails);
            console.log('Order ID:', refundDetails.orderId);
            console.log('Request ID for exchange:', refundDetails.requestId);
        }
    }, [refundDetails]);

    const handleApprove = async () => {
        if (!refundDetails) return;
        setLoading(true);

        try {
            const apiUrl = refundDetails.orderId
                ? `/refund-requests/approve/order/${refundDetails.orderId}`
                : refundDetails.requestId
                    ? `/refund-requests/approve/exchange/${refundDetails.requestId}`
                    : '';

            await privateAxios.patch(apiUrl);

            notification.success({
                message: 'Thành công',
                description: 'Yêu cầu đã được chấp thuận!',
                placement: 'topRight',
            });

            onApprove();
        } catch (error) {
            notification.error({
                message: 'Lỗi',
                description: 'Lỗi khi chấp thuận yêu cầu.',
                placement: 'topRight',
            });
        } finally {
            setLoading(false);
            onClose();
        }
    };


    const handleRejectOpen = () => {
        setIsRejectModalOpen(true);
    };

    const handleRejectClose = () => {
        setIsRejectModalOpen(false);
    };

    const getStatusChipStyles = (status: string) => {
        switch (status) {
            case "APPROVED":
                return {
                    color: "#4caf50",
                    backgroundColor: "#e8f5e9",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                };
            case "PENDING":
                return {
                    color: "#ff9800",
                    backgroundColor: "#fff3e0",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                };
            case "REJECTED":
                return {
                    color: "#e91e63",
                    backgroundColor: "#fce4ec",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                    whiteSpace: "nowrap",
                };
        }
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "Thành công";
            case "PENDING":
                return "Chờ duyệt";
            case "REJECTED":
                return "Đã từ chối";
            default:
                return status;
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="refund-modal-title"
                style={{ zIndex: 1000 }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        bgcolor: '#fff',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                        p: 4,
                        width: '650px',
                        borderRadius: '16px',
                        border: '2px solid #c66a7a',
                        '&:focus-visible': {
                            outline: 'none',
                        },
                    }}
                >
                    {refundDetails ? (
                        <>
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mb: 3
                            }}>
                                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-start' }}>
                                    <span style={getStatusChipStyles(refundDetails.status)}>
                                        {translateStatus(refundDetails.status)}
                                    </span>
                                </Box>
                                <Typography
                                    id="refund-modal-title"
                                    variant="h5"
                                    component="h2"
                                    sx={{
                                        color: '#71002b',
                                        fontFamily: 'REM',
                                        fontWeight: 'bold',
                                        flex: 2,
                                        textAlign: 'center',
                                        whiteSpace: 'nowrap',
                                    }}
                                >
                                    Chi tiết yêu cầu hoàn tiền
                                </Typography>
                                <Box sx={{
                                    flex: 1,
                                    display: 'flex',
                                    justifyContent: 'flex-end'
                                }}>
                                    <IconButton
                                        onClick={onClose}
                                        sx={{
                                            color: '#c66a7a',
                                            '&:hover': {
                                                color: '#71002b',
                                                bgcolor: 'transparent',
                                            },
                                        }}
                                    >
                                        <CloseIcon />
                                    </IconButton>
                                </Box>
                            </Box>
                            <Box sx={{
                                backgroundColor: '#ffe3d842',
                                p: 2,
                                borderRadius: '8px',
                                mb: 2
                            }}>
                                <Typography variant="body1" sx={{ mb: 1, fontFamily: 'REM' }}>
                                    <strong style={{ color: '#c66a7a' }}>Tên Người Dùng:</strong> {refundDetails.name}
                                </Typography>
                                <Typography variant="body1" sx={{ mb: 1, fontFamily: 'REM' }}>
                                    <strong style={{ color: '#c66a7a' }}>Thời gian:</strong> {formatDateTime(refundDetails.createdAt)}
                                </Typography>
                                <Typography variant="body1" sx={{ fontFamily: 'REM' }}>
                                    <strong style={{ color: '#c66a7a' }}>Lý do:</strong> {refundDetails.reason}
                                </Typography>
                            </Box>

                            <Typography
                                variant="h6"
                                sx={{
                                    mb: 2,
                                    color: '#71002b',
                                    fontFamily: 'REM',
                                    fontSize: '1rem'
                                }}
                            >
                                Hình ảnh đính kèm
                            </Typography>
                            <Box sx={{
                                display: 'flex',
                                gap: 2,
                                mb: 3,
                                flexWrap: 'wrap',
                                justifyContent: 'center'
                            }}>
                                {refundDetails.attachedImages?.length > 0 ? (
                                    refundDetails.attachedImages.map((image, index) => (
                                        <Box
                                            key={index}
                                            sx={{
                                                position: 'relative',
                                                '&:hover': {
                                                    transform: 'scale(1.05)',
                                                    transition: 'transform 0.2s'
                                                }
                                            }}
                                        >
                                            <img
                                                src={image}
                                                alt={`Refund Image ${index + 1}`}
                                                style={{
                                                    width: '100px',
                                                    height: '150px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    border: '2px solid #c66a7a',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </Box>
                                    ))
                                ) : (
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontStyle: 'italic',
                                            color: '#999',
                                            fontFamily: 'REM'
                                        }}
                                    >
                                        Không có hình ảnh
                                    </Typography>
                                )}
                            </Box>
                            <Divider sx={{
                                my: 3,
                                borderColor: '#c66a7a',
                                opacity: 0.3
                            }} />
                            <Box>
                                <TextField
                                    label="Chi tiết lý do từ chối"
                                    fullWidth
                                    multiline
                                    rows={3}
                                    value={refundDetails?.description || ''}
                                    disabled
                                    sx={{
                                        mb: 3,
                                        '& .MuiOutlinedInput-root': {
                                            '& fieldset': {
                                                borderColor: '#c66a7a',
                                            },
                                            '&:hover fieldset': {
                                                borderColor: '#71002b',
                                            },
                                            '&.Mui-disabled': {
                                                backgroundColor: '#ffe3d842',
                                                color: '#c66a7a',
                                            },
                                        },
                                        '& .MuiInputBase-input.Mui-disabled': {
                                            WebkitTextFillColor: '#c66a7a',
                                        },
                                        '& .MuiInputLabel-root': {
                                            color: '#c66a7a',
                                            fontFamily: 'REM',
                                        },
                                    }}
                                />
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 2,
                                    padding: '0 70px'
                                }}>
                                    {refundDetails?.status !== 'APPROVED' && refundDetails?.status !== 'REJECTED' && (
                                        <>
                                            <Button
                                                variant="contained"
                                                onClick={handleApprove}
                                                disabled={loading}
                                                sx={{
                                                    flex: 1,
                                                    bgcolor: '#c66a7a',
                                                    color: '#fff',
                                                    fontFamily: 'REM',
                                                    '&:hover': {
                                                        bgcolor: '#71002b',
                                                    },
                                                    '&.Mui-disabled': {
                                                        bgcolor: '#c66a7a80',
                                                    }
                                                }}
                                            >
                                                {loading ? 'Đang xử lý...' : 'Chấp thuận'}
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                onClick={handleRejectOpen}
                                                disabled={loading}
                                                sx={{
                                                    flex: 1,
                                                    borderColor: '#c66a7a',
                                                    color: '#c66a7a',
                                                    fontFamily: 'REM',
                                                    '&:hover': {
                                                        borderColor: '#71002b',
                                                        color: '#71002b',
                                                        bgcolor: 'transparent',
                                                    },
                                                }}
                                            >
                                                Từ chối
                                            </Button>
                                        </>
                                    )}
                                </Box>

                            </Box>
                        </>
                    ) : (
                        <Typography
                            variant="body1"
                            sx={{
                                color: '#71002b',
                                fontFamily: 'REM'
                            }}
                        >
                            Không có thông tin hoàn tiền.
                        </Typography>
                    )}
                </Box>
            </Modal >
            {/* <RejectReasonModal
                open={isRejectModalOpen}
                onClose={() => setIsRejectModalOpen(false)}
                orderId={refundDetails?.orderId || ''}
                onReject={() => {
                    onReject('');
                    onClose();
                }}
            /> */}
            < RejectReasonModal
                open={isRejectModalOpen}
                onClose={handleRejectClose}
                onConfirm={(reason) => {
                    onReject(reason);
                    handleRejectClose();
                }}
                orderId={refundDetails?.orderId || ''}
                requestId={refundDetails?.requestId || ''}
            />
        </>
    );
};

export default RefundModal;