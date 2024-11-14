import { Modal } from "antd";
import React, { useState } from "react";
import RegisterSeller from "../RegisterSeller/RegisterSeller";
import Logo from "../../assets/square-logo.png";

interface OpenModal {
  isRegisterSellerModal: boolean;
  setIsRegisterSellerModal: (value: boolean) => void;
}

const RegisterSellerModal: React.FC<OpenModal> = ({
  isRegisterSellerModal,
  setIsRegisterSellerModal,
}) => {
  const [isWelcoming, setIsWelcoming] = useState<boolean>(true);
  return (
    <>
      <Modal
        title={
          isWelcoming ? null : (
            <h2 className="text-xl">Đăng ký trở thành người bán của ComZone</h2>
          )
        }
        open={isRegisterSellerModal}
        // onOk={handleOk}
        onCancel={() => setIsRegisterSellerModal(!isRegisterSellerModal)}
        footer={null}
        width={800}
        centered
      >
        {isWelcoming ? (
          <div className="w-full flex flex-col items-center justify-center gap-4 pt-8 text-center">
            <img
              src={Logo}
              className="w-1/4 p-4 rounded-full border drop-shadow-lg"
            />
            <p className="font-semibold text-lg">
              Chào mừng bạn đến với ComZone
            </p>
            <p className="text-xs font-light">
              Hãy hoàn thiện một số thông tin cần thiết để trở thành một người
              bán truyện tranh uy tín trên ComZone.
            </p>
            <button
              onClick={() => setIsWelcoming(false)}
              className="bg-black px-16 py-2 rounded-md text-white my-4 border border-black duration-300 hover:bg-white hover:text-black"
            >
              BẮT ĐẦU
            </button>
          </div>
        ) : (
          <RegisterSeller setIsRegisterSellerModal={setIsRegisterSellerModal} />
        )}
      </Modal>
    </>
  );
};

export default RegisterSellerModal;
