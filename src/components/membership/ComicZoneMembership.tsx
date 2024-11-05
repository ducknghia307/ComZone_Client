import React, { useEffect, useState } from 'react';
import { Box, Typography, Chip, Button } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { publicAxios } from '../../middleware/axiosInstance';
import StarIcon from '@mui/icons-material/Star';
import TimerIcon from '@mui/icons-material/Timer';
import GavelIcon from '@mui/icons-material/Gavel';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

interface MembershipPlan {
    id: string;
    price: number;
    duration: number;
    offeredResource: number;
}

const ComicZoneMembership: React.FC = () => {
    const [plans, setPlans] = useState<MembershipPlan[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await publicAxios.get('/seller-subs-plans');
                setPlans(response.data);
            } catch (error) {
                console.error("Error fetching membership plans:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const getPlanIcon = (index: number) => {
        switch (index) {
            case 0:
                return <StarIcon sx={{ fontSize: 40, color: '#333' }} />;
            case 1:
                return <StarIcon sx={{ fontSize: 40, color: '#fff' }} />;
            case 2:
                return <AutoAwesomeIcon sx={{ fontSize: 40, color: '#fff' }} />;
            default:
                return <StarIcon sx={{ fontSize: 40 }} />;
        }
    };

    const getPlanTitle = (index: number) => {
        switch (index) {
            case 0:
                return 'BASIC';
            case 1:
                return 'STANDARD';
            case 2:
                return 'PREMIUM';
            default:
                return 'PLAN';
        }
    };

    const getPlanDescription = (index: number) => {
        switch (index) {
            case 0:
                return 'Bắt đầu hành trình của bạn';
            case 1:
                return 'Nâng tầm trải nghiệm';
            case 2:
                return 'Trải nghiệm đỉnh cao';
            default:
                return 'Mô tả gói';
        }
    };

    const getPlanColor = (index: number) => {
        switch (index) {
            case 0:
                return '#F9F9F9';
            case 1:
                return '#4A4A4A';
            case 2:
                return '#000';
            default:
                return '#F9F9F9';
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <Typography variant="h6" sx={{ fontFamily: "REM" }}>Đang tải gói thành viên...</Typography>
            </Box>
        );
    }

    return (
        <Box className="membership-container" sx={{
            padding: '50px',
            backgroundColor: '#FFF',
            borderRadius: '16px',
            margin: '40px auto',
            border: '1px solid black',
            boxShadow: '8px 8px 0px rgba(0,0,0,0.1)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '200px',
                background: 'linear-gradient(135deg, #000 0%, #808080 100%)',
                clipPath: 'polygon(0 0, 100% 0, 100% 60%, 0 100%)',
                zIndex: 0
            }} />

            <Chip
                label="GÓI THÀNH VIÊN TẠI COMZONE"
                icon={<AutoAwesomeIcon sx={{ color: '#FFFFFF !important' }} />}
                sx={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    backgroundColor: '#000',
                    color: '#FFFFFF',
                    padding: '30px 40px',
                    position: 'relative',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 2,
                    fontFamily: "REM",
                    boxShadow: '0 4px 20px #808080',
                    '& .MuiChip-icon': {
                        fontSize: '28px'
                    },
                    border: '2px solid white'
                }}
            />

            <Grid container justifyContent="center" alignItems="stretch" spacing={4} sx={{ paddingTop: '100px', position: 'relative', zIndex: 1 }}>
                {plans.map((plan, index) => (
                    <Grid key={plan.id} size={4} sx={{ display: 'flex' }}>
                        <Box sx={{
                            flex: 1,
                            borderRadius: '24px',
                            padding: '40px 30px',
                            backgroundColor: getPlanColor(index),
                            color: index === 0 ? '#333' : '#FFFFFF',
                            border: index === 0 ? '2px solid #E0E0E0' : 'none',
                            boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden',
                            '&:hover': {
                                transform: 'translateY(-12px)',
                                boxShadow: '0 12px 48px rgba(0,0,0,0.2)',
                            }
                        }}>
                            {index === 2 && (
                                <Chip
                                    label="ĐƯỢC ƯA CHUỘNG"
                                    sx={{
                                        position: 'absolute',
                                        top: 35,
                                        right: -65,
                                        transform: 'rotate(45deg)',
                                        backgroundColor: '#FF4081',
                                        color: '#fff',
                                        fontWeight: 'bold',
                                        fontSize: '12px',
                                        paddingX: '40px'
                                    }}
                                />
                            )}

                            <Box sx={{ textAlign: 'center', mb: 3 }}>
                                {getPlanIcon(index)}
                                <Typography variant="h4" sx={{
                                    fontWeight: 'bold',
                                    mb: 1,
                                    fontFamily: "REM",
                                    fontSize: '28px'
                                }}>
                                    {getPlanTitle(index)}
                                </Typography>
                                <Typography sx={{
                                    opacity: 0.9,
                                    fontFamily: "REM",
                                    fontSize: '16px'
                                }}>
                                    {getPlanDescription(index)}
                                </Typography>
                            </Box>

                            <Box sx={{
                                textAlign: 'center',
                                backgroundColor: index === 0 ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)',
                                borderRadius: '16px',
                                padding: '20px',
                                mb: 3
                            }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                                    <TimerIcon />
                                    <Typography sx={{ fontFamily: "REM", fontSize: '16px' }}>
                                        Thời hạn: <strong>{plan.duration} tháng</strong>
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                                    <GavelIcon />
                                    <Typography sx={{ fontFamily: "REM", fontSize: '16px', whiteSpace: 'nowrap', }}>
                                        Bán đấu giá: <strong>{plan.offeredResource} lần</strong>
                                    </Typography>
                                </Box>
                            </Box>

                            <Button
                                variant="contained"
                                sx={{
                                    mt: 'auto',
                                    backgroundColor: index === 0 ? '#000' : '#FFFFFF',
                                    color: index === 0 ? '#FFFFFF' : getPlanColor(index),
                                    fontWeight: 'bold',
                                    padding: '12px 32px',
                                    borderRadius: '50px',
                                    fontSize: '18px',
                                    textTransform: 'none',
                                    whiteSpace: 'nowrap',
                                    fontFamily: "REM",
                                    boxShadow:
                                        index === 0 ? '0 4px 20px #808080' :
                                            index === 1 ? '0 4px 20px #d9d3d2' :
                                                index === 2 ? '0 4px 20px #FFFFFF' :
                                                    '0 4px 20px rgba(255,255,255,0.4)',
                                    '&:hover': {
                                        backgroundColor: index === 0 ? '#000' : '#FFFFFF',
                                        transform: 'scale(1.05)',
                                    }
                                }}
                            >
                                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(plan.price)}
                            </Button>
                        </Box>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{
                mt: 6,
                textAlign: 'center',
                position: 'relative',
                zIndex: 1
            }}>
                <Typography
                    variant="h4"
                    sx={{
                        fontWeight: 'bold',
                        color: '#FF4081',
                        fontSize: '32px',
                        fontFamily: "REM",
                        mb: 2,
                        textShadow:'2px 2px #000'
                    }}
                >
                    THỬ NGAY GÓI PREMIUM TẠI COMZONE!
                </Typography>
            </Box>
        </Box>
    );
};

export default ComicZoneMembership;