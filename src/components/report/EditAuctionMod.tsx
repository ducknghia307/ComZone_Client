import React, { useEffect } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    Box,
    Typography,
    useTheme,
} from "@mui/material";
import { Form, Input, notification } from "antd";
import dayjs from "dayjs";
import { Auction } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";

interface EditAuctionModProps {
    open: boolean;
    onClose: () => void;
    auctionData: Auction;
    onSuccess: () => void;
}

const EditAuctionMod: React.FC<EditAuctionModProps> = ({
    open,
    onClose,
    auctionData,
    onSuccess,
}) => {
    const [form] = Form.useForm();
    const theme = useTheme();

    const formatCurrency = (value: string | number) => {
        if (!value) return "";
        return value
            .toString()
            .replace(/\D/g, "") // Loại bỏ ký tự không phải số
            .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Thêm dấu chấm ngăn cách hàng nghìn
    };

    // Hàm xóa định dạng để lấy giá trị số nguyên
    const parseCurrency = (value: string) => {
        return value.replace(/\./g, ""); // Loại bỏ dấu chấm
    };

    useEffect(() => {
        if (auctionData) {
            // form.setFieldsValue({
            //     reservePrice: auctionData.reservePrice,
            //     maxPrice: auctionData.maxPrice,
            //     priceStep: auctionData.priceStep,
            //     startTime: dayjs(auctionData.startTime).format("YYYY-MM-DDTHH:mm"),
            //     endTime: dayjs(auctionData.endTime).format("YYYY-MM-DDTHH:mm"),
            // });
            form.setFieldsValue({
                reservePrice: formatCurrency(auctionData.reservePrice),
                maxPrice: formatCurrency(auctionData.maxPrice),
                priceStep: formatCurrency(auctionData.priceStep),
                startTime: dayjs(auctionData.startTime).format("YYYY-MM-DDTHH:mm"),
                endTime: dayjs(auctionData.endTime).format("YYYY-MM-DDTHH:mm"),
            });
        }
        console.log("Auction Data:", auctionData);
    }, [auctionData, form]);

    // const handleSubmit = async () => {
    //     try {
    //         const values = await form.validateFields();
    //         await privateAxios.patch(`/auction/${auctionData.id}`, values);
    //         notification.success({
    //             message: "Cập nhật thông tin đấu giá thành công",
    //             duration: 5,
    //         });
    //         onSuccess();
    //         onClose();
    //     } catch (error) {
    //         notification.error({
    //             message: "Lỗi khi cập nhật đấu giá",
    //             description: error.message,
    //             duration: 5,
    //         });
    //     }
    // };
    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();

            // Chuyển các giá trị về số nguyên trước khi gửi
            const payload = {
                ...values,
                reservePrice: parseCurrency(values.reservePrice),
                maxPrice: parseCurrency(values.maxPrice),
                priceStep: parseCurrency(values.priceStep),
            };

            await privateAxios.patch(`/auction/${auctionData.id}`, payload);
            notification.success({
                message: "Cập nhật thông tin đấu giá thành công",
                duration: 5,
            });
            onSuccess();
            onClose();
        } catch (error) {
            notification.error({
                message: "Lỗi khi cập nhật đấu giá",
                description: error.message,
                duration: 5,
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    backgroundColor: "#c66a7a",
                    color: "#fff",
                    display: "flex",
                    justifyContent: "center",
                }}
            >
                <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: "REM" }}>
                    Chỉnh sửa thông tin đấu giá
                </Typography>
            </DialogTitle>

            <DialogContent sx={{ backgroundColor: "#ffe3d842", py: 2 }}>
                <Form
                    form={form}
                    layout="vertical"
                    style={{ marginTop: 15 }}
                >
                    <Box display="flex" flexDirection="column" gap={1}>
                        <Form.Item
                            name="reservePrice"
                            label="Giá khởi điểm (đ)"
                            style={{ marginBottom: 8 }}
                        >
                            <Input
                                type="text"
                                style={{ backgroundColor: "#fff" }}
                                onChange={(e) => {
                                    form.setFieldValue(
                                        "reservePrice",
                                        formatCurrency(e.target.value)
                                    );
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="maxPrice"
                            label="Giá tối đa (đ)"
                            style={{ marginBottom: 8 }}
                        >
                            <Input
                                type="text"
                                style={{ backgroundColor: "#fff" }}
                                onChange={(e) => {
                                    form.setFieldValue(
                                        "maxPrice",
                                        formatCurrency(e.target.value)
                                    );
                                }}
                            />
                        </Form.Item>

                        <Form.Item
                            name="priceStep"
                            label="Bước giá (đ)"
                            style={{ marginBottom: 8 }}
                        >
                            <Input
                                type="text"
                                style={{ backgroundColor: "#fff" }}
                                onChange={(e) => {
                                    form.setFieldValue(
                                        "priceStep",
                                        formatCurrency(e.target.value)
                                    );
                                }}
                            />
                        </Form.Item>
{/* 
                        <Form.Item
                            name="startTime"
                            label="Thời gian bắt đầu"
                            style={{ marginBottom: 8 }}
                        >
                            <Input type="datetime-local" style={{ backgroundColor: "#fff" }} />
                        </Form.Item>

                        <Form.Item
                            name="endTime"
                            label="Thời gian kết thúc"
                            style={{ marginBottom: 8 }}
                        >
                            <Input type="datetime-local" style={{ backgroundColor: "#fff" }} />
                        </Form.Item> */}
                    </Box>
                </Form>
            </DialogContent>

            <DialogActions
                sx={{
                    backgroundColor: "#ffe3d842",
                    padding: "16px",
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "#c66a7a",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#b05969",
                        },
                    }}
                >
                    Hủy
                </Button>
                <Button
                    onClick={handleSubmit}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "#c66a7a",
                        color: "#fff",
                        "&:hover": {
                            backgroundColor: "#b05969",
                        },
                    }}
                >
                    Lưu
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditAuctionMod;
