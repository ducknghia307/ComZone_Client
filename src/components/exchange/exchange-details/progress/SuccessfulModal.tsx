import { Modal } from "antd";
import React, { Dispatch, SetStateAction } from "react";
interface SuccessfulProp {
  isSuccessfulModal: boolean;
  setSuccessfulModal: Dispatch<SetStateAction<boolean>>;
}
const SuccessfulModal: React.FC<SuccessfulProp> = ({
  isSuccessfulModal,
  setSuccessfulModal,
}) => {
  return (
    <div>
      <Modal
        title={
          <h2 className="text-xl font-semibold">
            XÁC NHẬN ĐÃ NHẬN HÀNG THÀNH CÔNG
          </h2>
        }
        open={isSuccessfulModal}
        footer={null}
        centered
        // onOk={handleOk}
        onCancel={() => setSuccessfulModal(false)}
      >
        <div className="w-full flex flex-col gap-2 mt-4">
          <p className="text-base">
            Cảm ơn bạn đã xác nhận! Đơn hàng của bạn đã được đánh dấu là đã nhận
            thành công.
          </p>
          <button
            className="w-full py-2 text-lg rounded-lg bg-black text-white hover:opacity-70 duration-200 mt-4"
            onClick={() => setSuccessfulModal(false)}
          >
            ĐÓNG
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default SuccessfulModal;
