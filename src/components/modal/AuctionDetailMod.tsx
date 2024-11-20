import React, { useEffect, useState } from 'react';
import { Typography, Box, DialogTitle, alpha, IconButton, Chip, DialogContent, Stack, Divider, useTheme, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, styled, Dialog } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { Close as CloseIcon } from '@mui/icons-material';

const AuctionDetailMod = ({ open, onCancel, comic, auctionData, onSuccess, onClose }) => {
    const [form] = Form.useForm();

    const sellerInfo = auctionData?.sellerInfo || {};
    console.log(sellerInfo);

    const theme = useTheme();

    useEffect(() => {
        if (auctionData) {
            form.setFieldsValue({
                title: comic.title,
                reservePrice: auctionData.reservePrice,
                maxPrice: auctionData.maxPrice,
                priceStep: auctionData.priceStep,
                startTime: dayjs(auctionData.startTime),
                endTime: dayjs(auctionData.endTime),
            });
        }
        console.log("Auction Status:", auctionData.status);

    }, [auctionData, comic, form]);

    const StyledDialog = styled(Dialog)(({ theme }) => ({
        '& .MuiDialog-paper': {
            borderRadius: theme.spacing(2),
            maxHeight: '90vh',
            maxWidth: '50vw',
            boxShadow: theme.shadows[10]
        }
    }));

    const InfoRow = ({ label, value, isPaid }: { label: string; value: string | number; isPaid?: boolean; }) => {
        const theme = useTheme();

        return (
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                py={1}
                px={3}
                sx={{
                    '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.light, 0.05),
                        borderRadius: 1
                    }
                }}
            >
                <Typography
                    color="text.secondary"
                    variant="body2"
                    sx={{
                        whiteSpace: 'nowrap', fontWeight: 'bold', color: '#000', fontSize: '16px'
                    }}
                >
                    {label}
                </Typography>
                <Typography
                    variant="body1"
                    fontWeight={500}
                    sx={{
                        paddingLeft: 2,
                        color: isPaid !== undefined
                            ? (isPaid ? '#32CD32' : '#ff9800')
                            : '#000',
                        whiteSpace: 'normal',
                        wordWrap: 'break-word',
                    }}

                >
                    {value}
                </Typography>
            </Box>
        );
    };

    const getStatusChipStyles = (status: string) => {
        switch (status) {
            case 'SUCCESSFUL':
                return { color: '#4caf50', backgroundColor: '#e8f5e9', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
            case 'PROCESSING':
                return { color: '#ff9800', backgroundColor: '#fff3e0', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block', };
            case 'COMPLETED':
                return { color: '#009688', backgroundColor: '#e0f2f1', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
            case 'ONGOING':
                return { color: '#2196f3', backgroundColor: '#e3f2fd', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
            case 'FAILED':
                return { color: '#e91e63', backgroundColor: '#fce4ec', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
            case 'REJECTED':
                return { color: '#f44336', backgroundColor: '#ffebee', borderRadius: '8px', padding: '8px 20px', fontWeight: 'bold', display: 'inline-block' };
        }
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case 'SUCCESSFUL':
                return 'Thành công';
            case "COMPLETED":
                return "Hoàn thành";
            case 'PROCESSING':
                return 'Đang xử lí';
            case 'ONGOING':
                return 'Đang diễn ra';
            case 'FAILED':
                return 'Thất bại';
            case 'REJECTED':
                return 'Bị từ chối';
            default:
                return status;
        }
    };

    return (
        <StyledDialog
            open={open} onClose={onClose} maxWidth="md" fullWidth
        >
            <DialogTitle
                sx={{
                    p: 3,
                    backgroundColor: alpha(theme.palette.background.default, 0.5),
                }}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Chip
                        label={translateStatus(auctionData.status)}
                        sx={{
                            ...getStatusChipStyles(auctionData.status),
                            fontSize: '14px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    />

                    <Typography
                        variant="h5"
                        fontWeight="bold"
                        sx={{
                            fontSize: '1.5rem',
                            color: theme.palette.text.primary,
                            textTransform: 'uppercase',
                        }}
                    >
                        Chi tiết đơn hàng
                    </Typography>
                    <IconButton
                        onClick={onCancel}
                        size="small"
                        sx={{
                            color: theme.palette.grey[500],
                            '&:hover': {
                                backgroundColor: alpha(theme.palette.grey[500], 0.1)
                            }
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>

                <Box mt={2}>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 500, mb: '10px'
                        }}
                    >
                        Thời gian bắt đầu: {new Date(auctionData.startTime).toLocaleString()}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            color: theme.palette.text.secondary,
                            fontWeight: 500
                        }}
                    >
                        Thời gian kết thúc: {new Date(auctionData.endTime).toLocaleString()}
                    </Typography>
                </Box>
            </DialogTitle>

            <DialogContent sx={{ p: 3, backgroundColor: 'alpha(theme.palette.background.default, 0.5)' }}>
                <Stack spacing={3}>
                    <Grid container spacing={3} >
                        <Grid size={12} sx={{ borderBottom: `1px solid ${theme.palette.divider}`, borderTop: `1px solid ${theme.palette.divider}`, paddingTop: '10px', paddingBottom: '10px' }}>
                            <Stack divider={<Divider />} spacing={2} direction="row" justifyContent="space-between" padding={'10px 20px'}>
                                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                    <Chip
                                        label="Thông tin đấu giá"
                                        sx={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            padding: '18px 25px',
                                            fontFamily: "REM",
                                            border: '2px solid black',
                                        }}
                                    />
                                    <InfoRow label="Giá khởi điểm" value={auctionData.reservePrice.toLocaleString()} />
                                    <InfoRow label="Bước giá" value={auctionData.priceStep.toLocaleString()} />
                                    <InfoRow label="Giá hiện tại" value={auctionData.currentPrice.toLocaleString()} />
                                </Box>

                                <Divider orientation="vertical" flexItem />

                                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                                    <Chip
                                        label="Thông tin người bán"
                                        sx={{
                                            fontSize: '18px',
                                            fontWeight: 'bold',
                                            backgroundColor: '#fff',
                                            color: '#000',
                                            padding: '18px 25px',
                                            fontFamily: "REM",
                                            border: '2px solid black',
                                        }}
                                    />
                                    <InfoRow label="Họ tên" value={sellerInfo.name} />
                                    <InfoRow label="Số điện thoại" value={sellerInfo.phone} />
                                    <InfoRow label="Địa chỉ" value={sellerInfo.address} />
                                </Box>
                            </Stack>
                        </Grid>

                        <Grid size={12} sx={{ paddingLeft: '20px', paddingRight: '20px' }}>
                            <Chip
                                label="Thông tin truyện"
                                sx={{
                                    fontSize: '18px', fontWeight: 'bold', backgroundColor: '#fff', color: '#000', padding: '18px 25px', fontFamily: "REM", border: '2px solid black', marginBottom: '20px'
                                }}
                            />
                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: 'rgba(0,0,0,0.05)' }}>
                                            <TableCell sx={{ color: 'black', fontSize: '16px' }}>Ảnh Chính</TableCell>
                                            <TableCell sx={{ color: 'black', fontSize: '16px' }}>Tên Truyện</TableCell>
                                            <TableCell sx={{ color: 'black', fontSize: '16px' }}>Tác giả</TableCell>
                                            {/* <TableCell sx={{ color: 'black', fontSize: '16px' }}>Giá (đ)</TableCell> */}
                                            <TableCell sx={{ color: 'black', fontSize: '16px' }}>Tập/Bộ</TableCell>
                                        </TableRow>
                                    </TableHead>

                                    <TableBody>
                                        <TableRow>
                                            <TableCell>
                                                <img
                                                    src={comic.coverImage}
                                                    alt={comic.title}
                                                    style={{ width: 50, height: 'auto', margin: 'auto' }}
                                                />
                                            </TableCell>
                                            <TableCell>{comic.title || 'N/A'}</TableCell>
                                            <TableCell>{comic.author || 'N/A'}</TableCell>
                                            {/* <TableCell>{comic.price?.toLocaleString() || 'N/A'} đ</TableCell> */}
                                            <TableCell>{comic.quantity > 1 ? 'Bộ truyện' : 'Tập Truyện'}</TableCell>
                                        </TableRow>
                                    </TableBody>

                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Stack>
            </DialogContent>
        </StyledDialog>
    );
};

export default AuctionDetailMod;