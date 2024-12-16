import React from 'react';
import { Avatar, Box, Button, IconButton, Modal, Paper, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import { ExchangeData } from '../../common/base.interface';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

interface ModalExchangeDetailProps {
    isOpen: boolean;
    exchange: ExchangeData | null;
    onClose: () => void;
}

const getStatusColor = (status: string) => {
    switch (status) {
        case "PENDING":
            return {
                color: '#f89b28',
                backgroundColor: '#fff2c9',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "DEALING":
            return {
                color: '#ff6b1c',
                backgroundColor: '#ffe8db',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "DELIVERING":
            return {
                color: '#52a7bf',
                backgroundColor: '#daf4ff',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "SUCCESSFUL":
            return {
                color: '#fef6c7',
                backgroundColor: '#395f18',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "FAILED":
            return {
                color: '#e91e63',
                backgroundColor: '#fce4ec',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "REJECTED":
            return {
                color: "#f44336",
                backgroundColor: "#ffebee",
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "AVAILABLE":
            return {
                color: '#4CAF50',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "UNAVAILABLE":
            return {
                color: '#FF9800',
                backgroundColor: '#FFF3E0',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        case "DONE":
            return {
                color: '#2196F3',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
        default:
            return {
                color: '#000',
                backgroundColor: '#fff',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
                fontFamily: "REM"
            };
    }
};

const getStatusText = (status: string) => {
    switch (status) {
        case "PENDING":
            return "Chờ xử lí";
        case "DEALING":
            return "Đang đóng gói";
        case "DELIVERING":
            return "Đang giao hàng";
        case "SUCCESSFUL":
            return "Hoàn tất";
        case "REJECTED":
            return "Bị từ chối";
        case "FAILED":
            return "Thất bại";
        case "AVAILABLE":
            return "Đang được đăng";
        case "UNAVAILABLE":
            return "Không được đăng";
        case "DONE":
            return "Đã xong";
        default:
            return "Tất cả";
    }
};

const formatCurrency = (amount: number | string) => {
    if (amount === null || amount === undefined) return "Không có";
    const formattedAmount = new Intl.NumberFormat('vi-VN').format(Number(amount));
    return `${formattedAmount} đ`;
};

const ModalExchangeDetail: React.FC<ModalExchangeDetailProps> = ({ isOpen, exchange, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="exchange-detail-modal-title"
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
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        p: 3,
                        bgcolor: '#fff',
                        borderBottom: '1px solid rgba(113, 0, 43, 0.1)',
                        position: 'relative',
                    }}
                >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Stack
                            direction="row"
                            alignItems="center"
                            sx={{
                                bgcolor: 'rgba(113, 0, 43, 0.05)',
                                px: 2,
                                py: 1,
                                borderRadius: '12px',
                                gap: 1
                            }}
                        >
                            <AccessTimeIcon sx={{ color: '#71002b', fontSize: 20 }} />
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{
                                    fontWeight: 600,
                                    color: '#71002b',
                                    fontFamily: 'REM',
                                }}
                            >
                                {new Date(exchange?.createdAt).toLocaleString('vi-VN')}
                            </Typography>
                        </Stack>
                    </Box>

                    <Typography
                        variant="h6"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            background: '#71002b',
                            backgroundClip: 'text',
                            textFillColor: 'transparent',
                            textAlign: 'center',
                            flex: 1,
                            marginRight: '120px',
                            fontFamily: 'REM',
                        }}
                    >
                        Chi Tiết Trao Đổi
                    </Typography>

                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: 'grey.500',
                            '&:hover': {
                                bgcolor: 'rgba(113, 0, 43, 0.04)',
                            },
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

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
                    {exchange && (
                        <Stack spacing={4}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    gap: 2,
                                    mb: 2,
                                    padding: "0 20px",
                                    color: '#71002b'
                                }}
                            >
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'REM', }}>
                                        Trạng thái trao đổi:
                                    </Typography>
                                    {/* <span style={getStatusColor(exchange.status)}>{getStatusText(exchange.status)}</span> */}
                                    <span style={getStatusColor(exchange.status)}>
                                        {exchange.status ? getStatusText(exchange.status) : 'Unknown Status'}
                                    </span>
                                </Box>

                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                    <Typography variant="body2" sx={{ fontWeight: 700, fontFamily: 'REM', }}>
                                        Trạng thái bài post:
                                    </Typography>
                                    {/* <span style={getStatusColor(exchange.post.status)}>{getStatusText(exchange.post.status)}</span> */}
                                    <span style={getStatusColor(exchange.post?.status)}>
                                        {exchange.post?.status ? getStatusText(exchange.post.status) : 'Unknown Post Status'}
                                    </span>
                                </Box>
                            </Box>

                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'rgba(113, 0, 43, 0.04)',
                                    borderRadius: '16px',
                                    p: 2.5,
                                }}
                            >
                                <Stack
                                    spacing={2.5}
                                    direction="row"
                                    justifyContent='space-between'
                                    paddingX='30px'
                                >
                                    {/* <Avatar
                                            sx={{
                                                bgcolor: '#71002b', width: 40, height: 40,
                                            }}
                                        >
                                            <SwapVertIcon />
                                        </Avatar> */}
                                    <Box>
                                        <Typography sx={{ color: 'grey', fontSize: '13px', fontFamily: 'REM', }}>
                                            Người gửi yêu cầu
                                        </Typography>
                                        <Box display="flex" alignItems="center" sx={{ paddingTop: '10px' }}>
                                            <Avatar alt={exchange.requestUser.name} src={exchange.requestUser.avatar} sx={{ width: 34, height: 34, marginRight: 1.5 }} />
                                            <Typography sx={{ fontWeight: 'bold', fontFamily: 'REM', }}>{exchange.requestUser.name}</Typography>
                                        </Box>
                                    </Box>

                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        {/* <Avatar
                                            sx={{
                                                bgcolor: '#c66a7a', width: 40, height: 40,
                                            }}
                                        >
                                            <MonetizationOnOutlinedIcon />
                                        </Avatar> */}
                                        {/* <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Người đăng bài trao đổi
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {exchange.post.user.name}
                                            </Typography>
                                        </Box> */}
                                        <Box>
                                            <Typography sx={{ color: 'grey', fontSize: '13px', fontFamily: 'REM', }}>
                                                Người đăng bài trao đổi
                                            </Typography>
                                            <Box display="flex" alignItems="center" sx={{ paddingTop: '10px' }}>
                                                {/* <Avatar alt={exchange.post.user.avatar} src={exchange.post.user.avatar} sx={{ width: 34, height: 34, marginRight: 1.5 }} />
                                                <Typography sx={{ fontWeight: 'bold', fontFamily: 'REM', }}>{exchange.post.user.name}</Typography> */}
                                                {exchange.post?.user ? (
                                                    <>
                                                        <Avatar
                                                            alt={exchange.post.user.avatar || 'User Avatar'}
                                                            src={exchange.post.user.avatar}
                                                            sx={{ width: 34, height: 34, marginRight: 1.5 }}
                                                        />
                                                        <Typography sx={{ fontWeight: 'bold', fontFamily: 'REM' }}>
                                                            {exchange.post.user.name || 'Unknown User'}
                                                        </Typography>
                                                    </>
                                                ) : (
                                                    <Typography>No User Info</Typography>
                                                )}
                                            </Box>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>

                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    bgcolor: 'rgba(113, 0, 43, 0.04)',
                                    borderRadius: '16px',
                                }}
                            >
                                <Stack spacing={2.5}>
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontFamily: 'REM' }}>
                                            Nội dung yêu cầu
                                        </Typography>
                                        <Typography color="text.secondary" sx={{ fontFamily: 'REM' }}>
                                            {/* {exchange.post.postContent} */}
                                            {exchange.post?.postContent ? exchange.post.postContent : 'No post content available'}
                                        </Typography>
                                    </Box>
                                    <Stack direction="row" spacing={2}>
                                        <Box flex={1}>
                                            <Typography variant="subtitle1" fontWeight={600} gutterBottom sx={{ fontFamily: 'REM' }}>
                                                Tiền chênh lệch
                                            </Typography>
                                            <Typography color="text.secondary" sx={{ display: 'inline-flex', alignItems: 'center', fontFamily: 'REM', }}>
                                                {formatCurrency(exchange.compensationAmount)}
                                                {exchange.compensateUser && (
                                                    <Typography variant="body2" color="text.primary" sx={{ fontWeight: 600, fontSize: '14px', ml: 1, display: 'inline-flex', alignItems: 'center', fontFamily: 'REM', }}>
                                                        ({'người bù tiền: '}
                                                        <Box display="inline-flex" alignItems="center" sx={{ marginRight: 0.5, marginLeft: 1 }}>
                                                            <Avatar
                                                                alt={exchange.compensateUser.name}
                                                                src={exchange.compensateUser.avatar}
                                                                sx={{ width: 18, height: 18, marginRight: 0.5 }}
                                                            />
                                                            {exchange.compensateUser.name}
                                                        </Box>
                                                        )
                                                    </Typography>
                                                )}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>
                            {exchange.post?.images && exchange.post?.images?.length > 0 ? (
                                <Paper elevation={0} sx={{ p: 2.5, bgcolor: 'rgba(113, 0, 43, 0.04)', borderRadius: '16px' }}>
                                    <Typography variant="h6" fontWeight={600} gutterBottom sx={{ fontFamily: 'REM' }}>
                                        Hình ảnh
                                    </Typography>
                                    <Stack direction="row" spacing={2} flexWrap="wrap">
                                        {exchange.post.images.map((image, index) => (
                                            <Box key={index} sx={{ width: '100px', height: '150px', borderRadius: '8px', overflow: 'hidden' }}>
                                                <img
                                                    src={image}
                                                    alt={`Image ${index + 1}`}
                                                    style={{ width: '100%', height: '100%', objectFit: 'fill' }}
                                                />
                                            </Box>
                                        ))}
                                    </Stack>
                                </Paper>
                            ) : (
                            <Typography sx={{ fontStyle: 'italic', color: 'gray', textAlign: 'center' }}>
                                No images available
                            </Typography>
                            )}
                        </Stack>
                    )}
                </Box>

                <Box
                    sx={{
                        p: 3,
                        borderTop: '1px solid rgba(113, 0, 43, 0.1)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                        gap: 2,
                        bgcolor: 'rgba(113, 0, 43, 0.02)'
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            bgcolor: '#71002b',
                            color: '#fff',
                            px: 4,
                            py: 1.2,
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            fontSize: '0.95rem',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                                bgcolor: '#c66a7a',
                                // transform: 'scale(1.05)'
                            },
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
export default ModalExchangeDetail;