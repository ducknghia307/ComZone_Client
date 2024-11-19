export default function Stage2({
  currentStage,
  rotate,
}: {
  currentStage: number;
  rotate?: boolean;
}) {
  const stage = 3;

  return (
    <div className="relative flex items-center px-4 py-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
      >
        <path d="M17 2V4H20.0066C20.5552 4 21 4.44495 21 4.9934V21.0066C21 21.5552 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5551 3 21.0066V4.9934C3 4.44476 3.44495 4 3.9934 4H7V2H17ZM7 6H5V20H19V6H17V8H7V6ZM9 16V18H7V16H9ZM9 13V15H7V13H9ZM9 10V12H7V10H9ZM15 4H9V6H15V4Z"></path>
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
        className={`absolute bottom-[-50%] left-1/2 translate-x-[-50%] text-[0.7em] whitespace-nowrap ${
          currentStage >= stage && "opacity-50"
        }`}
      >
        Thông tin giao hàng
      </p>
    </div>
  );
}
