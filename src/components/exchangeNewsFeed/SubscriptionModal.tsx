import { Modal } from "antd";
import styles from "./style.module.css";
import { useState } from "react";

export default function SubscriptionModal({
  openSubscription,
  setOpenSubscription,
  handleSelectSubscription,
}: {
  openSubscription: boolean;
  setOpenSubscription: Function;
  handleSelectSubscription: Function;
}) {
  const [currentlySelected, setCurrentlySelected] = useState(0);

  return (
    <Modal
      open={openSubscription}
      onCancel={(e) => {
        e.stopPropagation();
        setOpenSubscription(false);
      }}
      footer={null}
      width={1000}
    >
      <div className="w-full flex flex-col items-center py-4">
        <p
          className={`${styles.subscriptionTitle} text-[2rem] font-bold uppercase pb-4`}
        >
          Đăng ký gói trao đổi không giới hạn
        </p>

        <div className="w-full flex items-center justify-between gap-2">
          <div
            className={`${
              currentlySelected === 1
                ? "border-2 border-black"
                : "border border-gray-300"
            } basis-[32%] h-96 flex flex-col items-center justify-between px-4 pt-8 pb-4 rounded-xl`}
          >
            <p className="text-[1.5em] font-bold">MIỄN PHÍ</p>
            <div className="w-full flex flex-col items-start justify-center gap-2">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                <p>Đăng 10 bài trao đổi mỗi tháng</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentlySelected(1)}
              className={`self-stretch py-2 border border-gray-500 rounded-xl duration-200 ${
                currentlySelected === 1
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              CHỌN
            </button>
          </div>
          <div
            className={`${
              currentlySelected === 2
                ? "border-2 border-black"
                : "border border-gray-300"
            } basis-[32%] h-96 flex flex-col items-center justify-between px-4 pt-8 pb-4 rounded-xl`}
          >
            <p className="text-[1.5em] font-bold">KHÔNG GIỚI HẠN</p>
            <div className="w-full flex flex-col items-start justify-center gap-2">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                <p>Đăng không giới hạn</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentlySelected(2)}
              className={`self-stretch py-2 border border-gray-500 rounded-xl duration-200 ${
                currentlySelected === 2
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              CHỌN
            </button>
          </div>
          <div
            className={`${
              currentlySelected === 3
                ? "border-2 border-black"
                : "border border-gray-300"
            } basis-[32%] h-96 flex flex-col items-center justify-between px-4 pt-8 pb-4 rounded-xl`}
          >
            <p className="text-[1.5em] font-bold">NÂNG CẤP</p>
            <div className="w-full flex flex-col items-start justify-center gap-2">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                <p>Đăng không giới hạn</p>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                </svg>
                <p>Tag đặc biệt trên bài đăng</p>
              </div>
            </div>
            <button
              onClick={() => setCurrentlySelected(3)}
              className={`self-stretch py-2 border border-gray-500 rounded-xl duration-200 ${
                currentlySelected === 3
                  ? "bg-black text-white font-semibold"
                  : "hover:bg-gray-100"
              }`}
            >
              CHỌN
            </button>
          </div>
        </div>

        <div className="w-full flex items-center justify-end gap-8 px-2 pt-8">
          <button
            className="px-4 hover:underline"
            onClick={() => setOpenSubscription(false)}
          >
            Quay lại
          </button>
          <button
            onClick={() => handleSelectSubscription()}
            className="px-16 py-2 bg-gray-950 text-white rounded-md font-semibold border duration-200 hover:bg-white hover:text-black hover:border-black"
          >
            TIẾP TỤC
          </button>
        </div>
      </div>
    </Modal>
  );
}
