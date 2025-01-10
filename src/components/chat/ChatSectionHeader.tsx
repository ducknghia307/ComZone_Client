import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import moment from "moment/min/moment-with-locales";

moment.locale("vi");

export default function ChatSectionHeader({
  chatRoom,
}: {
  chatRoom: ChatRoom | undefined;
}) {
  return (
    <div className="w-full flex items-center justify-start gap-2 sm:gap-4 px-4 py-4 border-b">
      <img
        src={chatRoom?.secondUser.avatar || ""}
        className="w-[3em] sm:w-[4em] aspect-square rounded-full"
      />
      <span className="">
        <p className="text-lg sm:text-xl font-semibold">
          {chatRoom?.secondUser.name}
        </p>
        <p className="text-[0.8em] sm:text-xs font-light">
          {chatRoom?.secondUser.isActive ? (
            <span className="flex items-center gap-2">
              <span className="p-[0.2em] bg-green-700 rounded-full" />
              <p>Đang hoạt động</p>
            </span>
          ) : (
            `Hoạt động ${moment(chatRoom?.secondUser.last_active).fromNow()}`
          )}
        </p>
      </span>
    </div>
  );
}
