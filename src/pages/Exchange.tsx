import { useParams } from "react-router-dom";
import ExchangeTab from "../components/exchange/ExchangeTab";
import TableExchange from "../components/exchange/TableExchange";

const Exchange = () => {
  return (
    <div className="grow w-full flex flex-col items-stretch gap-4">
      <ExchangeTab />
      <div className="w-full flex items-center justify-center px-2">
        <TableExchange />
      </div>
    </div>
  );
};

export default Exchange;
