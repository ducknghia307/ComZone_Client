/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { useEffect, useRef, useState } from "react";
import SendComicsModal from "./extraModals/SendComicsModal";
import { Comic } from "../../common/base.interface";
import PreviewSentImageModal from "./extraModals/PreviewSentImageModal";
import { notification, Popover } from "antd";
import TextArea from "antd/es/input/TextArea";
import EmojiPicker from "emoji-picker-react";

export default function ChatMessageInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
  sentComicsList,
  setSentComicsList,
  handleSendMessageAsComics,
  sentImage,
  setSentImage,
  handleSendMessageAsImage,
}: {
  messageInput: string;
  setMessageInput: Function;
  handleSendMessage: Function;
  sentComicsList: Comic[];
  setSentComicsList: Function;
  handleSendMessageAsComics: Function;
  sentImage: File | undefined;
  setSentImage: Function;
  handleSendMessageAsImage: Function;
}) {
  const [isSendingImage, setIsSendingImage] = useState<boolean>(false);
  const [isSendingComics, setIsSendingComics] = useState<boolean>(false);

  const fileRef = useRef<any>();

  useEffect(() => {
    const sendMessageInput = document.getElementById("send-message");
    sendMessageInput?.addEventListener("keypress", function (event) {
      if (event.key === "Enter") {
        document.getElementById("send-button")?.click();
      }
    });
  }, []);

  return (
    <div className="w-full flex items-center gap-2 px-4">
      <div className="flex items-center gap-2 sm:gap-6 sm:pl-2 sm:pr-4">
        <button
          onClick={() => {
            if (fileRef) fileRef.current?.click();
          }}
          className="flex items-center text-gray-500 duration-200 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M21 15V18H24V20H21V23H19V20H16V18H19V15H21ZM21.0082 3C21.556 3 22 3.44495 22 3.9934V13H20V5H4V18.999L14 9L17 12V14.829L14 11.8284L6.827 19H14V21H2.9918C2.44405 21 2 20.5551 2 20.0066V3.9934C2 3.44476 2.45531 3 2.9918 3H21.0082ZM8 7C9.10457 7 10 7.89543 10 9C10 10.1046 9.10457 11 8 11C6.89543 11 6 10.1046 6 9C6 7.89543 6.89543 7 8 7Z"></path>
          </svg>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          hidden
          onChange={(e) => {
            if (e.target.files) {
              setSentImage(e.target.files[0]);
              setIsSendingImage(true);
            } else
              notification.warning({
                key: "upload",
                message: "Tải hình ảnh lên không thành công",
                description: "Vui lòng thử lại!",
                duration: 5,
              });
          }}
        />
        <PreviewSentImageModal
          isOpen={isSendingImage}
          setIsOpen={setIsSendingImage}
          sentImage={sentImage}
          setSentImage={setSentImage}
          handleSendMessageAsImage={handleSendMessageAsImage}
        />

        <button
          onClick={() => setIsSendingComics(true)}
          className="hidden sm:flex items-center text-gray-500 duration-200 hover:text-black"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M2.5 7C2.5 9.48528 4.51472 11.5 7 11.5C9.48528 11.5 11.5 9.48528 11.5 7C11.5 4.51472 9.48528 2.5 7 2.5C4.51472 2.5 2.5 4.51472 2.5 7ZM2.5 17C2.5 19.4853 4.51472 21.5 7 21.5C9.48528 21.5 11.5 19.4853 11.5 17C11.5 14.5147 9.48528 12.5 7 12.5C4.51472 12.5 2.5 14.5147 2.5 17ZM12.5 17C12.5 19.4853 14.5147 21.5 17 21.5C19.4853 21.5 21.5 19.4853 21.5 17C21.5 14.5147 19.4853 12.5 17 12.5C14.5147 12.5 12.5 14.5147 12.5 17ZM9.5 7C9.5 8.38071 8.38071 9.5 7 9.5C5.61929 9.5 4.5 8.38071 4.5 7C4.5 5.61929 5.61929 4.5 7 4.5C8.38071 4.5 9.5 5.61929 9.5 7ZM9.5 17C9.5 18.3807 8.38071 19.5 7 19.5C5.61929 19.5 4.5 18.3807 4.5 17C4.5 15.6193 5.61929 14.5 7 14.5C8.38071 14.5 9.5 15.6193 9.5 17ZM19.5 17C19.5 18.3807 18.3807 19.5 17 19.5C15.6193 19.5 14.5 18.3807 14.5 17C14.5 15.6193 15.6193 14.5 17 14.5C18.3807 14.5 19.5 15.6193 19.5 17ZM16 11V8H13V6H16V3H18V6H21V8H18V11H16Z"></path>
          </svg>
        </button>
        <SendComicsModal
          isOpen={isSendingComics}
          setIsOpen={setIsSendingComics}
          sentComicsList={sentComicsList}
          setSentComicsList={setSentComicsList}
          handleSendMessageAsComics={handleSendMessageAsComics}
        />
      </div>

      <div className="grow relative">
        <input
          id="send-message"
          type="text"
          placeholder="Gửi tin nhắn..."
          autoComplete="off"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
        <Popover
          content={
            <EmojiPicker
              onEmojiClick={(emojiData) => {
                setMessageInput((prev) => prev + emojiData.emoji);
              }}
              lazyLoadEmojis={true}
              skinTonesDisabled={true}
            />
          }
          trigger="click"
          placement="top"
          className="absolute top-1/2 -translate-y-1/2 right-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM7 13H9C9 14.6569 10.3431 16 12 16C13.6569 16 15 14.6569 15 13H17C17 15.7614 14.7614 18 12 18C9.23858 18 7 15.7614 7 13ZM8 11C7.17157 11 6.5 10.3284 6.5 9.5C6.5 8.67157 7.17157 8 8 8C8.82843 8 9.5 8.67157 9.5 9.5C9.5 10.3284 8.82843 11 8 11ZM16 11C15.1716 11 14.5 10.3284 14.5 9.5C14.5 8.67157 15.1716 8 16 8C16.8284 8 17.5 8.67157 17.5 9.5C17.5 10.3284 16.8284 11 16 11Z"></path>
          </svg>
        </Popover>
      </div>

      <button
        disabled={messageInput.length === 0}
        id="send-button"
        onClick={() => handleSendMessage()}
        className="flex items-center bg-sky-600 text-white px-4 py-3 rounded-lg disabled:bg-gray-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
        >
          <path d="M21.7267 2.95694L16.2734 22.0432C16.1225 22.5716 15.7979 22.5956 15.5563 22.1126L11 13L1.9229 9.36919C1.41322 9.16532 1.41953 8.86022 1.95695 8.68108L21.0432 2.31901C21.5716 2.14285 21.8747 2.43866 21.7267 2.95694ZM19.0353 5.09647L6.81221 9.17085L12.4488 11.4255L15.4895 17.5068L19.0353 5.09647Z"></path>
        </svg>
      </button>
    </div>
  );
}
