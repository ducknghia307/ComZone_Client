import React, { useState } from "react";
import { Modal, Button, Typography } from "@mui/material";
import { privateAxios } from "../../middleware/axiosInstance";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { callbackUrl } from "../../redux/features/navigate/navigateSlice";
import { useNavigate } from "react-router-dom";
import PaymentForDeposit from "./PaymentForDeposit";

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
  const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
  const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [requiredDeposit, setRequiredDeposit] = useState<number>(depositAmount);
  const buttonStyles = {
    outlined: {
      borderColor: "black",
      borderWidth: "3px",
      color: "black",
      fontFamily: "REM",
      padding: "5px 30px",
      fontSize: "16px",
      textTransform: "uppercase",
      letterSpacing: "1px",
    },
    contained: {
      backgroundColor: "black",
      color: "white",
      fontFamily: "REM",
      padding: "5px 30px",
      fontSize: "16px",
      textTransform: "uppercase",
      letterSpacing: "1px",
      boxShadow: "5px 5px 0 white",
    },
  };

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
          onClose();
          setConfirmationModalOpen(true);
          // setPaymentModalOpen(true);
        });
    } else {
      alert("Please log in");
      dispatch(callbackUrl({ navigateUrl: location.pathname }));
      navigate("/signin");
    }
  };
  const handlePaymentSuccess = (amountPaid: number) => {
    if (amountPaid >= requiredDeposit) {
      console.log("Payment successful");
      setPaymentModalOpen(false);
      onDepositSuccess();
      onClose();
    } else {
      alert("Not enough funds deposited. Please try again.");
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
    <>
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
          </Typography>{" "}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
            }}
          >
            <Button
              variant="outlined"
              sx={buttonStyles.outlined}
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
              sx={buttonStyles.contained}
            >
              Xác Nhận
            </Button>
          </div>
        </div>
      </Modal>
      <Modal
        open={isConfirmationModalOpen}
        onClose={() => setConfirmationModalOpen(false)}
        aria-labelledby="confirmation-modal-title"
        aria-describedby="confirmation-modal-description"
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
            padding: "30px",
            borderRadius: "10px",
            textAlign: "center",
            width: "400px",
          }}
        >
          <Typography
            id="confirmation-modal-title"
            variant="h6"
            style={{ marginBottom: "20px", fontWeight: "bold" }}
          >
            Số dư không đủ
          </Typography>
          <Typography
            id="confirmation-modal-description"
            style={{ marginBottom: "20px" }}
          >
            Số dư trong ví của bạn không đủ để đặt cọc. Bạn có muốn nạp thêm
            tiền không?
          </Typography>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "15px",
            }}
          >
            <Button
              variant="outlined"
              onClick={() => setConfirmationModalOpen(false)}
              sx={buttonStyles.outlined}
            >
              Hủy
            </Button>
            <Button
              variant="contained"
              onClick={() => {
                setConfirmationModalOpen(false);
                setPaymentModalOpen(true);
              }}
              sx={buttonStyles.contained}
            >
              Nạp tiền
            </Button>
          </div>
        </div>
      </Modal>
      {isPaymentModalOpen && (
        <PaymentForDeposit
          isModalOpen={isPaymentModalOpen}
          handleOk={() => setPaymentModalOpen(false)}
          handleCancel={() => setPaymentModalOpen(false)}
          amount={requiredDeposit}
          onPayment={(method, amountPaid) => handlePaymentSuccess(amountPaid)}
          auctionId={auctionId}
        />
      )}
    </>
  );
};

export default ModalDeposit;
