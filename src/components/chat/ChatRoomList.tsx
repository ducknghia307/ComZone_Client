import { useState } from "react";
import dateFormat from "../../assistants/date.format";
import { Avatar } from "antd";
import { ChatRoom } from "../../common/interfaces/chat-room.interface";

export default function ChatRoomList({
  chatRoomList,
  currentRoom,
  handleSelectChatRoom,
}: {
  chatRoomList: ChatRoom[];
  currentRoom: ChatRoom | undefined;
  handleSelectChatRoom: Function;
}) {
  const [isDisplayedDefault, setIsDisplayedDefault] = useState<boolean>(true);
  return (
    <div
      className={`${
        isDisplayedDefault ? "basis-1/3" : "w-fit"
      }  border-r border-gray-300 transition-all duration-300 overflow-y-auto overflow-x-hidden relative`}
    >
      <div
        className={`flex items-center sticky top-0 bg-white z-10 ${
          isDisplayedDefault ? "justify-between" : "justify-center pb-4"
        }`}
      >
        <p
          className={`${
            !isDisplayedDefault && "hidden"
          } flex items-center gap-2 text-[2em] font-semibold pt-2 pb-4`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
            fill="currentColor"
          >
            <path d="M7.29117 20.8242L2 22L3.17581 16.7088C2.42544 15.3056 2 13.7025 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C10.2975 22 8.6944 21.5746 7.29117 20.8242ZM7.58075 18.711L8.23428 19.0605C9.38248 19.6745 10.6655 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 13.3345 4.32549 14.6175 4.93949 15.7657L5.28896 16.4192L4.63416 19.3658L7.58075 18.711Z"></path>
          </svg>
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

      <div className="w-full flex flex-col justify-start gap-1">
        {chatRoomList.map((chatRoom: ChatRoom) => {
          const user = chatRoom.secondUser;
          const lastMessageDisplay = () => {
            if (chatRoom.lastMessage) {
              switch (chatRoom.lastMessage.type) {
                case "TEXT": {
                  return (
                    chatRoom.lastMessage?.mine &&
                    "Bạn: " + chatRoom.lastMessage?.content
                  );
                }
                case "COMICS": {
                  return chatRoom.lastMessage.mine
                    ? "Bạn"
                    : chatRoom.secondUser.name +
                        ` đã gửi ${chatRoom.lastMessage.comics?.length} truyện.`;
                }
                case "IMAGE":
                case "LINK":
                case "REPLY":
                case "SYSTEM":
              }
            }
          };
          return (
            <button
              key={chatRoom.id}
              onClick={() => handleSelectChatRoom(chatRoom)}
              className={`${
                isDisplayedDefault
                  ? "justify-start pl-2 rounded-lg"
                  : "justify-center px-2 rounded-lg"
              } ${
                currentRoom?.id === chatRoom.id
                  ? "bg-sky-50"
                  : "duration-200 hover:bg-gray-100"
              } w-full min-h-20 max-h-32 flex items-center gap-4`}
            >
              <Avatar
                src={user.avatar}
                className="min-w-[4em] min-h-[4em] rounded-full"
              />
              <div
                className={`${
                  !isDisplayedDefault && "hidden"
                } flex flex-col items-start justify-center text-start gap-1`}
              >
                <p className="max-w-[10em] text-md font-semibold line-clamp-1">
                  {user.name}
                </p>
                <span
                  className={`${
                    !chatRoom.lastMessage && "hidden"
                  } flex items-center gap-2 text-start font-light`}
                >
                  <p
                    className={`max-w-[15em] break-words whitespace-nowrap overflow-hidden text-ellipsis ${
                      !chatRoom.lastMessage?.isRead &&
                      !chatRoom.lastMessage?.mine &&
                      "font-semibold"
                    }`}
                  >
                    {lastMessageDisplay()}
                  </p>
                  <p>&#8226;</p>
                  <p className="text-xs pr-2">
                    {dateFormat(chatRoom.updatedAt, "HH:MM")}
                  </p>
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
