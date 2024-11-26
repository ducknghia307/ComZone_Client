import React, { useEffect, useState } from 'react';
import {
    Button, Dialog, DialogContent, DialogTitle, TextField, Typography, IconButton, Rating
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import { privateAxios } from '../../middleware/axiosInstance';
import { OrderDetailData } from '../../common/base.interface';

interface ModalFeedbackSellerProps {
    open: boolean;
    onClose: () => void;
    sellerName: string;
    sellerId: string;
    userId: string;
    orderId: string; // Thêm orderId để cập nhật trạng thái
    onStatusUpdate: (orderId: string, newStatus: string) => void; // Callback để cập nhật trạng thái
}

const ModalFeedbackSeller: React.FC<ModalFeedbackSellerProps> = ({ open, onClose, sellerName, sellerId, userId, orderId, onStatusUpdate }) => {
    const [ratingValue, setRatingValue] = useState<number | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [orders, setOrders] = useState<OrderDetailData[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const [commentText, setCommentText] = useState<string>('');

    console.log("orderId", orderId);

    useEffect(() => {
        const fetchOrdersWithItems = async () => {
            try {
                const response = await privateAxios.get("/orders/user");
                const ordersData = response.data;

                const ordersWithItems = await Promise.all(
                    ordersData.map(async (order: any) => {
                        const itemsResponse = await privateAxios.get(
                            `/order-items/order/${order.id}`
                        );
                        const itemsData = itemsResponse.data;

                        return { ...order, items: itemsData };
                    })
                );

                setOrders(ordersWithItems);
                console.log("Orders with items:", ordersWithItems);
            } catch (error) {
                console.error("Error fetching orders:", error);
            }
        };

        fetchOrdersWithItems();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            if (selectedFiles.length + images.length > 4) {
                alert("Bạn chỉ có thể tải lên tối đa 4 hình ảnh.");
                return;
            }

            // Set selected images in state without uploading yet
            setImages([...images, ...selectedFiles]); // CHANGED: Only set images in state here, without uploading
        }
    };

    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        setImages(updatedImages);
    };

    const handleSubmitFeedback = async () => {
        if (!ratingValue || !commentText.trim() || images.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin đánh giá và tải lên ít nhất một hình ảnh.");
            return;
        }

        // UPLOAD IMAGES ONLY WHEN SUBMITTING FEEDBACK
        const formData = new FormData();
        images.forEach((file) => {
            formData.append("images", file);
        });

        try {
            const imageUploadResponse = await privateAxios.post("/file/upload/multiple-images", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            const imageUrls = imageUploadResponse.data.imageUrls;
            setUploadedImageUrls(imageUrls); // Update state with uploaded image URLs

            // Prepare the feedback payload
            const payload = {
                user: userId,
                seller: sellerId,
                rating: ratingValue,
                comment: commentText,
                attachedImages: imageUrls, // Include uploaded image URLs in the payload
                order: orderId,
                isFeedback: true
            };

            await privateAxios.post('/seller-feedback', payload);

            const statusPayload = {
                order: orderId,
                isFeedback: true,
            };

            console.log("Updating orderId:", orderId);
            console.log("Payload for PATCH:", statusPayload);

            // Update order status
            const response = await privateAxios.patch(`/orders/status/successful`, statusPayload);
            console.log("Order status update response:", response.data);

            // Gọi callback để cập nhật giao diện
            // onStatusUpdate(orderId, "COMPLETED");
            onStatusUpdate(orderId, "SUCCESSFUL");

            alert("Đánh giá đã được gửi thành công!");
            console.log(payload);

            onClose();
        } catch (error) {
            console.error("Error submitting feedback:", error);
            alert("Có lỗi xảy ra khi gửi đánh giá.");
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            sx={{
                '& .MuiPaper-root': {
                    border: '1px solid black',
                    borderRadius: '15px',
                }
            }}
        >
            <DialogTitle
                sx={{
                    fontWeight: 'bold',
                    fontSize: '24px',
                    textAlign: 'center',
                    paddingTop: '30px',
                    paddingBottom: '15px',
                    fontFamily:'REM'
                }}
            >
                ĐÁNH GIÁ NGƯỜI BÁN
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{ position: 'absolute', right: 20, top: 20, color: 'gray' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '0px 40px 40px 40px' }}>
                <Typography sx={{ marginBottom: '20px', textAlign: 'center', fontFamily:'REM' }}>
                    Hãy chia sẻ trải nghiệm của bạn để giúp người bán cải thiện dịch vụ.
                    Đánh giá của bạn rất quan trọng đối với cộng đồng!
                </Typography>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                    <Typography sx={{ fontWeight: '500', fontSize: '18px', fontFamily:'REM' }}>Người bán:</Typography>
                    <Button
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: '15px', padding: '5px 15px', color: '#fff', borderColor: '#000', gap: '5px', backgroundColor: '#000', fontFamily:'REM' }}
                    >
                        <StoreOutlinedIcon />
                        {sellerName}
                    </Button>
                </div>

                <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: "500", fontFamily:'REM' }}>Hình ảnh (tối đa 4):</Typography>
                    <input
                        accept="image/*"
                        type="file"
                        multiple
                        onChange={handleFileChange}
                        style={{ display: "none" }}
                        id="image-upload"
                    />
                    <label htmlFor="image-upload">
                        <Button
                            component="span"
                            sx={{
                                textTransform: "none",
                                fontWeight: "bold",
                                marginLeft: "10px",
                                color: "#000",
                                backgroundColor: "#fff",
                                border: "1px solid black",
                                borderRadius: "10px",
                                padding: "5px 15px",
                                fontFamily:'REM'
                            }}
                            startIcon={<CloudUploadOutlinedIcon />}
                        >
                            Tải lên
                        </Button>
                    </label>
                </div>

                <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
                    {images.map((image, index) => (
                        <div key={index} style={{ position: 'relative', marginTop: '20px' }}>
                            <img
                                src={URL.createObjectURL(image)}
                                alt={`uploaded-preview-${index}`}
                                style={{
                                    width: '100px',
                                    height: '150px',
                                    objectFit: 'cover',
                                }}
                            />
                            <IconButton
                                aria-label="remove"
                                onClick={() => handleRemoveImage(index)}
                                disableRipple
                                disableFocusRipple
                                sx={{
                                    position: 'absolute',
                                    top: 5,
                                    right: 5,
                                    backgroundColor: 'white',
                                    color: 'black',
                                    padding: '2px',
                                }}
                            >
                                <CloseIcon sx={{ fontSize: '20px' }} />
                            </IconButton>
                        </div>
                    ))}
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '0px', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: '500', fontFamily:'REM' }}>Đánh giá:</Typography>
                    <Rating
                        name="simple-controlled"
                        value={ratingValue}
                        onChange={(event, newValue) => {
                            setRatingValue(newValue);
                        }}
                    />
                </div>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Nhập đánh giá của bạn (tối đa 200 ký tự)"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ marginTop: '20px', marginBottom: '20px', borderRadius: '8px', fontFamily:'REM' }}
                />

                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#000',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px 30px',
                            fontSize: '16px', 
                            fontFamily:'REM'
                        }}
                        onClick={handleSubmitFeedback}
                    >
                        GỬI ĐÁNH GIÁ
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ModalFeedbackSeller;
