import React from 'react';
import { Box, Button, IconButton, Modal, Paper, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
interface Feedback {
    createdAt: string;
    comment: string;
    rating: number;
    attachedImages: string[]; // Assuming images are URLs
}
interface ModalFeedbackProps {
    isOpen: boolean;
    feedback: Feedback | null;
    onClose: () => void;
}
const ModalFeedback: React.FC<ModalFeedbackProps> = ({ isOpen, feedback, onClose }) => {
    return (
        <Modal
            open={isOpen}
            onClose={onClose}
            aria-labelledby="feedback-modal-title"
            aria-describedby="feedback-modal-description"
        >
            <Paper
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90%',
                    maxWidth: '700px',
                    bgcolor: '#ffffff',
                    borderRadius: '16px',
                    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                    p: 0,
                    outline: 'none',
                    display: 'flex',
                    flexDirection: 'column',
                    maxHeight: '90vh',
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid rgba(0,0,0,0.08)',
                        bgcolor: '#ffffff',
                        p: 2.5,
                        borderRadius: '16px 16px 0 0',
                    }}
                >
                    <Typography
                        id="feedback-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{
                            fontWeight: 700,
                            fontSize: '1.25rem',
                            color: '#1a1a1a',
                            textAlign: 'center',
                            width: '100%',
                        }}
                    >
                        Chi Tiết Đánh Giá
                    </Typography>
                    <IconButton
                        onClick={onClose}
                        sx={{
                            color: '#666',
                            position: 'absolute',
                            right: '8px',
                            '&:hover': {
                                bgcolor: 'rgba(0,0,0,0.04)',
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
                        '&::-webkit-scrollbar': {
                            width: '8px',
                        },
                        '&::-webkit-scrollbar-track': {
                            background: '#f1f1f1',
                            borderRadius: '4px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#888',
                            borderRadius: '4px',
                            '&:hover': {
                                background: '#666',
                            },
                        },
                    }}
                >
                    {feedback && (
                        <Box sx={{ px: 3, py: 3 }}>
                            <Box
                                sx={{
                                    mb: 3,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    gap: 2,
                                }}
                            >
                                <Box
                                    sx={{
                                        p: 2.5,
                                        bgcolor: '#f8f9fa',
                                        borderRadius: '12px',
                                        border: '1px solid rgba(0,0,0,0.06)',
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 2,
                                            color: '#333',
                                            '& strong': {
                                                color: '#1a1a1a',
                                                fontWeight: 600,
                                                marginRight: '8px',
                                            }
                                        }}
                                    >
                                        <strong>Thời gian:</strong>
                                        {new Date(feedback.createdAt).toLocaleString()}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 2,
                                            color: '#333',
                                            '& strong': {
                                                color: '#1a1a1a',
                                                fontWeight: 600,
                                                marginRight: '8px',
                                            }
                                        }}
                                    >
                                        <strong>Nội dung:</strong>
                                        {feedback.comment}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: '#333',
                                            '& strong': {
                                                color: '#1a1a1a',
                                                fontWeight: 600,
                                                marginRight: '8px',
                                            }
                                        }}
                                    >
                                        <strong>Đánh giá:</strong>
                                        {feedback.rating} sao
                                    </Typography>
                                </Box>

                                <Box sx={{ mt: 1 }}>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mb: 2,
                                            color: '#1a1a1a',
                                            fontWeight: 600,
                                        }}
                                    >
                                        Ảnh đánh giá
                                    </Typography>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: 2,
                                        }}
                                    >
                                        {feedback.attachedImages.map((image, imgIndex) => (
                                            <Box
                                                key={imgIndex}
                                                sx={{
                                                    width: '150px',
                                                    height: '200px',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                                                    transition: 'transform 0.2s ease-in-out',
                                                    '&:hover': {
                                                        transform: 'scale(1.02)',
                                                    },
                                                }}
                                            >
                                                <img
                                                    src={image}
                                                    alt={`Feedback Image ${imgIndex + 1}`}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                    }}
                                                />
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    )}
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        borderTop: '1px solid rgba(0,0,0,0.08)',
                        p: 2.5,
                        bgcolor: '#ffffff',
                        borderRadius: '0 0 16px 16px',
                    }}
                >
                    <Button
                        onClick={onClose}
                        variant="contained"
                        sx={{
                            bgcolor: '#1a1a1a',
                            color: 'white',
                            textTransform: 'none',
                            px: 4,
                            py: 1,
                            borderRadius: '8px',
                            fontSize: '0.95rem',
                            fontWeight: 500,
                            boxShadow: 'none',
                            '&:hover': {
                                bgcolor: '#333',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
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
