import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
  Rating,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import ModalFeedbackSeller from "./ModalFeedbackSeller";

interface ModalOrderProps {
  open: boolean;
  onClose: () => void;
}

const ModalOrder: React.FC<ModalOrderProps> = ({ open, onClose }) => {
  const [ratingValue, setRatingValue] = useState<number | null>(5);
  const [images, setImages] = useState<string[]>([]);
  const [isSellerRated, setIsSellerRated] = useState<string>("no");
  const [openFeedback, setOpenFeedback] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const fileArray = files
      ? Array.from(files).map((file) => URL.createObjectURL(file))
      : [];

    // Kiểm tra nếu tổng số ảnh vượt quá 5
    if (images.length + fileArray.length > 5) {
      alert("Bạn chỉ có thể chọn tối đa 5 ảnh!");
      return;
    }

    setImages((prevImages) => [...prevImages, ...fileArray]); // Store image URLs
  };

  const handleContinue = () => {
    setOpenFeedback(true);
  };

  const handleCloseFeedback = () => {
    setOpenFeedback(false);
    onClose();
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <>
      <ModalFeedbackSeller
        open={openFeedback}
        onClose={handleCloseFeedback}
        sellerName={""}
        sellerId={""}
        userId={""}
        orderId={""}
        onStatusUpdate={function (orderId: string, newStatus: string): void {
          throw new Error("Function not implemented.");
        }}
      />
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
            paddingTop: "40px",
            paddingBottom: "25px",
          }}
        >
          XÁC NHẬN NHẬN HÀNG VÀ ĐÁNH GIÁ TRUYỆN
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ position: "absolute", right: 20, top: 20, color: "gray" }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ padding: "0px 60px 40px 60px" }}>
          <div style={{ display: "flex", alignItems: "flex-start" }}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", marginRight: "8px" }}
            >
              Tên truyện:
            </Typography>
            <div style={{ display: "flex", flexDirection: "column" }}>
              <Typography sx={{ fontSize: "18px" }}>
                Thám Tử Lừng Danh Conan - Tập 102 (x1)
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                Thám Tử Lừng Danh Conan - Tập 1 (x1)
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                Thám Tử Lừng Danh Conan - Tập 2 (x1)
              </Typography>
            </div>
          </div>

          <div style={{ display: "flex", marginTop: "10px" }}>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "bold", marginRight: "8px" }}
            >
              Mã đơn hàng:
            </Typography>
            <Typography sx={{ fontSize: "18px" }}>240909GKNHT1P0</Typography>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "center",
              marginTop: "10px",
            }}
          >
            <div style={{ display: "flex", marginTop: "10px" }}>
              <Typography
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginRight: "8px",
                }}
              >
                Ảnh truyện cụ thể
              </Typography>
              <Typography sx={{ fontSize: "18px" }}>
                (tùy chọn): tối đa 5 ảnh
              </Typography>
            </div>
            <input
              accept="image/*"
              type="file"
              multiple
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="upload-images"
            />
            <label htmlFor="upload-images">
              <Button
                component="span"
                sx={{
                  textTransform: "none",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  color: "#000",
                  backgroundColor: "#fff",
                  border: "1px solid black",
                  borderRadius: "10px",
                  padding: "5px 15px",
                }}
                startIcon={<CloudUploadOutlinedIcon />}
              >
                Tải lên
              </Button>
            </label>
          </div>

          <div
            style={{
              display: "flex",
              gap: "20px",
              marginTop: "15px",
              flexWrap: "wrap",
            }}
          >
            {images.map((image, index) => (
              <div
                key={index}
                style={{ position: "relative", display: "inline-block" }}
              >
                <img
                  src={image}
                  alt={`uploaded-${index}`}
                  style={{
                    width: "100px",
                    height: "150px",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <IconButton
                  onClick={() => handleRemoveImage(index)}
                  sx={{
                    position: "absolute",
                    top: "5px",
                    right: "5px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "2px",
                    "&:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Đánh giá:
            </Typography>
            <Rating
              name="simple-controlled"
              value={ratingValue}
              onChange={(event, newValue) => {
                setRatingValue(newValue);
              }}
            />
          </div>

          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Nhập đánh giá của bạn (tối đa 200 ký tự)"
            sx={{ marginTop: "10px", borderRadius: "8px" }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              marginTop: "15px",
              alignItems: "center",
            }}
          >
            <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
              Đánh giá người bán:
            </Typography>
            <RadioGroup
              row
              value={isSellerRated}
              onChange={(event) => setIsSellerRated(event.target.value)}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Có" />
              <FormControlLabel value="no" control={<Radio />} label="Không" />
            </RadioGroup>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "20px",
              gap: "20px",
            }}
          >
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#000",
                color: "#fff",
                fontWeight: "bold",
                padding: "10px 30px",
                fontSize: "16px",
              }}
              onClick={isSellerRated === "yes" ? handleContinue : onClose}
            >
              {isSellerRated === "yes" ? "Tiếp tục" : "Hoàn tất"}
            </Button>
            <Button
              sx={{
                backgroundColor: "#fff",
                color: "#000",
                fontWeight: "bold",
                padding: "10px 30px",
                textTransform: "none",
                fontSize: "16px",
                border: "1px solid black",
              }}
              onClick={onClose}
            >
              HỦY
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModalOrder;
