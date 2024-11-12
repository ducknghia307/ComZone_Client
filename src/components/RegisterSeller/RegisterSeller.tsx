import React, { useEffect, useState } from "react";
import { message, Steps } from "antd";
import SellerInfomation from "./SellerInfomation";
import DeliveryMethod from "./DeliveryMethod";
import { privateAxios } from "../../middleware/axiosInstance";
import { UserInfo } from "../../common/base.interface";
import RegisterSellerSuccess from "./RegisterSellerSuccess";
import { useNavigate } from "react-router-dom";

const RegisterSeller: React.FC = () => {
  const [current, setCurrent] = useState(0);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [isAddressComplete, setIsAddressComplete] = useState(false);
  const navigate = useNavigate();
  // New state variables to store seller information
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [district, setDistrict] = useState<number | null>(null);
  const [province, setProvince] = useState<number | null>(null);
  const [ward, setWard] = useState<number | null>(null);
  const [detailedAddress, setDetailedAddress] = useState<string>("");

  const validateAddress = (isValid: boolean) => {
    setIsAddressComplete(isValid);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("/users/profile");
      const data = response.data;
      setUserInfo(data);
    } catch {
      console.log("Error fetching user info...");
    }
  };

  const handleSendOtp = () => {
    if (phone) {
      setOtpSent(true);
    } else {
      message.warning("Bạn cần nhập số điện thoại để gửi mã xác thực OTP!");
    }
  };

  const next = () => {
    if (current === 0) {
      if (!otp) {
        message.error("Vui lòng nhập mã xác thực.");
      } else {
        if (otp === "123456") {
          message.success("Mã OTP hợp lệ");
          setCurrent(current + 1);
        } else {
          message.error("Mã xác thực không hợp lệ. Vui lòng kiểm tra lại.");
        }
      }
    } else if (current === 1) {
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
      title: <span className="whitespace-nowrap">Thông tin Người bán</span>,
    },
    {
      key: "Cài đặt vận chuyển",
      title: <span className="whitespace-nowrap">Cài đặt vận chuyển</span>,
    },
    {
      key: "Hoàn tất",
      title: <span className="whitespace-nowrap">Hoàn tất</span>,
    },
  ];

  const steps = [
    {
      title: "Thông tin Người bán",
      content: (
        <SellerInfomation
          userInfo={userInfo}
          otp={otp}
          setOtp={setOtp}
          otpSent={otpSent}
          handleSendOtp={handleSendOtp}
          setName={setName} // Pass down the setter
          setEmail={setEmail} // Pass down the setter
          setPhone={setPhone} // Pass down the setter
        />
      ),
    },
    {
      title: "Cài đặt vận chuyển",
      content: (
        <DeliveryMethod
          validateAddress={validateAddress}
          setDistrict={setDistrict} // Pass down the setter
          setProvince={setProvince} // Pass down the setter
          setWard={setWard} // Pass down the setter
          setDetailedAddress={setDetailedAddress} // Pass down the setter
        />
      ),
    },
    {
      title: "Hoàn tất",
      content: <RegisterSellerSuccess />,
    },
  ];

  useEffect(() => {
    fetchUserInfo();
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
      message.success("Đăng ký thông tin người bán thành công!");
      console.log("Response data:", response.data);
      navigate("/sellerManagement");
    } catch (error) {
      message.error(
        "Đã xảy ra lỗi khi đăng ký thông tin người bán. Vui lòng thử lại."
      );
      console.error("Error posting seller details:", error);
    }
  };

  return (
    <div className="w-full px-2 pb-4 pt-8">
      <div className="flex w-full items-center justify-center">
        <Steps
          current={current}
          items={items}
          labelPlacement="vertical"
          progressDot
          className="w-2/3"
        />
      </div>
      <div className="w-full">{steps[current].content}</div>
      <div className="flex w-full items-center justify-center">
        <div className="mt-6 flex flex-row items-center justify-end w-full h-10">
          {current < steps.length - 1 && (
            <button
              className="px-4 py-2 rounded-lg bg-black text-white duration-200 hover:opacity-70"
              onClick={next}
            >
              Tiếp theo
            </button>
          )}
          {current === steps.length - 1 && (
            <button
              className="px-4 py-2 rounded-lg bg-black text-white duration-200 hover:opacity-70"
              onClick={handleFinish} // Call handleFinish when "Hoàn thành" is clicked
            >
              Hoàn thành
            </button>
          )}
          {current > 0 && (
            <button
              className="px-4 py-2 rounded-lg bg-white text-black duration-200 hover:opacity-70 border border-black ml-4"
              onClick={prev}
            >
              Quay lại
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterSeller;
