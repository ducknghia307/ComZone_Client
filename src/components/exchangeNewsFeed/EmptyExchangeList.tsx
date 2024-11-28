import EmptyIcon from "../../assets/notFound/empty_icon.jpg";

export default function EmptyExchangeList({
  isLoading,
}: {
  isLoading: boolean;
}) {
  return (
    <div
      className={`${
        isLoading && "hidden"
      } min-h-[70vh] w-full flex items-center justify-center gap-16 REM py-8`}
    >
      <img
        src={EmptyIcon}
        alt=""
        style={{
          width: "300px",
          borderRadius: "50%",
        }}
        className={`basis-1/2 w-1/2 hidden lg:block ${isLoading && "hidden"}`}
      />

      <div className="basis-1/2 flex flex-col items-center justify-center gap-4 text-center text-gray-700">
        <p className="text-[3em] font-bold">Không tìm thấy!</p>
        <span className="flex flex-col items-center justify-center gap-4">
          <p className={`text-2xl font-bold`}>
            Hiện tại hệ thống chưa ghi nhận được bài đăng yêu cầu trao đổi nào.
          </p>
        </span>
      </div>
    </div>
  );
}
