import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  FormGroup,
} from "@mui/material";
import { Input, notification } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";

interface RejectReasonAuctionProps {
  open: boolean;
  onCancel: () => void;
  onReject: (reason: string[]) => void;
  auctionId: string;
}

const RejectReasonAuction: React.FC<RejectReasonAuctionProps> = ({
  open,
  onCancel,
  onReject,
  auctionId,
}) => {
  const [selectedReasons, setSelectedReasons] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState<string>("");

  const handleCheckboxChange = (reason: string) => {
    setSelectedReasons((prev) =>
      prev.includes(reason) ? prev.filter((r) => r !== reason) : [...prev, reason]
    );
  };

  const handleReject = async () => {
    const allReasons = [...selectedReasons];
    console.log("All reasons:", allReasons);

    if (otherReason.trim()) {
      allReasons.push(otherReason.trim());
    }

    if (allReasons.length === 0) {
      notification.warning({
        message: 'Cảnh báo',
        description: 'Vui lòng chọn ít nhất một lý do từ chối',
        placement: 'topRight'
      });
      return;
    }

    try {
      const response = await privateAxios.patch(
        `/auction-request/${auctionId}/reject`,
        { rejectionReason: allReasons.join(", ") },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 || response.status === 204) {
        notification.success({
          message: 'Thành công',
          description: 'Từ chối yêu cầu đấu giá thành công',
          placement: 'topRight'
        });
        console.log("Reject success:", response.data);
        onReject(allReasons);
        setSelectedReasons([]);
        setOtherReason("");
      }
    } catch (error) {
      console.error("Failed to reject auction request:", error);
      notification.error({
        message: 'Lỗi',
        description: 'Có lỗi xảy ra khi từ chối yêu cầu đấu giá',
        placement: 'topRight'
      });
    }
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
        Lý Do Từ Chối
      </DialogTitle>
      <DialogContent>
        <Box>
          <FormGroup sx={{ display: "flex", flexDirection: "column" }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedReasons.includes("Chưa nhập đủ thông tin truyện")}
                  onChange={() => handleCheckboxChange("Chưa nhập đủ thông tin truyện")}
                />
              }
              label={
                <Typography sx={{ fontFamily: "REM", fontSize: "14px" }}>
                  Chưa nhập đủ thông tin truyện
                </Typography>
              }
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedReasons.includes("Tình trạng truyện quá tệ để đấu giá")}
                  onChange={() => handleCheckboxChange("Tình trạng truyện quá tệ để đấu giá")}
                />
              }
              label={
                <Typography sx={{ fontFamily: "REM", fontSize: "14px" }}>
                  Tình trạng truyện quá tệ để đấu giá
                </Typography>
              }
            />
          </FormGroup>
          <Typography sx={{ fontFamily: "REM", fontSize: "14px", marginTop: "8px" }}>
            Lý do khác:
          </Typography>
          <Input.TextArea
            placeholder={`Nhập lý do khác (nếu có)...`}
            spellCheck="false"
            autoSize={{ minRows: 3, maxRows: 10 }}
            value={otherReason}
            onChange={(e) => setOtherReason(e.target.value)}
            maxLength={1000}
            className="REM"
            style={{
              marginTop: "8px",
              padding: "10px 15px",
              fontFamily: "REM",
              fontSize: "14px",
            }}
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ padding: "16px", backgroundColor: "#f9f9f9" }}>
        <Button onClick={onCancel} sx={{ fontFamily: "REM", backgroundColor: "#f0f0f0", color: "#555" }}>
          Hủy
        </Button>
        <Button
          onClick={handleReject}
          sx={{ fontFamily: "REM", backgroundColor: "#D32F2F", color: "white" }}
        >
          Từ Chối
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RejectReasonAuction;

