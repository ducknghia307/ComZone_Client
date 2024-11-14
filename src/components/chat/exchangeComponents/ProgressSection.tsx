import { useEffect, useState } from "react";
import { ExchangeOffer } from "../../../common/interfaces/exchange-offer.interface";
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";
import { Avatar, Tooltip } from "antd";
import ActionButtons from "./ActionButtons";
import CurrencySplitter from "../../../assistants/Spliter";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";
import PlaceDepositModal from "./PlaceDepositModal";
import DepositWalletModal from "./DepositWalletModal";
import { privateAxios } from "../../../middleware/axiosInstance";
import styles from "./style.module.css";
import { Deposit } from "../../../common/interfaces/deposit.interface";
import DeliveryAddressModal from "./DeliveryAddressModal";

export default function ProgressSection({
  exchangeOffer,
  userId,
  setIsLoading,
}: {
  exchangeOffer: ExchangeOffer;
  userId: string;
  setIsLoading: Function;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [firstCurrentStage, setFirstCurrentStage] = useState<number>(1);
  const [secondCurrentStage, setSecondCurrentStage] = useState<number>(1);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isDeliveryModal, setDeliveryModal] = useState<boolean>(false);
  const exchangeRequest: ExchangeRequest = exchangeOffer.exchangeRequest;
  const [isDepositModal, setIsDepositModal] = useState<boolean>(false);
  const firstUser =
    exchangeOffer.user.id === userId
      ? exchangeOffer.user
      : exchangeRequest.user;

  const secondUser =
    exchangeOffer.user.id !== userId
      ? exchangeOffer.user
      : exchangeRequest.user;

  const firstComicsGroup =
    exchangeRequest.user.id === userId
      ? exchangeRequest.requestComics
      : exchangeOffer.offerComics;

  const secondComicsGroup =
    exchangeRequest.user.id !== userId
      ? exchangeRequest.requestComics
      : exchangeOffer.offerComics;

  const getUserCurrentStage = (stage: number) => {
    switch (stage) {
      case 1:
        return "Đang tiến hành đặt cọc";
      case 2:
        return "Đang ghi nhận thông tin giao hàng";
      case 3:
        return "Đang chờ giao truyện";
      case 4:
        return "Đã nhận được truyện";
    }
  };

  const fetchUserProgresses = async () => {
    setIsLoading(true);

    try {
      const exchangeDeposits = await privateAxios
        .get(`deposits/exchange-request/${exchangeRequest.id}`)
        .then((res) => {
          console.log("Deposits: ", res.data);
          return res.data;
        })
        .catch((err) => console.log(err));

      if (exchangeDeposits && exchangeDeposits.length > 0) {
        if (
          exchangeDeposits.find(
            (deposit: Deposit) => deposit.user.id === firstUser.id
          )
        ) {
          setFirstCurrentStage(2);
        }

        if (
          exchangeDeposits.find(
            (deposit: Deposit) => deposit.user.id === secondUser.id
          )
        ) {
          setSecondCurrentStage(2);
        }
      }
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProgresses();
  }, [exchangeOffer]);

  const handleShowDepositModal = () => {
    setIsModalVisible(true);
  };

  const handleShowDeliveryModal = () => {
    setDeliveryModal(true);
  };

  if (isExpanded)
    return (
      <div className="w-full">
        <div className="w-full flex flex-col items-stretch justify-start gap-2 p-2 pb-4 border-b border-gray-300">
          <div className="w-full flex items-center justify-start gap-8">
            <div className="flex flex-col items-center gap-2">
              <Avatar src={firstUser.avatar} size={64} />
              <p className="font-light text-xs text-gray-600">Bạn</p>
            </div>

            <div className="flex items-center gap-8 xl:gap-16">
              <Stage1
                currentStage={firstCurrentStage}
                comicsGroup={firstComicsGroup}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
              <Stage2 currentStage={firstCurrentStage} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
              <Stage3 currentStage={firstCurrentStage} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M16.1716 10.9999L10.8076 5.63589L12.2218 4.22168L20 11.9999L12.2218 19.778L10.8076 18.3638L16.1716 12.9999H4V10.9999H16.1716Z"></path>
              </svg>
              <Stage4 currentStage={secondCurrentStage} />
            </div>
          </div>

          {/* Middle */}
          <div className="flex flex-col justify-center items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M16.0503 12.0498L21 16.9996L16.0503 21.9493L14.636 20.5351L17.172 17.9988L4 17.9996V15.9996L17.172 15.9988L14.636 13.464L16.0503 12.0498ZM7.94975 2.0498L9.36396 3.46402L6.828 5.9988L20 5.99955V7.99955L6.828 7.9988L9.36396 10.5351L7.94975 11.9493L3 6.99955L7.94975 2.0498Z"></path>
            </svg>
            <div className="flex items-center gap-1">
              <Tooltip
                placement="bottomLeft"
                title={
                  <p className="font-light text-xs text-black">
                    Mức cọc hoàn toàn do người đăng bài tìm kiếm trao đổi quyết
                    định. Giá trị cọc sẽ không đổi xuyên suốt quá trình trao
                    đổi.
                  </p>
                }
                color="white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12 2 6.47715 6.47715 2 12 2 17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 7.58172 4 4 7.58172 4 12 4 16.4183 7.58172 20 12 20ZM13 10.5V15H14V17H10V15H11V12.5H10V10.5H13ZM13.5 8C13.5 8.82843 12.8284 9.5 12 9.5 11.1716 9.5 10.5 8.82843 10.5 8 10.5 7.17157 11.1716 6.5 12 6.5 12.8284 6.5 13.5 7.17157 13.5 8Z"></path>
                </svg>
              </Tooltip>
              <p>
                Mức cọc: {CurrencySplitter(exchangeRequest.depositAmount || 0)}{" "}
                đ
              </p>
            </div>
          </div>

          <div className="flex flex-row-reverse items-center justify-start gap-8">
            <Avatar src={secondUser.avatar} size={64} />

            <div className="flex flex-row-reverse items-center gap-8 xl:gap-16">
              <Stage1
                currentStage={secondCurrentStage}
                comicsGroup={secondComicsGroup}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
              </svg>
              <Stage2 currentStage={secondCurrentStage} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
              </svg>
              <Stage3 currentStage={secondCurrentStage} rotate={true} />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
              </svg>
              <Stage4 currentStage={secondCurrentStage} />
            </div>
          </div>
        </div>

        <ActionButtons
          currentStage={firstCurrentStage}
          oppositeCurrentStage={secondCurrentStage}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onShowModal={handleShowDepositModal}
          handleShowDeliveryModal={handleShowDeliveryModal}
        />
        {exchangeRequest.depositAmount && (
          <PlaceDepositModal
            isModalVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            firstUser={firstUser}
            exchangeRequest={exchangeRequest}
            setIsDepositModal={setIsDepositModal}
            setFirstCurrentStage={setFirstCurrentStage}
          />
        )}
        {firstUser.balance && exchangeRequest.depositAmount && (
          <DepositWalletModal
            isDepositModal={isDepositModal}
            setIsDepositModal={setIsDepositModal}
            balance={firstUser.balance}
            amount={exchangeRequest.depositAmount}
          />
        )}
        {exchangeRequest && (
          <DeliveryAddressModal
            isDeliveryModal={isDeliveryModal}
            setDeliveryModal={setDeliveryModal}
            exchangeRequest={exchangeRequest}
          />
        )}
      </div>
    );
  else
    return (
      <div className="w-full flex flex-col items-stretch justify-start">
        <div className="basis-full flex items-center justify-between px-2 py-2">
          <div className="w-[45%] flex items-center justify-start gap-4 overflow-hidden">
            <Avatar src={firstUser.avatar} size={40} />
            <p className="font-light text-gray-500">
              {getUserCurrentStage(firstCurrentStage)}
            </p>
            <div className={`${styles.smallDotTyping} mx-4`}></div>
          </div>

          <div className="grow flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M16.0503 12.0498L21 16.9996L16.0503 21.9493L14.636 20.5351L17.172 17.9988L4 17.9996V15.9996L17.172 15.9988L14.636 13.464L16.0503 12.0498ZM7.94975 2.0498L9.36396 3.46402L6.828 5.9988L20 5.99955V7.99955L6.828 7.9988L9.36396 10.5351L7.94975 11.9493L3 6.99955L7.94975 2.0498Z"></path>
            </svg>
          </div>

          <div className="w-[45%] flex flex-row-reverse items-center justify-start gap-4 overflow-hidden">
            <Avatar src={secondUser.avatar} size={40} />
            <p className="font-light text-gray-500">
              {getUserCurrentStage(secondCurrentStage)}
            </p>
            <div className={`${styles.smallDotTyping} mx-4`}></div>
          </div>
        </div>

        <ActionButtons
          currentStage={firstCurrentStage}
          oppositeCurrentStage={secondCurrentStage}
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onShowModal={handleShowDepositModal}
          handleShowDeliveryModal={handleShowDeliveryModal}
        />
        {exchangeRequest.depositAmount && (
          <PlaceDepositModal
            isModalVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)}
            firstUser={firstUser}
            exchangeRequest={exchangeRequest}
            setIsDepositModal={setIsDepositModal}
            setFirstCurrentStage={setFirstCurrentStage}
          />
        )}
        {firstUser.balance && exchangeRequest.depositAmount && (
          <DepositWalletModal
            isDepositModal={isDepositModal}
            setIsDepositModal={setIsDepositModal}
            balance={firstUser.balance}
            amount={exchangeRequest.depositAmount}
          />
        )}
        {exchangeRequest && (
          <DeliveryAddressModal
            isDeliveryModal={isDeliveryModal}
            setDeliveryModal={setDeliveryModal}
            exchangeRequest={exchangeRequest}
          />
        )}
      </div>
    );
}
