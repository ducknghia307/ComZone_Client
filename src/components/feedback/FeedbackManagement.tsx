import { Box, Chip, IconButton, InputAdornment, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import ModalFeedback from '../modal/ModalFeedback';
import { StarTwoTone } from '@ant-design/icons';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
interface Feedback {
    createdAt: string;
    comment: string;
    rating: number;
    attachedImages: string[];
    isApprove: boolean;
}

const FeedbackManagement = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        privateAxios.get("/seller-feedback")
            .then((response) => {
                console.log("All Feedbacks:", response.data);
                const approvedFeedbacks = response.data.filter((feedback: Feedback) => feedback.isApprove);
                console.log("Feedbacks approves:", approvedFeedbacks);
                setFeedbacks(approvedFeedbacks);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);

    const openModal = (feedback: Feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const paginatedData = feedbacks.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <div className='seller-container' style={{ width: '100%', overflow: 'hidden' }}>
            <Typography variant="h5" className="content-header">Quản lí đánh giá</Typography>
            {feedbacks.length === 0 ? (
                <Chip
                    label="Bạn chưa nhận được đánh giá nào"
                    style={{
                        margin: 'auto',
                        display: 'inline-flex',
                        backgroundColor: '#f0f0f0',
                        color: '#000',
                        fontSize: '16px',
                        padding: '20px',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            ) : (<>
                <Box sx={{ marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <TextField
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchOutlinedIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            size='small'
                            placeholder="Tìm kiếm đánh giá..."
                            variant="outlined"
                        />
                    </div>
                </Box>
                <TableContainer component={Paper} className="auction-table-container" sx={{ border: '1px solid black' }}>
                    <Table>
                        <TableHead>
                            <TableRow style={{ backgroundColor: 'black' }}>
                                <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Thời Gian</TableCell>
                                <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Nội Dung</TableCell>
                                <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Đánh giá</TableCell>
                                <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Ảnh Đánh Giá</TableCell>
                                <TableCell style={{ color: 'white', textAlign: 'center', whiteSpace: 'nowrap' }}>Chi Tiết</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {paginatedData.map((feedback, index) => (
                                <TableRow key={index}>
                                    <TableCell style={{ whiteSpace: 'nowrap' }} align="center">{new Date(feedback.createdAt).toLocaleString()}</TableCell>
                                    <TableCell style={{ whiteSpace: 'nowrap' }} align="center">{(feedback.comment)}</TableCell>
                                    <TableCell align="center">{feedback.rating} <StarTwoTone twoToneColor="#fcdb03" /></TableCell>
                                    <TableCell align="center">{feedback.attachedImages.length} ảnh</TableCell>
                                    <TableCell align="center">
                                        <IconButton color="primary" onClick={() => openModal(feedback)}>
                                            <VisibilityOutlinedIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 15]}
                        component="div"
                        count={feedbacks.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={handleChangePage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                </TableContainer>
            </>)}

            <ModalFeedback
                isOpen={isModalOpen}
                feedback={selectedFeedback}
                onClose={closeModal}
            />
        </div>
    );
};

export default FeedbackManagement;