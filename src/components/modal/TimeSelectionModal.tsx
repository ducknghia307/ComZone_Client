import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Box, Typography } from "@mui/material";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { privateAxios } from "../../middleware/axiosInstance";

dayjs.extend(utc);
dayjs.extend(timezone);

interface TimeSelectionModalProps {
    open: boolean;
    onCancel: () => void;
    onConfirm: (startTime: string, endTime: string) => void;
    duration: number;
    auctionId: string;
}

const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({ open, onCancel, onConfirm, duration, auctionId }) => {
    const [startTime, setStartTime] = useState<string>("");
    const [endTime, setEndTime] = useState<string>("");

    useEffect(() => {
        if (startTime) {
            const end = dayjs(startTime).add(duration, 'day').toISOString();
            setEndTime(end);
        }
    }, [startTime, duration]);

    const handleConfirm = async () => {
        if (startTime && endTime) {
            try {
                await privateAxios.put(`/auction/${auctionId}/approve`, { startTime, endTime });
                onConfirm(startTime, endTime);
            } catch (error) {
                console.error("Failed to approve auction:", error);
            }
        }
    };

    const disabledStartDate = (current: dayjs.Dayjs | null) => {
        const now = dayjs().tz("Asia/Ho_Chi_Minh");
        return current && current.isBefore(now.add(10, 'minute'), 'minute');
    };

    const disabledStartTime = (current: dayjs.Dayjs | null) => {
        const now = dayjs().tz("Asia/Ho_Chi_Minh");
        if (!current || !current.isSame(now, 'day')) return {};
        const minutes = Array.from({ length: 60 }, (_, i) => i).filter(i => i < now.minute() + 10);
        return {
            disabledHours: () => Array.from({ length: 24 }, (_, i) => i < now.hour() ? i : -1).filter(x => x !== -1),
            disabledMinutes: () => minutes,
        };
    };

    return (
        <Dialog open={open} onClose={onCancel} maxWidth="sm" fullWidth>
            <DialogTitle
                sx={{
                    fontFamily: "REM",
                    fontSize: "20px",
                    fontWeight: "bold",
                    color: "#71002b",
                }}
            >
                Chọn Thời Gian Đấu Giá
            </DialogTitle>
            <DialogContent>
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontFamily: "REM", fontSize: "14px" }}>
                        <strong>Thời gian bắt đầu:</strong>
                    </Typography>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        disabledDate={disabledStartDate}
                        disabledTime={disabledStartTime}
                        onChange={(value) => setStartTime(value ? value.toISOString() : "")}
                        getPopupContainer={() => document.body}
                        popupStyle={{ zIndex: 1300 }}
                        style={{ width: "100%", marginTop: "8px" }}
                    />
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography sx={{ fontFamily: "REM", fontSize: "14px" }}>
                        <strong>Thời gian kết thúc:</strong>
                    </Typography>
                    <DatePicker
                        showTime
                        format="YYYY-MM-DD HH:mm:ss"
                        value={endTime ? dayjs(endTime) : null}
                        disabled
                        getPopupContainer={() => document.body}
                        popupStyle={{ zIndex: 1300 }}
                        style={{ width: "100%", marginTop: "8px" }}
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ padding: "16px", backgroundColor: "#f9f9f9" }}>
                <Button onClick={onCancel} sx={{ fontFamily: "REM", backgroundColor: "#f0f0f0", color: "#555" }}>
                    Hủy
                </Button>
                <Button onClick={handleConfirm} sx={{ fontFamily: "REM", backgroundColor: "#1976d2", color: "white" }}>
                    Xác Nhận
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default TimeSelectionModal;