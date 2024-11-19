import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import {
  ExchangeConfirmation,
  ExchangeDetails,
} from "../common/interfaces/exchange.interface";
import InformationCollectSection from "../components/exchange/exchange-details/information-collect/InformationCollectSection";
import { useAppSelector } from "../redux/hooks";
import ActionButtons from "../components/exchange/exchange-details/information-collect/ActionButtons";
import ProgressSection from "../components/exchange/exchange-details/progress/ProgressSection";
import Loading from "../components/loading/Loading";
import ExchangeInformation from "../components/exchange/exchange-details/ExchangeInformation";

const ExchangeDetail: React.FC = () => {
  const { id } = useParams();
  const { userId } = useAppSelector((state) => state.auth);

  const [exchangeData, setExchangeData] = useState<ExchangeDetails>();

  const [firstCurrentStage, setFirstCurrentStage] = useState<number>(0);
  const [secondCurrentStage, setSecondCurrentStage] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const firstUser = exchangeData
    ? exchangeData?.isRequestUser
      ? exchangeData?.exchange.requestUser
      : exchangeData?.exchange.post.user
    : null;

  const secondUser = exchangeData
    ? exchangeData?.isRequestUser
      ? exchangeData?.exchange.post.user
      : exchangeData?.exchange.requestUser
    : null;

  const firstComicsGroup = exchangeData
    ? exchangeData.isRequestUser
      ? exchangeData.requestUserList
      : exchangeData.postUserList
    : null;

  const secondComicsGroup = exchangeData
    ? exchangeData.isRequestUser
      ? exchangeData.postUserList
      : exchangeData.requestUserList
    : null;

  const fetchExchangeDetails = async () => {
    setIsLoading(true);
    try {
      const response = await privateAxios(`exchange-comics/exchange/${id}`);
      const exchangeDetails: ExchangeDetails = response.data;
      console.log("exchange details:", exchangeDetails);
      setExchangeData(exchangeDetails);

      //FETCH STAGE 0
      if (exchangeDetails.exchange.status === "PENDING") return;

      //FETCH STAGE 1
      if (exchangeDetails.exchange.status === "DEALING") {
        setFirstCurrentStage(1);
        setSecondCurrentStage(1);

        //FETCH STAGE 2 (first user)
        const confirmationResponse = await privateAxios(
          `exchange-confirmation/user/exchange/${exchangeDetails.exchange.id}`
        );
        if (confirmationResponse) {
          const confirmation: ExchangeConfirmation = confirmationResponse.data;
          if (confirmation.dealingConfirm) {
            setFirstCurrentStage(2);
          }
        }

        //FETCH STAGE 2 (second user)
        const secondConfirmationResponse = await publicAxios(
          `exchange-confirmation/user/${secondUser?.id}/exchange/${exchangeDetails.exchange.id}`
        );
        if (secondConfirmationResponse) {
          const secondConfirmation: ExchangeConfirmation =
            secondConfirmationResponse.data;
          if (secondConfirmation.dealingConfirm) {
            setSecondCurrentStage(2);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching exchange details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchExchangeDetails();
    }
  }, [id]);

  if (!exchangeData || isLoading)
    return (
      <div className="h-[80vh]">
        <Loading />
      </div>
    );

  return (
    <div className="REM min-h-[80vh] w-full flex items-stretch justify-between gap-4 px-4 py-4">
      <div className="grow flex flex-col items-stretch justify-start gap-4 px-4 border-r border-gray-300">
        <InformationCollectSection
          exchangeDetails={exchangeData}
          firstCurrentStage={firstCurrentStage}
          secondCurrentStage={secondCurrentStage}
          fetchExchangeDetails={fetchExchangeDetails}
        />

        <ActionButtons
          exchangeDetails={exchangeData}
          currentStage={firstCurrentStage}
          oppositeCurrentStage={secondCurrentStage}
          fetchExchangeDetails={fetchExchangeDetails}
        />

        <ProgressSection
          exchangeDetails={exchangeData}
          firstUser={firstUser || undefined}
          firstComicsGroup={firstComicsGroup || []}
          firstCurrentStage={firstCurrentStage}
          secondUser={secondUser || undefined}
          secondComicsGroup={secondComicsGroup || []}
          secondCurrentStage={secondCurrentStage}
        />
      </div>

      <div className="basis-1/3">
        <ExchangeInformation
          exchangeDetails={exchangeData}
          firstUser={firstUser}
          secondUser={secondUser}
          firstComicsGroup={firstComicsGroup?.map((item) => item.comics) || []}
          secondComicsGroup={
            secondComicsGroup?.map((item) => item.comics) || []
          }
        />
      </div>
    </div>
  );
};

export default ExchangeDetail;
