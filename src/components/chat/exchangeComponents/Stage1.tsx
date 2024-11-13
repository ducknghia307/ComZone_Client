import { Avatar } from "antd";
import { Comic } from "../../../common/base.interface";

export default function Stage1({
  currentStage,
  comicsGroup,
}: {
  currentStage: number;
  comicsGroup: Comic[];
}) {
  return (
    <div className="relative flex items-center">
      <Avatar.Group
        shape="square"
        size={40}
        max={{ count: 3 }}
        className={`${currentStage >= 1 && "opacity-50"}`}
      >
        {comicsGroup.map((comics: Comic) => {
          return <Avatar src={comics.coverImage} />;
        })}
      </Avatar.Group>

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

      <p
        className={`absolute bottom-[-50%] left-1/2 translate-x-[-50%] text-[0.7em] whitespace-nowrap ${
          currentStage >= 1 && "opacity-50"
        }`}
      >
        Chọn danh sách truyện
      </p>
    </div>
  );
}
