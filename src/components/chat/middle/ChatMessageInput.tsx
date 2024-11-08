import { useEffect } from "react";

export default function ChatMessageInput({
  messageInput,
  setMessageInput,
  handleSendMessage,
}: {
  messageInput: string;
  setMessageInput: Function;
  handleSendMessage: Function;
}) {
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
      <input
        id="send-message"
        type="text"
        placeholder="Gửi tin nhắn..."
        autoComplete="off"
        value={messageInput}
        onChange={(e) => setMessageInput(e.target.value)}
        className="grow px-4 py-2 border border-gray-300 rounded-lg"
      />
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
