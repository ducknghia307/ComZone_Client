/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import {
  ExchangeConfirmation,
  ExchangeDetails,
} from "../common/interfaces/exchange.interface";
import InformationCollectSection from "../components/exchange/exchange-details/information-collect/InformationCollectSection";
import ActionButtons from "../components/exchange/exchange-details/information-collect/ActionButtons";
import ProgressSection from "../components/exchange/exchange-details/progress/ProgressSection";
import Loading from "../components/loading/Loading";
import ExchangeInformation from "../components/exchange/exchange-details/ExchangeInformation";
import { Address } from "../common/base.interface";
import { Delivery } from "../common/interfaces/delivery.interface";

const ExchangeDetail: React.FC = () => {
  const { id } = useParams();

  const [exchangeData, setExchangeData] = useState<ExchangeDetails>();

  const [firstCurrentStage, setFirstCurrentStage] = useState<number>(0);
  const [secondCurrentStage, setSecondCurrentStage] = useState<number>(0);
  const [firstAddress, setFirstAddress] = useState<string>("");
  const [secondAddress, setSecondAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

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
      const first = exchangeDetails
        ? exchangeDetails?.isRequestUser
          ? exchangeDetails?.exchange.requestUser
          : exchangeDetails?.exchange.post.user
        : null;

      const second = exchangeDetails
        ? exchangeDetails?.isRequestUser
          ? exchangeDetails?.exchange.post.user
          : exchangeDetails?.exchange.requestUser
        : null;

      //FETCH STAGE 0
      if (exchangeDetails.exchange.status === "PENDING") return;

      //FETCH STAGE 6
      if (exchangeDetails.exchange.status === "SUCCESSFUL") {
        setFirstCurrentStage(6);
        setSecondCurrentStage(6);
        return;
      }

      //FETCH STAGE 1
      if (exchangeDetails.exchange.status === "DEALING") {
        setFirstCurrentStage(1);
        setSecondCurrentStage(1);
      }

      //FETCH STAGE 2 (first user)
      const confirmationResponse = await privateAxios(
        `exchange-confirmation/user/exchange/${exchangeDetails.exchange.id}`
      );
      const firstConfirmation: ExchangeConfirmation = confirmationResponse.data;
      if (firstConfirmation) {
        if (firstConfirmation.dealingConfirm) {
          setFirstCurrentStage(2);
        }
      }

      //FETCH STAGE 2 (second user)
      const secondConfirmationResponse = await publicAxios(
        `exchange-confirmation/user/${second?.id}/exchange/${exchangeDetails.exchange.id}`
      );
      const secondConfirmation: ExchangeConfirmation =
        secondConfirmationResponse.data;
      if (secondConfirmation) {
        if (secondConfirmation.dealingConfirm) {
          setSecondCurrentStage(2);
        }
      }

      //FETCH STAGE 3
      const deliveriesResponse = await privateAxios(
        `deliveries/exchange/${exchangeDetails.exchange.id}`
      );
      const deliveries: Delivery[] = deliveriesResponse.data;

      if (deliveries.length > 0) {
        const firstUserDelivery = deliveries.find(
          (delivery) =>
            (delivery.from && delivery.from.user.id === first?.id) ||
            (delivery.to && delivery.to.user.id === first?.id)
        );
        if (firstUserDelivery) {
          setFirstCurrentStage(3);
          setFirstAddress(
            deliveries[0].from.user.id === first?.id
              ? deliveries[0].from.fullAddress!
              : deliveries[0].to.fullAddress!
          );
        }

        const secondUserDelivery = deliveries.find(
          (delivery) =>
            (delivery.from && delivery.from.user.id === second?.id) ||
            (delivery.to && delivery.to.user.id === second?.id)
        );
        if (secondUserDelivery) {
          setSecondCurrentStage(3);
          setSecondAddress(
            deliveries[0].from.user.id === second?.id
              ? deliveries[0].from.fullAddress!
              : deliveries[0].to.fullAddress!
          );
        }
      }

      //FETCH STAGE 4
      const selfTransactionsResponse = await privateAxios(
        `transactions/exchange/self/${exchangeDetails.exchange.id}`
      );
      if (selfTransactionsResponse.data) setFirstCurrentStage(4);
      const otherTransactionsResponse = await privateAxios(
        `transactions/exchange/other/${exchangeDetails.exchange.id}`
      );
      if (otherTransactionsResponse.data) setSecondCurrentStage(4);

      //FETCH STAGE 5
      if (firstConfirmation) {
        if (firstConfirmation.deliveryConfirm) {
          setFirstCurrentStage(5);
        }
      }
      if (secondConfirmation) {
        if (secondConfirmation.deliveryConfirm) {
          setSecondCurrentStage(5);
        }
      }
    } catch (error) {
      console.error("Error fetching exchange details:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await privateAxios("/user-addresses/user");

      const data = response.data;

      const sortedAddresses = data.sort((a: Address, b: Address) => {
        return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0);
      });
      console.log(sortedAddresses);

      setSelectedAddress(sortedAddresses[0] || null);
      setAddresses(sortedAddresses);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (id) {
      fetchExchangeDetails();
      fetchUserAddress();
    }
  }, [id]);

  if (!exchangeData) return;

  return (
    <div className="REM min-h-[80vh] w-full flex justify-center gap-4 px-4 py-4">
      {isLoading && <Loading />}
      <div className="basis-2/3 flex flex-col items-stretch justify-start gap-4 px-4 border-r border-gray-300">
        <InformationCollectSection
          exchangeDetails={exchangeData}
          firstCurrentStage={firstCurrentStage}
          secondCurrentStage={secondCurrentStage}
          fetchExchangeDetails={fetchExchangeDetails}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          addresses={addresses}
          setAddresses={setAddresses}
          fetchUserAddress={fetchUserAddress}
          firstAddress={firstAddress}
          secondAddress={secondAddress}
          setIsLoading={setIsLoading}
        />

        <ActionButtons
          exchangeDetails={exchangeData}
          currentStage={firstCurrentStage}
          oppositeCurrentStage={secondCurrentStage}
          fetchExchangeDetails={fetchExchangeDetails}
          selectedAddress={selectedAddress}
        />

        <ExchangeInformation
          exchangeDetails={exchangeData}
          firstCurrentStage={firstCurrentStage}
          secondCurrentStage={secondCurrentStage}
          firstUser={firstUser}
          secondUser={secondUser}
          firstComicsGroup={firstComicsGroup?.map((item) => item.comics) || []}
          secondComicsGroup={
            secondComicsGroup?.map((item) => item.comics) || []
          }
          setIsLoading={setIsLoading}
        />
      </div>

      <div className="basis-1/3 min-w-fit">
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
    </div>
  );
};

export default ExchangeDetail;
