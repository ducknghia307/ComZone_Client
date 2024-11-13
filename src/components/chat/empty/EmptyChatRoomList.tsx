import EmptyIcon from "../../../assets/notFound/emptybox.png";

export default function EmptyChatRoomList() {
  return (
    <div className="w-full flex flex-col items-center justify-center gap-8 opacity-50">
      <img src={EmptyIcon} alt="" className="w-1/2" />
      Chưa có đoạn hội thoại nào!
    </div>
  );
}
