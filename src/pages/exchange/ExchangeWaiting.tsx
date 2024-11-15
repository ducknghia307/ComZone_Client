import React from "react";
import ExchangeTab from "../../components/exchange/ExchangeTab";
import ExchangeTable from "../../components/exchange/ExchangeTable";

const ExchangeWaiting = () => {
  return (
    <div className="w-full px-10 py-5">
      <ExchangeTab />
      <ExchangeTable />
    </div>
  );
};

export default ExchangeWaiting;
