/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Checkbox, Modal, notification } from "antd";
import { useEffect, useState } from "react";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import ChargeMoney from "./ChargeMoney";
import { UserInfo } from "../../../../../common/base.interface";
import PhoneVerification from "../../../../wallet/PhoneVerification";

export default function PayButton({
  user,
  total,
  exchangeId,
  fetchExchangeDetails,
  setIsLoading,
}: {
  user: UserInfo;
  total: number;
  exchangeId: string;
  fetchExchangeDetails: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [userBalance, setUserBalance] = useState(0);
  const [paymentGateway, setPaymentGateway] = useState<"zalopay" | "vnpay">();
  const [amount, setAmount] = useState<number>(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [checked, setChecked] = useState(false);

  const [isVerifyingPhone, setIsVerifyingPhone] = useState(false);

  const fetchUserBalance = async () => {
    setIsLoading(true);
    await privateAxios
      .get("users/profile")
      .then((res) => {
        const balance = res.data.balance;
        setUserBalance(balance);
        if (balance < total) {
          setAmount(total - balance);
          if (!user.phone) setIsVerifyingPhone(true);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const redirectPath = window.location.pathname;

  const redirectToPay = async () => {
    try {
      localStorage.setItem("paying-exchange", exchangeId);

      if (paymentGateway === "zalopay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount,
        });
        const resZalopay = await privateAxios.post("/zalopay", {
          walletDeposit: resWalletDes.data.id,
          redirectPath: redirectPath || "/",
        });
        window.location.href = resZalopay.data.orderurl;
      } else if (paymentGateway === "vnpay") {
        const resWalletDes = await privateAxios.post("/wallet-deposits", {
          amount,
        });
        const resVNpay = await privateAxios.post("/vnpay", {
          walletDeposit: resWalletDes.data.id,
          redirectPath: redirectPath || "/",
        });
        window.location.href = resVNpay.data.url;
      } else {
        console.error("No valid payment method selected");
      }
    } catch (error) {
      console.error("Payment error:", error);
    }
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
          message: "Giao dịch cọc không thành công!",
          duration: 2,
        });
      })
      .finally(() => setIsLoading(false));

    await privateAxios
      .patch(`/exchanges/pay/${exchangeId}`)
      .then(() => {
        notification.success({ message: "Thanh toán thành công", duration: 5 });
        fetchExchangeDetails();
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          message: "Thanh toán không thành công!",
          duration: 2,
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUserBalance();

    const payRedirectSession = localStorage.getItem("paying-exchange");
    if (payRedirectSession && payRedirectSession === exchangeId) {
      handlePayment();

      localStorage.removeItem("paying-exchange");
    }
  }, [total, isConfirming]);

  return (
    <>
      <button
        onClick={() => {
          if (userBalance < total) setAmount(total - userBalance);
          setIsConfirming(true);
        }}
        className="bg-sky-700 py-2 text-white text-xs font-semibold rounded-md duration-200 hover:bg-sky-900"
      >
        THANH TOÁN BẰNG VÍ COMZONE
      </button>

      {isConfirming && (
        <Modal
          open={isConfirming}
          onCancel={(e) => {
            e.stopPropagation();
            setChecked(false);
            setAmount(0);
            setPaymentGateway(undefined);
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
                  &#8226;&emsp;Số tiền thanh toán giữa hai người có thể khác
                  nhau trong cùng một trao đổi vì phí giao hàng có thể khác
                  nhau.
                </p>
                <p className="font-light text-xs">
                  &#8226;&emsp;Tiền cọc sẽ được hoàn lại chỉ khi cả hai người
                  tham gia trao đổi xác nhận đã nhận truyện thành công.
                </p>
                <p className="font-light text-xs">
                  &#8226;&emsp;Nếu có vấn đề xảy ra và được xác định là do một
                  trong hai người trao đổi, toàn bộ số tiền cọc sẽ được chuyển
                  về cho người đối diện.
                </p>
                <p className="font-light text-xs">
                  &#8226;&emsp;Phí giao hàng sẽ không được hoàn trả.
                </p>
              </div>
            </div>

            <ChargeMoney
              total={total}
              userBalance={userBalance}
              paymentGateway={paymentGateway}
              setPaymentGateway={setPaymentGateway}
              amount={amount}
              setAmount={setAmount}
            />

            <div className="flex items-center gap-2 px-4">
              <Checkbox
                checked={checked}
                onChange={() => setChecked(!checked)}
              />
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
                disabled={
                  !checked || amount + userBalance < total || !paymentGateway
                }
                className="basis-2/3 py-2 bg-sky-700 text-white font-semibold rounded-md duration-200 hover:bg-sky-800 disabled:bg-gray-300"
                onClick={() => {
                  if (userBalance < total) redirectToPay();
                  else handlePayment();
                }}
              >
                {userBalance < total ? "NẠP TIỀN VÀ THANH TOÁN" : "THANH TOÁN"}
              </button>
            </div>
          </div>

          {isVerifyingPhone && (
            <PhoneVerification
              isOpen={isVerifyingPhone}
              setIsOpen={setIsVerifyingPhone}
              user={user}
              cancelCallback={() => {
                setIsVerifyingPhone(false);
                setIsConfirming(false);
              }}
              confirmCallback={() => {
                setIsVerifyingPhone(false);
                fetchExchangeDetails();
              }}
            />
          )}
        </Modal>
      )}
    </>
  );
}
