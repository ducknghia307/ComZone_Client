import React, { useEffect, useState } from "react";
import { Checkbox, message, notification, Steps } from "antd";
import SellerInfomation from "./SellerInfomation";
import DeliveryMethod from "./DeliveryMethod";
import { privateAxios } from "../../middleware/axiosInstance";
import { UserInfo } from "../../common/base.interface";
import RegisterSellerSuccess from "./RegisterSellerSuccess";
import { useNavigate } from "react-router-dom";
import SubscriptionRegister from "./SubscriptionRegister";

const RegisterSeller = ({
  setIsRegisterSellerModal,
  fetchUserInfo,
}: {
  setIsRegisterSellerModal: React.Dispatch<React.SetStateAction<boolean>>;
  fetchUserInfo: () => void;
}) => {
  const [current, setCurrent] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const navigate = useNavigate();
  // New state variables to store seller information
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [district, setDistrict] = useState<number | null>(null);
  const [province, setProvince] = useState<number | null>(null);
  const [ward, setWard] = useState<string | null>(null);
  const [detailedAddress, setDetailedAddress] = useState<string>("");

  const [policyCheck, setPolicyCheck] = useState<boolean>(false);

  const validateAddress = (isValid: boolean) => {
    setIsAddressComplete(isValid);
  };

  const fetchUserInfoInRegister = async () => {
    try {
      const response = await privateAxios("/users/profile");
      const data = response.data;
      setUserInfo(data);
    } catch {
      console.log("Error fetching user info...");
    }
  };

  const handleSendOtp = () => {
    if (phone && phone.length > 0) {
      if (phone.length < 10 || phone.length > 11 || phone.charAt(0) !== "0")
        message.warning("Số điện thoại không hợp lệ!");

      setOtpSent(true);
    } else {
      message.warning("Bạn cần nhập số điện thoại để gửi mã xác thực OTP!");
    }
  };

  const next = () => {
    if (current === 1) {
      if (!isAddressComplete) {
        message.error("Vui lòng điền đầy đủ thông tin địa chỉ.");
      } else {
        setCurrent(current + 1);
      }
    } else {
      setCurrent(current + 1);
    }
  };

  const prev = () => {
    setCurrent(current - 1);
  };

  const items = [
    {
      key: "Thông tin Người bán",
      title: (
        <span className="text-xs whitespace-nowrap">Thông tin người bán</span>
      ),
    },
    {
      key: "Cài đặt vận chuyển",
      title: (
        <span className="text-xs whitespace-nowrap">Cài đặt vận chuyển</span>
      ),
    },
    {
      key: "Điều khoản sử dụng",
      title: (
        <span className="text-xs whitespace-nowrap">Điều khoản sử dụng</span>
      ),
    },
    {
      key: "Đăng ký gói bán",
      title: <span className="text-xs whitespace-nowrap">Đăng ký gói bán</span>,
    },
  ];

  const steps = [
    {
      title: "Thông tin người bán",
      content: (
        <SellerInfomation
          userInfo={userInfo}
          otp={otp}
          setOtp={setOtp}
          otpSent={otpSent}
          setOtpSent={setOtpSent}
          handleSendOtp={handleSendOtp}
          setName={setName}
          setPhone={setPhone}
          setCurrent={setCurrent}
        />
      ),
    },
    {
      title: "Cài đặt vận chuyển",
      content: (
        <DeliveryMethod
          validateAddress={validateAddress}
          setDistrict={setDistrict}
          setProvince={setProvince}
          setWard={setWard}
          setDetailedAddress={setDetailedAddress}
        />
      ),
    },
    {
      title: "Điều khoản sử dụng",
      content: <RegisterSellerSuccess />,
    },
    {
      title: "Đăng ký gói bán",
      content: (
        <SubscriptionRegister
          user={userInfo}
          setIsRegisterSellerModal={setIsRegisterSellerModal}
        />
      ),
    },
  ];

  useEffect(() => {
    fetchUserInfoInRegister();
  }, []);

  const handleFinish = async () => {
    const sellerData = {
      verifiedPhone: phone,
      district: district,
      province: province,
      ward: ward,
      detailedAddress: detailedAddress,
    };

    try {
      const response = await privateAxios.post("/seller-details", sellerData);
      message.success(
        "Đăng ký thông tin người bán thành công! Bạn có thể tiếp tục đăng ký gói bán của ComZone.",
        8
      );
      fetchUserInfo();
      console.log("Response data:", response.data);
    } catch (error) {
      message.error(
        "Đã xảy ra lỗi khi đăng ký thông tin người bán. Vui lòng thử lại."
      );
      console.error("Error posting seller details:", error);
    } finally {
      setCurrent(current + 1);
    }
  };

  return (
    <div className="w-full max-w-[70vw] px-2 pt-8">
      <div className="flex w-full items-center justify-center">
        <Steps current={current} items={items} labelPlacement="vertical" />
      </div>
      <div className="w-full">{steps[current].content}</div>

      {current === 2 && (
        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            checked={policyCheck}
            onChange={() => setPolicyCheck(!policyCheck)}
          />
          <p>Tôi đã đọc và chấp nhận điều khoản sử dụng.</p>
        </div>
      )}

      <div className="flex w-full items-center justify-center">
        <div className="mt-6 flex flex-row items-center justify-end w-full h-10 gap-4">
          {current > 0 && current < steps.length - 1 && (
            <button
              className="px-8 py-2 rounded-lg bg-white text-black duration-200 hover:opacity-70 border border-black"
              onClick={prev}
            >
              Quay lại
            </button>
          )}
          {current < steps.length - 2 && (
            <button
              className="px-16 py-2 rounded-lg bg-black text-white duration-200 hover:opacity-70"
              onClick={next}
            >
              Tiếp theo
            </button>
          )}
          {current === steps.length - 2 && (
            <button
              disabled={current === 2 && !policyCheck}
              className="px-16 py-2 rounded-lg bg-green-700 text-white duration-200 hover:opacity-70 disabled:bg-gray-300"
              onClick={handleFinish}
            >
              HOÀN TẤT ĐĂNG KÝ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterSeller;
