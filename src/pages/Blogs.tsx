import React, { useState } from 'react';
import { Avatar, Box, Button, Card, CardContent, CardMedia, Dialog, DialogContent, DialogTitle, IconButton, TextField, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import Grid from '@mui/material/Grid2';
import CloseIcon from '@mui/icons-material/Close';
import ExchangeModal from '../components/modal/ExchangeModal';

const posts = [
    {
        user: "Thanh Mai",
        wantBooks: ["Conan", "Harry Potter"],
        offerBooks: ["Clamp CLOVER", "Một chiến dịch ở Bắc Kỳ"],
        images: [
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSaI9vFLJKXQ0nna8QBy1FBkXzagGq8h68lSA&s",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJolUi6vw9-qUavTe5q_yrdORoN_y2yeL3I9Sl3TnicTNLvRAzoHkJ-3LpfII2M9OYwP4&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRMwQyNmH1vt13ySVvL2eaYWcvZu3TqQU-GQpdLRMZC4tRLvMM6golwZLwWY5QmmqMH408&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFX250qf6i6PgImvvHLinVEIKfuBmhapFkBxz-ImRxO6J-8_R8HC-JXUqXexZ7c1E-MU&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFX250qf6i6PgImvvHLinVEIKfuBmhapFkBxz-ImRxO6J-8_R8HC-JXUqXexZ7c1E-MU&usqp=CAU",
            "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQuFX250qf6i6PgImvvHLinVEIKfuBmhapFkBxz-ImRxO6J-8_R8HC-JXUqXexZ7c1E-MU&usqp=CAU",
        ]
    }
];

const Blogs = () => {
    const [open, setOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [newPostOpen, setNewPostOpen] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);

    const [openExchangeModal, setOpenExchangeModal] = useState(false);

    const handleOpenExchangeModal = () => setOpenExchangeModal(true);
    const handleCloseExchangeModal = () => setOpenExchangeModal(false);

    const handleImageChange = (event) => {
        const files = Array.from(event.target.files);
        const images = files.map((file) => URL.createObjectURL(file));
        setSelectedImages((prevImages) => [...prevImages, ...images]);
    };

    const handleOpen = (post) => {
        setSelectedPost(post);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    const handleNewPostOpen = () => setNewPostOpen(true);
    const handleNewPostClose = () => setNewPostOpen(false);

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ textAlign: 'center', paddingTop: '30px' }}>
                <Typography sx={{ mb: 2, fontSize: '40px', fontWeight: 'bold' }}>
                    BLOG TRAO ĐỔI TRUYỆN TRANH
                </Typography>
                <Typography sx={{ mb: 4, fontSize: '20px' }}>
                    Trao đổi truyện tranh yêu thích dễ dàng cùng các nhà sưu tầm trên nền tảng của chúng tôi!
                </Typography>

            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '30px' }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ backgroundColor: 'black', textTransform: 'none', fontWeight: 'bold', fontSize: '16px' }}
                    onClick={handleNewPostOpen}
                >
                    Đăng post mới
                </Button>

                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm"
                    InputProps={{ endAdornment: <SearchIcon /> }}
                    sx={{ width: '300px' }}
                    size='small'
                />
            </div>

            {/* post exchange */}
            <Grid container spacing={3} justifyContent="center" sx={{ paddingBottom: '30px' }}>
                {posts.map((post, index) => (
                    <Grid size={12} key={index}>
                        <div style={{ padding: '40px', border: '1px solid #000', borderRadius: '10px' }}>
                            <div style={{ display: 'flex', paddingBottom: '15px', justifyContent: 'space-between' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <Typography sx={{ margin: "auto 0", fontSize: '20px', fontWeight: 'bold' }}>
                                        Người đăng:
                                    </Typography>
                                    <Box display="flex" alignItems="center" sx={{ border: '1px solid #000', padding: '5px 15px', borderRadius: '10px' }}>
                                        <Avatar
                                            alt="user avatar"
                                            src="https://themeisle.com/blog/wp-content/uploads/2024/06/Online-Image-Optimizer-Test-Image-JPG-Version.jpeg"
                                            sx={{ mr: 1, width: 30, height: 30 }}
                                        />
                                        <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{post.user}</Typography>
                                    </Box>
                                </div>
                                <div>
                                    <Button onClick={() => handleOpen(post)} sx={{ color: '#000', backgroundColor: '#fff', padding: '5px 15px', border: 'solid 1px #000', fontWeight: 'bold', textTransform: 'none', fontSize: '16px' }}>Xem chi tiết</Button>
                                </div>
                            </div>

                            <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>
                                    Cần tìm truyện:
                                </Typography>
                                <Typography sx={{ margin: "auto 0" }}>
                                    {post.wantBooks.join(", ")}
                                </Typography>
                            </div>

                            <div style={{ display: 'flex', paddingBottom: '15px' }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>
                                    Truyện để trao đổi:
                                </Typography>
                                <Typography sx={{ margin: "auto 0" }}>
                                    {post.offerBooks.join(", ")}
                                </Typography>
                            </div>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                {post.images.map((img, i) => (
                                    <div>
                                        <img src={img} style={{ width: "150px", height: "200px" }} />
                                    </div>
                                ))}
                            </Grid>

                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                <Button
                                    variant="contained"
                                    onClick={handleOpenExchangeModal}
                                    sx={{ backgroundColor: 'black', color: 'white', textTransform: 'none', fontSize: '16px', padding: '5px 25px', fontWeight:'bold' }}
                                >
                                    Yêu cầu trao đổi
                                </Button>
                            </Box>
                        </div>
                    </Grid>
                    
                ))}
            </Grid>
            <ExchangeModal open={openExchangeModal} onClose={handleCloseExchangeModal} />

            {/* Dialog (Modal) */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth sx={{
                '& .MuiPaper-root': {
                    border: '1px solid black',
                    borderRadius: '15px'
                }
            }}>
                <DialogTitle sx={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', paddingTop: '40px' }}>
                    CHI TIẾT YÊU CẦU TRAO ĐỔI
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{ position: 'absolute', right: 20, top: 20, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: '30px' }}>
                    {selectedPost && (
                        <Box sx={{ padding: "10px 40px" }}>
                            <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>
                                    Cần tìm truyện:
                                </Typography>
                                <Typography sx={{ margin: "auto 0" }}>
                                    {selectedPost.wantBooks.join(", ")}
                                </Typography>
                            </div>
                            <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>
                                    Tác giả:
                                </Typography>
                                <Typography sx={{ margin: "auto 0" }}>
                                    Charles-Édouard Hocquard
                                </Typography>
                            </div>

                            <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>
                                    Tình trạng:
                                </Typography>
                                <Typography sx={{ margin: "auto 0" }}>
                                    9/10 Rất mới
                                </Typography>
                            </div>

                            <div style={{ display: 'flex', paddingBottom: '10px' }}>
                                <Typography sx={{ fontSize: '20px', fontWeight: 'bold', mr: 1 }}>
                                    Truyện để trao đổi:
                                </Typography>
                                <Typography sx={{ margin: "auto 0" }}>
                                    {selectedPost.offerBooks.join(", ")}
                                </Typography>
                            </div>

                            <Grid container spacing={3} sx={{ mt: 1 }}>
                                {selectedPost.images.map((img, i) => (
                                    <div>
                                        <img src={img} alt={`book-${i + 1}`} style={{ width: "130px", height: "180px" }} />
                                    </div>
                                ))}
                            </Grid>
                        </Box>
                    )}
                </DialogContent>
            </Dialog>

            {/* Modal Đăng Bài Mới */}
            <Dialog open={newPostOpen} onClose={handleNewPostClose} maxWidth="md" fullWidth sx={{
                '& .MuiPaper-root': {
                    border: '1px solid black',
                    borderRadius: '15px'
                }
            }}>
                <DialogTitle
                    sx={{
                        textAlign: 'center',
                        fontSize: '24px',
                        fontWeight: 'bold',
                        paddingTop: '40px',
                    }}
                >
                    ĐĂNG BÀI TRAO ĐỔI
                    <IconButton
                        onClick={handleNewPostClose}
                        sx={{ position: 'absolute', right: 20, top: 20, color: (theme) => theme.palette.grey[500] }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ paddingBottom: '20px' }}>
                    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Typography
                            sx={{ color: '#1976d2', cursor: 'pointer', marginTop: '10px' }}
                            component="label"
                        >
                            Ảnh Truyện Muốn Trao Đổi
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                        </Typography>
                        <Box
                            component="label"
                            sx={{
                                display: 'flex',
                                width: '100%',
                                maxWidth: '700px',  // Giới hạn chiều rộng
                                margin: '0 auto',
                                height: '100px',
                                borderRadius: '8px',
                                border: '2px dashed #ccc',
                                cursor: 'pointer',
                                position: 'relative',
                                // backgroundColor: '#f5f5f5',
                                justifyContent: 'center',
                                alignItems: 'center',
                                overflow: 'hidden',
                                flexWrap: 'wrap',
                                gap: '10px',
                                padding: "10px 60px",
                                marginTop: '10px'
                            }}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageChange}
                                style={{ display: 'none' }}
                            />
                            {selectedImages.length === 0 ? (
                                <AddIcon
                                    sx={{
                                        fontSize: '40px',
                                        color: '#888',
                                    }}
                                />
                            ) : (
                                selectedImages.slice(0, 5).map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt={`selected-${index}`}
                                        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                    />
                                ))
                            )}
                            {selectedImages.length > 5 && (
                                <Box
                                    sx={{
                                        width: '80px',
                                        height: '80px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                        color: 'white',
                                        fontSize: '18px',
                                        borderRadius: '8px',
                                    }}
                                >
                                    +{selectedImages.length - 5}
                                </Box>
                            )}
                        </Box>

                    </Box>

                    <div style={{ padding: "10px 60px" }}>
                        <div style={{ marginBottom: '20px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Cần Tìm Truyện</Typography>
                            <TextField
                                placeholder="Cần Tìm Truyện"
                                fullWidth
                                sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Truyện Để Trao Đổi</Typography>
                            <TextField
                                placeholder="Truyện Để Trao Đổi"
                                fullWidth
                                sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Tình Trạng Truyện Để Trao Đổi</Typography>
                            <TextField
                                placeholder="Tình Trạng Truyện Để Trao Đổi"
                                fullWidth
                                sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
                            />
                        </div>
                        <div style={{ marginBottom: '20px' }}>
                            <Typography sx={{ fontWeight: 'bold' }}>Tác Giả Truyện Để Trao Đổi</Typography>
                            <TextField
                                placeholder="Tác Giả Truyện Để Trao Đổi"
                                fullWidth
                                sx={{ backgroundColor: '#f5f5f5', borderRadius: '8px' }}
                            />
                        </div>
                    </div>

                    <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: 'black',
                                color: 'white',
                                textTransform: 'none',
                                fontSize: '16px',
                                padding: '10px 50px',
                                borderRadius: '8px',
                            }}
                        >
                            Đăng bài
                        </Button>
                    </Box>
                </DialogContent>
            </Dialog>

        </div>
    );
};

export default Blogs;