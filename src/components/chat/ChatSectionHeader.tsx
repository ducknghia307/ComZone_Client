import { ChatRoom } from "../../common/interfaces/chat-room.interface";
import moment from "moment/min/moment-with-locales";

moment.locale("vi");

export default function ChatSectionHeader({
  chatRoom,
}: {
  chatRoom: ChatRoom | undefined;
}) {
  return (
    <div className="w-full flex items-center justify-between gap-4 px-4 py-4 border-b">
      <div className="flex items-center gap-4">
        <img
          src={chatRoom?.secondUser.avatar || ""}
          className="w-[4em] h-[4em] rounded-full"
        />
        <span className="text">
          <p className="text-xl font-semibold">{chatRoom?.secondUser.name}</p>
          <p className="text-xs font-light">
            {chatRoom?.secondUser.last_active
              ? `Hoạt động ${moment(
                  chatRoom?.secondUser.last_active
                ).fromNow()}`
              : ""}
          </p>
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button className="flex items-center p-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M3 4H21V6H3V4ZM9 11H21V13H9V11ZM3 18H21V20H3V18Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}
