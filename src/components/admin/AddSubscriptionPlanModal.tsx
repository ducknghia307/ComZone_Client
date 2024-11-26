import React, { useState } from "react";
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
import { privateAxios } from "../../middleware/axiosInstance";

interface SubscriptionPlan {
    id: string;
    price: number;
    duration: number;
    offeredResource: number;
}

interface AddModalProps {
    open: boolean;
    onClose: () => void;
    onAddPlan: (newPlan: SubscriptionPlan) => void;
}

const AddSubscriptionPlanModal: React.FC<AddModalProps> = ({
    open,
    onClose,
    onAddPlan,
}) => {
    const [newPlan, setNewPlan] = useState<Partial<SubscriptionPlan>>({
        price: 0,
        duration: 0,
        offeredResource: 0,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setNewPlan((prev) => ({
            ...prev,
            [name]: ["price", "duration", "offeredResource"].includes(name)
                ? Number(value)
                : value,
        }));
    };

    const handleAdd = async () => {
        try {
            const response = await privateAxios.post("/seller-subs-plans", newPlan);
            onAddPlan(response.data); // Thêm gói mới vào table quản lý
            onClose();
        } catch (error) {
            console.error("Error adding subscription plan:", error);
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
                        }}
                    >
                        Thêm Gói Subscription
                    </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 3, pb: 3 }}>
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(2, 1fr)",
                        gap: 2,
                        paddingTop: "15px",
                    }}
                >
                    <TextField
                        fullWidth
                        label="Giá (VND)"
                        name="price"
                        type="number"
                        value={newPlan.price || ""}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Thời Hạn (Tháng)"
                        name="duration"
                        value={newPlan.duration || ""}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
                            "& .MuiOutlinedInput-root": {
                                borderRadius: 2,
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        label="Lượt Bán Đấu Giá"
                        name="offeredResource"
                        value={newPlan.offeredResource || ""}
                        onChange={handleChange}
                        variant="outlined"
                        sx={{
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
                    onClick={handleAdd}
                    variant="contained"
                    color="primary"
                    sx={{
                        borderRadius: 2,
                        textTransform: "none",
                        background: "linear-gradient(145deg, #c66a7a, #a3566a)",
                        "&:hover": {
                            background: "linear-gradient(145deg, #a3566a, #c66a7a)",
                        },
                    }}
                >
                    Thêm Gói
                </Button>
                <Button
                    onClick={onClose}
                    variant="outlined"
                    color="secondary"
                    sx={{
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

export default AddSubscriptionPlanModal;
