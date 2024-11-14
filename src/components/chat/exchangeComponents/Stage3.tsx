import styles from "./style.module.css";

export default function Stage3({ currentStage }: { currentStage: number }) {
  return (
    <div className="relative flex items-center p-2">
      {currentStage < 3 ? (
        <div className="p-2">
          <div className={`${styles.dotTyping}`}></div>
        </div>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="36"
          height="36"
          fill="currentColor"
          className="fill-green-600"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path>
        </svg>
      )}

      <p
        className={`absolute bottom-[-40%] left-1/2 translate-x-[-50%] text-[0.7em] whitespace-nowrap ${
          currentStage >= 3 && "bottom-[-50%] opacity-50"
        }`}
      >
        {currentStage < 3 ? "Đang tiến hành cọc" : "Đã hoàn tất cọc"}
      </p>
    </div>
  );
}
