import React, { useEffect, useState } from "react";
import {
  Box,
  Modal,
  Typography,
  TextField,
  Button,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { notification } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";
import { RefundRequest } from "../../common/interfaces/refund-request.interface";

interface RejectReasonModalProps {
  open: boolean;
  onClose: () => void;
  refundRequest: RefundRequest;
  onConfirm: (reason: string) => void;
}

const RejectReasonModal: React.FC<RejectReasonModalProps> = ({
  open,
  onClose,
  refundRequest,
  onConfirm,
}) => {
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log("RejectReasonModal: ", refundRequest);
  }, [refundRequest]);

  const handleConfirm = async () => {
    if (!reason.trim()) {
      notification.warning({
        message: "Chú ý",
        description: "Vui lòng nhập lý do từ chối.",
        placement: "topRight",
      });
      return;
    }

    setLoading(true);
    try {
      const apiUrl = refundRequest.exchange
        ? `/refund-requests/reject/exchange/${refundRequest.id}`
        : refundRequest.order
        ? `/refund-requests/reject/order/${refundRequest.order.id}`
        : "";

      if (apiUrl) {
        await privateAxios.patch(apiUrl, {
          rejectReason: reason.trim(),
        });

        notification.success({
          message: "Thành công",
          description: "Yêu cầu hoàn tiền đã bị từ chối.",
          placement: "topRight",
        });

        setReason("");
        onConfirm(reason.trim());
        onClose();
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description:
          "Đã xảy ra lỗi khi từ chối yêu cầu hoàn tiền. Vui lòng thử lại.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setReason(""); // Reset lý do khi đóng
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="reject-reason-modal-title"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "#fff",
          p: 4,
          width: "400px",
          borderRadius: "12px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "2px solid #c66a7a",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography
            id="reject-reason-modal-title"
            variant="h6"
            sx={{ color: "#71002b", fontWeight: "bold" }}
          >
            Nhập lý do từ chối
          </Typography>
          <IconButton
            onClick={handleClose}
            sx={{
              color: "#c66a7a",
              "&:hover": {
                color: "#71002b",
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Lý do từ chối"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          sx={{
            mb: 3,
            "& .MuiOutlinedInput-root": {
              "& fieldset": { borderColor: "#c66a7a" },
              "&:hover fieldset": { borderColor: "#71002b" },
            },
            "& .MuiInputLabel-root": { color: "#c66a7a" },
          }}
        />
        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={loading}
            sx={{
              flex: 1,
              bgcolor: "#c66a7a",
              color: "#fff",
              "&:hover": { bgcolor: "#71002b" },
              "&.Mui-disabled": {
                bgcolor: "#c66a7a80",
              },
            }}
          >
            {loading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
          <Button
            variant="outlined"
            onClick={handleClose}
            disabled={loading}
            sx={{
              flex: 1,
              borderColor: "#c66a7a",
              color: "#c66a7a",
              "&:hover": {
                borderColor: "#71002b",
                color: "#71002b",
              },
            }}
          >
            Hủy
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default RejectReasonModal;
