import React from 'react';
import {
    Button, Dialog, DialogContent, DialogTitle, TextField, Typography, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ModalFeedbackSellerProps {
    open: boolean;
    onClose: () => void;
    onBack: () => void;
}

const ModalFeedbackSeller: React.FC<ModalFeedbackSellerProps> = ({ open, onClose, onBack }) => {
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
                    onClick={onBack}
                    sx={{ position: 'absolute', right: 20, top: 20, color: 'gray' }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ padding: '0px 40px 40px 40px' }}>
                <Typography sx={{ marginBottom: '10px', textAlign: 'center' }}>
                    Hãy chia sẻ trải nghiệm của bạn để giúp người bán cải thiện dịch vụ.
                    Đánh giá của bạn rất quan trọng đối với cộng đồng!
                </Typography>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '15px' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '18px' }}>Đánh giá người bán:</Typography>
                    <Button
                        variant="outlined"
                        sx={{ textTransform: 'none', borderRadius: '15px', padding: '5px 15px' }}
                    >
                        🛍️ Thanh Mai
                    </Button>
                </div>

                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    placeholder="Nhập đánh giá của bạn (tối đa 200 ký tự)"
                    sx={{ marginBottom: '20px', borderRadius: '8px' }}
                />

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
                        onClick={onClose}
                    >
                        GỬI
                    </Button>
                    <Button
                        sx={{
                            backgroundColor: '#fff',
                            color: '#000',
                            fontWeight: 'bold',
                            padding: '10px 30px',
                            border: '1px solid black',
                            fontSize: '16px'
                        }}
                        onClick={onBack}
                    >
                        QUAY LẠI
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ModalFeedbackSeller;
