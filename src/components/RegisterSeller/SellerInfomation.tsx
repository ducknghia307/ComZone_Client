import React, { useState, useEffect } from "react";
import { UserInfo } from "../../common/base.interface";
import { Input } from "antd";

interface SellerInfomationProps {
  userInfo?: UserInfo;
  otp: string;
  setOtp: (otp: string) => void;
  otpSent: boolean;
  handleSendOtp: () => void;
  setName: (name: string) => void;
  setEmail: (email: string) => void;
  setPhone: (phone: string) => void;
}

const SellerInfomation: React.FC<SellerInfomationProps> = ({
  userInfo,
  otp,
  setOtp,
  otpSent,
  handleSendOtp,
  setName,
  setEmail,
  setPhone,
}) => {
  const [name, setLocalName] = useState<string>(userInfo?.name || "");
  const [email, setLocalEmail] = useState<string>(userInfo?.email || "");
  const [phone, setLocalPhone] = useState<string>(userInfo?.phone || "");

  // Update local state when userInfo changes
  useEffect(() => {
    if (userInfo) {
      setLocalName(userInfo.name);
      setLocalEmail(userInfo.email);
      setLocalPhone(userInfo.phone || "");
    }
  }, [userInfo]);

  // Update parent state when local state changes
  useEffect(() => {
    setName(name);
  }, [name, setName]);

  useEffect(() => {
    setEmail(email);
  }, [email, setEmail]);

  useEffect(() => {
    setPhone(phone);
  }, [phone, setPhone]);

  return (
    <div className="w-full items-center justify-center bg-white REM">
      {!userInfo ? (
        <h2>Vui lòng đăng nhập</h2>
      ) : (
        <div className="w-full px-16 py-8 flex flex-col items-center justify-center">
          <div className="w-2/3 flex flex-col">
            <h2>Tên người bán</h2>
            <input
              className="p-2 border rounded-lg w-full mt-2"
              type="text"
              value={name}
              onChange={(e) => setLocalName(e.target.value)}
            />
          </div>
          <div className="w-2/3 flex flex-col mt-4">
            <h2>Email</h2>
            <input
              className="p-2 border rounded-lg w-full mt-2"
              type="text"
              value={email}
              onChange={(e) => setLocalEmail(e.target.value)}
            />
          </div>
          <div className="w-2/3 flex flex-col mt-4">
            <h2>Số điện thoại</h2>
            <div className="relative w-full">
              <input
                className="p-2 border rounded-lg w-full mt-2"
                type="text"
                placeholder="Nhập số điện thoại"
                value={phone}
                onChange={(e) => setLocalPhone(e.target.value)}
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
            <div className="w-2/3 flex flex-col mt-4">
              <h2>OTP</h2>
              <Input.OTP length={6} onChange={(e) => setOtp(e)} value={otp} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SellerInfomation;
