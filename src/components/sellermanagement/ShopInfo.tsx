import { useEffect, useState } from "react";
import SellerDetailsSection from "./shop-info/SellerDetailsSection";
import IncomeManagementSection from "./shop-info/IncomeManagementSection";
import { Comic, SellerDetails, UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import {
  SellerFeedback,
  SellerFeedbackResponse,
} from "../../common/interfaces/seller-feedback.interface";
import { Transaction } from "../../common/interfaces/transaction.interface";
import Loading from "../loading/Loading";

export interface SellerComicsData {
  comics: Comic[];
  total: number;
  totalAvailable: number;
}

export interface SellerOrdersData {
  orders: any[];
  ongoingOrders: any[];
  total: number;
  totalSuccessful: number;
  totalPendingAmount: number;
}

export interface SellerTransactionsData {
  transactions: Transaction[];
  transactionGroupsByDate: {
    date: string;
    transactions: Transaction[];
    totalInDate: number;
  }[];
  total: number;
  totalAmount: number;
  totalUnavailableAmount: number;
}

export default function ShopInfo() {
  const [user, setUser] = useState<UserInfo>();
  const [sellerDetails, setSellerDetails] = useState<SellerDetails>();

  const [sellerComicsData, setSellerComicsData] = useState<SellerComicsData>();

  const [sellerOrdersData, setSellerOrdersData] = useState<SellerOrdersData>();

  const [sellerTransactionsData, setSellerTransactionsData] =
    useState<SellerTransactionsData>();

  const [feedbacks, setFeedbacks] = useState<SellerFeedback[]>([]);
  const [totalFeedback, setTotalFeedback] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchUserInfo = async () => {
    await privateAxios
      .get("users/profile")
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSellerDetails = async () => {
    await privateAxios
      .get("seller-details")
      .then((res) => {
        setSellerDetails(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSellerComicsData = async () => {
    await privateAxios
      .get("comics/seller/data")
      .then((res) => {
        setSellerComicsData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSellerOrdersData = async () => {
    await privateAxios
      .get("orders/seller/data")
      .then((res) => {
        console.log("ORDER: ", res.data);
        setSellerOrdersData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSellerTransactionsData = async () => {
    await privateAxios
      .get("transactions/seller/data")
      .then((res) => {
        console.log("TRANSACTIONS: ", res.data);
        setSellerTransactionsData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const fetchSellerFeedback = async () => {
    await privateAxios
      .get("/seller-feedback/seller/self")
      .then((res) => {
        const feedbackResponse: SellerFeedbackResponse = res.data;
        setFeedbacks(feedbackResponse.feedback);
        setTotalFeedback(feedbackResponse.totalFeedback);
        setAverageRating(feedbackResponse.averageRating);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchUserInfo();
    fetchSellerDetails();
    fetchSellerComicsData();
    fetchSellerOrdersData();
    fetchSellerTransactionsData();
    fetchSellerFeedback();
  }, []);

  return (
    <div className="REM w-full flex flex-col phone:flex-row items-stretch justify-start gap-2">
      {isLoading && <Loading />}

      <div className="phone:basis-1/3 p-2 sm:p-4 bg-white rounded-md drop-shadow-md">
        <SellerDetailsSection
          user={user}
          sellerDetails={sellerDetails}
          sellerComicsData={sellerComicsData}
          sellerOrdersData={sellerOrdersData}
          totalFeedback={totalFeedback}
          averageRating={averageRating}
          setIsLoading={setIsLoading}
          fetchUserInfo={fetchUserInfo}
        />
      </div>

      <div className="grow p-2 sm:p-4 bg-white rounded-md drop-shadow-md">
        <IncomeManagementSection
          sellerOrdersData={sellerOrdersData}
          sellerTransactionsData={sellerTransactionsData}
        />
      </div>
    </div>
  );
}
