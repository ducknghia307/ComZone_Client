import { Button, IconButton, TextField, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { UserInfo } from "../../common/base.interface";
import CurrencySplitter from "../../assistants/Spliter";
// interface Wallet extends BaseInterface {
//   balance: number;
//   nonWithdrawableAmount: number;
//   status: number;
// }
interface DepositFormProps {
  onBack: () => void;
  userInfo: UserInfo;
}

const DepositForm: React.FC<DepositFormProps> = ({ onBack, userInfo }) => {
  const [isVisible, setIsVisible] = useState(false);
  console.log(userInfo);

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
        <div className="bw-full max-w-xl m-auto mt-10">
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
              Nhập số tiền nạp:
            </Typography>
            <TextField
              variant="outlined"
              fullWidth
              //   slotProps={{
              //     select: <Typography>đ</Typography>,
              //   }}
            />
          </div>
          <div className="flex flex-wrap justify-start gap-2 w-full max-w-lg mx-auto my-4">
            {[20000, 50000, 100000, 200000, 500000, 1000000, 1500000, 2000000]
              // .filter((value) => value >= Math.max(0, amount - balance))
              .map((value) => (
                <button
                  key={value}
                  className=" px-2 bg-white border border-gray-500 hover:bg-gray-200 duration-200 rounded text-black"
                  // onClick={() => setSelectedAmount(value)}
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
          <Box display="flex" gap={3} sx={{ paddingLeft: "20px" }}>
            <img
              style={{
                border: "1px solid black",
                borderRadius: "10px",
                width: "70px",
                height: "70px",
              }}
              src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
              alt="ZaloPay"
            />
            <img
              style={{
                border: "1px solid black",
                borderRadius: "10px",
                width: "70px",
                height: "70px",
              }}
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLeYoMVenMbgWL1FxDJPKuQvJD6R0KdnXE7A&s"
              alt="VNPay"
              width={100}
            />
          </Box>
          <Button
            sx={{
              marginTop: 6,
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
              color: "#fff",
              backgroundColor: "#000",
              padding: "5px 20px",
              fontSize: "16px",
              fontFamily: "REM",
            }}
            className="duration-200 hover:opacity-70"
          >
            TIẾN HÀNH NẠP TIỀN
          </Button>
        </div>
      </Box>
    </div>
  );
};

export default DepositForm;
