import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { UserInfo } from "../../common/base.interface";
import CurrencySplitter from "../../assistants/Spliter";
import { privateAxios } from "../../middleware/axiosInstance";
import PhoneVerification from "./PhoneVerification";
// interface Wallet extends BaseInterface {
//   balance: number;
//   nonWithdrawableAmount: number;
//   status: number;
// }
interface DepositFormProps {
  onBack: () => void;
  userInfo: UserInfo;
  fetchUserInfo: () => void;
}

const DepositForm: React.FC<DepositFormProps> = ({
  onBack,
  userInfo,
  fetchUserInfo,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [amount, setAmount] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState<"zalopay" | "vnpay">();

  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  const redirectToPay = async () => {
    try {
      const redirectPath = window.location.pathname;
      localStorage.setItem("wallet-deposit", amount.toString());

      if (paymentGateway === "zalopay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount,
        });
        const resZalopay = await privateAxios.post("/zalopay", {
          walletDeposit: resWalletDes.data.id,
          redirectPath: redirectPath || "/",
        });
        window.location.href = resZalopay.data.orderurl;
      } else if (paymentGateway === "vnpay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount,
        });
        const resVNpay = await privateAxios.post("/vnpay", {
          walletDeposit: resWalletDes.data.id,
          redirectPath: redirectPath || "/",
        });
        window.location.href = resVNpay.data.url;
      } else {
        console.error("No valid payment method selected");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
  };

  useEffect(() => {
    if (!userInfo.phone || userInfo.phone.length === 0)
      setIsVerifyingPhone(true);
  }, [userInfo]);

  return (
    <div className="w-full REM">
      <Box>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          variant="h4"
          gutterBottom
          textAlign="center"
          fontWeight="bold"
          fontFamily="REM"
        >
          NẠP TIỀN VÀO VÍ
        </Typography>
        <div className="w-full max-w-xl m-auto mt-10 flex flex-col">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="h6" fontFamily="REM">
              Số dư hiện tại:
            </Typography>
            <Box display="flex" alignItems="center">
              <Typography
                variant="h6"
                fontFamily="REM"
                sx={{ color: "#FF8A00" }}
              >
                {isVisible ? (
                  <span>{CurrencySplitter(Number(userInfo?.balance))} đ</span>
                ) : (
                  "******** đ"
                )}
              </Typography>
              <IconButton onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </Box>
          </div>

          <div className="mt-6">
            <Typography
              fontFamily="REM"
              sx={{ paddingBottom: "10px", fontWeight: "bold" }}
            >
              Nhập số tiền nạp (VND):
            </Typography>
            <input
              type="text"
              value={CurrencySplitter(amount)}
              onChange={(e) => {
                const value = e.target.value.replace(/\./g, "");
                if (value.length === 0) setAmount(0);
                if (/^[0-9]*$/.test(value)) {
                  if (Number(value) > 99999000) setAmount(99999000);
                  else setAmount(Number(value));
                }
              }}
              className="w-full border border-gray-400 p-2 rounded-md"
            />
          </div>
          <div className="grid md:grid-cols-4 grid-cols-2 gap-2 w-full my-4">
            {[20000, 50000, 100000, 200000, 500000, 1000000, 1500000, 2000000]
              // .filter((value) => value >= Math.max(0, amount - balance))
              .map((value) => (
                <button
                  key={value}
                  className="px-2 bg-white border border-gray-500 hover:bg-gray-200 duration-200 rounded text-black"
                  onClick={() => setAmount(amount + value)}
                >
                  {CurrencySplitter(value)}
                </button>
              ))}
          </div>
          <Typography
            sx={{
              paddingBottom: "10px",
              fontWeight: "bold",
              paddingTop: "20px",
            }}
            fontFamily="REM"
          >
            Chọn hình thức nạp:
          </Typography>

          <div className="flex items-stretch justify-center gap-2 pt-4">
            <button
              onClick={() => setPaymentGateway("zalopay")}
              className={`basis-1/2 flex items-center gap-2 ${
                paymentGateway === "zalopay"
                  ? "border-2 border-black"
                  : "border border-gray-400 font-light opacity-30"
              } duration-200 rounded-md p-2`}
            >
              <img
                src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                alt="ZaloPay"
                className="w-1/6"
              />
              <p>NẠP QUA ZALOPAY</p>
            </button>

            <button
              onClick={() => setPaymentGateway("vnpay")}
              className={`basis-1/2 flex items-center gap-2 ${
                paymentGateway === "vnpay"
                  ? "border-2 border-black"
                  : "border border-gray-400 font-light opacity-30"
              } duration-200 rounded-md p-2`}
            >
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLeYoMVenMbgWL1FxDJPKuQvJD6R0KdnXE7A&s"
                alt="VNPay"
                className="w-1/6"
              />
              <p>NẠP QUA VNPAY</p>
            </button>
          </div>

          <button
            disabled={amount === 0 || !paymentGateway}
            onClick={() => redirectToPay()}
            className="bg-black text-white text-xl mt-8 mx-auto p-2 rounded-md font-semibold duration-200 hover:bg-gray-700 disabled:bg-gray-300"
          >
            CHUYỂN ĐẾN CỔNG THANH TOÁN
          </button>
        </div>
      </Box>

      <PhoneVerification
        user={userInfo}
        isOpen={isVerifyingPhone}
        setIsOpen={setIsVerifyingPhone}
        confirmCallback={() => {
          fetchUserInfo();
        }}
        cancelCallback={onBack}
      />
    </div>
  );
};

export default DepositForm;
