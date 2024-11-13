import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Modal, notification } from "antd";
import { UserInfo } from "../../../common/base.interface";
import CurrencySplitter from "../../../assistants/Spliter";
import { WalletOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";
import { privateAxios } from "../../../middleware/axiosInstance";
import Loading from "../../loading/Loading";

interface ModalProp {
  isModalVisible: boolean;
  onClose: () => void;
  firstUser: UserInfo;
  exchangeRequest: ExchangeRequest;
  setIsDepositModal: Dispatch<SetStateAction<boolean>>;
  setFirstCurrentStage: Dispatch<SetStateAction<number>>;
}

const PlaceDepositModal: React.FC<ModalProp> = ({
  isModalVisible,
  onClose,
  firstUser,
  exchangeRequest,
  setFirstCurrentStage,
  //   setIsDepositModal,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    onClose();
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const depositsPayload = {
      exchange: exchangeRequest.id,
      amount: exchangeRequest.depositAmount,
    };
    try {
      const resDeposits = await privateAxios.post("/deposits", depositsPayload);
      console.log("resDeposits", resDeposits.data);
      const resTransactions = await privateAxios.post("/transactions", {
        deposit: resDeposits.data.id,
        amount: exchangeRequest.depositAmount,
      });
      console.log("resTransactions", resTransactions.data);
      notification.success({
        message: "Đặt cọc thành công",
        duration: 2,
      });
      setFirstCurrentStage(2);
      onClose();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {isLoading && <Loading />}
      <Modal
        title={<h2 className="text-xl p-2">XÁC NHẬN ĐẶT CỌC NGAY</h2>}
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={600}
        footer={null}
      >
        <div className="flex flex-col p-2 w-full">
          <div className="flex flex-row gap-2">
            <WalletOutlined style={{ fontSize: "18px" }} />
            <h2 className="text-lg">
              Số dư hiện tại: {CurrencySplitter(firstUser.balance)}d
            </h2>
          </div>
          {firstUser.balance - Number(exchangeRequest.depositAmount) > 0 ? (
            <div className="flex flex-row gap-2 mt-4">
              <h2 className="text-light italic text-md">
                Số dư của bạn sau khi đặt cọc:{" "}
                {CurrencySplitter(
                  firstUser.balance - Number(exchangeRequest.depositAmount)
                )}
                d
              </h2>
            </div>
          ) : (
            <div className="flex flex-row gap-2 mt-4">
              <h2 className="text-red-500 text-base">Số dư không đủ.</h2>
              <h2
                className="text-sky-700 text-base hover:cursor-pointer"
                onClick={() =>
                  //   setIsDepositModal(true)
                  navigate("/accountmanagement/wallet")
                }
              >
                Nạp thêm
              </h2>
            </div>
          )}
          <div className="w-full flex justify-end gap-3 mt-4">
            <button className="font-semibold px-3 py-2 rounded-md hover:opacity-75 duration-200">
              HỦY
            </button>
            <button
              className="font-semibold px-5 py-2 text-white bg-black rounded-md hover:opacity-75 duration-200"
              onClick={handleSubmit}
            >
              XÁC NHẬN
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default PlaceDepositModal;
