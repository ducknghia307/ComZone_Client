export default function Stage3({ currentStage }: { currentStage: number }) {
  const stage = 4;

  return (
    <div
      className={`relative flex flex-col items-center gap-2 px-4 py-2 ${
        currentStage < stage - 1 && "opacity-20"
      }`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
        className={`${currentStage >= stage && "opacity-20"}`}
      >
        <path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path>
      </svg>

      {currentStage >= stage && (
        <span className="text-green-600 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="36"
            height="36"
            fill="currentColor"
          >
            <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path>
          </svg>
        </span>
      )}

      <p
        className={`text-[0.7em] whitespace-nowrap ${
          currentStage >= stage && "opacity-50"
        }`}
      >
        Thanh toán
      </p>
    </div>
  );
}
