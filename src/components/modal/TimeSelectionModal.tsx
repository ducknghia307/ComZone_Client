import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Paper,
} from "@mui/material";
import { DatePicker, notification } from "antd";
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

const TimeSelectionModal: React.FC<TimeSelectionModalProps> = ({
  open,
  onCancel,
  onConfirm,
  duration,
  auctionId,
}) => {
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");

  useEffect(() => {
    if (startTime) {
      const end = dayjs(startTime).add(duration, "day").toISOString();
      setEndTime(end);
    }
  }, [startTime, duration]);

  const handleConfirm = async () => {
    if (!startTime || !endTime) {
      notification.warning({
        message: "Cảnh báo",
        description: "Vui lòng chọn thời gian bắt đầu trước khi xác nhận.",
        placement: "topRight",
      });
      return;
    }

    try {
      await privateAxios.put(`/auction-request/${auctionId}/approve`, {
        startTime,
        endTime,
      });
      notification.success({
        message: "Thành công",
        description: "Đã chấp nhận thành công yêu cầu đấu giá.",
        placement: "topRight",
      });
      onConfirm(startTime, endTime);
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Không thể phê duyệt đấu giá. Vui lòng thử lại sau.",
        placement: "topRight",
      });
      console.error("Failed to approve auction:", error);
    }
  };

  const disabledStartDate = (current: dayjs.Dayjs | null) => {
    const now = dayjs().tz("Asia/Ho_Chi_Minh");
    return current && current.isBefore(now.add(10, "minute"), "minute");
  };

  const disabledStartTime = (current: dayjs.Dayjs | null) => {
    const now = dayjs().tz("Asia/Ho_Chi_Minh");
    if (!current || !current.isSame(now, "day")) return {};
    const minutes = Array.from({ length: 60 }, (_, i) => i).filter(
      (i) => i < now.minute() + 10
    );
    return {
      disabledHours: () =>
        Array.from({ length: 24 }, (_, i) => (i < now.hour() ? i : -1)).filter(
          (x) => x !== -1
        ),
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
          textAlign: "center",
        }}
      >
        Chọn Thời Gian Đấu Giá
      </DialogTitle>
      <DialogContent>
        <Paper
          elevation={0}
          sx={{
            p: 1,
            mb: 3,
            backgroundColor: "#FFF4E5",
            border: "1px solid #FFB74D",
            borderRadius: "8px",
          }}
        >
          <Typography
            sx={{
              fontFamily: "REM",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <span>⏱️ Thời lượng cuộc đấu giá diễn ra:</span>
            <span
              style={{
                fontSize: "16px",
                fontWeight: "bold",
                color: "#D32F2F",
              }}
            >
              {duration} ngày
            </span>
          </Typography>
        </Paper>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: "REM", fontSize: "14px" }}>
            <strong>Thời gian bắt đầu:</strong>
          </Typography>

          <DatePicker
            showTime={{
              format: "HH:mm",
            }}
            format="YYYY-MM-DD HH:mm"
            style={{ width: "100%" }}
            placeholder="Chọn thời gian bắt đầu"
            getPopupContainer={() => document.body}
            popupStyle={{ zIndex: 1300 }}
            onChange={(value) => setStartTime(value ? value.toISOString() : "")}
            disabledDate={(current) => {
              // Disable dates before today
              return current && current.isBefore(dayjs().startOf("day"));
            }}
            disabledTime={(current) => {
              // Only allow times at least 15 minutes from now
              if (!current) return {};
              const now = dayjs();
              const fifteenMinutesFromNow = now.add(10, "minute");

              if (current.isSame(now, "day")) {
                return {
                  disabledHours: () =>
                    Array.from({ length: 24 }, (_, i) =>
                      i < fifteenMinutesFromNow.hour() ? i : -1
                    ).filter((x) => x !== -1),
                  disabledMinutes: () =>
                    current.isSame(fifteenMinutesFromNow, "hour")
                      ? Array.from({ length: 60 }, (_, i) =>
                          i < fifteenMinutesFromNow.minute() ? i : -1
                        ).filter((x) => x !== -1)
                      : [],
                };
              }
              return {};
            }}
          />
        </Box>
        <Box sx={{ mb: 2 }}>
          <Typography sx={{ fontFamily: "REM", fontSize: "14px" }}>
            <strong>Thời gian kết thúc:</strong>
          </Typography>
          <DatePicker
          placeholder="Chọn thời gian kết thúc"
            showTime
            format="YYYY-MM-DD HH:mm"
            value={endTime ? dayjs(endTime) : null}
            disabled
            getPopupContainer={() => document.body}
            popupStyle={{ zIndex: 1300 }}
            style={{ width: "100%", marginTop: "8px" }}
          />
          <Typography
            sx={{ fontFamily: "REM", fontSize: "12px", color: "#777", mt: 1 }}
          >
            * Thời gian kết thúc sẽ được tự động tính toán dựa trên thời gian
            bắt đầu bạn đã chọn và thời lượng được thiết lập trước là
            <span style={{ fontWeight: "bold", color: "#D32F2F" }}>
              {" "}
              {duration} ngày
            </span>
            . Bạn không thể chỉnh sửa thời gian kết thúc.
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "16px", backgroundColor: "#f9f9f9" }}>
        <Button
          onClick={onCancel}
          sx={{ fontFamily: "REM", backgroundColor: "#f0f0f0", color: "#555" }}
        >
          Hủy
        </Button>
        <Button
          onClick={handleConfirm}
          sx={{ fontFamily: "REM", backgroundColor: "#1976d2", color: "white" }}
        >
          Xác Nhận
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TimeSelectionModal;
