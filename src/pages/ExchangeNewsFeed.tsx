import ExchangePost from "../components/exchange/ExchangePost";
import { Tour } from "antd";
import type { TourProps } from "antd";
import { useRef, useState } from "react";

const samples = [1, 2, 3, 4, 5, 6];

export default function ExchangeNewsFeed() {
  const [beginTour, setBeginTour] = useState(false);

  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);

  const steps: TourProps["steps"] = [
    {
      title: "Tìm kiếm truyện cho chính mình.",
      description: "Bắt đầu với việc tìm những truyện bạn muốn đổi lấy.",
      cover: (
        <img
          alt="select_tour"
          src="https://cdn-icons-png.freepik.com/256/12640/12640222.png?semt=ais_hybrid"
          className="max-w-[100px] mx-auto"
        />
      ),
      placement: "rightTop",
      target: () => ref1.current,
    },
    {
      title: "Truyện người đăng đang tìm kiếm.",
      description: "Xem qua những truyện người đăng đang tìm kiếm.",
      cover: (
        <img
          alt="select_tour"
          src="https://cdn-icons-png.flaticon.com/512/8424/8424155.png"
          className="max-w-[100px] mx-auto"
        />
      ),
      placement: "leftTop",
      target: () => ref2.current,
    },
    {
      title: "Bắt đầu trao đổi.",
      description: "Bắt đầu trò chuyện để tiến hành trao đổi với nhau.",
      cover: (
        <img
          alt="select_tour"
          src="https://cdn-icons-png.flaticon.com/512/10828/10828522.png"
          className="max-w-[100px] mx-auto"
        />
      ),
      placement: "topLeft",
      target: () => ref3.current,
    },
  ];

  return (
    <div className="w-full flex justify-center bg-[rgba(0,0,0,0.03)]">
      <div className="w-full md:w-3/4 flex justify-center min-h-[80vh] px-8 py-8 REM">
        <div className="flex flex-col items-center justify-start gap-2 py-8">
          <div className="w-full flex items-center justify-center gap-2">
            <input
              type="search"
              placeholder="Thử tìm kiếm gì đó..."
              className="w-full border-2 rounded-lg px-4 py-2"
            />
            <button
              onClick={() => setBeginTour(true)}
              className="border border-black p-2 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M5.76282 17H20V5H4V18.3851L5.76282 17ZM6.45455 19L2 22.5V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V18C22 18.5523 21.5523 19 21 19H6.45455ZM11 14H13V16H11V14ZM8.56731 8.81346C8.88637 7.20919 10.302 6 12 6C13.933 6 15.5 7.567 15.5 9.5C15.5 11.433 13.933 13 12 13H11V11H12C12.8284 11 13.5 10.3284 13.5 9.5C13.5 8.67157 12.8284 8 12 8C11.2723 8 10.6656 8.51823 10.5288 9.20577L8.56731 8.81346Z"></path>
              </svg>
            </button>
          </div>

          <div className="w-full flex flex-col justify-center gap-8 py-4">
            {samples.map((value, index: number) => {
              return <ExchangePost refs={[ref1, ref2, ref3]} index={index} />;
            })}
          </div>
        </div>
      </div>
      <Tour
        open={beginTour}
        onClose={() => setBeginTour(false)}
        steps={steps}
      />
    </div>
  );
}
