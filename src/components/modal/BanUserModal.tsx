import * as React from 'react';
import { Modal, Box, Typography, FormControl, FormControlLabel, Radio, RadioGroup, Button, TextField, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface BanComicModalProps {
    open: boolean;
    onClose: () => void;
    onBan: (reason: string) => void;
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '30%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
};

const BanUserModal: React.FC<BanComicModalProps> = ({ open, onClose, onBan }) => {
    const [selectedReason, setSelectedReason] = React.useState<string>('Thông tin sai lệch');
    const [otherReason, setOtherReason] = React.useState<string>('');

    const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReason(event.target.value);
        if (event.target.value !== 'Khác') {
            setOtherReason('');
        }
    };

    const handleBan = () => {
        const reason = selectedReason === 'Khác' ? otherReason : selectedReason;
        onBan(reason);
        onClose();
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold' }}>
                        Lý Do Cấm Người Dùng
                    </Typography>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <FormControl component="fieldset" fullWidth>
                <RadioGroup value={selectedReason} onChange={handleReasonChange}>
                        <FormControlLabel value="Cung cấp thông tin sai lệch" control={<Radio />} label="Cung cấp thông tin sai lệch" />
                        <FormControlLabel value="Hành vi xúc phạm và lạm dụng" control={<Radio />} label="Hành vi xúc phạm và lạm dụng" />
                        <FormControlLabel value="Gian lận" control={<Radio />} label="Gian lận" />
                        <FormControlLabel value="Tạo nhiều tài khoản ảo" control={<Radio />} label="Tạo nhiều tài khoản ảo" />
                        <FormControlLabel value="Trả lại hàng không đúng quy định" control={<Radio />} label="Trả lại hàng không đúng quy định" />
                        <FormControlLabel value="Khác" control={<Radio />} label="Khác" />
                    </RadioGroup>
                    {selectedReason === 'Khác' && (
                        <TextField
                            margin="dense"
                            label="Nhập lý do khác"
                            fullWidth
                            variant="outlined"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            sx={{ mt: 2 }}
                        />
                    )}
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button onClick={handleBan} sx={{color:'#fff', backgroundColor:'#000'}}>
                        Cấm Người Dùng
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};

export default BanUserModal;
