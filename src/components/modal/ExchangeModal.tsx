import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, IconButton, Box, Typography, Checkbox, TextField, Button, Avatar } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const books = [
    {
        title: 'Thám tử lừng danh Conan',
        author: 'Gosho Aoyama',
        condition: '8/10',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaI9vFLJKXQ0nna8QBy1FBkXzagGq8h68lSA&s'
    },
    {
        title: 'Harry Potter Và Bảo Bối Tử Thần - Tập 7',
        author: 'J.K.Rowling, Lý Lan',
        condition: 'Mới',
        image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMwQyNmH1vt13ySVvL2eaYWcvZu3TqQU-GQpdLRMZC4tRLvMM6golwZLwWY5QmmqMH408&usqp=CAU'
    }
];

const ExchangeModal = ({ open, onClose }) => {
    const [selectedBooks, setSelectedBooks] = useState([]);
    const [confirmationOpen, setConfirmationOpen] = useState(false);
    const [overviewOpen, setOverviewOpen] = useState(false);

    const handleSelectAll = (event) => {
        if (event.target.checked) {
            setSelectedBooks(books.map((_, index) => index));
        } else {
            setSelectedBooks([]);
        }
    };

    const handleSelectBook = (index) => {
        setSelectedBooks((prev) =>
            prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
        );
    };

    const handleNext = () => { // Mở modal chọn truyện muốn trao đổi
        setConfirmationOpen(true);
    };

    const handleConfirmationClose = () => { // Đóng modal chọn truyện muốn trao đổi
        setConfirmationOpen(false);
    };

    const handleConfirm = () => {
        // Đóng tất cả các modal
        setConfirmationOpen(false);
        setOverviewOpen(false);
        onClose(); // Đóng modal chính
    };

    const handleOverviewClose = () => {
        setOverviewOpen(false); // Đóng modal overview
    };

    const handleBackToConfirmation = () => {
        setOverviewOpen(false); // Đóng modal overview
        setConfirmationOpen(true); // Mở lại modal chọn truyện muốn trao đổi
    };

    return (
        <>
            {/* Modal chọn truyện của mình dùng để trao đổi */}
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth sx={{
                '& .MuiPaper-root': {
                    border: '1px solid black',
                    borderRadius: '15px'
                }
            }}>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '28px', margin: '20px auto 0px auto' }}>
                    CHỌN TRUYỆN DÙNG ĐỂ TRAO ĐỔI
                    <IconButton onClick={onClose} sx={{ position: 'absolute', right: 20, top: 20 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ padding: '20px 50px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '20px', marginBottom: '10px' }}>
                        Chọn truyện từ danh sách truyện của bạn:
                    </Typography>

                    <Box>
                        <Checkbox sx={{ fontSize: '16px' }} onChange={handleSelectAll} /> Chọn tất cả
                    </Box>

                    {books.map((book, index) => (
                        <Box key={index} sx={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '5px' }}>
                            <Checkbox
                                checked={selectedBooks.includes(index)}
                                onChange={() => handleSelectBook(index)}
                            />
                            <img src={book.image} alt={book.title} style={{ width: '120px', height: '160px', marginRight: '20px', marginLeft: '5px', marginBottom: '10px', marginTop: '10px' }} />
                            <Box sx={{ marginTop: '5px' }}>
                                <Typography><b>Tên Truyện:</b> {book.title}</Typography>
                                <Typography><b>Tác giả:</b> {book.author}</Typography>
                                <Typography><b>Tình trạng:</b> {book.condition}</Typography>
                            </Box>
                        </Box>
                    ))}

                    <TextField
                        fullWidth
                        placeholder="Ghi chú"
                        sx={{ marginBottom: '20px' }}
                    />

                    <Box sx={{ textAlign: 'center' }}>
                        <Button onClick={handleNext} variant="contained" sx={{ backgroundColor: 'black', color: 'white', padding: '5px 25px', fontWeight: 'bold', fontSize: '16px' }}>
                            Tiếp Theo
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

            {/* Modal chọn truyện muốn được trao đổi */}
            <Dialog open={confirmationOpen} onClose={handleConfirmationClose} maxWidth="md" fullWidth sx={{
                '& .MuiPaper-root': {
                    border: '1px solid black',
                    borderRadius: '15px'
                }
            }}>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '28px', margin: '20px auto 0px auto' }}>
                    CHỌN TRUYỆN DÙNG ĐỂ TRAO ĐỔI
                    <IconButton onClick={handleConfirmationClose} sx={{ position: 'absolute', right: 20, top: 20 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent sx={{ padding: '20px 50px' }}>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Typography sx={{ margin: "auto 0", fontSize: '20px', fontWeight: 'bold' }}>
                            Chọn truyện từ danh sách truyện của:
                        </Typography>
                        <Box display="flex" alignItems="center" sx={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '10px' }}>
                            <Avatar
                                alt="user avatar"
                                src="https://themeisle.com/blog/wp-content/uploads/2024/06/Online-Image-Optimizer-Test-Image-JPG-Version.jpeg"
                                sx={{ mr: 1, width: 30, height: 30 }}
                            />
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Thanh Mai</Typography>
                        </Box>
                    </div>

                    <Box>
                        <Checkbox sx={{ fontSize: '16px' }} onChange={handleSelectAll} /> Chọn tất cả
                    </Box>

                    {books.map((book, index) => (
                        <Box key={index} sx={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '5px' }}>
                            <Checkbox
                                checked={selectedBooks.includes(index)}
                                onChange={() => handleSelectBook(index)}
                            />
                            <img src={book.image} alt={book.title} style={{ width: '120px', height: '160px', marginRight: '20px', marginLeft: '5px', marginBottom: '10px', marginTop: '10px' }} />
                            <Box sx={{ marginTop: '5px' }}>
                                <Typography><b>Tên Truyện:</b> {book.title}</Typography>
                                <Typography><b>Tác giả:</b> {book.author}</Typography>
                                <Typography><b>Tình trạng:</b> {book.condition}</Typography>
                            </Box>
                        </Box>
                    ))}

                    <TextField
                        fullWidth
                        placeholder="Ghi chú"
                        sx={{ marginBottom: '20px' }}
                    />

                    <div style={{ textAlign: 'center' }}>
                        <Button onClick={handleConfirmationClose} variant="contained" sx={{ backgroundColor: 'white', color: 'black', padding: '5px 25px', fontWeight: 'bold', fontSize: '16px', border: '1px solid black' }}>
                            Quay Lại
                        </Button>
                        <Button onClick={() => setOverviewOpen(true)} variant="contained" sx={{ backgroundColor: 'black', color: 'white', padding: '5px 25px', fontWeight: 'bold', fontSize: '16px', marginLeft: '20px' }}>
                            Xác Nhận
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Modal Overview */}
            <Dialog open={overviewOpen} onClose={handleOverviewClose} maxWidth="md" fullWidth>
                <DialogTitle sx={{ fontWeight: 'bold', fontSize: '28px', margin: '20px auto 0px auto' }}>
                    XÁC NHẬN YÊU CẦU TRAO ĐỔI
                    <IconButton onClick={handleConfirm} sx={{ position: 'absolute', right: 20, top: 20 }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>

                <DialogContent>
                    <Typography sx={{ margin: "auto 0", fontSize: '20px', fontWeight: 'bold' }}>1. Truyện bạn đã chọn để trao đổi:</Typography>
                    {books.map((book, index) => (
                        <Box key={index} sx={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '5px' }}>

                            <img src={book.image} alt={book.title} style={{ width: '120px', height: '160px', marginRight: '20px', marginLeft: '5px', marginBottom: '10px', marginTop: '10px' }} />
                            <Box sx={{ marginTop: '5px' }}>
                                <Typography><b>Tên Truyện:</b> {book.title}</Typography>
                                <Typography><b>Tác giả:</b> {book.author}</Typography>
                                <Typography><b>Tình trạng:</b> {book.condition}</Typography>
                            </Box>
                        </Box>
                    ))}

                    <div style={{ display: 'flex', gap: '10px' }}>
                        <Typography sx={{ margin: "auto 0", fontSize: '20px', fontWeight: 'bold' }}>
                            Chọn truyện từ danh sách truyện của:
                        </Typography>
                        <Box display="flex" alignItems="center" sx={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '10px' }}>
                            <Avatar
                                alt="user avatar"
                                src="https://themeisle.com/blog/wp-content/uploads/2024/06/Online-Image-Optimizer-Test-Image-JPG-Version.jpeg"
                                sx={{ mr: 1, width: 30, height: 30 }}
                            />
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Thanh Mai</Typography>
                        </Box>
                    </div>
                    {books.map((book, index) => (
                        <Box key={index} sx={{ display: 'flex', marginBottom: '10px', borderBottom: '1px solid #ddd', paddingBottom: '10px', marginTop: '5px' }}>

                            <img src={book.image} alt={book.title} style={{ width: '120px', height: '160px', marginRight: '20px', marginLeft: '5px', marginBottom: '10px', marginTop: '10px' }} />
                            <Box sx={{ marginTop: '5px' }}>
                                <Typography><b>Tên Truyện:</b> {book.title}</Typography>
                                <Typography><b>Tác giả:</b> {book.author}</Typography>
                                <Typography><b>Tình trạng:</b> {book.condition}</Typography>
                            </Box>
                        </Box>
                    ))}

                    <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
                        <div style={{ textAlign: 'center' }}>
                            <Button onClick={handleBackToConfirmation} variant="contained" sx={{ backgroundColor: 'white', color: 'black', padding: '5px 25px', fontWeight: 'bold', fontSize: '16px', border: '1px solid black' }}>
                                Quay Lại
                            </Button>
                            <Button  onClick={handleConfirm} variant="contained" sx={{ backgroundColor: 'black', color: 'white', padding: '5px 25px', fontWeight: 'bold', fontSize: '16px', marginLeft: '20px' }}>
                                Gửi Yêu Cầu
                            </Button>
                        </div>
                    </Box>
                </DialogContent>
            </Dialog>
        </>

    );
};

export default ExchangeModal;
