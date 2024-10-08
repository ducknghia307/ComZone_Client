import React from 'react';
import Grid from '@mui/material/Grid';
import "../ui/ComicDetail.css"
import { Button, Typography } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import StarIcon from '@mui/icons-material/Star';

const ComicDetails = () => {
    return (
        <div className='container-comic'>
            <Grid container spacing={2.5} className='frame'>
                <Grid item xs={5} className='left-frame'>
                    <div className='big-img'>
                        <img
                            src="https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg?_gl=1*f7gx7h*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODM3MTA0OC4zMi4xLjE3MjgzNzIwMDQuNTUuMC4xMDk5ODg2NjI."
                            alt="Conan Comic"
                            style={{ width: '270px', height: 'auto' }}
                        />
                    </div>

                    <div className='small-img'>
                        <img
                            src="https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg?_gl=1*f7gx7h*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODM3MTA0OC4zMi4xLjE3MjgzNzIwMDQuNTUuMC4xMDk5ODg2NjI."
                            alt="Conan Small Image 1"
                            style={{ width: '90px', height: 'auto' }}
                        />
                        <img
                            src="https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_4_tap_102.jpg"
                            alt="Conan Small Image 2"
                            style={{ width: '90px', height: 'auto' }}
                        />
                        <img
                            src="https://blogger.googleusercontent.com/img/a/AVvXsEgEajcSgInbrqIu1Hzau3OGo6wqwgpG34u3IWBqgI9LU9wj2vx7bP3buUZfByRf6PkGsh7aHS1CofZ2n52BL2xrQwIawg7rn3BI_btX6rYsx6cPASJJOu5-GXxt68Fn49ju1kBqCwH_cc6Lvj1p6pGN_OHl4pSP2ACP6Z2P_BOZMZrDvhPk0I2MD2lapA"
                            alt="Conan Small Image 3"
                            style={{ width: '90px', height: 'auto' }}
                        />
                    </div>
                    <div className='button'>
                        <Button sx={{ textTransform: 'none' }} className='button1'><AddShoppingCartIcon />Thêm Vào Giỏ Hàng</Button>
                        <Button sx={{ textTransform: 'none' }} className='button2'>Mua Ngay</Button>
                    </div>
                </Grid>

                <Grid item xs={7} className='detail-frame'>
                    <div className='detail1' style={{marginBottom:"20px"}}>
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
            </Grid>
        </div>
    );
};

export default ComicDetails;
