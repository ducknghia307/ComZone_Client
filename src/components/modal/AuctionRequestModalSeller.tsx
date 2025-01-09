import React, { useEffect, useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    Chip,
} from "@mui/material";
import { publicAxios } from "../../middleware/axiosInstance";

interface AuctionDetailModalProps {
    open: boolean;
    onClose: () => void;
    auctionRequest: {
        id: string;
        comic: { id: string; title: string; coverImage: string };
        maxPrice: number;
        reservePrice: number;
        depositAmount: number;
        status: string;
        priceStep: number;
        duration: number;
    };
}

const AuctionRequestModalSeller: React.FC<AuctionDetailModalProps> = ({
    open,
    onClose,
    auctionRequest,
}) => {

    if (!auctionRequest) return null;

    const getStatusChipStyles = (status: string) => {
        switch (status) {
            case "REJECTED":
                return {
                    color: "#f44336",
                    backgroundColor: "#ffebee",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                };
            case "PENDING":
                return {
                    color: "#a64dff",
                    backgroundColor: "#f2e6ff",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                };

            case "APPROVED":
                return {
                    color: "#3f51b5",
                    backgroundColor: "#e8eaf6",
                    borderRadius: "8px",
                    padding: "8px 20px",
                    fontWeight: "bold",
                    display: "inline-block",
                };
        }
    };

    const translateStatus = (status: string) => {
        switch (status) {
            case "APPROVED":
                return "Đã duyệt";
            case "PENDING":
                return "Chờ duyệt";
            case "REJECTED":
                return "Bị từ chối";
            default:
                return status;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: "#ffffff",
                    color: "#333",
                    borderRadius: "12px",
                    boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0",
                },
            }}
        >
            <DialogTitle
                style={{
                    backgroundColor: "#f5f5f5",
                    color: "#000",
                    fontWeight: 700,
                    borderBottom: "1px solid #e0e0e0",
                    padding: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                }}
            >
                <span style={{ flex: 1, textAlign: "left" }}></span>
                <span
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        fontFamily: "REM"
                    }}
                >
                    Chi tiết đấu giá
                </span>

                <div
                    style={{
                        ...getStatusChipStyles(auctionRequest.status),
                        display: "inline-block",
                        textAlign: "center",
                        fontSize: "14px",
                        fontFamily: "REM"
                    }}
                >
                    {translateStatus(auctionRequest.status)}
                </div>
            </DialogTitle>

            <DialogContent>
                <div
                    style={{
                        display: "flex",
                        gap: "20px",
                        padding: "0 10px",
                        backgroundColor: "#ffffff",
                        // border: '1px solid #e0e0e0',
                        borderRadius: "8px",
                        marginTop: "20px",
                    }}
                >
                    <img
                        src={auctionRequest.comic.coverImage}
                        alt="Comic cover"
                        style={{
                            width: "250px",
                            height: "auto",
                            borderRadius: "8px",
                            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                            objectFit: "cover",
                            border: "1px solid #e0e0e0",
                        }}
                    />
                    <div style={{ flex: 1, padding: "15px" }}>
                        <Typography
                            variant="h5"
                            style={{ color: "#000", marginBottom: "15px", fontWeight: 600, fontFamily: "REM" }}
                        >
                            {auctionRequest.comic.title}
                        </Typography>
                        {[
                            { label: "Giá mua ngay", value: auctionRequest.maxPrice },
                            { label: "Giá đặt cọc", value: auctionRequest.depositAmount },
                            { label: "Giá khởi điểm", value: auctionRequest.reservePrice },
                            { label: "Bước giá tối thiểu", value: auctionRequest.priceStep },
                            { label: "Thời lượng", value: `${auctionRequest.duration} ngày` },
                        ].map(({ label, value }) => (
                            <div
                                key={label}
                                style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    marginBottom: "10px",
                                    borderBottom: "1px solid #e0e0e0",
                                    paddingBottom: "8px",
                                }}
                            >
                                <Typography style={{ color: "#666", fontWeight: 500, fontFamily: "REM" }}>
                                    {label}
                                </Typography>
                                <Typography
                                    style={{
                                        fontWeight: "500",
                                        color: "#000",
                                        fontFamily: "REM"
                                    }}
                                >
                                    {typeof value === "number"
                                        ? value.toLocaleString("vi-VN") + " đ"
                                        : value}
                                </Typography>
                            </div>
                        ))}
                    </div>
                </div>
            </DialogContent>
            <DialogActions
                style={{
                    backgroundColor: "#f5f5f5",
                    padding: "15px",
                    justifyContent: "center",
                    borderTop: "1px solid #e0e0e0",
                }}
            >
                <Button
                    onClick={onClose}
                    variant="contained"
                    style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        borderRadius: "4px",
                        padding: "10px 30px",
                        fontWeight: 600,
                        textTransform: "none",
                        // '&:hover': { backgroundColor: '#333' }
                    }}
                >
                    Đóng
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AuctionRequestModalSeller;
