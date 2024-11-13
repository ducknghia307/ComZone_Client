export default function ActionButtons({
  currentStage,
  oppositeCurrentStage,
  onShowModal,
}: {
  currentStage: number;
  oppositeCurrentStage: number;
  onShowModal: () => void;
}) {
  if (currentStage + 1 < oppositeCurrentStage)
    return (
      <div className="flex items-stretch justify-center px-2 mt-1">
        <div className="w-full bg-gray-300 text-white py-2 rounded-lg text-center">
          Đang đợi người đối diện thực hiện...
        </div>
      </div>
    );
  switch (currentStage) {
    case 1:
      return (
        <div className="flex items-stretch justify-center px-2 mt-1">
          <button
            className="w-full bg-gray-900 text-white py-2 border border-gray-900 rounded-lg duration-200 hover:bg-white hover:text-black"
            onClick={onShowModal}
          >
            Tiến hành đặt cọc
          </button>
        </div>
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
}
