import { message, Modal, notification } from "antd";
import React, { useState } from "react";
import OTPVerification from "./OTPVerification";
import { UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";

export default function PhoneVerification({
  user,
  isOpen,
  setIsOpen,
  confirmCallback,
  cancelCallback,
}: {
  user: UserInfo;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  confirmCallback: () => void;
  cancelCallback: () => void;
}) {
  const [phoneInput, setPhoneInput] = useState<string>("");
  const [otpSent, setOtpSent] = useState<boolean>(false);

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setIsOpen(false);
    cancelCallback();
  };

  const handleSendOTP = () => {
    if (/^(0[3|5|7|8|9])[0-9]{8}$/.test(phoneInput)) setOtpSent(true);
    else {
      message.warning(<p className="REM">Số điện thoại không hợp lệ!</p>, 5);
    }
  };

  const handleUpdateVerifiedPhone = async () => {
    await privateAxios
      .patch("users/phone/verify", {
        phone: phoneInput,
      })
      .then(() => {
        notification.success({
          message: <p className="REM">Xác thực số điện thoại thành công</p>,
          duration: 5,
        });

        confirmCallback();
        setIsOpen(false);
      })
      .catch((err) => {
        notification.error({
          message: <p className="REM">Lỗi xác thực số điện thoại</p>,
          description: (
            <p className="REM">Vui lòng thử lại với số điện thoại khác!</p>
          ),
          duration: 5,
        });
        console.log(err);
      });
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleCancel}
      maskClosable={false}
      footer={null}
      centered
    >
      <div className="REM flex flex-col gap-2">
        <p className="text-xl font-semibold">THÊM SỐ ĐIỆN THOẠI XÁC THỰC</p>

        <p>
          Hệ thống cần ghi nhận và xác thực số điện thoại của bạn trước khi bạn
          thực hiện nạp tiền vào hệ thống.
        </p>

        <p>
          Số điện thoại đã được xác thực của bạn sẽ được dùng để xác thực các
          giao dịch rút tiền từ ví hệ thống về các tài khoản liên kết của bạn.
        </p>

        <div className="flex items-center gap-2 mt-2">
          <p>Nhập số điện thoại:</p>
          <input
            type="text"
            value={phoneInput}
            onChange={(e) => {
              if (e.target.value.length < 13) setPhoneInput(e.target.value);
            }}
            className="grow border border-gray-400 px-2 py-1 rounded-md"
          />
        </div>

        <div className="flex items-stretch gap-1 mt-2">
          <button
            onClick={handleCancel}
            className="grow py-2 border border-gray-400 rounded-md duration-200 hover:bg-gray-100 hover:border-gray-600"
          >
            Hủy bỏ
          </button>
          <button
            disabled={phoneInput.length < 9}
            onClick={handleSendOTP}
            className="grow bg-sky-800 text-white font-semibold py-2 rounded-md duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            GỬI MÃ
          </button>
        </div>
      </div>

      {otpSent && (
        <OTPVerification
          user={user}
          isOpen={otpSent}
          setIsOpen={setOtpSent}
          phoneNumber={phoneInput}
          handleCallback={() => handleUpdateVerifiedPhone()}
        />
      )}
    </Modal>
  );
}
