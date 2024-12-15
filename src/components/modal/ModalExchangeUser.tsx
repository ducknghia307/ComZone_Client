import React from 'react';
import { Modal, Box, Typography, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { UserInfo } from '../../common/base.interface';

interface ModalExchangeUserProps {
    open: boolean;
    onClose: () => void;
    user: UserInfo | null;
}

const StyledModalBox = styled(Box)(({ theme }: { theme: any }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    maxWidth: '550px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const ModalExchangeUser: React.FC<ModalExchangeUserProps> = ({ open, onClose, user }) => {
    if (!user) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <StyledModalBox>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
                    <Typography variant="h6" sx={{ flex: 1, textAlign: 'center', fontFamily: 'REM', fontWeight: 'bold', color: '#71002b' }}>
                        Thông tin người dùng
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#71002b' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                <img
                    src={user.avatar || '/placeholder.png'}
                    alt={user.name}
                    style={{
                        width: '120px',
                        height: '120px',
                        borderRadius: '50%',
                        marginBottom: '20px',
                        border: '1px solid #71002b',
                    }}
                />

                <Box sx={{ width: '100%' }}>
                    {[{ label: 'Email', value: user.email }, { label: 'Tên Người Dùng', value: user.name }, { label: 'Số điện thoại', value: user.phone || 'Không có số điện thoại' }, { label: 'Địa chỉ', value: user.address || 'Không có địa chỉ' }].map(({ label, value }) => (
                        <Box key={label} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <Typography sx={{ fontWeight: 'bold', color: '#333', flex: 1, textAlign: 'right', paddingRight: '16px', whiteSpace: 'nowrap', fontFamily: 'REM' }}>
                                {label}:
                            </Typography>
                            <Typography sx={{ color: '#555', flex: 2, textAlign: 'left', fontFamily: 'REM' }}>
                                {value}
                            </Typography>
                        </Box>
                    ))}
                </Box>
            </StyledModalBox>
        </Modal>
    );
};

export default ModalExchangeUser;
