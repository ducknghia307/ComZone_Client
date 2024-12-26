import React, { useState, useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Box,
    Typography,
} from "@mui/material";
import { notification } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";

interface AuctionConfig {
    id: string;
    priceStepConfig: number;
    depositAmountConfig: number;
    maxPriceConfig: number;
}

interface EditAuctionConfigModalProps {
    open: boolean;
    onClose: () => void;
    config: AuctionConfig;
    onUpdateConfig: (updatedConfig: AuctionConfig) => void;
}

const EditAuctionConfigModal: React.FC<EditAuctionConfigModalProps> = ({
    open,
    onClose,
    config,
    onUpdateConfig,
}) => {
    const [editedConfig, setEditedConfig] = useState<AuctionConfig>(config);

    useEffect(() => {
        setEditedConfig(config);
    }, [config]);

    console.log("config id", editedConfig.id);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setEditedConfig((prev) => ({
            ...prev,
            [name]: Number(value) < 0 ? 0 : Number(value),
        }));
    };

    const handleSave = async () => {
        try {            
            const response = await privateAxios.put(`/auction-config/${config.id}`, editedConfig);
            onUpdateConfig(response.data);
            console.log("response", response.data);
            
            notification.success({
                message: "Thành Công",
                description: "Cập nhật cấu hình đấu giá thành công!",
                placement: "topRight",
                duration: 3,
            });
            onClose();
        } catch (error) {
            console.error("Error updating auction config:", error);
            notification.error({
                message: "Thất Bại",
                description: "Có lỗi xảy ra khi cập nhật cấu hình đấu giá!",
                placement: "topRight",
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
                    background: "linear-gradient(145deg, #f0f0f0 0%, #e6e6e6 100%)",
                    boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
                },
            }}
        >
            <DialogTitle>
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        pb: 1,
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            color: "#71002b",
                            fontWeight: "bold",
                            textTransform: "uppercase",
                            letterSpacing: 1,
                            margin: "auto",
                            borderBottom: "2px solid #c66a7a",
                            fontFamily: "REM",
                        }}
                    >
                        Chỉnh Sửa Thông Số Đấu Giá
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 3 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "1fr",
                        gap: 2,
                        paddingTop: "15px",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Bước Giá (%)"
                        name="priceStepConfig"
                        type="number"
                        value={editedConfig.priceStepConfig}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            fontFamily: "REM",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Mức Cọc (%)"
                        name="depositAmountConfig"
                        type="number"
                        value={editedConfig.depositAmountConfig}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            fontFamily: "REM",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Giá Mua Ngay (%)"
                        name="maxPriceConfig"
                        type="number"
                        value={editedConfig.maxPriceConfig}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            fontFamily: "REM",
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                </Box>
            </DialogContent>
            <DialogActions
                sx={{
                    p: 2,
                    justifyContent: "flex-end",
                    borderTop: "1px solid rgba(0,0,0,0.1)",
                }}
            >
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                    sx={{
                        fontFamily: "REM",
                        borderRadius: 2,
                        textTransform: "none",
                        background: "linear-gradient(145deg, #c66a7a, #a3566a)",
                        "&:hover": {
                            background: "linear-gradient(145deg, #a3566a, #c66a7a)",
                        },
                    }}
                >
                    Lưu Thay Đổi
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{
                        fontFamily: "REM",
                        borderRadius: 2,
                        textTransform: "none",
                    }}
                >
                    Hủy
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAuctionConfigModal;
