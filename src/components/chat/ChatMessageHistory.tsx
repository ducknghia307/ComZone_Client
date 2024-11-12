import { MessageGroup } from "../../common/interfaces/message.interface";
import moment from "moment/min/moment-with-locales";
import styles from "./style.module.css";
import { Avatar } from "antd";

moment.locale("vi");

export default function ChatMessageHistory({
  messagesList,
  lastMessageRef,
}: {
  messagesList: MessageGroup[];
  lastMessageRef: any;
}) {
  if (!messagesList || messagesList.length === 0) return;

  return (
    <div
      className={`grow overflow-y-auto overflow-x-hidden flex flex-col justify-start gap-2 px-4 ${styles.chatHistory}`}
    >
      {messagesList.map((messageGroup, index) => {
        return (
          <div key={index} className="flex flex-col gap-[0.2em] font-light">
            {messageGroup.messages.map((message, messIndex) => {
              const checkDisplayDateTime =
                moment(new Date()).unix() - moment(messageGroup.date).unix() <
                172800;

              const checkDisplayMessageTime =
                messIndex > 0 &&
                messageGroup.messages[messIndex].createdAt &&
                messageGroup.messages[messIndex - 1].createdAt &&
                moment(messageGroup.messages[messIndex].createdAt).unix() -
                  moment(
                    messageGroup.messages[messIndex - 1].createdAt
                  ).unix() >
                  60 * 20;

              const checkHiddenAvatar =
                messIndex > 0 &&
                !message.mine &&
                !messageGroup.messages[messIndex - 1].mine &&
                !checkDisplayMessageTime;

              return (
                <div key={messIndex} className="">
                  {messIndex === 0 && (
                    <p className={`text-xs font-light text-center pt-8 pb-2`}>
                      {checkDisplayDateTime
                        ? moment(messageGroup.date).calendar()
                        : moment(messageGroup.date).format("do MMMM, HH:mm")}
                    </p>
                  )}
                  {checkDisplayMessageTime && (
                    <p className="text-xs font-light text-center pt-8 pb-2">
                      {moment(message.createdAt).format("HH:mm")}
                    </p>
                  )}
                  <div
                    className={`flex ${
                      message.mine ? "flex-row-reverse" : ""
                    } justify-start`}
                  >
                    <div className="flex items-start gap-2">
                      {!message.mine && (
                        <img
                          src={message.user.avatar || ""}
                          className={`${
                            checkHiddenAvatar && "invisible"
                          } w-[3em] h-[3em] rounded-full`}
                        />
                      )}
                      <div
                        className={`min-w-12 max-w-[40em] px-2 py-2 ${
                          message.mine
                            ? "bg-sky-800 text-white"
                            : "bg-gray-50 drop-shadow-md"
                        } rounded-lg text-start`}
                      >
                        {message.type === "TEXT" && message.content}
                        {message.type === "COMICS" && message.comics && (
                          <div className="flex flex-col gap-1 group">
                            <Avatar.Group
                              shape="square"
                              max={{ count: 5 }}
                              className="hover:opacity-50 cursor-pointer"
                            >
                              {message.comics.map((comics) => {
                                return (
                                  <Avatar size={100}>
                                    <img src={comics.coverImage} alt="" />
                                  </Avatar>
                                );
                              })}
                            </Avatar.Group>
                            <p>
                              {message.mine ? (
                                "Bạn"
                              ) : (
                                <span className="font-semibold">
                                  {message.user.name}
                                </span>
                              )}{" "}
                              đã gửi {message.comics.length} truyện.{" "}
                              <span className="text-xs italic hidden group-hover:inline">
                                Nhấn vào để xem chi tiết!
                              </span>
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
      <div ref={lastMessageRef} />
    </div>
  );
}
