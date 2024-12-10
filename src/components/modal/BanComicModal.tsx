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

const BanComicModal: React.FC<BanComicModalProps> = ({ open, onClose, onBan }) => {
    const [selectedReason, setSelectedReason] = React.useState<string>('Thông tin sai lệch');
    const [otherReason, setOtherReason] = React.useState<string>('');

    const handleReasonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedReason(event.target.value);
        if (event.target.value !== 'Khác') {
            setOtherReason('');
        }
    };

    const [loading, setLoading] = React.useState(false);

    const handleBan = async () => {
        setLoading(true); // Bật trạng thái loading
        const reason = selectedReason === 'Khác' ? otherReason : selectedReason;
        await onBan(reason); // Gọi hàm xử lý cập nhật trạng thái
        setLoading(false); // Tắt trạng thái loading
        onClose();
    };


    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={modalStyle}>
                <Box sx={{ position: 'relative', mb: 2 }}>
                    <Typography variant="h6" component="h2" sx={{ textAlign: 'center', fontSize: '24px', fontWeight: 'bold', color: '#71002b', fontFamily: 'REM' }}>
                        Lý Do Cấm Bán Truyện
                    </Typography>
                    <IconButton onClick={onClose} sx={{ position: 'absolute', top: 0, right: 0 }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <FormControl component="fieldset" fullWidth>
                    <RadioGroup value={selectedReason} onChange={handleReasonChange}>
                        <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'REM', fontWeight: 400 } }} value="Thông tin sai lệch" control={<Radio />} label="Thông tin sai lệch" />
                        <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'REM', fontWeight: 400 } }} value="Nội dung không phù hợp" control={<Radio />} label="Nội dung không phù hợp" />
                        <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'REM', fontWeight: 400 } }} value="Vi phạm bản quyền" control={<Radio />} label="Vi phạm bản quyền" />
                        <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'REM', fontWeight: 400 } }} value="Sách lậu, sách giả" control={<Radio />} label="Sách lậu, sách giả" />
                        <FormControlLabel sx={{ '& .MuiFormControlLabel-label': { fontFamily: 'REM', fontWeight: 400 } }} value="Khác" control={<Radio />} label="Khác" />
                    </RadioGroup>
                    {selectedReason === 'Khác' && (
                        <TextField
                            margin="dense"
                            label="Nhập lý do khác"
                            fullWidth
                            variant="outlined"
                            value={otherReason}
                            onChange={(e) => setOtherReason(e.target.value)}
                            sx={{ mt: 2, backgroundColor: '#ffe3d842' }}
                        />
                    )}
                </FormControl>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button
                        onClick={handleBan}
                        sx={{
                            color: '#fff',
                            backgroundColor: '#c66a7a',
                            '&:hover': { backgroundColor: '#a84e61' },
                            padding: '10px 20px',
                            borderRadius: '4px',
                            fontWeight: 'bold',
                            fontFamily: 'REM'
                        }}
                        disabled={loading}
                    >
                        {loading ? 'Đang cập nhật...' : 'Cấm Bán Truyện'}
                    </Button>

                </Box>
            </Box>
        </Modal>
    );
};

export default BanComicModal;
