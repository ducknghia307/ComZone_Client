export const AuctionResult = ({
  isWinner,
  auctionStatus,
}: {
  isWinner: boolean | null;
  auctionStatus: string | undefined;
}) => {
  if (isWinner === null) {
    return null;
  }
  console.log(isWinner);
  console.log(auctionStatus);

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
          animation: "scroll-left 20s linear infinite",
          fontSize: "18px",
          fontWeight: "500",
          fontFamily: "REM",
        }}
      >
        {isWinner
          ? "🎉 Chúc mừng bạn đã đấu giá thành công! "
          : "😞 Bạn đã đấu giá thất bại. Cọc đã được hoàn trả"}
      </div>
    </div>
  );
};
