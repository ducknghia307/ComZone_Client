import React from "react";
import CurrencySplitter from "../../assistants/Spliter";
import moment from "moment/min/moment-with-locales";
import { Input } from "antd";
moment.locale("vi");

const DeliveryMethod = ({
  deliveryPrice,
  estDeliveryTime,
  note,
  onNoteChange,
}: {
  deliveryPrice: number;
  estDeliveryTime: Date;
  note: string;
  onNoteChange: (note: string) => void;
}) => {
  const formattedDate = () => {
    const arr = moment(estDeliveryTime || new Date())
      .format("LLLL")
      .split(" ");

    return (
      arr[0].charAt(0).toUpperCase() +
      arr[0].slice(1) +
      " " +
      arr[1] +
      " ngày " +
      arr[2] +
      " " +
      arr[3] +
      " " +
      arr[4] +
      " " +
      arr[5] +
      " " +
      arr[6]
    );
  };

  return (
    <div className="w-full flex items-start justify-center gap-2 border-t mt-2">
      <div className="w-1/2 bg-white pt-4 flex flex-col gap-2 md:pr-8">
        <p className="font-bold">GHI CHÚ</p>
        <p className="font-light text-xs italic">
          Gửi đến người bán những ghi chú cho đơn hàng của bạn.
        </p>
        <Input.TextArea
          autoSize={{ minRows: 2, maxRows: 4 }}
          placeholder="Ghi chú"
          spellCheck={false}
          className="text-xs font-light"
          value={note}
          onChange={(e) => onNoteChange(e.target.value)}
        />
      </div>

      <div className="w-1/2 bg-white pt-4 flex flex-col gap-2">
        <h2 className="font-bold">THÔNG TIN VẬN CHUYỂN</h2>

        <div
          className={`${
            deliveryPrice === 0 && "hidden"
          } w-full flex items-center justify-between gap-2 font-light text-xs italic`}
        >
          <div className="flex gap-2 items-center">
            <svg
              width="24px"
              height="24px"
              viewBox="0 0 64 64"
              xmlns="http://www.w3.org/2000/svg"
              strokeWidth="3"
              stroke="#000000"
              fill="none"
            >
              <path d="M21.68,42.22H37.17a1.68,1.68,0,0,0,1.68-1.68L44.7,19.12A1.68,1.68,0,0,0,43,17.44H17.61a1.69,1.69,0,0,0-1.69,1.68l-5,21.42a1.68,1.68,0,0,0,1.68,1.68h2.18" />
              <path d="M41.66,42.22H38.19l5-17.29h8.22a.85.85,0,0,1,.65.3l3.58,6.3a.81.81,0,0,1,.2.53L52.51,42.22h-3.6" />
              <ellipse cx="18.31" cy="43.31" rx="3.71" ry="3.76" />
              <ellipse cx="45.35" cy="43.31" rx="3.71" ry="3.76" />
              <line
                x1="23.25"
                y1="22.36"
                x2="6.87"
                y2="22.36"
                strokeLinecap="round"
              />
              <line
                x1="20.02"
                y1="27.6"
                x2="8.45"
                y2="27.6"
                strokeLinecap="round"
              />
              <line
                x1="21.19"
                y1="33.5"
                x2="3.21"
                y2="33.5"
                strokeLinecap="round"
              />
            </svg>

            <p>Dự kiến nhận hàng: </p>
          </div>
          <p className="text-end">{formattedDate()}</p>
        </div>

        <div
          className={`${
            deliveryPrice === 0 && "hidden"
          } w-full flex items-center justify-between gap-2 text-sm`}
        >
          <p>Phí giao hàng: </p>
          <p>{CurrencySplitter(deliveryPrice || 0)} đ</p>
        </div>

        <p className={`${deliveryPrice === 0 ? "inline" : "hidden"} text-sm font-light italic text-red-600`}>
          Chưa ghi nhận thông tin giao hàng
        </p>
      </div>
    </div>
  );
};

export default DeliveryMethod;
