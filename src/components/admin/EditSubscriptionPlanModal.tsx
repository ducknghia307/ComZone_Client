import React, { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography
} from '@mui/material';
import { privateAxios } from '../../middleware/axiosInstance';
import { notification, Switch } from 'antd';

interface SubscriptionPlan {
    id: string;
    price: number;
    duration: number;
    auctionTime: number;
    sellTime: number;
}

interface EditModalProps {
    open: boolean;
    onClose: () => void;
    plan: SubscriptionPlan;
    onUpdatePlan: (updatedPlan: SubscriptionPlan) => void;
}

const EditSubscriptionPlanModal: React.FC<EditModalProps> = ({
    open,
    onClose,
    plan,
    onUpdatePlan
}) => {
    const [editedPlan, setEditedPlan] = useState<SubscriptionPlan>(plan);
    const [isUnlimited, setIsUnlimited] = useState<boolean>(plan.sellTime === 0 && plan.auctionTime === 0);
    const [originalValues, setOriginalValues] = useState<{ sellTime: number, auctionTime: number }>({ sellTime: plan.sellTime, auctionTime: plan.auctionTime });

    useEffect(() => {
        setEditedPlan(plan);
        setIsUnlimited(plan.sellTime === 0 && plan.auctionTime === 0);
        setOriginalValues({ sellTime: plan.sellTime, auctionTime: plan.auctionTime });
    }, [plan]);

    useEffect(() => {
        if (!open) {
            setEditedPlan(plan);
        }
    }, [open, plan]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        // setEditedPlan((prev) => ({
        //     ...prev,
        //     [name]: ["price", "duration", "auctionTime", "sellTime"].includes(name)
        //         ? Number(value)
        //         : value
        // }));
        const numericValue = Number(value);

        setEditedPlan((prev) => ({
            ...prev,
            [name]: ["price", "duration", "auctionTime", "sellTime"].includes(name)
                ? numericValue < 0
                    ? 0 // = 0 nếu nhập số âm
                    : numericValue
                : value
        }));
    };

    const handleToggleChange = () => {
        if (isUnlimited) {
            // toggle off, original values
            setEditedPlan((prev) => ({
                ...prev,
                sellTime: originalValues.sellTime,
                auctionTime: originalValues.auctionTime
            }));
        } else {
            //toggle on, sellTime and auctionTime (unlimited)
            setEditedPlan((prev) => ({
                ...prev,
                sellTime: 0,
                auctionTime: 0
            }));
        }

        setIsUnlimited(!isUnlimited);
    };

    const handleSave = async () => {
        console.log("Edited plan:", editedPlan);
        try {
            const response = await privateAxios.patch(`/seller-subs-plans/${plan.id}`, editedPlan);
            onUpdatePlan(response.data);

            notification.success({
                message: 'Thành Công',
                description: 'Cập nhật gói đăng ký thành công!',
                placement: 'topRight',
                duration: 3,
            });

            onClose();
        } catch (error) {
            console.error('Error updating subscription plan:', error);

            notification.error({
                message: 'Thất Bại',
                description: 'Có lỗi xảy ra khi cập nhật gói đăng ký!',
                placement: 'topRight',
                duration: 3,
            });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    background: 'linear-gradient(145deg, #f0f0f0 0%, #e6e6e6 100%)',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                }
            }}
        >
            <DialogTitle>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',

                    pb: 1
                }}>
                    <Typography
                        variant="h6"
                        sx={{
                            color: '#71002b',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: 1,
                            margin: 'auto',
                            borderBottom: '2px solid #c66a7a',
                            fontFamily: 'REM'
                        }}
                    >
                        Chỉnh Sửa Gói Đăng Ký
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 3 }}>
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 2,
                    paddingTop: '15px'
                }}>
                    <TextField
                        fullWidth
                        label="Tên Gói"
                        name="name"
                        value={
                            editedPlan.price === 0
                                ? "Gói Dùng Thử"
                                : editedPlan.price > 300000 && editedPlan.price < 1000000
                                    ? "Gói Nâng Cấp"
                                    : editedPlan.price >= 1000000
                                        ? "Gói Không Giới Hạn"
                                        : "Gói Dùng Thử"
                        }
                        disabled
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                backgroundColor: '#f0f0f0',
                                fontFamily: 'REM',
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Giới Hạn Lượt Bán"
                        name="sellTime"
                        type="number"
                        value={editedPlan.sellTime}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                        disabled={isUnlimited}
                    />
                    <TextField
                        fullWidth
                        label="Giá (VND)"
                        name="price"
                        type="number"
                        value={editedPlan.price}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            fontFamily: 'REM',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            },

                        }}
                    />
                    <TextField
                        fullWidth
                        label="Thời Hạn (Tháng)"
                        name="duration"
                        type="number"
                        value={editedPlan.duration}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            fontFamily: 'REM',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Lượt Bán Đấu Giá"
                        name="auctionTime"
                        type="number"
                        value={editedPlan.auctionTime}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            fontFamily: 'REM',
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 2
                            }
                        }}
                        disabled={isUnlimited}
                    />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                    <Typography variant="body2" sx={{ mr: 2 }}>
                        Không Giới Hạn Lượt Bán và Đấu Giá:
                    </Typography>
                    <Switch checked={isUnlimited} onChange={handleToggleChange} />
                </Box>
            </DialogContent>
            <DialogActions sx={{
                p: 2,
                justifyContent: 'flex-end',
                borderTop: '1px solid rgba(0,0,0,0.1)'
            }}>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    sx={{
                        fontFamily: 'REM',
                        borderRadius: 2,
                        textTransform: 'none',
                        background: 'linear-gradient(145deg, #c66a7a, #a3566a)',
                        '&:hover': {
                            background: 'linear-gradient(145deg, #a3566a, #c66a7a)'
                        }
                    }}
                >
                    Lưu Thay Đổi
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{
                        fontFamily: 'REM',
                        borderRadius: 2,
                        textTransform: 'none'
                    }}
                >
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditSubscriptionPlanModal;