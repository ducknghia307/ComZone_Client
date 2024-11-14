import { Dispatch, SetStateAction } from "react";

export default function ActionButtons({
  currentStage,
  oppositeCurrentStage,
  onShowModal,
  isExpanded,
  setIsExpanded,
  handleShowDeliveryModal,
  setSuccessfulModal,
}: {
  currentStage: number;
  oppositeCurrentStage: number;
  onShowModal: () => void;
  handleShowDeliveryModal: () => void;
  isExpanded: boolean;
  setIsExpanded: Function;
  setSuccessfulModal: Dispatch<SetStateAction<boolean>>;
}) {
  const getButton = () => {
    if (currentStage > oppositeCurrentStage)
      return (
        <div className="w-full bg-gray-300 text-white py-2 rounded-lg text-center">
          Đang đợi người đối diện thực hiện...
        </div>
      );
    switch (currentStage) {
      case 1:
        return "Thêm thông tin giao hàng";
      case 2:
        return "Tiến hành đặt cọc";
      case 4:
    }
  };

  const handleButtonTrigger = () => {
    switch (currentStage) {
      case 1: {
        handleShowDeliveryModal();
        break;
      }
      case 2: {
        onShowModal();
        break;
      }
    }
  };

  return (
    <div className="relative w-full flex flex-col items-stretch justify-center px-2 mt-1">
      {currentStage === 3 ? (
        <div className="flex items-stretch gap-2">
          <button className="basis-1/3 min-w-max py-2 rounded-lg bg-red-700 text-white hover:opacity-80 duration-200">
            Gặp vấn đề khi nhận hàng
          </button>
          <button
            className="grow py-2 rounded-lg bg-gray-600  text-white hover:opacity-80 duration-200"
            onClick={() => setSuccessfulModal(true)}
          >
            Đã nhận thành công
          </button>
        </div>
      ) : (
        <button
          className="w-full bg-gray-600 font-semibold text-white py-2 border hover:border-gray-900 rounded-lg duration-300 hover:bg-white hover:text-black"
          onClick={handleButtonTrigger}
        >
          {getButton()}
        </button>
      )}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-[-70%] left-1/2 translate-x-[-50%] p-1 rounded-full drop-shadow-lg bg-gray-50 duration-200 transition-all hover:bg-gray-100 z-10"
      >
        {isExpanded ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path>
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
          </svg>
        )}
      </button>
    </div>
  );
}
