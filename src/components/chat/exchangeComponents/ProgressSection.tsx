import { useState } from "react";
import { ExchangeOffer } from "../../../common/interfaces/exchange-offer.interface";
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";
import { Avatar } from "antd";
import Stage1 from "./Stage1";
import Stage2 from "./Stage2";
import ActionButtons from "./ActionButtons";

export default function ProgressSection({
  exchangeRequest,
  exchangeOffer,
  userId,
}: {
  exchangeRequest: ExchangeRequest;
  exchangeOffer: ExchangeOffer;
  userId: string;
}) {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [firstCurrentStage, setFirstCurrentStage] = useState<number>(1);
  const [secondCurrentStage, setSecondCurrentStage] = useState<number>(1);

  const firstUser = exchangeRequest.user;
  exchangeRequest.user.id === userId
    ? exchangeRequest.user
    : exchangeOffer.user;

  const secondUser =
    exchangeRequest.user.id !== userId
      ? exchangeRequest.user
      : exchangeOffer.user;

  const firstComicsGroup =
    exchangeRequest.user.id === userId
      ? exchangeRequest.requestComics
      : exchangeOffer.offerComics;

  const secondComicsGroup =
    exchangeRequest.user.id !== userId
      ? exchangeRequest.requestComics
      : exchangeOffer.offerComics;

  if (isExpanded)
    return (
      <div className="w-full">
        <div className="w-full flex flex-col items-stretch justify-start gap-2 p-2 border-b border-gray-300">
          <div className="w-full flex items-center justify-start gap-4">
            <Avatar src={firstUser.avatar} size={64} />

            <div className="flex items-center gap-8">
              <Stage1
                currentStage={firstCurrentStage}
                comicsGroup={firstComicsGroup}
              />
              <Stage2
                currentStage={firstCurrentStage}
                comicsGroup={firstComicsGroup}
              />
            </div>
          </div>

          {/* Middle */}
          <div className="flex justify-center items-center">
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

          <div className="flex flex-row-reverse items-center justify-start gap-4">
            <Avatar src={secondUser.avatar} size={64} />

            <Stage1
              currentStage={secondCurrentStage}
              comicsGroup={secondComicsGroup}
            />
          </div>
        </div>

        <ActionButtons currentStage={firstCurrentStage} />
      </div>
    );
  else return <div className=""></div>;
}
