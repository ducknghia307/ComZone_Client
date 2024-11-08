import { useState } from "react";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";

export default function ChatRoomList({
  chatRoomList,
  selectedChatRoom,
  setSelectedChatRoom,
}: {
  chatRoomList: ChatRoom[] | [];
  selectedChatRoom: ChatRoom | null;
  setSelectedChatRoom: Function;
}) {
  const [isDisplayedDefault, setIsDisplayedDefault] = useState<boolean>(true);
  return (
    <div
      className={`${
        isDisplayedDefault ? "w-[25em]" : "w-fit"
      } pr-4 border-r border-gray-300 transition-all duration-300`}
    >
      <div
        className={`flex items-center ${
          isDisplayedDefault ? "justify-between" : "justify-center pb-4"
        }`}
      >
        <p
          className={`${
            !isDisplayedDefault && "hidden"
          } text-[2em] font-semibold pt-2 pb-4`}
        >
          CHAT
        </p>
        <button
          onClick={() => setIsDisplayedDefault(!isDisplayedDefault)}
          className={`${
            isDisplayedDefault ? "" : ""
          }flex items-center justify-center hover:bg-gray-200 rounded-xl duration-200`}
        >
          {isDisplayedDefault ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M10.8284 12.0007L15.7782 16.9504L14.364 18.3646L8 12.0007L14.364 5.63672L15.7782 7.05093L10.8284 12.0007Z"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="32"
              height="32"
              fill="currentColor"
            >
              <path d="M13.1717 12.0007L8.22192 7.05093L9.63614 5.63672L16.0001 12.0007L9.63614 18.3646L8.22192 16.9504L13.1717 12.0007Z"></path>
            </svg>
          )}
        </button>
      </div>

      <div className="w-full flex flex-col gap-1">
        {chatRoomList.map((chatRoom: ChatRoom) => {
          const user = chatRoom.secondUser;
          return (
            <button
              onClick={() => setSelectedChatRoom(chatRoom)}
              className={`${
                isDisplayedDefault
                  ? "justify-start pl-2 rounded-lg"
                  : "justify-center px-2 rounded-lg"
              } ${
                selectedChatRoom?.id === chatRoom.id
                  ? "bg-gray-800 text-white"
                  : "duration-200 hover:bg-gray-100"
              } w-full h-20 flex items-center gap-2`}
            >
              <img
                src={user.avatar || ""}
                className="w-[4em] h-[4em] rounded-full"
              />
              <div
                className={`${
                  !isDisplayedDefault && "hidden"
                } flex flex-col items-start justify-center gap-1`}
              >
                <p className="text-lg font-semibold">{user.name}</p>
                <span className="flex items-center gap-2">
                  <p className="line-clamp-1">Hí, chào cậu!</p>
                  <p>&#8226;</p>
                  <p>14:27</p>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
