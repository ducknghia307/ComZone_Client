import { Checkbox, Modal, notification } from "antd";
import React, { useState } from "react";
import { MembershipPlan } from "../membership/ComicZoneMembership";
import CurrencySplitter from "../../assistants/Spliter";
import { UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import ActionConfirm from "../actionConfirm/ActionConfirm";
import { SellerSubscription } from "../../common/interfaces/seller-subscription.interface";

export default function BuyPlan({
  user,
  userSubs,
  plan,
  index,
  isOpen,
  setIsOpen,
  setIsRegisterSellerModal,
  callback,
  setEntirelyOpen,
  setUsedTrial,
}: {
  user?: UserInfo;
  userSubs: SellerSubscription;
  plan: MembershipPlan;
  index: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<string>>;
  setIsRegisterSellerModal?: React.Dispatch<React.SetStateAction<boolean>>;
  callback?: () => void;
  setEntirelyOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setUsedTrial: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isHidingBalance, setIsHidingBalance] = useState<boolean>(true);
  const [confirmCheck, setConfirmCheck] = useState<boolean>(false);
  const [amount, setAmount] = useState<number>(0);
  const [paymentGateway, setPaymentGateway] = useState<"zalopay" | "vnpay">();

  const redirectPath = window.location.pathname;

  const getPlanTitle = () => {
    switch (index) {
      case 0:
        return "GÓI DÙNG THỬ";
      case 1:
        return "GÓI NÂNG CẤP";
      case 2:
        return "GÓI KHÔNG GIỚI HẠN";
      default:
        return "GÓI DÙNG THỬ";
    }
  };

  const redirectToPay = async () => {
    try {
      localStorage.setItem("registeringSellerPlan", plan.id);

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

  const handleBuyPlan = async () => {
    if (plan.price === 0) {
      setUsedTrial(true);
      if (userSubs && userSubs.usedTrial) {
        notification.info({
          key: "trial",
          message: "Bạn đã hết lượt dùng thử.",
          description:
            "Vui lòng đăng ký các gói bán khác của ComZone để tiếp tục!",
          duration: 5,
        });
        return;
      }
    }

    console.log("PLAN: ", plan.id);

    await privateAxios
      .post("seller-subscriptions", {
        planId: plan.id,
      })
      .then(() => {
        notification.success({
          key: "buy-plan",
          message: "Đăng ký gói bán thành công",
          duration: 5,
        });
        if (callback) callback();
        setEntirelyOpen(false);
      })
      .catch((err) => {
        console.log(err);
        notification.error({
          key: "buy-plan",
          message: "Đã có lỗi xảy ra!",
          duration: 5,
        });
      })
      .finally(() => {
        if (setIsRegisterSellerModal) setIsRegisterSellerModal(false);
      });
  };

  if (plan.price === 0) {
    return (
      <ActionConfirm
        isOpen={isOpen}
        setIsOpen={(isOpen) => {
          if (!isOpen) setIsOpen("");
        }}
        title="Xác nhận đăng ký dùng thử?"
        confirmCallback={() => {
          setIsOpen("");
          handleBuyPlan();
        }}
      />
    );
  }

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsHidingBalance(true);
        setPaymentGateway(undefined);
        setIsOpen("");
      }}
      centered
      footer={null}
      width="auto"
    >
      <div className="w-full min-w-fit flex flex-col gap-4 mt-4">
        <p className="text-xl font-bold">MUA GÓI ĐĂNG KÝ BÁN TRUYỆN COMZONE</p>

        <p>
          Bạn có thể tiến hành mua gói bằng cách thanh toán bằng ví ComZone:
        </p>

        <div className="min-w-max px-4 flex items-center justify-between gap-2">
          <p>Tổng số tiền cần thanh toán:</p>
          <div className="flex items-center gap-4 font-semibold text-lg">
            <p>{getPlanTitle()} X1</p>
            <p className="">{CurrencySplitter(plan.price)} đ</p>
          </div>
        </div>

        {user && (
          <div className="px-4">
            {user.balance >= plan.price ? (
              <div className="flex items-center gap-2">
                <p>Số dư sau thanh toán:</p>
                <p className="font-semibold">
                  {isHidingBalance
                    ? "*********"
                    : `${CurrencySplitter(user.balance - plan.price)} đ`}
                </p>
                <button onClick={() => setIsHidingBalance(!isHidingBalance)}>
                  {isHidingBalance ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
                      <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
                      <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
                      <path d="m2 2 20 20" />
                    </svg>
                  )}
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-1">
                {amount + user.balance < plan.price && (
                  <p className="text-red-500 italic">
                    Số dư hiện tại không đủ.
                  </p>
                )}

                {user.balance > 0 && (
                  <div className="flex justify-start items-center gap-4 mb-4">
                    <h3 className="text-xs">Số dư hiện tại:</h3>
                    <div className="font-semibold">
                      {CurrencySplitter(user.balance)} đ
                    </div>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className="font-bold mb-2 text-base">
                    Nhập số tiền nạp:
                  </h3>
                  <input
                    type="text"
                    placeholder="Nhập số tiền nạp"
                    className="w-full border p-2 rounded mb-2"
                    value={CurrencySplitter(Number(amount)) || 0}
                    onChange={(e) => {
                      if (
                        /^[0-9]*$/.test(
                          e.target.value.replace(/[^0-9.-]+/g, "")
                        ) &&
                        e.target.value.replace(/[^0-9.-]+/g, "").length < 10
                      )
                        setAmount(
                          Number(e.target.value.replace(/[^0-9.-]+/g, ""))
                        );
                    }}
                  />
                  {amount + user.balance < plan.price && (
                    <p className="text-red-500 text-xs italic">
                      Cần phải nạp thêm:{" "}
                      {CurrencySplitter(plan.price - user.balance)} đ
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap justify-start gap-2 mb-4 w-full max-w-lg mx-auto">
                  {[
                    20000, 50000, 100000, 200000, 500000, 1000000, 1500000,
                    2000000,
                  ].map((value) => (
                    <button
                      key={value}
                      className=" px-2 bg-white border border-gray-500 hover:bg-gray-200 duration-200 rounded text-black"
                      onClick={() => setAmount(amount + value)}
                    >
                      {CurrencySplitter(value)}
                    </button>
                  ))}
                </div>

                <p className="font-semibold">Chọn cổng thanh toán:</p>
                <div className="flex items-stretch gap-2">
                  <button
                    onClick={() => setPaymentGateway("zalopay")}
                    className={`flex items-center gap-2 ${
                      paymentGateway === "zalopay"
                        ? "bg-gray-900 text-white font-semibold"
                        : "border border-gray-400 hover:bg-gray-100"
                    } p-2 rounded-md duration-200`}
                  >
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Logo-ZaloPay-Square.png"
                      alt=""
                      className="w-[3em] h-[3em]"
                    />
                    Nạp thêm qua ZaloPay
                  </button>
                  <button
                    onClick={() => setPaymentGateway("vnpay")}
                    className={`flex items-center gap-2 ${
                      paymentGateway === "vnpay"
                        ? "bg-gray-900 text-white font-semibold"
                        : "border border-gray-400 hover:bg-gray-100"
                    } p-2 rounded-md duration-200`}
                  >
                    <img
                      src="https://cdn.haitrieu.com/wp-content/uploads/2022/10/Icon-VNPAY-QR.png"
                      alt=""
                      className="w-[3em] h-[3em]"
                    />
                    Nạp thêm qua VNPay
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        <div className="flex items-center gap-2 mt-4">
          <Checkbox
            checked={confirmCheck}
            onChange={() => setConfirmCheck(!confirmCheck)}
          />{" "}
          Xác nhận mua gói
        </div>

        {user.balance < plan.price ? (
          <button
            disabled={
              !paymentGateway ||
              amount + user.balance < plan.price ||
              !confirmCheck
            }
            onClick={() => redirectToPay()}
            className="self-stretch py-2 mt-4 font-semibold text-lg bg-sky-900 text-white rounded-md duration-200 hover:bg-gray-800 disabled:bg-gray-300"
          >
            NẠP VÀ MUA GÓI
          </button>
        ) : (
          <button
            disabled={!confirmCheck}
            onClick={() => {
              setIsOpen("");
              handleBuyPlan();
            }}
            className="self-stretch py-2 font-semibold text-lg bg-sky-900 text-white rounded-md duration-200 hover:bg-gray-800 disabled:bg-gray-300"
          >
            MUA GÓI
          </button>
        )}
      </div>
    </Modal>
  );
}
