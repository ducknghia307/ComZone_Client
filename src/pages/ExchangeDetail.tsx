/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../middleware/axiosInstance";
import {
  Exchange,
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
import { Avatar } from "antd";
import { CircularProgress } from "@mui/material";
import ExchangeLoader from "../components/exchange/exchange-details/ExchangeLoader";

const ExchangeDetail: React.FC = () => {
  const { id } = useParams();

  const [exchangeData, setExchangeData] = useState<ExchangeDetails>();

  const [firstCurrentStage, setFirstCurrentStage] = useState<number>(-1);
  const [secondCurrentStage, setSecondCurrentStage] = useState<number>(-1);
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

  const stageAllocating = (
    isFirst: boolean,
    confirmation: ExchangeConfirmation,
    transaction: any | undefined,
    delivery: Delivery | undefined,
    exchange: Exchange
  ) => {
    //FETCH STAGE 5
    if (confirmation && confirmation.deliveryConfirm) {
      if (isFirst) setFirstCurrentStage(5);
      else setSecondCurrentStage(5);
      return;
    }

    //FETCH STAGE 4
    else if (transaction && delivery) {
      if (isFirst) {
        setFirstCurrentStage(4);
        setFirstAddress(delivery.from.fullAddress!);
        setSecondAddress(delivery.to.fullAddress!);
      } else {
        setSecondCurrentStage(4);
        setFirstAddress(delivery.to.fullAddress!);
        setSecondAddress(delivery.from.fullAddress!);
      }
      return;
    }

    //FETCH STAGE 3
    else if (delivery) {
      if (isFirst) {
        setFirstCurrentStage(3);
        setFirstAddress(delivery.from.fullAddress!);
        setSecondAddress(delivery.to.fullAddress!);
      } else {
        setSecondCurrentStage(3);
        setFirstAddress(delivery.to.fullAddress!);
        setSecondAddress(delivery.from.fullAddress!);
      }
      return;
    }

    //FETCH STAGE 2
    else if (confirmation && confirmation.dealingConfirm) {
      if (isFirst) setFirstCurrentStage(2);
      else setSecondCurrentStage(2);
      return;
    }

    // FETCH STAGE 1
    else if (exchange.status === "DEALING" && !confirmation) {
      if (isFirst) setFirstCurrentStage(1);
      else setSecondCurrentStage(1);
    }

    //FETCH STAGE 0
    else if (exchange.status === "PENDING") {
      setFirstCurrentStage(0);
      setSecondCurrentStage(0);
      return;
    }
  };

  const fetchExchangeDetails = async () => {
    setIsLoading(true);

    try {
      const response = await privateAxios(`exchange-comics/exchange/${id}`);
      const exchangeDetails: ExchangeDetails = response.data;
      setExchangeData(exchangeDetails);

      if (!exchangeDetails || !exchangeDetails.exchange) return;

      const first = exchangeDetails.isRequestUser
        ? exchangeDetails.exchange.requestUser
        : exchangeDetails.exchange.post.user;

      const second = exchangeDetails.isRequestUser
        ? exchangeDetails.exchange.post.user
        : exchangeDetails.exchange.requestUser;

      //FETCH STAGE 6
      if (exchangeDetails.exchange.status === "SUCCESSFUL") {
        setFirstCurrentStage(6);
        setSecondCurrentStage(6);
        return;
      }

      //FETCH FAILED
      if (
        exchangeDetails.exchange.status === "FAILED" ||
        exchangeDetails.exchange.status === "REJECTED"
      ) {
        setFirstCurrentStage(0);
        setSecondCurrentStage(0);
        return;
      }

      const firstConfirmationResponse = await privateAxios(
        `exchange-confirmation/user/exchange/${exchangeDetails.exchange.id}`
      );

      const secondConfirmationResponse = await publicAxios(
        `exchange-confirmation/user/${second?.id}/exchange/${exchangeDetails.exchange.id}`
      );

      const selfTransactionsResponse = await privateAxios(
        `transactions/exchange/self/${exchangeDetails.exchange.id}`
      );

      const otherTransactionsResponse = await privateAxios(
        `transactions/exchange/other/${exchangeDetails.exchange.id}`
      );

      const deliveriesResponse = await privateAxios(
        `deliveries/exchange/${exchangeDetails.exchange.id}`
      );
      const deliveries: Delivery[] = deliveriesResponse.data;

      const firstUserDelivery: Delivery | undefined = deliveries.find(
        (d) => d.from && d.from.user.id === first.id
      );

      const secondUserDelivery: Delivery | undefined = deliveries.find(
        (d) => d.to && d.to.user.id === second.id
      );

      //Allocate FIRST stage
      stageAllocating(
        true,
        firstConfirmationResponse.data,
        selfTransactionsResponse.data,
        firstUserDelivery,
        exchangeDetails.exchange
      );

      //Allocate SECOND stage
      stageAllocating(
        false,
        secondConfirmationResponse.data,
        otherTransactionsResponse.data,
        secondUserDelivery,
        exchangeDetails.exchange
      );
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

      {firstCurrentStage > -1 ? (
        <>
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
              firstComicsGroup={
                firstComicsGroup?.map((item) => item.comics) || []
              }
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
        </>
      ) : (
        <ExchangeLoader firstUser={firstUser} secondUser={secondUser} />
      )}
    </div>
  );
};

export default ExchangeDetail;
