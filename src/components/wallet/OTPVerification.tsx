/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Input, message, Modal } from "antd";
import { UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { generateNumericCode } from "../../assistants/generators";

export default function OTPVerification({
  user,
  isOpen,
  setIsOpen,
  handleCallback,
  phoneNumber,
}: {
  user: UserInfo;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleCallback: () => void;
  phoneNumber?: string;
}) {
  const [resendAvailable, setResendAvailable] = useState<number>(60);
  const [otpInput, setOtpInput] = useState<string>("");

  const [generatedOTP, setGeneratedOTP] = useState<string>();

  const smsInitialized = useRef(false);

  const sendOTP = async () => {
    if (!user.phone && !phoneNumber) {
      message.warning({
        key: "empty-phone",
        content: <p>Không tìm thấy số điện thoại để gửi mã!</p>,
        duration: 5,
      });
      setIsOpen(false);
      return;
    }

    const newOTP = generateNumericCode(6);

    await privateAxios
      .post("speed-sms/send", {
        phone: phoneNumber || user.phone,
        content: newOTP,
      })
      .then(() => {
        setGeneratedOTP(newOTP);
        setResendAvailable(60);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    if (resendAvailable > 0) {
      const interval = setInterval(() => {
        setResendAvailable((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [resendAvailable]);

  useEffect(() => {
    if (!smsInitialized.current) {
      sendOTP();
      smsInitialized.current = true;
    }
  }, []);

  const verifyOTP = () => {
    console.log("GENERATED OTP: ", generatedOTP);
    if (otpInput === generatedOTP) {
      setIsOpen(false);
      handleCallback();
    } else {
      message.error({
        key: "otp",
        content:
          "Mã OTP không đúng. Vui lòng kiểm tra lại mã OTP đã được gửi về số điện thoại của bạn!",
        duration: 5,
      });
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setOtpInput("");
        setIsOpen(false);
      }}
      maskClosable={false}
      footer={null}
      centered
    >
      <div className="flex flex-col gap-4">
        <p className="text-[1.5em] font-semibold">XÁC THỰC BẰNG OTP</p>

        <p className="font-light">
          Hệ thống đã gửi một mã OTP để xác nhận giao dịch rút tiền của bạn đến
          số điện thoại *** ***{" "}
          {phoneNumber
            ? phoneNumber.slice(-3)
            : user.phone
            ? user.phone.slice(-3)
            : ""}
          .
        </p>

        <Input.OTP
          value={otpInput}
          onChange={(value) => {
            setOtpInput(value);
          }}
        />

        <div className="flex items-stretch gap-1">
          <button
            disabled={resendAvailable > 0}
            onClick={() => sendOTP()}
            className="grow border border-gray-300 rounded-md py-2 duration-200 hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white disabled:cursor-not-allowed"
          >
            Gửi lại {resendAvailable > 0 && `(Sau ${resendAvailable}s)`}
          </button>

          <button
            disabled={otpInput.length !== 6}
            onClick={() => verifyOTP()}
            className="grow rounded-md text-white bg-sky-800 duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            XÁC THỰC
          </button>
        </div>
      </div>
    </Modal>
  );
}
