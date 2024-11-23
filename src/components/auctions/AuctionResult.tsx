export const AuctionResult = ({ isWinner }: { isWinner: boolean | null }) => {
  if (isWinner === null) {
    return null;
  }
  console.log(isWinner);

  return (
    <div
      className="auction-result"
      style={{
        backgroundColor: isWinner ? "#d4edda" : "#f8d7da",
        color: isWinner ? "#155724" : "#721c24",
      }}
    >
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          margin: 0,
          lineHeight: "50px",
          textAlign: "center",
          transform: "translateX(100%)",
          animation: "scroll-left 15s linear infinite",
          fontSize: "18px",
          fontWeight: "500",
          fontFamily: "REM",
        }}
      >
        {isWinner
          ? "🎉 Bạn đã đấu giá thành công! Vui lòng tiến hành thanh toán để hoàn tất và hoàn cọc!"
          : "😞 Bạn đã đấu giá thất bại. Cọc đã được hoàn trả"}
      </div>
    </div>
  );
};
