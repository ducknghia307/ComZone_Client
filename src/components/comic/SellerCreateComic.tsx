import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import ImportContactsRoundedIcon from '@mui/icons-material/ImportContactsRounded';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import { TextField, Button, Typography, Autocomplete, IconButton, Chip } from '@mui/material';
import "../ui/SellerCreateComic.css";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { privateAxios, publicAxios } from '../../middleware/axiosInstance';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

interface Genre {
    id: string;
    name: string;
}

interface ComicFormData {
    title: string;
    author: string;
    genre: Genre[];
    price: string;
    language: string;
    series: string;
    quantity: string;
    description: string;
    isAuction: boolean;
    isExchange: boolean;
    comicCommission: string;
}

const SellerCreateComic = () => {
    const navigate = useNavigate();
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('comic');
    const [formData, setFormData] = useState<ComicFormData>({
        title: '',
        author: '',
        genre: [],
        price: '',
        language: '',
        series: '',
        quantity: '1',
        description: '',
        isAuction: false,
        isExchange: false,
        comicCommission: '0',
    });

    const [genres, setGenres] = useState<Genre[]>([]);
    const [coverImages, setCoverImages] = useState<string[]>([]);
    const [contentImages, setContentImages] = useState<string[]>([]);

    useEffect(() => {
        publicAxios.get('/genres')
            .then((response) => {
                const genreData = response.data;

                // Đảm bảo genres là một mảng
                const genresData: Genre[] = genreData.genres || [];

                // Lấy tên các thể loại và in ra console
                const genreNames = genresData.map((genre) => genre.name);
                console.log("Genre Names:", genreNames);

                // Cập nhật comic để bao gồm tên thể loại
                const updatedComic = {
                    ...genreData,
                    genreNames: genreNames,
                };

                console.log("Updated Comic with Genres:", updatedComic);

                setGenres(genreData);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    console.log(genres);

    const handleFileChange = (
        event: React.ChangeEvent<HTMLInputElement>,
        setImageState: React.Dispatch<React.SetStateAction<string[]>>,
        maxImages: number
    ) => {
        const files = event.target.files;
        const fileArray = files ? Array.from(files).map(file => URL.createObjectURL(file)) : [];
    
        // Kiểm tra nếu số lượng ảnh vượt quá giới hạn
        if (fileArray.length > maxImages) {
            alert(`Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh!`);
            return;
        }
    
        setImageState(fileArray); // Thay thế ảnh cũ bằng ảnh mới
    };

    const handleGenreChange = (event: any, newValue: Genre[]) => {
        setFormData({ ...formData, genre: newValue });
    };


    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRemoveImage = (
        index: number,
        setImageState: React.Dispatch<React.SetStateAction<string[]>>
    ) => {
        setImageState((prevImages) => prevImages.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Chuẩn bị dữ liệu gửi đi
        const comicData = {
            // sellerId: "your-seller-id", 
            genreIds: formData.genre.map((g) => g.id),
            title: formData.title,
            author: formData.author,
            description: formData.description,
            coverImage: coverImages,
            previewChapter: contentImages,
            publishedDate: new Date().toISOString(),
            price: parseFloat(formData.price) || 0,
            quantity: parseInt(formData.quantity) || 1,
            isAuction: formData.isAuction ? 1 : 0,
            isExchange: formData.isExchange ? 1 : 0,
            comicCommission: parseFloat(formData.comicCommission) || 0,
        };

        console.log("Comic Data to Send:", comicData);
        console.log("Comic Data to Send:", JSON.stringify(comicData, null, 2));

        // Gửi dữ liệu lên API
        privateAxios.post('/comics', comicData)
            .then((response) => {
                console.log('Comic Created:', response.data);
                alert('Truyện mới đã được thêm thành công!');
                navigate('/sellermanagement');
            })
            .catch((error) => {
                console.error('Error creating comic:', error);
                alert('Đã có lỗi xảy ra khi thêm truyện.');
            });
    };

    // const handleDropdownChange = (name: keyof ComicFormData, value: string) => {
    //     setFormData({ ...formData, [name]: value === '1' }); // Set true for '1', false for '0'
    // };    


    const renderImageUploadSection = (
        title: string,
        images: string[],
        setImageState: React.Dispatch<React.SetStateAction<string[]>>,
        maxImages: number
    ) => (
        <>
            <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
                <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>{title}</Typography>
                <input
                    accept="image/*"
                    type="file"
                    multiple
                    onChange={(e) => handleFileChange(e, setImageState, maxImages)}
                    style={{ display: 'none' }}
                    id={`${title.replace(/\s/g, '-')}-upload`}
                />
                <label htmlFor={`${title.replace(/\s/g, '-')}-upload`}>
                    <Button
                        component="span"
                        sx={{
                            textTransform: 'none',
                            fontWeight: 'bold',
                            marginLeft: '10px',
                            color: '#000',
                            backgroundColor: '#fff',
                            border: '1px solid black',
                            borderRadius: '10px',
                            padding: '5px 15px',
                        }}
                        startIcon={<CloudUploadOutlinedIcon />}
                    >
                        Tải lên
                    </Button>
                </label>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '15px', flexWrap: 'wrap' }}>
                {images.map((image, index) => (
                    <div key={index} style={{ position: 'relative' }}>
                        <img
                            src={image}
                            alt={`uploaded-${index}`}
                            style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: '8px' }}
                        />
                        <IconButton
                            onClick={() => handleRemoveImage(index, setImageState)}
                            sx={{
                                position: 'absolute',
                                top: '5px',
                                right: '5px',
                                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                                color: 'white',
                                padding: '2px',
                                '&:hover': {
                                    backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                },
                            }}
                        >
                            <CloseIcon fontSize="small" />
                        </IconButton>
                    </div>
                ))}
            </div>
        </>
    );
    

    const renderCreateComicForm = () => (
        <div className="form-container">
            <div className="create-comic-form">
                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <ArrowBackIcon sx={{ fontSize: '40px', cursor: 'pointer' }} onClick={() => navigate('/sellermanagement')} />
                        <Typography sx={{ paddingBottom: '50px', color: '#000', fontWeight: 'bold', margin: '0 auto' }} variant="h4" className="form-title">THÊM TRUYỆN MỚI</Typography>
                    </div>

                    {/* Phần tải lên ảnh bìa - tối đa 4 ảnh */}
                    {renderImageUploadSection("Ảnh Bìa", coverImages, setCoverImages, 4)}

                    {/* Phần tải lên ảnh nội dung - tối đa 5 ảnh */}
                    {renderImageUploadSection("Ảnh Nội Dung", contentImages, setContentImages, 5)}

                    <Grid container columnSpacing={7} rowSpacing={3} sx={{ paddingTop: '20px' }}>
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
                            <Autocomplete
                                multiple
                                options={genres}
                                getOptionLabel={(option) => option.name}
                                value={formData.genre}
                                onChange={handleGenreChange}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Chọn Thể Loại" />
                                )}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                        <Chip
                                            // key={option.id}
                                            label={option.name}
                                            {...getTagProps({ index })}
                                            onDelete={() => {
                                                const newGenres = formData.genre.filter((_, i) => i !== index);
                                                setFormData({ ...formData, genre: newGenres });
                                            }}
                                        />
                                    ))
                                }
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
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Số Lượng</Typography>
                            <TextField
                                fullWidth
                                label="Số Lượng"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                                type='number'
                            />
                        </Grid>
                        {/* <Grid size={2}>
                            <Typography sx={{ paddingBottom: '10px', fontWeight: 'bold' }}>Đấu Giá</Typography>
                            <TextField
                                select
                                value={formData.isAuction}
                                onChange={(e) => handleDropdownChange('isAuction', e.target.value)}
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                            >
                                <option value="0">Không</option>
                                <option value="1">Có</option>
                            </TextField>
                        </Grid>
                        <Grid size={2}>
                            <Typography sx={{ paddingBottom: '10px', fontWeight: 'bold' }}>Trao Đổi</Typography>
                            <TextField
                                select
                                value={formData.isExchange}
                                onChange={(e) => handleDropdownChange('isExchange', e.target.value)}
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                            >
                                <option value="0">Không</option>
                                <option value="1">Có</option>
                            </TextField>
                        </Grid>
                        <Grid size={2}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Phí Hoa Hồng</Typography>
                            <TextField
                                fullWidth
                                label="Phí Hoa Hồng"
                                name="comicCommission"
                                value={formData.comicCommission}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid> */}
                        <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Mô Tả Truyện</Typography>
                            <TextField
                                fullWidth
                                label="Mô Tả Truyện"
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid>
                    </Grid>
                    <div className="form-submit-section">
                        <Button
                            type="submit" variant="contained" className="submit-button">
                            Xác Nhận
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
                {/* <Grid size={2} className="seller-menu">
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
                </Grid> */}
                <Grid size={10} sx={{ padding: '0 80px', margin:'auto' }}>
                    <div className="content-section">

                        {renderContent()}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SellerCreateComic;