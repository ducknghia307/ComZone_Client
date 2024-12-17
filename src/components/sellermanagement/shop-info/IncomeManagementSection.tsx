import React from "react";
import { LineChart } from "@mui/x-charts/LineChart";
import { SellerOrdersData, SellerTransactionsData } from "../ShopInfo";
import CurrencySplitter from "../../../assistants/Spliter";

export default function IncomeManagementSection({
  sellerOrdersData,
  sellerTransactionsData,
}: {
  sellerOrdersData: SellerOrdersData;
  sellerTransactionsData: SellerTransactionsData;
}) {
  if (!sellerTransactionsData) return;

  const xLabels = sellerTransactionsData.transactionGroupsByDate.map(
    (group) => group.date
  );

  const amountData = sellerTransactionsData.transactionGroupsByDate.map(
    (group) => group.totalInDate
  );

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-2xl font-semibold">THỐNG KÊ</p>

      {sellerTransactionsData.total > 0 ? (
        <div className="w-full">
          <LineChart
            xAxis={[{ scaleType: "point", data: xLabels }]}
            series={[
              {
                data: amountData,
                label: "Số tiền nhận được từ đơn hàng",
                valueFormatter: (value) =>
                  value == null ? "" : CurrencySplitter(value) + "đ",
              },
            ]}
            height={300}
            margin={{ top: 10, bottom: 20 }}
            sx={{ padding: "10px" }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-1 py-[10vh] opacity-50">
          <p className="font-light uppercase">Chưa có đơn hàng thành công</p>
          <p className="text-xs italic">
            Thống kê doanh thu từ đơn hàng của bạn sẽ được hiển thị ở đây
          </p>
        </div>
      )}
    </div>
  );
}
