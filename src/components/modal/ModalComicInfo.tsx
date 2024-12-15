import React from 'react';
import { Modal, Box, Typography, IconButton, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';

const StyledModalBox = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '650px',
    backgroundColor: theme.palette.background.paper,
    borderRadius: '12px',
    boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.3)',
    padding: '24px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
}));

const ModalComicInfo = ({ open, onClose, comic }) => {
    if (!comic) return null;

    const getConditionChipColor = (condition: string): { label: string; color: 'success' | 'warning' | 'default' } => {
        switch (condition) {
            case 'SEALED':
                return { label: 'Nguyên seal', color: 'success' };
            case 'USED':
                return { label: 'Đã qua sử dụng', color: 'warning' };
            default:
                return { label: 'Không xác định', color: 'default' };
        }
    };

    const getEditionChipColor = (edition: string): { label: string; color: 'primary' | 'secondary' | 'error' | 'default' } => {
        switch (edition) {
            case 'REGULAR':
                return { label: 'Bản thường', color: 'primary' };
            case 'SPECIAL':
                return { label: 'Bản đặc biệt', color: 'secondary' };
            case 'LIMITED':
                return { label: 'Bản giới hạn', color: 'error' };
            default:
                return { label: 'Không xác định', color: 'default' };
        }
    };

    const conditionChip = getConditionChipColor(comic.condition);
    const editionChip = getEditionChipColor(comic.edition);

    return (
        <Modal open={open} onClose={onClose}>
            <StyledModalBox>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        width: '100%',
                        alignItems: 'center',
                        marginBottom: '16px',
                    }}
                >
                    <Typography
                        variant="h6"
                        sx={{
                            flex: 1,
                            textAlign: 'center',
                            fontFamily: 'REM',
                            fontWeight: 'bold',
                            color: '#71002b',
                        }}
                    >
                        Thông tin truyện
                    </Typography>
                    <IconButton onClick={onClose} sx={{ color: '#71002b' }}>
                        <CloseIcon />
                    </IconButton>
                </Box>
                <img
                    src={comic.coverImage}
                    alt={comic.title}
                    style={{
                        width: '150px',
                        height: '200px',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #ccc',
                    }}
                />
                <Typography sx={{ fontWeight: 'bold', marginBottom: '16px', padding: '0 40px', whiteSpace: 'nowrap', fontFamily: 'REM', fontSize:'16px' }}>
                    {comic.title}
                </Typography>
                <Box sx={{ width: '100%' }}>
                    {[
                        { label: 'Giá', value: `${comic?.price?.toLocaleString()} đ` },
                        { label: 'Tác Giả', value: comic.author },
                        {
                            label: 'Tình Trạng', value:
                                (<Chip label={conditionChip.label} color={conditionChip.color} size="small" />)
                        },
                        {
                            label: 'Phiên Bản Truyện', value:
                                (comic.edition === "REGULAR" && "Bản thường") ||
                                (comic.edition === "SPECIAL" && "Bản đặc biệt") ||
                                "Bản giới hạn"
                        },
                        { label: 'Thể Loại', value: comic.genres.map((genre) => genre.name).join(', ') },
                        { label: 'Số Trang', value: comic.page },
                        { label: 'Truyện lẻ / Bộ truyện', value: comic.quantity > 1 ? 'Bộ Truyện' : 'Tập Truyện' },
                    ].map(({ label, value }) => (
                        <Box
                            key={label}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginBottom: '12px',
                                padding: '0 30px'
                            }}
                        >
                            <Typography sx={{ fontWeight: 'bold', color: '#555', flex: 1, fontFamily: 'REM', fontSize:'16px' }}>
                                {label}:
                            </Typography>
                            <Typography sx={{ color: '#555', fontFamily: 'REM', fontSize:'14px' }}>{value}</Typography>
                        </Box>
                    ))}
                </Box>
            </StyledModalBox>
        </Modal>
    );
};

export default ModalComicInfo;
