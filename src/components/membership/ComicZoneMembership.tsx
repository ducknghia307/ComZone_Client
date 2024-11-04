import React from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import "../ui/ComicZoneMembership.css";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';

const ComicZoneMembership: React.FC = () => {
    return (
        <Box className="membership-container" sx={{ padding: '60px', backgroundColor: '#F3FBFF', borderRadius: '8px', margin:'40px auto' }}>
            <Chip
                label="GÓI THÀNH VIÊN TẠI COMZONE"
                sx={{
                    fontSize: '20px',
                    fontWeight: 'bold',
                    backgroundColor: '#FF4081',
                    color: '#FFFFFF',
                    padding: '15px',
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}
            />

            <Grid container justifyContent="center" alignItems="center" spacing={1} paddingTop={'50px'}>
                {/* Basic (Freemium) Plan */}
                <Grid size={6} className="membership-box basic-plan" sx={{ backgroundColor: '#FFFFFF', borderRadius: '10px', padding: '20px', border: '1px solid #000' }}>
                    <Typography variant="h5" className="plan-title" sx={{ fontWeight: 'bold', color: '#333', mb: 2, textAlign: 'center' }}>
                        FREEMIUM
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#555', textAlign: 'center' }}>
                        Sử dụng dịch vụ nhanh chóng, dễ dàng
                    </Typography>
                    <ul className="plan-features">
                        <li><CancelIcon style={{ color: '#FF5252', marginRight: '8px' }} /> Đăng bán 3 truyện đầu tiên miễn phí</li>
                        <li><CancelIcon style={{ color: '#FF5252', marginRight: '8px' }} /> Tham gia đấu giá truyện</li>
                        <li><CancelIcon style={{ color: '#FF5252', marginRight: '8px' }} /> Lưu lại các truyện yêu thích</li>
                        <li><CancelIcon style={{ color: '#FF5252', marginRight: '8px' }} /> Nhận thông báo về các đợt đấu giá mới</li>
                    </ul>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="outlined"
                            sx={{
                                backgroundColor: '#FFFFFF',
                                color: '#000',
                                border: '2px solid #000',
                                fontWeight: 'bold',
                                padding: '2px 20px',
                                borderRadius: '50px', 
                                fontSize: '16px',
                                textTransform: 'none', 
                            }}
                        >
                            Miễn phí
                        </Button>
                    </Box>
                </Grid>

                {/* Premium Plan */}
                <Grid size={6} className="membership-box premium-plan" sx={{ backgroundColor: '#38419e', borderRadius: '10px', padding: '20px', border: '1px solid #000' }}>
                    <Typography variant="h5" className="plan-title" sx={{ fontWeight: 'bold', color: '#fff', mb: 2, textAlign: 'center' }}>
                        PREMIUM 💎
                    </Typography>
                    <Typography variant="body1" sx={{ mb: 2, color: '#fff', textAlign: 'center' }}>
                        Trọn gói dịch vụ, đáp ứng đầy đủ và nhanh nhất
                    </Typography>
                    <ul className="plan-features">
                        <li style={{ color: '#fff' }}><CheckCircleIcon style={{ color: '#4CAF50', marginRight: '8px' }} /> Đăng truyện không giới hạn số lượng</li>
                        <li style={{ color: '#fff' }}><CheckCircleIcon style={{ color: '#4CAF50', marginRight: '8px' }} /> Đặt giá cao hơn với thông báo sớm</li>
                        <li style={{ color: '#fff' }}><CheckCircleIcon style={{ color: '#4CAF50', marginRight: '8px' }} /> Nhắn tin trực tiếp với người mua/bán</li>
                        <li style={{ color: '#fff' }}><CheckCircleIcon style={{ color: '#4CAF50', marginRight: '8px' }} /> Tăng khả năng hiển thị truyện</li>
                        <li style={{ color: '#fff' }}><CheckCircleIcon style={{ color: '#4CAF50', marginRight: '8px' }} /> Ưu đãi độc quyền từ ComicZone</li>
                    </ul>
                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: '#FF4081',
                                color: '#FFFFFF',
                                fontWeight: 'bold',
                                padding: '2px 20px',
                                borderRadius: '50px', 
                                fontSize: '16px',
                                textTransform: 'none',
                            }}
                        >
                            200,000 VND / tháng
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Typography
                variant="h4"
                className="try-now-text"
                sx={{
                    textAlign: 'center',
                    mt: 4,
                    fontWeight: 'bold',
                    color: '#FF4081',
                    fontSize: '28px',
                    textShadow: '1px 1px 0 #FFFFFF, 1px 1px 0 #FF4081, 2px 2px 0 #D0006F',
                }}
            >
                THỬ NGAY GÓI PREMIUM TẠI COMZONE!
            </Typography>
        </Box>
    );
};

export default ComicZoneMembership;
