import React from "react";
import { Auction } from "../../common/base.interface";
import Countdown from "react-countdown";

export default function ShopAuctionsList({
  auctionsList,
}: {
  auctionsList: Auction[];
}) {
  const renderer = ({ days, hours, minutes, seconds }: any) => {
    return (
      <div className="countdown">
        <div className="time-box">
          <span className="time1">{days.toString().padStart(2, "0")}</span>
          <span className="label">Ngày</span>
        </div>
        <div className="time-box">
          <span className="time1">{hours.toString().padStart(2, "0")}</span>
          <span className="label">Giờ</span>
        </div>
        <div className="time-box">
          <span className="time1">{minutes.toString().padStart(2, "0")}</span>
          <span className="label">Phút</span>
        </div>
        <div className="time-box">
          <span className="time1">{seconds.toString().padStart(2, "0")}</span>
          <span className="label">Giây</span>
        </div>
      </div>
    );
  };

  return (
    <div>
      {auctionsList.map((auction) => {
        return (
          <Countdown date={new Date(auction.endTime)} renderer={renderer} />
        );
      })}
    </div>
  );
}
