import React from "react";
import { Modal, Button, Typography } from "@mui/material";
import { privateAxios } from "../../middleware/axiosInstance";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import {
  callbackUrl,
  navigateSlice,
} from "../../redux/features/navigate/navigateSlice";
import { useNavigate } from "react-router-dom";

interface ModalDepositProps {
  open: boolean;
  onClose: () => void;
  depositAmount: number;
  onDepositSuccess: () => void;
  auctionId: string;
}

const ModalDeposit: React.FC<ModalDepositProps> = ({
  open,
  onClose,
  depositAmount,
  onDepositSuccess,
  auctionId,
}) => {
  const dispatch = useAppDispatch();
  const userId = useAppSelector((state) => state.auth.userId);
  const navigate = useNavigate();
  const handleConfirm = () => {
    if (userId) {
      // Make the real API call to place the deposit
      depositApiCall(auctionId)
        .then(() => {
          console.log("Deposit successful");
          onDepositSuccess();
          onClose();
        })
        .catch((error) => {
          console.error("Deposit failed:", error);
          alert("Đặt cọc thất bại. Vui lòng thử lại!");
        });
    } else {
      alert("Please log in");
      dispatch(callbackUrl({ navigateUrl: location.pathname }));
      navigate("/signin");
    }
  };
  const depositApiCall = async (auctionId: string) => {
    try {
      const response = await privateAxios.post(
        `/deposits/auction/${auctionId}`
      );
      return response.data;
    } catch (error) {
      throw new Error("Deposit failed");
    }
  };
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="deposit-modal-title"
      aria-describedby="deposit-modal-description"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(1px)",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "40px",
          borderRadius: "20px",
          textAlign: "center",
          maxWidth: "600px",
          width: "100%",
          border: "4px solid black",
          boxShadow: "5px 5px 0 black",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          id="deposit-modal-title"
          variant="h5"
          component="h2"
          style={{
            marginBottom: "25px",
            fontFamily: "REM",
            fontWeight: "bold",
            color: "black",
            textTransform: "uppercase",
            letterSpacing: "1px",
          }}
        >
          Xác Nhận Đặt Cọc
        </Typography>

        <Typography
          id="deposit-modal-description"
          style={{
            marginBottom: "25px",
            fontFamily: "REM",
            fontSize: "18px",
            fontWeight: "bold",
            color: "black",
          }}
        >
          Bạn có muốn đặt cọc{" "}
          <span style={{ color: "red" }}>
            {depositAmount.toLocaleString("vi-VN")}đ
          </span>{" "}
          cho cuộc đấu giá này?
        </Typography>

        <Typography
          variant="body2"
          style={{
            marginBottom: "25px",
            fontFamily: "REM",
            fontStyle: "italic",
            color: "#333",
            padding: "10px",
            backgroundColor: "#f0f0f0",
            borderRadius: "10px",
          }}
        >
          Lưu ý: Số tiền cọc sẽ được hoàn lại khi kết thúc đấu giá
        </Typography>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
          }}
        >
          <Button
            variant="contained"
            onClick={handleConfirm}
            style={{
              backgroundColor: "black",
              color: "white",
              fontFamily: "REM",
              padding: "10px 30px",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              boxShadow: "5px 5px 0 white",
            }}
          >
            Xác Nhận
          </Button>

          <Button
            variant="outlined"
            onClick={onClose}
            style={{
              borderColor: "black",
              borderWidth: "3px",
              color: "black",
              fontFamily: "REM",
              padding: "10px 30px",
              fontSize: "16px",
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Hủy
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalDeposit;
