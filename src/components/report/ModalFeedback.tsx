import React from 'react';
import { Box, Button, IconButton, Modal, Typography, Rating, Stack, Avatar, Chip, ImageList, ImageListItem, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined';

const ModalFeedback = ({ isOpen, feedback, onClose }) => {
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
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    flexWrap: 'wrap',
                                    gap: 2,
                                }}
                            >
                                <Stack direction="row" alignItems="center" spacing={1}>
                                    <AccessTimeIcon sx={{ color: '#71002b', fontSize: 20 }} />
                                    <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>
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
                                            bgcolor: '#c66a7a',
                                            color: 'white',
                                            fontWeight: 600,
                                            fontSize: '0.875rem',
                                            height: 24,
                                        }}
                                    />
                                </Stack>
                            </Box>

                            {/* User and Seller Info */}
                            <Paper
                                elevation={0}
                                sx={{
                                    bgcolor: 'rgba(113, 0, 43, 0.04)',
                                    borderRadius: '16px',
                                    p: 2.5,
                                }}
                            >
                                <Stack spacing={2.5} direction="row" justifyContent='space-between' paddingX='30px'>
                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar
                                            sx={{
                                                bgcolor: '#71002b',
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <PersonOutlineIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Người mua
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {feedback.user?.name || 'Không xác định'}
                                            </Typography>
                                        </Box>
                                    </Stack>

                                    <Stack direction="row" alignItems="center" spacing={2}>
                                        <Avatar
                                            sx={{
                                                bgcolor: '#c66a7a',
                                                width: 40,
                                                height: 40,
                                            }}
                                        >
                                            <StorefrontOutlinedIcon />
                                        </Avatar>
                                        <Box>
                                            <Typography variant="caption" color="text.secondary" gutterBottom>
                                                Người bán
                                            </Typography>
                                            <Typography variant="subtitle1" fontWeight={600}>
                                                {feedback.seller?.name || 'Không xác định'}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Stack>
                            </Paper>

                            {/* Comment Section */}
                            <Paper
                                elevation={0}
                                sx={{
                                    p: 2.5,
                                    bgcolor: '#F8FAFC',
                                    borderRadius: '16px',
                                    backgroundColor: 'rgba(113, 0, 43, 0.04)',
                                }}
                            >
                                <Stack spacing={2} >
                                    <Stack direction="row" alignItems="center" spacing={1}>
                                        <ChatOutlinedIcon sx={{ color: '#71002b', fontSize: 20 }} />
                                        <Typography variant="subtitle1" fontWeight={600}>
                                            Nội dung đánh giá
                                        </Typography>
                                    </Stack>
                                    <Typography
                                        sx={{
                                            color: 'text.secondary',
                                            lineHeight: 1.6,
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
                                        p: 2.5,
                                        bgcolor: '#F8FAFC',
                                        borderRadius: '16px',
                                        backgroundColor: 'rgba(113, 0, 43, 0.04)',
                                    }}
                                >
                                    <Stack spacing={2.5}>
                                        <Stack direction="row" alignItems="center" spacing={1}>
                                            <ImageOutlinedIcon sx={{ color: '#71002b', fontSize: 20 }} />
                                            <Typography variant="subtitle1" fontWeight={600}>
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
                                                        borderRadius: '12px',
                                                        overflow: 'hidden',
                                                        bgcolor: 'white',
                                                        border: '1px solid rgba(0,0,0,0.06)',
                                                        '&:hover': {
                                                            transform: 'translateY(-4px)',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
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
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                objectFit: 'cover',
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

                {/* Footer */}
                <Box
                    sx={{
                        p: 3,
                        borderTop: '1px solid rgba(113, 0, 43, 0.1)',
                        display: 'flex',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Button
                        onClick={onClose}
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