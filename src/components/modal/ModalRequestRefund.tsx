import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  TextField,
} from "@mui/material";
import { notification } from "antd";
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import { privateAxios } from "../../middleware/axiosInstance";

interface ModalRequestRefundProps {
  open: boolean;
  onClose: () => void;
  orderId: string;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalRequestRefund: React.FC<ModalRequestRefundProps> = ({
  open,
  onClose,
  orderId,
  setIsLoading,
}) => {
  const [images, setImages] = useState<File[]>([]);
  const [reason, setReason] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [api, contextHolder] = notification.useNotification();

  const reasons = [
    "Truyện bị hư hỏng, chất lượng kém, bao bì kém chất lượng hoặc lỗi thời.",
    "Truyện không đúng mô tả, giao nhầm, không đúng số lượng.",
    "Giao sai địa chỉ, giao hàng trễ, đơn hàng thất lạc.",
    "Sai thông tin người nhận, phát sinh phí không rõ ràng, lỗi do shipper, vấn đề thanh toán.",
    "Truyện bị tráo đổi, mất cắp hoặc bị mở niêm phong (nếu có).",
  ];

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      if (selectedFiles.length + images.length > 4) {
        api.warning({
          message: "Giới hạn hình ảnh",
          description: "Bạn chỉ có thể tải lên tối đa 4 hình ảnh.",
          placement: "topRight",
        });
        return;
      }

      setImages([...images, ...selectedFiles]);
    }
  };

  const handleRemoveImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setImages(updatedImages);
  };

  const handleSubmitRefundRequest = async () => {
    if (!reason.trim()) {
      api.warning({
        key: "warning",
        message: "Thiếu thông tin",
        description: "Vui lòng chọn một lý do.",
        duration: 5,
      });
      return;
    }

    if (!description.trim()) {
      api.warning({
        key: "warning",
        message: "Thiếu thông tin",
        description: "Vui lòng nhập mô tả chi tiết.",
        duration: 5,
      });
      return;
    }

    if (images.length === 0) {
      api.warning({
        key: "warning",
        message: "Thiếu thông tin",
        description: "Vui lòng đính kèm ít nhất 1 hình ảnh.",
        duration: 5,
      });
      return;
    }

    onClose();
    setIsLoading(true);

    const formData = new FormData();
    images.forEach((file) => formData.append("images", file));

    try {
      let imageUrls: string[] = [];
      if (images.length > 0) {
        const imageUploadResponse = await privateAxios.post(
          "/file/upload/multiple-images",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        imageUrls = imageUploadResponse.data.imageUrls;
      }

      const payload = {
        order: orderId,
        reason,
        description,
        attachedImages: imageUrls,
      };
      console.log("Payload sent to refund API:", payload);
      await privateAxios.post("/refund-requests/order", payload);

      api.success({
        message: "Thành công",
        description: "Yêu cầu hoàn tiền đã được gửi!",
        placement: "topRight",
      });
    } catch (error) {
      console.error("Error submitting refund request:", error);
      api.error({
        message: "Lỗi",
        description: "Có lỗi xảy ra khi gửi yêu cầu hoàn tiền.",
        placement: "topRight",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        sx={{
          "& .MuiPaper-root": {
            border: "1px solid black",
            borderRadius: "15px",
          },
        }}
      >
        <DialogTitle
          sx={{
            fontWeight: "bold",
            fontSize: "24px",
            textAlign: "center",
            pt: "30px",
            pb: "15px",
            fontFamily: "REM",
          }}
        >
          YÊU CẦU HOÀN TIỀN
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 20,
              top: 20,
              color: "black",
              backgroundColor: "white",
              "&:hover": { backgroundColor: "#f5f5f5" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: "0px 40px 40px 40px" }}>
          <FormControl component="fieldset" sx={{ mb: "20px" }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                mb: "10px",
                fontFamily: "REM",
              }}
            >
              Lý do yêu cầu hoàn tiền: <span className="text-red-600">*</span>
            </Typography>
            <RadioGroup
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            >
              {reasons.map((reasonText, index) => (
                <FormControlLabel
                  key={index}
                  value={reasonText}
                  control={<Radio />}
                  label={<p className="REM">{reasonText}</p>}
                />
              ))}
            </RadioGroup>
          </FormControl>
          <div style={{ marginBottom: "20px" }}>
            <Typography
              sx={{
                fontSize: "18px",
                fontWeight: "bold",
                mb: "10px",
                fontFamily: "REM",
              }}
            >
              Mô tả chi tiết lý do: <span className="text-red-600">*</span>
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Nhập mô tả chi tiết (tối đa 200 ký tự)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              sx={{ borderRadius: "8px" }}
            />
          </div>
          <div style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "20px",
                gap: "20px",
              }}
            >
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  fontFamily: "REM",
                  m: 0,
                }}
              >
                Ảnh đính kèm (tối đa 4): <span className="text-red-600">*</span>
              </Typography>
              <input
                accept="image/*"
                type="file"
                multiple
                onChange={handleFileChange}
                style={{ display: "none" }}
                id="refund-image-upload"
              />
              <label htmlFor="refund-image-upload">
                <Button
                  component="span"
                  sx={{
                    textTransform: "none",
                    fontWeight: "bold",
                    color: "#000",
                    backgroundColor: "#fff",
                    border: "1px solid black",
                    borderRadius: "10px",
                    p: "5px 15px",
                    fontFamily: "REM",
                    minWidth: "120px",
                  }}
                  startIcon={<CloudUploadOutlinedIcon />}
                >
                  Tải lên
                </Button>
              </label>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
                gap: "20px",
                width: "100%",
              }}
            >
              {images.map((image, index) => (
                <div
                  key={index}
                  style={{
                    position: "relative",
                    width: "100%",
                    paddingTop: "150%",
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(image)}
                      alt={`uploaded-preview-${index}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      aria-label="remove"
                      onClick={() => handleRemoveImage(index)}
                      sx={{
                        position: "absolute",
                        top: 5,
                        right: 5,
                        backgroundColor: "white",
                        color: "black",
                        p: "2px",
                        "&:hover": { backgroundColor: "#f5f5f5" },
                      }}
                    >
                      <CloseIcon sx={{ fontSize: "20px" }} />
                    </IconButton>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Button
              disabled={
                reason.trim().length === 0 || description.trim().length === 0
              }
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
                p: "10px 30px",
                fontSize: "16px",
                fontFamily: "REM",
                "&:hover": { backgroundColor: "#333" },
              }}
              onClick={handleSubmitRefundRequest}
            >
              GỬI YÊU CẦU
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalRequestRefund;
