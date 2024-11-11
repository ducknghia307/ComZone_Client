import { Modal } from "antd";
import React from "react";
import RegisterSeller from "../RegisterSeller/RegisterSeller";

interface OpenModal {
  isRegisterSellerModal: boolean;
  setIsRegisterSellerModal: (value: boolean) => void;
}

const RegisterSellerModal: React.FC<OpenModal> = ({
  isRegisterSellerModal,
  setIsRegisterSellerModal,
}) => {
  return (
    <>
      <Modal
        title="Basic Modal"
        open={isRegisterSellerModal}
        // onOk={handleOk}
        onCancel={() => setIsRegisterSellerModal(!isRegisterSellerModal)}
        footer={null}
        width={800}
      >
        <RegisterSeller />
      </Modal>
    </>
  );
};

export default RegisterSellerModal;
