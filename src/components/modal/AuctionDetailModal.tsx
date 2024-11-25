import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
} from "@mui/material";

interface AuctionDetailModalProps {
    open: boolean;
    onClose: () => void;
    auction: {
        comics: { id: string; title: string; coverImage: string };
        currentPrice?: number;
        maxPrice: number;
        reservePrice: number;
        depositAmount: number;
        startTime: string;
        endTime: string;
        status: string;
        winner?: { id: string; createdAt: string, name: string };
    };
}

const AuctionDetailModal: React.FC<AuctionDetailModalProps> = ({
    open,
    onClose,
    auction,
}) => {
    if (!auction) return null;

    const getStatusChipStyles = (status: string) => {
        switch (status) {
            case "SUCCESSFUL":
                return { color: "#4caf50", backgroundColor: "#e8f5e9", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
            case "UPCOMING":
                return { color: "#ff9800", backgroundColor: "#fff3e0", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
            case "ONGOING":
                return {
                    color: "#2196f3", backgroundColor: "#e3f2fd", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block",
                };
            case "FAILED":
                return {
                    color: "#e91e63", backgroundColor: "#fce4ec", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block",
                };
            case "REJECTED":
                return {
                    color: "#f44336", backgroundColor: "#ffebee", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block",
                };
            case "COMPLETED":
                return {
                    color: "#009688", backgroundColor: "#e0f2f1", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block",
                };
        }
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case "SUCCESSFUL": return "Đấu giá thành công";
            case "COMPLETED": return "Hoàn thành";
            case "ONGOING": return "Đang diễn ra";
            case "FAILED": return "Đấu giá thất bại";
            case "REJECTED": return "Bị từ chối";
            default: return status;
        }
    };

    const formattedStartTime = new Date(auction.startTime).toLocaleString("vi-VN");
    const formattedEndTime = new Date(auction.endTime).toLocaleString("vi-VN");

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: '#ffffff',
                    color: '#333',
                    borderRadius: '12px',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)',
                    border: '1px solid #e0e0e0'
                }
            }}
        >
            <DialogTitle
                style={{
                    backgroundColor: '#f5f5f5',
                    color: '#000',
                    fontWeight: 700,
                    borderBottom: '1px solid #e0e0e0',
                    textAlign: 'center',
                    padding: '15px'
                }}
            >
                Chi tiết đấu giá
            </DialogTitle>
            <DialogContent>
                <div style={{
                    display: "flex",
                    gap: "20px",
                    padding: "0 10px",
                    backgroundColor: '#ffffff',
                    // border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    marginTop: '20px',
                }}>
                    <img
                        src={auction.comics.coverImage}
                        alt="Comic cover"
                        style={{
                            width: "250px",
                            height: "auto",
                            borderRadius: "8px",
                            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                            objectFit: 'cover',
                            border: '1px solid #e0e0e0'
                        }}
                    />
                    <div style={{ flex: 1, padding:'20px' }}>
                        <Typography variant="h5" style={{ color: '#000', marginBottom: '15px', fontWeight: 600 }}>
                            {auction.comics.title}
                        </Typography>
                        {[
                            { label: 'Giá hiện tại', value: auction.currentPrice, highlight: true },
                            { label: 'Giá tối đa', value: auction.maxPrice },
                            { label: 'Giá đặt cọc', value: auction.depositAmount },
                            { label: 'Giá khởi điểm', value: auction.reservePrice },
                            { label: 'Thời gian bắt đầu', value: formattedStartTime },
                            { label: 'Thời gian kết thúc', value: formattedEndTime }
                        ].map(({ label, value, highlight }) => (
                            <div
                                key={label}
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '10px',
                                    borderBottom: '1px solid #e0e0e0',
                                    paddingBottom: '8px'
                                }}
                            >
                                <Typography style={{ color: '#666', fontWeight: 500 }}>{label}</Typography>
                                <Typography style={{
                                    fontWeight: 'bold',
                                    color: highlight ? '#d32f2f' : '#000'
                                }}>
                                    {typeof value === 'number' ? value.toLocaleString("vi-VN") + ' đ' : value}
                                </Typography>
                            </div>
                        ))}

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginTop: '15px',
                            alignItems: 'center',
                            borderBottom: '1px solid #e0e0e0',
                            paddingBottom: '10px'
                        }}>
                            <Typography style={{ color: '#666', fontWeight: 500 }}>Trạng thái</Typography>
                            <span style={getStatusChipStyles(auction.status)}>
                                {translateStatus(auction.status)}
                            </span>
                        </div>

                        {auction.winner && (
                            <div style={{
                                marginTop: '15px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography style={{ color: '#666', fontWeight: 500 }}>Người thắng</Typography>
                                <Typography style={{ color: '#000', fontWeight: 600 }}>
                                    {auction.winner.name}
                                </Typography>
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
            <DialogActions style={{
                backgroundColor: '#f5f5f5',
                padding: '15px',
                justifyContent: 'center',
                borderTop: '1px solid #e0e0e0'
            }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    style={{
                        backgroundColor: '#000',
                        color: '#fff',
                        borderRadius: '4px',
                        padding: '10px 30px',
                        fontWeight: 600,
                        textTransform: 'none',
                        // '&:hover': { backgroundColor: '#333' }
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuctionDetailModal;