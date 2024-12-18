import React, { useState, useEffect } from "react";
import { UserInfo } from "../../common/base.interface";
import { message } from "antd";
import OTPVerification from "../wallet/OTPVerification";

interface SellerInformationProps {
  userInfo?: UserInfo;
  otp: string;
  setOtp: (otp: string) => void;
  otpSent: boolean;
  setOtpSent: React.Dispatch<React.SetStateAction<boolean>>;
  handleSendOtp: () => void;
  setName: (name: string) => void;
  setPhone: (phone: string) => void;
  setCurrent: React.Dispatch<React.SetStateAction<number>>;
}

const SellerInfomation: React.FC<SellerInformationProps> = ({
  userInfo,
  otp,
  setOtp,
  otpSent,
  setOtpSent,
  handleSendOtp,
  setName,
  setPhone,
  setCurrent,
}) => {
  const [name, setLocalName] = useState<string>(userInfo?.name || "");
  const [phone, setLocalPhone] = useState<string>(userInfo?.phone || "");

  // Update local state when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setLocalName(userInfo.name);
      setLocalPhone(userInfo.phone || "");
    }
  }, [userInfo]);

  // Update parent state when local state changes
  useEffect(() => {
    setName(name);
  }, [name, setName]);

  useEffect(() => {
    setPhone(phone);
  }, [phone, setPhone]);

  return (
    <div className="w-full items-center justify-center bg-white REM">
      {!userInfo ? (
        <h2>Vui lòng đăng nhập</h2>
      ) : (
        <div className="w-full px-16 pt-4 pb-8 flex flex-col items-stretch justify-center gap-4">
          <div className="flex items-start justify-start gap-16">
            <div className="flex flex-col">
              <h2>
                Tên người bán: <span className="text-red-600">*</span>
              </h2>
              <p className="text-xs font-light italic text-gray-700">
                Tên người dùng của tài khoản để hiển thị cho những truyện được
                đăng bán của bạn trên hệ thống.
              </p>
              <input
                className="p-2 border rounded-lg min-w-fit xl:w-1/2 mt-2"
                type="text"
                value={name}
                onChange={(e) => setLocalName(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-start justify-start gap-16">
            <div className="w-2/3 flex flex-col">
              <h2>
                Số điện thoại: <span className="text-red-600">*</span>
              </h2>
              <div className="relative w-full">
                <input
                  className="p-2 border rounded-lg w-full mt-2"
                  type="text"
                  placeholder="Nhập số điện thoại"
                  value={phone}
                  onChange={(e) => {
                    const isValidNumber = e.target.value.match(/^[0-9]*$/);
                    if (isValidNumber && e.target.value.length < 11)
                      setLocalPhone(e.target.value);
                  }}
                />
                <button
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 mt-1 px-4 py-1 bg-black text-white rounded-lg hover:bg-gray-800 duration-200"
                  onClick={handleSendOtp}
                >
                  {!otpSent ? "Gửi mã" : "Gửi lại"}
                </button>
              </div>
            </div>
            {otpSent && (
              <OTPVerification
                isOpen={otpSent}
                setIsOpen={setOtpSent}
                handleCallback={() => {
                  message.success("Xác thực OTP thành công.", 5);
                  setOtpSent(false);
                  setCurrent((prev) => prev + 1);
                }}
                user={userInfo}
                phoneNumber={phone}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerInfomation;
