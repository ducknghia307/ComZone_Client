import { Avatar } from "antd";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import Stage3 from "./Stage3";
import Stage4 from "./Stage4";
import Stage5 from "./Stage5";
import Stage6 from "./Stage6";
import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { Comic, UserInfo } from "../../../../common/base.interface";

export default function ProgressSection({
  exchangeDetails,
  firstUser,
  firstCurrentStage,
  firstComicsGroup,
  secondUser,
  secondCurrentStage,
  secondComicsGroup,
}: {
  exchangeDetails: ExchangeDetails;
  firstUser?: UserInfo;
  firstCurrentStage: number;
  firstComicsGroup?: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    comics: Comic;
  }[];
  secondUser?: UserInfo;
  secondCurrentStage: number;
  secondComicsGroup: {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date;
    comics: Comic;
  }[];
}) {
  const isFailed = ["FAILED", "CANCELED", "REJECTED"].some(
    (status) => status === exchangeDetails.exchange.status
  );

  const downArrow = (current: number, stage: number) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="24"
        height="24"
        fill="currentColor"
        className={`${current < stage && "opacity-20"}`}
      >
        <path d="M13.0001 16.1716L18.3641 10.8076L19.7783 12.2218L12.0001 20L4.22192 12.2218L5.63614 10.8076L11.0001 16.1716V4H13.0001V16.1716Z"></path>
      </svg>
    );
  };

  return (
    <div className={`${isFailed && "opacity-30"} py-4`}>
      <p className="text-lg font-semibold">TIẾN ĐỘ TRAO ĐỔI</p>

      <div className="flex flex-row items-start justify-around gap-2 px-8 py-4">
        <div className="flex flex-col items-center justify-center gap-8">
          <div className="flex flex-col items-center gap-2">
            <Avatar src={firstUser?.avatar} size={64} />
            <p className="font-light text-xs text-gray-600">Bạn</p>
          </div>

          <div className="flex flex-col items-center gap-2">
            <Stage1
              currentStage={firstCurrentStage}
              comicsGroup={firstComicsGroup?.map((item) => item.comics) || []}
            />
            {downArrow(firstCurrentStage, 1)}

            <Stage2
              currentStage={firstCurrentStage}
              isRequestUser={exchangeDetails.isRequestUser}
            />
            {downArrow(firstCurrentStage, 2)}

            <Stage3 currentStage={firstCurrentStage} />
            {downArrow(firstCurrentStage, 3)}

            <Stage4 currentStage={firstCurrentStage} />
            {downArrow(firstCurrentStage, 4)}

            <Stage5 currentStage={firstCurrentStage} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              className={`${firstCurrentStage < 5 && "opacity-20"}`}
            >
              <path d="M14.5895 16.0032L5.98291 7.39664L7.39712 5.98242L16.0037 14.589V7.00324H18.0037V18.0032H7.00373V16.0032H14.5895Z"></path>
            </svg>
          </div>
        </div>

        {/* Middle */}
        <div className="flex flex-col justify-center items-center gap-2 bg-black text-white w-fit self-center px-4 py-2 rounded-lg">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M16.0503 12.0498L21 16.9996L16.0503 21.9493L14.636 20.5351L17.172 17.9988L4 17.9996V15.9996L17.172 15.9988L14.636 13.464L16.0503 12.0498ZM7.94975 2.0498L9.36396 3.46402L6.828 5.9988L20 5.99955V7.99955L6.828 7.9988L9.36396 10.5351L7.94975 11.9493L3 6.99955L7.94975 2.0498Z"></path>
          </svg>
        </div>

        <div className="flex flex-col items-center justify-start gap-8">
          <div className="flex flex-col items-center gap-2">
            <Avatar src={secondUser?.avatar} size={64} />
            <p className="font-light text-xs text-gray-600">
              {secondUser?.name}
            </p>
          </div>

          <div className="flex flex-col items-center justify-start gap-2">
            <Stage1
              currentStage={secondCurrentStage}
              comicsGroup={secondComicsGroup?.map((item) => item.comics) || []}
            />
            {downArrow(secondCurrentStage, 1)}

            <Stage2
              currentStage={secondCurrentStage}
              isRequestUser={!exchangeDetails.isRequestUser}
            />
            {downArrow(secondCurrentStage, 2)}

            <Stage3 currentStage={secondCurrentStage} />
            {downArrow(secondCurrentStage, 3)}

            <Stage4 currentStage={secondCurrentStage} />
            {downArrow(secondCurrentStage, 4)}

            <Stage5 currentStage={secondCurrentStage} />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
              className={`${secondCurrentStage < 5 && "opacity-20"}`}
            >
              <path d="M9 13.589L17.6066 4.98242L19.0208 6.39664L10.4142 15.0032H18V17.0032H7V6.00324H9V13.589Z"></path>
            </svg>
          </div>
        </div>
      </div>

      <Stage6 currentStage={firstCurrentStage} />
    </div>
  );
}
