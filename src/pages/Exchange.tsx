import React from "react";
import { useParams } from "react-router-dom";
import ExchangeTab from "../components/exchange/ExchangeTab";
import TableExchange from "../components/exchange/TableExchange";

const Exchange = () => {
  const { status } = useParams();

  const renderContent = () => {
    switch (status) {
      case "all":
        return <TableExchange />;
      case "pending-request":
        return <TableExchange />;
      case "sent-request":
        return <TableExchange />;
      case "in-progress":
        return <TableExchange />;
      case "in-delivery":
        return <TableExchange />;
      case "finished-delivery":
        return <TableExchange />;
      case "successful":
        return <TableExchange />;
      case "canceled":
        return <TableExchange />;
      default:
        return <div>Page not found</div>;
    }
  };

  return (
    <div className="w-full px-10 py-5 min-h-[70vh]">
      <h2 className="text-3xl font-bold mt-4 mb-8">TRAO ĐỔI CỦA BẠN</h2>
      <ExchangeTab />
      <div className="mt-5">{renderContent()}</div>
    </div>
  );
};

export default Exchange;