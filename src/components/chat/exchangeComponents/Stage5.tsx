export default function Stage5({
  currentStage,
}: {
  currentStage: number;
  rotate?: boolean;
}) {
  return (
    <div
      className={`relative flex items-center px-4 py-1 ${
        currentStage === 4 && "text-green-600"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="32"
        height="32"
        fill="currentColor"
      >
        <path d="M11.602 13.7599L13.014 15.1719L21.4795 6.7063L22.8938 8.12051L13.014 18.0003L6.65 11.6363L8.06421 10.2221L10.189 12.3469L11.6025 13.7594L11.602 13.7599ZM11.6037 10.9322L16.5563 5.97949L17.9666 7.38977L13.014 12.3424L11.6037 10.9322ZM8.77698 16.5873L7.36396 18.0003L1 11.6363L2.41421 10.2221L3.82723 11.6352L3.82604 11.6363L8.77698 16.5873Z"></path>
      </svg>

      <p
        className={`absolute bottom-[-50%] left-1/2 translate-x-[-50%] text-[0.7em] whitespace-nowrap`}
      >
        Hoàn tất
      </p>
    </div>
  );
}