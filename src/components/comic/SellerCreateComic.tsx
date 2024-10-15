import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import ImportContactsRoundedIcon from '@mui/icons-material/ImportContactsRounded';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import { TextField, Button, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';
import CameraAltOutlinedIcon from '@mui/icons-material/CameraAltOutlined';
import "../ui/SellerCreateComic.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { Link, useNavigate } from 'react-router-dom';

const SellerCreateComic = () => {
    const navigate = useNavigate();
    const [selectedMenuItem, setSelectedMenuItem] = useState('comic');
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        genre: '',
        price: '',
        language: '',
        series: '',
        sellingType: 'normal',
    });

    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);


    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleImageChange = (e, setImage) => {
        const file = e.target.files[0];
        if (file) {
            setImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form Submitted:', formData);
    };

    const renderCreateComicForm = () => (
        <div className="form-container">

            <div className="create-comic-form">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowBackIcon sx={{ fontSize: '40px', cursor: 'pointer' }} onClick={() => navigate('/sellermanagement')} />
                        <Typography sx={{ paddingBottom: '30px', color: '#000', fontWeight: 'bold', margin: '0 auto' }} variant="h4" className="form-title">THÊM TRUYỆN MỚI</Typography>
                    </div>
                    <div className="image-upload-section">
                        <div className="image-upload" onClick={() => document.getElementById('frontImageUpload').click()}>
                            <div className="image-upload-circle">
                                {frontImage ? <img src={frontImage} alt="Front" className="uploaded-image" /> : <CameraAltOutlinedIcon />}
                            </div>
                            <Typography className="image-upload-text">Ảnh Mặt Trước</Typography>
                        </div>
                        <input
                            type="file"
                            id="frontImageUpload"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setFrontImage)}
                        />
                        <div className="image-upload" onClick={() => document.getElementById('backImageUpload').click()}>
                            <div className="image-upload-circle">
                                {backImage ? <img src={backImage} alt="Back" className="uploaded-image" /> : <CameraAltOutlinedIcon />}
                            </div>
                            <Typography className="image-upload-text">Ảnh Mặt Sau</Typography>
                        </div>
                        <input
                            type="file"
                            id="backImageUpload"
                            style={{ display: 'none' }}
                            accept="image/*"
                            onChange={(e) => handleImageChange(e, setBackImage)}
                        />
                    </div>
                    <Grid container columnSpacing={7} rowSpacing={3}>
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Tên Truyện</Typography>
                            <TextField
                                fullWidth
                                label="Tên Truyện"
                                name="title"
                                value={formData.title}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Tác Giả</Typography>
                            <TextField
                                fullWidth
                                label="Tác Giả"
                                name="author"
                                value={formData.author}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Thể Loại</Typography>
                            <TextField
                                fullWidth
                                label="Thể Loại"
                                name="genre"
                                value={formData.genre}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Giá</Typography>
                            <TextField
                                fullWidth
                                label="Giá"
                                name="price"
                                value={formData.price}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Ngôn Ngữ</Typography>
                            <TextField
                                fullWidth
                                label="Ngôn Ngữ"
                                name="language"
                                value={formData.language}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Tập/Bộ</Typography>
                            <TextField
                                fullWidth
                                label="Tập/Bộ"
                                name="series"
                                value={formData.series}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                    </Grid>
                    <div className="selling-type-section">
                        <Typography sx={{ color: '#000', fontWeight: 'bold' }}>Chọn hình thức bán</Typography>
                        <RadioGroup
                            row
                            name="sellingType"
                            value={formData.sellingType}
                            onChange={handleInputChange}
                            className="radio-group"
                        >
                            <FormControlLabel value="normal" control={<Radio sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }} />} label="Bán thông thường" />
                            <FormControlLabel value="auction" control={<Radio sx={{ color: '#000', '&.Mui-checked': { color: '#000' } }} />} label="Bán đấu giá" />
                        </RadioGroup>
                    </div>
                    <div className="form-submit-section">
                        <Button component={Link}
                            to="/sellermanagement" type="submit" variant="contained" className="submit-button">
                            {formData.sellingType === 'normal' ? 'Đăng Truyện Ngay' : 'Nhập Chi Tiết Đấu Giá'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'comic':
                return renderCreateComicForm();
            case 'auction':
                return <Typography variant="h4">Quản Lý Đấu Giá</Typography>;
            case 'delivery':
                return <Typography variant="h4">Thông Tin Giao Hàng</Typography>;
            default:
                return <Typography variant="h4">Chọn một mục để hiển thị nội dung</Typography>;
        }
    };

    return (
        <div className="seller-container">
            <Grid container spacing={3}>
                <Grid size={2} className="seller-menu">
                    <div className="menu-seller-section">
                        <ul>
                            <li
                                className={selectedMenuItem === 'comic' ? 'active' : ''}
                                onClick={() => handleMenuItemClick('comic')}
                            >
                                <ImportContactsRoundedIcon /> Quản Lý Truyện
                            </li>
                            <li
                                className={selectedMenuItem === 'auction' ? 'active' : ''}
                                onClick={() => handleMenuItemClick('auction')}
                            >
                                <TvOutlinedIcon /> Quản Lý Đấu Giá
                            </li>
                            <li
                                className={selectedMenuItem === 'delivery' ? 'active' : ''}
                                onClick={() => handleMenuItemClick('delivery')}
                            >
                                <DeliveryDiningOutlinedIcon /> Thông Tin Giao Hàng
                            </li>
                        </ul>
                    </div>
                </Grid>
                <Grid size={10} sx={{ padding: '0 80px' }}>
                    <div className="content-section">

                        {renderContent()}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SellerCreateComic;