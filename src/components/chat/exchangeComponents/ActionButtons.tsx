export default function ActionButtons({
  currentStage,
  oppositeCurrentStage,
  onShowModal,
  isExpanded,
  setIsExpanded,
}: {
  currentStage: number;
  oppositeCurrentStage: number;
  onShowModal: () => void;
  isExpanded: boolean;
  setIsExpanded: Function;
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
        return (
          <button
            className="w-full bg-gray-900 text-white py-2 border border-gray-900 rounded-lg duration-200 hover:bg-white hover:text-black"
            onClick={onShowModal}
          >
            Tiến hành đặt cọc
          </button>
        );
      case 2:
        return (
          <div className="flex items-stretch justify-center px-2 mt-1">
            <button
              className="w-full bg-gray-900 text-white py-2 border border-gray-900 rounded-lg duration-200 hover:bg-white hover:text-black"
              // onClick={onShowModal}
            >
              Chọn thông tin giao hàng
            </button>
          </div>
        );
      case 3:
      case 4:
    }
  };

  return (
    <div className="relative flex items-stretch justify-center px-2 mt-1">
      {getButton()}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute bottom-[-70%] p-1 rounded-full drop-shadow-lg bg-gray-50 duration-200 hover:bg-gray-00"
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
