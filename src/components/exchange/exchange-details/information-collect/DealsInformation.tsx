import { ExchangeDetails } from "../../../../common/interfaces/exchange.interface";
import { Avatar } from "antd";
import { UserInfo } from "../../../../common/base.interface";
import CurrencySplitter from "../../../../assistants/Spliter";

export default function DealsInformation({
  exchangeDetails,
  self,
  theOther,
}: {
  exchangeDetails: ExchangeDetails;
  self: UserInfo;
  theOther: UserInfo;
}) {
  if (
    exchangeDetails.exchange.depositAmount &&
    exchangeDetails.exchange.depositAmount > 0
  )
    return (
      <div className="w-1/3 flex flex-col items-stretch justify-start mx-auto pb-16">
        <p className="self-stretch text-center font-semibold bg-gray-800 text-white px-4 py-4 rounded-sm">
          MỨC TIỀN ĐỀ NGHỊ CỦA{" "}
          <span className="font-light italic">
            <Avatar src={exchangeDetails.exchange.requestUser.avatar} />{" "}
            {exchangeDetails.exchange.requestUser.name}
          </span>
        </p>

        <div className="basis-full flex items-center justify-between gap-4 border border-gray-300 px-4 py-1">
          <div className="flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M3.00488 2.99979H21.0049C21.5572 2.99979 22.0049 3.4475 22.0049 3.99979V19.9998C22.0049 20.5521 21.5572 20.9998 21.0049 20.9998H3.00488C2.4526 20.9998 2.00488 20.5521 2.00488 19.9998V3.99979C2.00488 3.4475 2.4526 2.99979 3.00488 2.99979ZM20.0049 10.9998H4.00488V18.9998H20.0049V10.9998ZM20.0049 8.99979V4.99979H4.00488V8.99979H20.0049ZM14.0049 14.9998H18.0049V16.9998H14.0049V14.9998Z"></path>
            </svg>
            <p>Số tiền cọc: </p>
          </div>
          <span className="font-semibold">
            {CurrencySplitter(exchangeDetails.exchange.depositAmount || 0)} đ
          </span>
        </div>

        {exchangeDetails.exchange.compensationAmount > 0 ? (
          <div
            className={`basis-full border-x border-gray-300 px-4 py-2 text-center text-white ${
              exchangeDetails.exchange.compensateUser?.id === self.id
                ? "bg-red-900"
                : "bg-green-900"
            }`}
          >
            {exchangeDetails.exchange.compensateUser?.id === self.id ? (
              <p className="font-light">
                Bạn sẽ phải bù cho{" "}
                <span className="font-semibold">
                  <Avatar src={theOther.avatar} /> {theOther.name}
                </span>
              </p>
            ) : (
              <p className="font-light">
                <span className="font-semibold">
                  <Avatar src={theOther.avatar} /> {theOther.name}
                </span>{" "}
                sẽ bù tiền cho bạn
              </p>
            )}
          </div>
        ) : (
          <div className="basis-full border-x border-b border-gray-300 text-center py-2 font-semibold uppercase">
            Không áp dụng tiền bù
          </div>
        )}

        {exchangeDetails.exchange.compensationAmount > 0 && (
          <div className="basis-full flex items-center justify-between gap-4 border border-gray-300 px-4 py-1">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
                fill="currentColor"
              >
                <path d="M5.67591 4.25667C9.60392 1.03828 15.4094 1.26236 19.076 4.92893C22.9812 8.83418 22.9812 15.1658 19.076 19.0711C15.1707 22.9763 8.83906 22.9763 4.93382 19.0711C2.40932 16.5466 1.51676 13.0081 2.25611 9.76666L2.33275 9.45394L4.26718 9.96315C3.56967 12.623 4.26329 15.5721 6.34803 17.6569C9.47222 20.781 14.5375 20.781 17.6617 17.6569C20.7859 14.5327 20.7859 9.46734 17.6617 6.34315C14.8441 3.5255 10.4475 3.24903 7.32006 5.51375L7.09886 5.67983L8.1158 6.6967L3.5196 7.75736L4.58026 3.16117L5.67591 4.25667ZM13.0049 6V8H15.5049V10H10.0049C9.72874 10 9.50488 10.2239 9.50488 10.5C9.50488 10.7455 9.68176 10.9496 9.91501 10.9919L10.0049 11H14.0049C15.3856 11 16.5049 12.1193 16.5049 13.5C16.5049 14.8807 15.3856 16 14.0049 16H13.0049V18H11.0049V16H8.50488V14H14.0049C14.281 14 14.5049 13.7761 14.5049 13.5C14.5049 13.2545 14.328 13.0504 14.0948 13.0081L14.0049 13H10.0049C8.62417 13 7.50488 11.8807 7.50488 10.5C7.50488 9.11929 8.62417 8 10.0049 8H11.0049V6H13.0049Z"></path>
              </svg>
              <p>Số tiền bù: </p>
            </div>
            <span className="font-semibold">
              {CurrencySplitter(
                exchangeDetails.exchange.compensationAmount || 0
              )}{" "}
              đ
            </span>
          </div>
        )}
      </div>
    );
}
