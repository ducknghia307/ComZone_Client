import React, { useState } from 'react';
import { Box, Modal, Typography, Button, IconButton } from '@mui/material';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CloseIcon from '@mui/icons-material/Close';

interface ModalDeliveryProps {
    open: boolean;
    onClose: () => void;
    deliveryStatus: string;
    orderId: string;
    comicName: string;
    buyerName: string;
    orderDate: string;
    cancelReason?: string;
    deliveryImage?: string;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 650,
    bgcolor: 'background.paper',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    padding: '20px 40px 40px 60px',
    borderRadius: '16px',
    border: '1px solid #000',
};

const ModalDelivery: React.FC<ModalDeliveryProps> = ({
    open,
    onClose,
    deliveryStatus,
    orderId,
    comicName,
    buyerName,
    orderDate,
    cancelReason,
    deliveryImage: initialDeliveryImage,
}) => {
    const [uploadedImage, setUploadedImage] = useState<string | null>(initialDeliveryImage || null);

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setUploadedImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <Typography sx={{ marginBottom: '25px', fontWeight: 'bold', textAlign: 'center', fontSize: '30px' }}>
                    Chi Tiết Đơn Hàng
                </Typography>
                <IconButton onClick={onClose} sx={{ position: 'absolute', right: 20, top: 20 }}>
                    <CloseIcon />
                </IconButton>
                <Typography sx={{ marginBottom: '8px', fontSize: '18px' }}>
                    <strong>Trạng thái:</strong>
                    <span style={{ marginLeft: '8px', ...getStatusChipStyles(deliveryStatus) }}>
                        {deliveryStatus}
                    </span>
                </Typography>
                <Typography sx={{ fontSize: '18px', marginBottom: '15px' }}><strong>Mã đơn hàng:</strong> {orderId}</Typography>
                <Typography sx={{ fontSize: '18px', marginBottom: '15px' }}><strong>Tên Truyện:</strong> {comicName}</Typography>
                <Typography sx={{ fontSize: '18px', marginBottom: '15px' }}><strong>Tổng đơn hàng:</strong> 100.000đ</Typography>
                <Typography sx={{ fontSize: '18px', marginBottom: '15px' }}><strong>Tên Người Mua:</strong> {buyerName}</Typography>
                <Typography sx={{ fontSize: '18px', marginBottom: '15px' }}><strong>Ngày Đặt Hàng:</strong> {orderDate}</Typography>
                <Typography sx={{ fontSize: '18px', marginBottom: '15px' }}><strong>Địa Chỉ:</strong> abc abc abc</Typography>

                {cancelReason && <Typography><strong>Lý do hủy:</strong> {cancelReason}</Typography>}

                {deliveryStatus === 'DELIVERING' && (
                    <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', marginBottom: '25px', gap: '10px' }}>
                        <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Ảnh:</Typography>
                        <Button
                            component="label"
                            sx={{
                                textTransform: 'none',
                                fontWeight: 'bold',
                                color: '#000',
                                backgroundColor: '#fff',
                                border: '1px solid black',
                                borderRadius: '10px',
                                padding: '5px 15px',
                                display: 'flex',
                                alignItems: 'center',
                                cursor: 'pointer',
                            }}
                            startIcon={<CloudUploadOutlinedIcon />}
                        >
                            Tải lên
                            <input
                                type="file"
                                accept="image/*"
                                hidden
                                onChange={handleImageUpload}
                            />
                        </Button>
                    </div>
                )}

                {uploadedImage && (
                    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'row', gap: '20px' }}>
                        {deliveryStatus === 'COMPLETED' && (
                            <Typography sx={{ fontSize: '18px', fontWeight: 'bold' }}>Ảnh:</Typography>
                        )}
                        <img
                            src={uploadedImage}
                            alt="Delivery"
                            style={{ width: '200px', height: 'auto', borderRadius: '8px' }}
                        />
                    </div>
                )}

                {deliveryStatus === 'DELIVERING' && uploadedImage && (
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <Button
                            sx={{
                                marginTop: '25px',
                                backgroundColor: '#000',
                                color: 'white',
                                padding: '10px 20px',
                                fontWeight: 'bold',
                            }}
                        >
                            Xác Nhận Giao Hàng
                        </Button>
                    </div>
                )}
            </Box>
        </Modal>
    );
};

const getStatusChipStyles = (status: string) => {
    switch (status) {
        case 'PENDING':
            return {
                color: '#ff9800',
                backgroundColor: '#fff3e0',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'PACKAGING':
            return {
                color: '#4caf50',
                backgroundColor: '#e8f5e9',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'DELIVERING':
            return {
                color: '#2196f3',
                backgroundColor: '#e3f2fd',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'COMPLETED':
            return {
                color: '#009688',
                backgroundColor: '#e0f2f1',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
        case 'CANCELED':
            return {
                color: '#e91e63',
                backgroundColor: '#fce4ec',
                borderRadius: '8px',
                padding: '8px 20px',
                fontWeight: 'bold',
                display: 'inline-block',
            };
    }
};

export default ModalDelivery;
