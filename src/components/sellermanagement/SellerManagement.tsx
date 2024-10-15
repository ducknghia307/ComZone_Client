import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Typography, TextField, Box, InputAdornment } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid2';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import ImportContactsRoundedIcon from '@mui/icons-material/ImportContactsRounded';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import DeliveryDiningOutlinedIcon from '@mui/icons-material/DeliveryDiningOutlined';
import "../ui/SellerCreateComic.css"
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const SellerManagement = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('comic');
    const [selectionModel, setSelectionModel] = useState([]);
    const navigate = useNavigate();

    const handleMenuItemClick = (item) => {
        setSelectedMenuItem(item);
        if (item === 'comic') {
            navigate('/sellermanagement'); 
        }
    };

    const columns: GridColDef[] = [
        {
            field: 'image', headerName: 'Ảnh truyện', flex: 0.75, headerClassName: 'custom-header', headerAlign: 'center', align: 'center',
            renderCell: (params) => (
                <img src={params.value} alt="Truyện" style={{ width: 70, height: 100 }} />
            )
        },
        { field: 'title', headerName: 'Tên truyện', flex: 1, headerClassName: 'custom-header', headerAlign: 'center', align: 'center' },
        { field: 'author', headerName: 'Tác giả', flex: 1, headerClassName: 'custom-header', headerAlign: 'center', align: 'center' },
        { field: 'price', headerName: 'Giá (đ)', flex: 0.5, headerClassName: 'custom-header', headerAlign: 'center', align: 'center', sortComparator: (v1, v2) => Number(v1) - Number(v2),},
        { field: 'genre', headerName: 'Thể loại', flex: 2.25, headerClassName: 'custom-header', headerAlign: 'center', align: 'center' },
        { field: 'language', headerName: 'Ngôn ngữ', flex: 0.75, headerClassName: 'custom-header', headerAlign: 'center', align: 'center' },
        {
            field: 'status', headerName: 'Trạng thái', flex: 0.75, headerClassName: 'custom-header', headerAlign: 'center', align: 'center'
        },
        {
            field: 'actions', headerName: 'Xem/Xóa', flex: 1, headerClassName: 'custom-header', headerAlign: 'center', align: 'center', renderCell: () => (
                <>
                    <Button variant="text" color="primary">View</Button>
                    <Button variant="text" color="error">Delete</Button>
                </>
            )
        },
    ];

    const rows = [
        {
            id: 1,
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS3MA07l4q4eYYmFiBvHJYJa0HgfknJYxmUQg&s',
            title: 'Thám tử lừng danh Conan',
            author: 'Gosho Aoyama',
            price: '50.000',
            genre: 'Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường',
            language: 'Tiếng việt',
            status: 'Đang bán',
        },
        {
            id: 2,
            image: 'https://example.com/image2.jpg',
            title: 'Thám tử lừng danh Conan',
            author: 'Gosho Aoyama',
            price: '140.000',
            genre: 'Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường',
            language: 'Tiếng việt',
            status: 'Ngừng bán',
        },
        {
            id: 3,
            image: 'https://example.com/image2.jpg',
            title: 'Thám tử lừng danh Conan',
            author: 'Gosho Aoyama',
            price: '60.000',
            genre: 'Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường',
            language: 'Tiếng việt',
            status: 'Ngừng bán',
        }, {
            id: 4,
            image: 'https://example.com/image2.jpg',
            title: 'Thám tử lừng danh Conan',
            author: 'Gosho Aoyama',
            price: '170.000',
            genre: 'Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường',
            language: 'Tiếng việt',
            status: 'Ngừng bán',
        },
        {
            id: 5,
            image: 'https://example.com/image2.jpg',
            title: 'Thám tử lừng danh Conan',
            author: 'Gosho Aoyama',
            price: '10.000',
            genre: 'Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường',
            language: 'Tiếng việt',
            status: 'Ngừng bán',
        },
        {
            id: 6,
            image: 'https://example.com/image2.jpg',
            title: 'Thám tử lừng danh Conan',
            author: 'Gosho Aoyama',
            price: '200.000',
            genre: 'Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường',
            language: 'Tiếng việt',
            status: 'Ngừng bán',
        },
    ];

    const paginationModel = { page: 0, pageSize: 5 };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'comic':
                return (
                    <div>
                        <Typography variant="h5" className="content-header">Quản lí truyện tranh</Typography>
                        <Box sx={{ marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Button
                                    variant="contained"
                                    sx={{ borderRadius: '20px', backgroundColor: '#D9D9D9', color: '#000' }}
                                    startIcon={<AddIcon />}
                                    component={Link}
                                    to="/sellermanagement/createcomic"
                                >
                                    Thêm truyện mới
                                </Button>
                                <TextField slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchOutlinedIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }} size='small' placeholder="Tìm kiếm truyện..." variant="outlined" />
                            </div>
                        </Box>

                        <div style={{ height: 'auto', width: '100%' }}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                initialState={{ pagination: { paginationModel } }}
                                pageSizeOptions={[5, 10]}
                                rowHeight={120}
                                disableExtendRowFullWidth={false}
                                sx={{
                                    border: 1,
                                    "& .MuiDataGrid-columnHeader": {
                                        backgroundColor: "#000000",
                                        color: "#ffffff",
                                    },
                                    "& .MuiDataGrid-cell": {
                                        justifyContent: 'center',
                                        display: 'flex',
                                        alignItems: 'center',
                                    },
                                    "& .MuiDataGrid-sortIcon": {
                                        color: "#ffffff !important",
                                    },
                                    "& .MuiDataGrid-iconButtonContainer": {
                                        color: "#ffffff !important",
                                    },
                                    "& .MuiDataGrid-menuIconButton": {
                                        color: "#ffffff !important",
                                    }
                                }}
                            />
                        </div>
                    </div>
                );
            case 'auction':
                return <Typography variant="h4">Quản Lý Đấu Giá</Typography>;
            case 'delivery':
                return <Typography variant="h4">Thông Tin Giao Hàng</Typography>;
            default:
                return <Typography variant="h4">Chọn một mục để hiển thị nội dung</Typography>;
        }
    };

    return (
        <div className='seller-container'>
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

                <Grid size={10}>
                    <div style={{ padding: '20px' }}>
                        {renderContent()}
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default SellerManagement;