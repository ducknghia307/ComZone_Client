import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import "../ui/ComicDetail.css"
import { Box, Button, IconButton, Modal, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';
import Carousel from 'react-multi-carousel';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 580,
    height: 300,
    bgcolor: '#221F1F',
    // border: '2px solid #000',
    boxShadow: 24,
    color: '#fff',
    p: 4,
    borderRadius: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
};

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 4.5,
        slidesToSlide: 2,
    },
    desktop: {
        breakpoint: { max: 1024, min: 800 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 800, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const CustomButtonGroup = ({ next, previous, goToSlide, carouselState }) => {
    const { currentSlide, totalItems, slidesToShow } = carouselState;
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide + slidesToShow >= totalItems;

    return (
        <div className="custom-button-group">
            {!isFirstSlide && (
                <button className="custom-button custom-button-left" onClick={previous}>
                    <ChevronLeftIcon />
                </button>
            )}
            {!isLastSlide && (
                <button className="custom-button custom-button-right" onClick={next}>
                    <ChevronRightIcon />
                </button>
            )}
        </div>
    );
};

const ComicDetails = () => {
    const [open, setOpen] = React.useState(false);

    const [imageModalOpen, setImageModalOpen] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const handleOpen = () => {
        setOpen(true);
        setTimeout(() => {
            handleClose();
        }, 2000);
    };
    const handleClose = () => setOpen(false);

    const handleImageModalOpen = (index) => {
        setCurrentImageIndex(index);
        setImageModalOpen(true);
    };

    const handleImageModalClose = () => {
        setImageModalOpen(false);
    };

    const images = [
        "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg?_gl=1*f7gx7h*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODM3MTA0OC4zMi4xLjE3MjgzNzIwMDQuNTUuMC4xMDk5ODg2NjI.",
        "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_4_tap_102.jpg",
        "https://blogger.googleusercontent.com/img/a/AVvXsEgEajcSgInbrqIu1Hzau3OGo6wqwgpG34u3IWBqgI9LU9wj2vx7bP3buUZfByRf6PkGsh7aHS1CofZ2n52BL2xrQwIawg7rn3BI_btX6rYsx6cPASJJOu5-GXxt68Fn49ju1kBqCwH_cc6Lvj1p6pGN_OHl4pSP2ACP6Z2P_BOZMZrDvhPk0I2MD2lapA"
    ];

    const nextImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };


    return (
        <div className='container-comic'>
            <Grid container spacing={2.5} className='frame'>
                <Grid size={{ xs: 5 }} className='left-frame'>
                    <div className='big-img'>
                        <img
                            src={images[0]}
                            alt="Conan Comic"
                            style={{ width: '270px', height: 'auto', cursor: 'pointer' }}
                            onClick={() => handleImageModalOpen(0)}
                        />
                    </div>

                    <div className='small-img'>
                        {images.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`Conan Small Image ${index + 1}`}
                                style={{ width: '90px', height: 'auto', cursor: 'pointer' }}
                                onClick={() => handleImageModalOpen(index)}
                            />
                        ))}
                    </div>

                    {/* Image Modal */}
                    <Modal
                        open={imageModalOpen}
                        onClose={handleImageModalClose}
                        aria-labelledby="image-modal-title"
                        aria-describedby="image-modal-description"
                    >
                        <Box sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '80%',
                            height: '80%',
                            bgcolor: 'background.paper',
                            boxShadow: 24,
                            p: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <IconButton
                                aria-label="close"
                                onClick={handleImageModalClose}
                                sx={{
                                    position: 'absolute',
                                    right: 8,
                                    top: 8,
                                    color: (theme) => theme.palette.grey[500],
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                            <img
                                src={images[currentImageIndex]}
                                alt={`Large Comic Image ${currentImageIndex + 1}`}
                                style={{ maxWidth: '100%', maxHeight: '80%', objectFit: 'contain' }}
                            />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mt: 2 }}>
                                <Button
                                    sx={{
                                        color: '#fff',
                                        backgroundColor: '#000',
                                        '&:hover': {
                                            backgroundColor: '#333',
                                        },
                                        padding: '8px 20px'
                                    }}
                                    onClick={prevImage} startIcon={<ChevronLeftIcon />}>
                                    Previous
                                </Button>
                                <Button
                                    sx={{
                                        color: '#fff',
                                        backgroundColor: '#000',
                                        '&:hover': {
                                            backgroundColor: '#333',
                                        },
                                        padding: '8px 20px'
                                    }}
                                    onClick={nextImage} endIcon={<ChevronRightIcon />}>
                                    Next
                                </Button>
                            </Box>
                        </Box>
                    </Modal>

                    <div className='button'>
                        <Button onClick={handleOpen} sx={{ textTransform: 'none' }} className='button1'><AddShoppingCartIcon />Thêm Vào Giỏ Hàng</Button>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="modal-modal-title"
                            aria-describedby="modal-modal-description"
                        >
                            <Box sx={style} gap={5}>
                                <img style={{ borderRadius: '50%', width: '110px', height: 'auto' }} src='https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRBJ_WI8f100AmOgoU3Js3qbE0B2NAe9Zs9uA&s' />
                                <Typography id="modal-modal-description" sx={{ mt: 2, fontSize: '28px' }}>
                                    Sản phẩm đã được thêm vào giỏ hàng
                                </Typography>
                            </Box>
                        </Modal>
                        <Button sx={{ textTransform: 'none' }} className='button2'>Mua Ngay</Button>
                    </div>
                </Grid>

                <Grid size={{ xs: 7 }} className='detail-frame'>
                    <div className='detail1' style={{ marginBottom: "20px" }}>
                        <Typography className='title'>Thám Tử Lừng Danh Conan - Tập 102</Typography>
                        <div className='author'>
                            <Typography className='title1'>
                                Bộ: <span className="blue-text">Thám Tử Lừng Danh Conan Tuyển Tập Đặc Biệt</span>
                            </Typography>
                            <Typography className='title1'>
                                Tác giả: <span className="author-name">Gosho Aoyama</span>
                            </Typography>
                        </div>

                        <div className="rating-sold">
                            <p className="rating"><p className="rating">{[...Array(5)].map((_, index) => (
                                <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                            ))}</p></p>
                            <div className="divider"></div>
                            <p className="sold-info">Đã bán 1014</p>
                        </div>
                        <p className='price'>24.000đ</p>
                    </div>

                    <div className='detail2'>
                        <Typography className='info'>Thông tin chi tiết</Typography>
                        <div className='authorinfo'>
                            <Typography className='infoleft'>
                                Tác giả:
                            </Typography>
                            <Typography className='inforight'>
                                Gosho Aoyama
                            </Typography>
                            <div className="divider"></div>
                        </div>
                        <div className='authorinfo'>
                            <Typography className='infoleft'>
                                Ngôn ngữ:
                            </Typography>
                            <Typography className='inforight'>
                                Tiếng Việt
                            </Typography>
                            <div className="divider"></div>
                        </div>
                        <div className='authorinfo'>
                            <Typography className='infoleft'>
                                Thể loại:
                            </Typography>
                            <Typography className='infogenre'>
                                Cuộc phiêu lưu, Bí ẩn, Lãng mạn, Cuộc sống học đường
                            </Typography>
                            <div className="divider"></div>
                        </div>
                        <Typography className='note'>Giá sản phẩm trên ComZone đã bao gồm thuế theo luật hiện hành.
                            Bên cạnh đó, tuỳ vào loại sản phẩm, hình thức và địa chỉ giao hàng mà
                            có thể phát sinh thêm chi phí khác như: Phụ phí đóng gói, phí vận chuyển,
                            phụ phí hàng cồng kềnh,... </Typography>
                    </div>
                </Grid>
                <Grid size={{ xs: 12 }} className='detail-frame2' sx={{ marginTop: '20px' }}>
                    <div className='related'>
                        <Typography variant='h5' style={{ fontWeight: "600", paddingLeft: '10px', paddingBottom: '10px' }}>SẢN PHẨM LIÊN QUAN</Typography>
                    </div>
                    <div className=" w-full related-cards">
                        <Carousel
                            responsive={responsive}
                            customButtonGroup={<CustomButtonGroup />}
                            renderButtonGroupOutside={true}
                        >

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>

                            <div className="related-card">
                                <img
                                    src="https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg"
                                    alt=""
                                    className=" object-cover mx-auto"
                                />
                                <p className="description">Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái</p>
                                <p className="price">64,350đ</p>
                                <div className="rating-sold1">
                                    <p className="rating">{[...Array(5)].map((_, index) => (
                                        <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                    ))}</p>
                                    <div className="divider"></div>
                                    <p className="sold-info">Đã bán 1014</p>
                                </div>
                            </div>


                        </Carousel>
                    </div>
                </Grid>

                {/* chưa login/signup */}
                <Grid size={{ xs: 12 }} className='detail-frame3' sx={{ marginTop: '20px' }}>
                    <div className="rating-section" >
                        <Typography variant='h5' style={{ fontWeight: "600", paddingTop: '10px', paddingLeft: '20px', paddingBottom: '10px' }}>Đánh giá sản phẩm</Typography>
                        <div className="rating-overview" style={{ padding: '0 30px' }}>
                            <div className="rating-score" style={{ paddingRight: '30px' }}>
                                <div className="rating-score-detail">
                                    <Typography variant="h3" style={{ fontWeight: "bold" }}>0</Typography>
                                    <Typography variant="h5">/5</Typography>
                                </div>
                                <p className="rating">{[...Array(5)].map((_, index) => (
                                    <StarIcon key={index} style={{ width: "20px", color: "#ccc" }} />
                                ))}</p>
                                <Typography style={{ fontSize: '14px' }}>(0 đánh giá)</Typography>
                            </div>
                            <div className="rating-breakdown" style={{ width: "30%" }}>
                                {[5, 4, 3, 2, 1].map(star => (
                                    <div className="rating-row" key={star}>
                                        <Typography>{star} sao</Typography>
                                        <div className="rating-bar">
                                            <div className="bar" style={{ width: '0%' }}></div>
                                        </div>
                                        <Typography>0%</Typography>
                                    </div>
                                ))}
                            </div>
                            <Typography style={{ margin: 'auto', fontSize: '14px' }}>
                                Chỉ có thành viên mới có thể viết nhận xét. Vui lòng <a href="/login">đăng nhập</a> hoặc <a href="/register">đăng ký</a>.
                            </Typography>
                        </div>

                    </div>
                </Grid>

                {/* tất cả đánh giá */}
                <Grid size={{ xs: 12 }} className='detail-frame4' sx={{ marginTop: '20px' }}>
                    <div className="review-section">
                        <Typography variant='h5' style={{ fontWeight: "600", paddingBottom: '10px' }}>TẤT CẢ ĐÁNH GIÁ</Typography>

                        <div className="review-item">
                            <div className="review-header">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnREvTod720f9SbWLf_lp5JTOoJ4OIJTGOXQ&s"
                                    alt=""
                                    className="avatar"
                                />
                                <div className="user-info">
                                    <Typography variant="body1" className="user-name">thanhmai2709</Typography>
                                    <div className="review-date">
                                        <Typography variant="body2">2024-10-02 22:59</Typography>
                                    </div>
                                    <div className="star-rating">
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                        ))}
                                    </div>
                                    <div className="review-content">
                                        <Typography>
                                            Truyện này quá tuyệt, cốt truyện hấp dẫn và hình ảnh minh họa đẹp.
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                        </div>

                        <div className="gap-feedback"></div>

                        <div className="review-item">
                            <div className="review-header">
                                <img
                                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQnREvTod720f9SbWLf_lp5JTOoJ4OIJTGOXQ&s"
                                    alt=""
                                    className="avatar"
                                />
                                <div className="user-info">
                                    <Typography variant="body1" className="user-name">thanhmai2709</Typography>
                                    <div className="review-date">
                                        <Typography variant="body2">2024-10-02 22:59</Typography>
                                    </div>
                                    <div className="star-rating">
                                        {[...Array(5)].map((_, index) => (
                                            <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                        ))}
                                    </div>
                                    <div className="review-content">
                                        <Typography>
                                            Truyện này quá tuyệt, cốt truyện hấp dẫn và hình ảnh minh họa đẹp.
                                        </Typography>
                                    </div>
                                </div>

                            </div>
                        </div>

                    </div>
                </Grid>



            </Grid>

        </div>
    );
};

export default ComicDetails;
