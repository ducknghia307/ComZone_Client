/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Checkbox, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import CurrencySplitter from "../../../../../assistants/Spliter";
import Loading from "../../../../loading/Loading";

export default function PayButton({
  total,
  exchangeId,
  fetchExchangeDetails,
  setIsLoading,
}: {
  total: number;
  exchangeId: string;
  fetchExchangeDetails: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userBalance, setUserBalance] = useState(0);
  const [isHidingBalance, setIsHidingBalance] = useState(true);
  const [isConfirming, setIsConfirming] = useState(false);
  const [checked, setChecked] = useState(false);

  const fetchUserBalance = async () => {
    setIsLoading(true);
    await privateAxios
      .get("users/profile")
      .then((res) => {
        console.log(res.data.balance);
        setUserBalance(res.data.balance);
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handlePayment = async () => {
    setIsConfirming(false);

    setIsLoading(true);
    await privateAxios
      .post("/deposits/exchange", {
        exchange: exchangeId,
      })
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log("error:", err);
        notification.error({
          message: "Giao dịch không thành công",
          duration: 2,
        });
      })
      .finally(() => setIsLoading(false));

    await privateAxios
      .patch(`/exchanges/pay/${exchangeId}`)
      .then((res) => {
        console.log(res.data);
        notification.success({ message: "Thanh toán thành công", duration: 5 });
        fetchExchangeDetails();
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Thanh toán không thành công",
          duration: 2,
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUserBalance();
  }, [total]);

  return (
    <>
      <button
        onClick={() => setIsConfirming(true)}
        className="bg-sky-700 py-2 text-white text-xs font-semibold rounded-md duration-200 hover:bg-sky-900"
      >
        THANH TOÁN BẰNG VÍ COMZONE
      </button>
      <Modal
        open={isConfirming}
        onCancel={(e) => {
          e.stopPropagation();
          setIsConfirming(false);
        }}
        centered
        footer={null}
      >
        <div className="flex flex-col gap-4">
          <p className="font-bold text-lg">XÁC NHẬN THANH TOÁN</p>

          <div className="flex flex-col gap-2">
            <p className="text-red-600">Lưu ý trước khi thanh toán:</p>

            <div className="flex flex-col gap-1 px-4">
              <p className="font-light text-xs">
                &#8226;&emsp;Số tiền thanh toán giữa hai người có thể khác nhau
                trong cùng một trao đổi vì phí giao hàng có thể khác nhau.
              </p>
              <p className="font-light text-xs">
                &#8226;&emsp;Tiền cọc sẽ được hoàn lại chỉ khi cả hai người tham
                gia trao đổi xác nhận đã nhận truyện thành công.
              </p>
              <p className="font-light text-xs">
                &#8226;&emsp;Nếu có vấn đề xảy ra và được xác định là do một
                trong hai người trao đổi, toàn bộ số tiền cọc sẽ được chuyển về
                cho người đối diện.
              </p>
            </div>
          </div>

          {userBalance < total ? null : (
            <div className="flex items-center gap-2">
              <p className="font-light text-xs">
                Số dư sau khi thanh toán:{" "}
                {isHidingBalance
                  ? "*******"
                  : CurrencySplitter(userBalance - (total || 0)) + " đ"}
              </p>
              <button onClick={() => setIsHidingBalance(!isHidingBalance)}>
                {isHidingBalance ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="currentColor"
                  >
                    <path d="M12.0003 3C17.3924 3 21.8784 6.87976 22.8189 12C21.8784 17.1202 17.3924 21 12.0003 21C6.60812 21 2.12215 17.1202 1.18164 12C2.12215 6.87976 6.60812 3 12.0003 3ZM12.0003 19C16.2359 19 19.8603 16.052 20.7777 12C19.8603 7.94803 16.2359 5 12.0003 5C7.7646 5 4.14022 7.94803 3.22278 12C4.14022 16.052 7.7646 19 12.0003 19ZM12.0003 16.5C9.51498 16.5 7.50026 14.4853 7.50026 12C7.50026 9.51472 9.51498 7.5 12.0003 7.5C14.4855 7.5 16.5003 9.51472 16.5003 12C16.5003 14.4853 14.4855 16.5 12.0003 16.5ZM12.0003 14.5C13.381 14.5 14.5003 13.3807 14.5003 12C14.5003 10.6193 13.381 9.5 12.0003 9.5C10.6196 9.5 9.50026 10.6193 9.50026 12C9.50026 13.3807 10.6196 14.5 12.0003 14.5Z"></path>
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="12"
                    height="12"
                    fill="currentColor"
                  >
                    <path d="M17.8827 19.2968C16.1814 20.3755 14.1638 21.0002 12.0003 21.0002C6.60812 21.0002 2.12215 17.1204 1.18164 12.0002C1.61832 9.62282 2.81932 7.5129 4.52047 5.93457L1.39366 2.80777L2.80788 1.39355L22.6069 21.1925L21.1927 22.6068L17.8827 19.2968ZM5.9356 7.3497C4.60673 8.56015 3.6378 10.1672 3.22278 12.0002C4.14022 16.0521 7.7646 19.0002 12.0003 19.0002C13.5997 19.0002 15.112 18.5798 16.4243 17.8384L14.396 15.8101C13.7023 16.2472 12.8808 16.5002 12.0003 16.5002C9.51498 16.5002 7.50026 14.4854 7.50026 12.0002C7.50026 11.1196 7.75317 10.2981 8.19031 9.60442L5.9356 7.3497ZM12.9139 14.328L9.67246 11.0866C9.5613 11.3696 9.50026 11.6777 9.50026 12.0002C9.50026 13.3809 10.6196 14.5002 12.0003 14.5002C12.3227 14.5002 12.6309 14.4391 12.9139 14.328ZM20.8068 16.5925L19.376 15.1617C20.0319 14.2268 20.5154 13.1586 20.7777 12.0002C19.8603 7.94818 16.2359 5.00016 12.0003 5.00016C11.1544 5.00016 10.3329 5.11773 9.55249 5.33818L7.97446 3.76015C9.22127 3.26959 10.5793 3.00016 12.0003 3.00016C17.3924 3.00016 21.8784 6.87992 22.8189 12.0002C22.5067 13.6998 21.8038 15.2628 20.8068 16.5925ZM11.7229 7.50857C11.8146 7.50299 11.9071 7.50016 12.0003 7.50016C14.4855 7.50016 16.5003 9.51488 16.5003 12.0002C16.5003 12.0933 16.4974 12.1858 16.4919 12.2775L11.7229 7.50857Z"></path>
                  </svg>
                )}
              </button>
            </div>
          )}

          <div className="flex items-center gap-2">
            <Checkbox checked={checked} onChange={() => setChecked(!checked)} />
            <p className="text-xs font-light cursor-default">
              Xác nhận tiến hành thanh toán
            </p>
          </div>

          <div className="flex self-stretch gap-2">
            <button
              className="basis-1/3 hover:underline"
              onClick={() => setIsConfirming(false)}
            >
              Quay lại
            </button>
            <button
              disabled={!checked || userBalance < total}
              className="basis-2/3 py-2 bg-sky-700 text-white font-semibold rounded-md duration-200 hover:bg-sky-800 disabled:bg-gray-300"
              onClick={handlePayment}
            >
              THANH TOÁN
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
