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
  else
    return (
      <>
        <div className="basis-1/3 grow font-light text-sm text-red-600">
          <p className="font-semibold pb-2">Lưu ý:</p>
          <ul className="list-disc px-8">
            <li>
              Số tiền cọc này sẽ phải đảm bảo được HOÀN TOÀN thiệt hại nếu có
              tình huống ngoài mong muốn xảy ra với truyện của bạn trong quá
              trình thực hiện trao đổi.
            </li>
            <li>
              Tiền cọc chỉ được đưa ra từ đầu ngay trước khi bắt đầu trao đổi.
              Mức cọc KHÔNG THỂ thay đổi từ khi quá trình trao đổi bắt đầu diễn
              ra cho đến khi kết thúc.
            </li>
            <li>
              Số tiền bù sẽ được chuyển cho người nhận tiền bù chỉ khi quá trình
              trao đổi hoàn tất mà không có sự cố nào.
            </li>
            <li className="font-semibold">
              ComZone sẽ KHÔNG chịu trách nhiệm cho những sự cố xảy ra vì tiền
              cọc không đảm bảo.
            </li>
          </ul>
        </div>

        <div className="flex flex-col items-start gap-2">
          <p className="text-sm font-semibold">GIAO HÀNG & NHẬN HÀNG</p>
          <div className="flex items-stretch gap-2 px-8">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              className="mt-1"
            >
              <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
            </svg>
            <p className="font-light">
              Chúng tôi đã áp dụng{" "}
              <span className="font-semibold">
                Dịch vụ Giao hàng của ComZone
              </span>{" "}
              để bảo đảm an toàn cho xuyên suốt quá trình trao đổi truyện của
              bạn.
            </p>
          </div>
        </div>
      </>
    );
}
