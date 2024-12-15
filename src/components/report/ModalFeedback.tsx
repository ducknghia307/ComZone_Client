import React from 'react';
import { Box, Button, IconButton, Modal, Typography, Rating, Stack, Avatar, Chip, ImageList, ImageListItem, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import { notification } from 'antd';
interface Feedback {
    id: string;
    user: { name: string; avatar: string; };
    seller: { name: string; avatar: string; };
    createdAt: string;
    comment: string;
    rating: number;
    attachedImages: string[];
    isApprove: boolean;
}
interface ModalFeedbackProps {
    isOpen: boolean;
    feedback: Feedback | null;
    onClose: () => void;
    onUpdateFeedback: (updatedFeedback: Feedback) => void;
}
const ModalFeedback: React.FC<ModalFeedbackProps> = ({ isOpen, feedback, onClose, onUpdateFeedback }) => {
    const handleApprove = async () => {
        if (!feedback?.id) {
            console.error("Feedback ID is missing!");
            return;
        }

        console.log(`API URL: /seller-feedback/approve/${feedback.id}`);

        try {
            console.log("Approving feedback ID:", feedback.id);
            const response = await privateAxios.patch(`/seller-feedback/approve/${feedback.id}`);
            console.log("Approval response:", response.data);
            // alert("Feedback đã được duyệt thành công!");
            notification.success({
                message: 'Duyệt Đánh Giá Thành Công!',
                description: 'Đánh giá đã được duyệt thành công.',
                placement: 'topRight',
            });

            // Cập nhật trạng thái feedback qua callback
            const updatedFeedback = { ...feedback, isApprove: true };
            onUpdateFeedback(updatedFeedback);

            onClose(); // Đóng modal
        } catch (error) {
            console.error("Error approving feedback:", error);
            // alert("Có lỗi xảy ra khi duyệt đánh giá!");
            notification.error({
                message: 'Lỗi Khi Duyệt Đánh Giá!',
                description: 'Có lỗi xảy ra khi duyệt đánh giá, vui lòng thử lại sau.',
                placement: 'topRight',
            });
        }
    };

    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="feedback-modal-title"
        >
            <Paper
                elevation={24}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '95%',
                    maxWidth: '800px',
                    bgcolor: '#FFFFFF',
                    borderRadius: '24px',
                    outline: 'none',
                    maxHeight: '90vh',
                    display: 'flex',
                    flexDirection: 'column',
                    overflow: 'hidden',
                }}
            >
                {/* Header */}
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        bgcolor: '#fff',
                        borderBottom: '1px solid rgba(113, 0, 43, 0.1)',
                        position: 'relative',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            background: '#71002b',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            textAlign: 'center',
                            fontFamily: 'REM'
                        }}
                    >
                        Chi Tiết Đánh Giá
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            position: 'absolute',
                            right: 16,
                            color: 'grey.500',
                            '&:hover': {
                                bgcolor: 'rgba(113, 0, 43, 0.04)',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                {/* Content */}
                <Box
                    sx={{
                        overflow: 'auto',
                        flex: 1,
                        px: 3,
                        py: 3,
                        '&::-webkit-scrollbar': {
                            width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '10px',
                            '&:hover': {
                                background: '#555',
                            },
                        },
                    }}
                >
                    {feedback && (
                        <Stack spacing={4}>
                            {/* Time and Rating Section */}
                            <Box
                                sx={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <AccessTimeIcon sx={{ color: '#71002b', fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 400, fontFamily: 'REM' }}>
                                        {new Date(feedback.createdAt).toLocaleString()}
                                    </Typography>
                                </Stack>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Rating
                                        value={feedback.rating}
                                        readOnly
                                        sx={{
                                            '& .MuiRating-iconFilled': {
                                                color: '#c66a7a',
                                            }
                                        }}
                                    />
                                    <Chip
                                        label={`${feedback.rating}/5`}
                                        size="small"
                                        sx={{
                                            bgcolor: '#c66a7a', color: 'white', fontWeight: 400, fontSize: '0.875rem', height: 24, fontFamily: 'REM',
                                        }}
                                    />
                                </Stack>
                            </Box>

                            {/* User and Seller Info */}
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'rgba(113, 0, 43, 0.04)', borderRadius: '16px', p: 2.5,
                                }}
                            >
                                <Stack spacing={2.5} direction="row" justifyContent='space-between' paddingX='30px'>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {/* <Avatar
                                            sx={{
                                                bgcolor: '#71002b', width: 40, height: 40,
                                            }}
                                        >
                                            <PersonOutlineIcon />
                                        </Avatar> */}
                                        <Box>
                                            <Typography sx={{ color: 'grey', fontSize: '13px', fontFamily: 'REM', }}>
                                                Người mua
                                            </Typography>
                                            <Box display="flex" alignItems="center" sx={{ paddingTop: '10px' }}>
                                                <Avatar alt={feedback.user?.name} src={feedback.user?.avatar} sx={{ width: 34, height: 34, marginRight: 1.5 }} />
                                                <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: 'REM' }}>
                                                    {feedback.user?.name || 'Không xác định'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {/* <Avatar
                                            sx={{
                                                bgcolor: '#c66a7a', width: 40, height: 40,
                                            }}
                                        >
                                            <StorefrontOutlinedIcon />
                                        </Avatar> */}
                                        <Box>
                                            <Typography sx={{ color: 'grey', fontSize: '13px', fontFamily: 'REM', }}>
                                                Người bán
                                            </Typography>
                                            <Box display="flex" alignItems="center" sx={{ paddingTop: '10px' }}>
                                                <Avatar alt={feedback.seller?.name} src={feedback.seller?.avatar} sx={{ width: 34, height: 34, marginRight: 1.5 }} />
                                                <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: 'REM' }}>
                                                    {feedback.seller?.name || 'Không xác định'}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Comment Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5, bgcolor: '#F8FAFC', borderRadius: '16px', backgroundColor: 'rgba(113, 0, 43, 0.04)',
                                }}
                            >
                                <Stack spacing={2} >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <ChatOutlinedIcon sx={{ color: '#71002b', fontSize: 20 }} />
                                        <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: 'REM' }}>
                                            Nội dung đánh giá
                                        </Typography>
                                    </Stack>
                                    <Typography
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.6,
                                            fontFamily: 'REM',
                                        }}
                                    >
                                        {feedback.comment}
                                    </Typography>
                                </Stack>
                            </Paper>

                            {/* Images */}
                            {feedback.attachedImages?.length > 0 && (
                                <Paper
                                    elevation={0}
                                    sx={{
                                        p: 2.5, bgcolor: '#F8FAFC', borderRadius: '16px', backgroundColor: 'rgba(113, 0, 43, 0.04)',
                                    }}
                                >
                                    <Stack spacing={2.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <ImageOutlinedIcon sx={{ color: '#71002b', fontSize: 20 }} />
                                            <Typography variant="subtitle1" fontWeight={600} sx={{ fontFamily: 'REM' }}>
                                                Ảnh đánh giá
                                            </Typography>
                                        </Stack>

                                        <ImageList
                                            sx={{
                                                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))!important',
                                                gap: '16px!important',
                                                mt: '8px!important',
                                            }}
                                        >
                                            {feedback.attachedImages.map((image, index) => (
                                                <ImageListItem
                                                    key={index}
                                                    sx={{
                                                        borderRadius: '12px', overflow: 'hidden', bgcolor: 'white', border: '1px solid rgba(0,0,0,0.06)',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)', transition: 'all 0.3s ease', boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                                        },
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            position: 'relative',
                                                            paddingTop: '100%',
                                                        }}
                                                    >
                                                        <img
                                                            src={image}
                                                            alt={`Feedback ${index + 1}`}
                                                            loading="lazy"
                                                            style={{
                                                                position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover',
                                                            }}
                                                        />
                                                    </Box>
                                                </ImageListItem>
                                            ))}
                                        </ImageList>
                                    </Stack>
                                </Paper>
                            )}
                        </Stack>
                    )}
                </Box>

                {/* Buttons */}
                <Box
                    sx={{
                        p: 3,
                        borderTop: '1px solid rgba(113, 0, 43, 0.1)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                    }}
                >
                    {!feedback?.isApprove && (
                        <Button
                            onClick={handleApprove}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(45deg, #71002b 30%, #c66a7a 90%)',
                                color: 'white',
                                px: 4,
                                py: 1.2,
                                borderRadius: '12px',
                                textTransform: 'none',
                                fontWeight: 600,
                                fontSize: '0.95rem',
                                boxShadow: '0 8px 16px rgba(113, 0, 43, 0.3)',
                                '&:hover': {
                                    boxShadow: '0 12px 20px rgba(113, 0, 43, 0.4)',
                                    transform: 'translateY(-1px)',
                                },
                                fontFamily: 'REM',
                            }}
                        >
                            Duyệt Đánh Giá
                        </Button>
                    )}
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            bgcolor: '#fff',
                            color: '#71002b',
                            border: '1px solid #c66a7a',
                            px: 4,
                            py: 1.2,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            fontFamily: 'REM',
                        }}
                    >
                        Đóng
                    </Button>
                </Box>
            </Paper>
        </Modal>
    );
};

export default ModalFeedback;