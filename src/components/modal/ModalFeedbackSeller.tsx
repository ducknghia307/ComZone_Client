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
}

const ModalFeedbackSeller: React.FC<ModalFeedbackSellerProps> = ({ open, onClose, sellerName, sellerId, userId }) => {
    const [ratingValue, setRatingValue] = useState<number | null>(null);
    const [images, setImages] = useState<File[]>([]);
    const [orders, setOrders] = useState<OrderDetailData[]>([]);
    const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
    const [commentText, setCommentText] = useState<string>('');

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

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const selectedFiles = Array.from(e.target.files);

            if (selectedFiles.length + images.length > 4) {
                alert("Bạn chỉ có thể tải lên tối đa 4 hình ảnh.");
                return;
            }

            const updatedImages = [...images, ...selectedFiles];
            setImages(updatedImages);

            const formData = new FormData();
            updatedImages.forEach((file) => {
                formData.append("images", file);
            });

            try {
                const response = await privateAxios.post("/file/upload/multiple-images", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                // Access the imageUrls array from the response
                const imageUrls = response.data.imageUrls;
                setUploadedImageUrls(imageUrls);
                console.log("imageUrls", imageUrls);

                alert("Hình ảnh đã được tải lên thành công!");
            } catch (error) {
                console.error("Error uploading images:", error);
                alert("Có lỗi xảy ra khi tải lên hình ảnh.");
            }
        }
    };


    const handleRemoveImage = (index: number) => {
        const updatedImages = images.filter((_, i) => i !== index);
        const updatedUrls = uploadedImageUrls.filter((_, i) => i !== index);
        setImages(updatedImages);
        setUploadedImageUrls(updatedUrls);
        console.log("updatedUrls", updatedUrls);
        console.log("updatedImages", updatedImages);

    };

    const handleSubmitFeedback = async () => {
        if (!ratingValue || !commentText.trim() || uploadedImageUrls.length === 0) {
            alert("Vui lòng nhập đầy đủ thông tin đánh giá và tải lên ít nhất một hình ảnh.");
            return;
        }

        const payload = {
            user: userId,
            seller: sellerId,
            rating: ratingValue,
            comment: commentText,
            attachedImages: uploadedImageUrls
        };

        try {
            await privateAxios.post('/seller-feedback', payload);
            alert("Đánh giá đã được gửi thành công!");
            onClose();
            console.log(payload)
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
                    paddingBottom: '15px'
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
                <Typography sx={{ marginBottom: '20px', textAlign: 'center' }}>
                    Hãy chia sẻ trải nghiệm của bạn để giúp người bán cải thiện dịch vụ.
                    Đánh giá của bạn rất quan trọng đối với cộng đồng!
                </Typography>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Người bán:</Typography>
                    <Button
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: '15px', padding: '5px 15px', color: '#fff', borderColor: '#000', gap: '5px', backgroundColor: '#000' }}
                    >
                        <StoreOutlinedIcon />
                        {sellerName}
                    </Button>
                </div>
                {/* Upload Button */}
                <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
                    <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>Hình ảnh (tối đa 4):</Typography>
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
                            }}
                            startIcon={<CloudUploadOutlinedIcon />}
                        >
                            Tải lên
                        </Button>
                    </label>
                </div>
                {/* Image Preview Section */}
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
                {/* Rating Component */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '0px', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Đánh giá:</Typography>
                    <Rating
                        name="simple-controlled"
                        value={ratingValue}
                        onChange={(event, newValue) => {
                            setRatingValue(newValue);
                        }}
                    />
                </div>
                {/* Text Field for Feedback */}
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Nhập đánh giá của bạn (tối đa 200 ký tự)"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    sx={{ marginTop: '20px', marginBottom: '20px', borderRadius: '8px' }}
                />

                {/* Submit Button */}
                <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
                    <Button
                        variant="contained"
                        sx={{
                            backgroundColor: '#000',
                            color: '#fff',
                            fontWeight: 'bold',
                            padding: '10px 30px',
                            fontSize: '16px'
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