import { Avatar, Modal, Tooltip } from "antd";
import React from "react";
import CurrencySplitter from "../../../assistants/Spliter";
import { UserInfo } from "../../../common/base.interface";
import { SellerOrdersData } from "../ShopInfo";
import {
  DeliveryStatus,
  DeliveryStatusGroup,
} from "../../../common/interfaces/delivery.interface";
import displayPastTimeFromNow from "../../../utils/displayPastTimeFromNow";
import { useNavigate } from "react-router-dom";

export default function ShopBalanceModal({
  user,
  sellerOrdersData,
  isOpen,
  setIsOpen,
}: {
  user: UserInfo;
  sellerOrdersData: SellerOrdersData;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();

  const translateStatus = (status: string, deliveryStatus?: DeliveryStatus) => {
    if (
      status === "PACKAGING" &&
      deliveryStatus &&
      DeliveryStatusGroup.pickingGroup.some(
        (status) => deliveryStatus === status
      )
    ) {
      return "Hoàn tất đóng gói";
    }
    switch (status) {
      case "PENDING":
        return "Đang chờ xác nhận";
      case "DELIVERED":
        return "Đã giao hàng";
      case "PACKAGING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang chờ xác nhận giao hàng";
      case "SUCCESSFUL":
        return "Hoàn tất";
      case "CANCELED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      footer={null}
      centered
      width={"auto"}
    >
      <div className="REM flex flex-col items-stretch gap-4">
        <p className="text-xl font-semibold">THÔNG TIN SỐ DƯ</p>

        <div className="flex flex-col sm:flex-row items-center justify-between sm:gap-8">
          <div className="flex items-center gap-2 font-light">
            <Tooltip
              title={
                <p className="REM font-light text-black">
                  Tổng số dư khả dụng của tài khoản của bạn, bao gồm cả số dư
                  bạn đã nạp và nhận trên hệ thống.
                </p>
              }
              color="white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"></path>
              </svg>
            </Tooltip>
            Số dư khả dụng:{" "}
            <span className="font-semibold pl-2">
              {CurrencySplitter(user.balance)} đ
            </span>
          </div>
          <div className="flex items-center gap-2 font-light">
            <Tooltip
              title={
                <p className="REM font-light text-black">
                  Số tiền hệ thống giữ lại để chờ người dùng xác nhận đơn hàng
                  thành công, sau đó mới được chuyển vào số dư khả dụng của
                  người bán.
                </p>
              }
              color="white"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"></path>
              </svg>
            </Tooltip>
            Số dư đang chờ xác nhận đơn hàng:{" "}
            <span className="font-semibold pl-2">
              {CurrencySplitter(sellerOrdersData?.totalPendingAmount)} đ
            </span>
          </div>
        </div>

        {sellerOrdersData?.ongoingOrders?.length > 0 ? (
          <div className="flex flex-col items-stretch gap-2">
            <p className="text-sm font-light">
              Danh sách đơn hàng đang chờ xác nhận:
            </p>

            <div className="phone:min-w-[50em] flex flex-col items-stretch justify-start gap-2 border border-gray-300 rounded-md px-2 py-1">
              {sellerOrdersData.ongoingOrders?.map(
                (order, index) =>
                  index < 5 && (
                    <div
                      key={order.id}
                      className="grow basis-1/4 flex items-stretch justify-between gap-4"
                    >
                      <p className="my-auto basis-1/4 grow">
                        {displayPastTimeFromNow(order.createdAt)}
                      </p>

                      <div className="flex items-center gap-2">
                        <Avatar src={order.user.avatar} size={40} alt="" />
                        <p className="whitespace-nowrap line-clamp-1">
                          {order.user.name}
                        </p>
                      </div>

                      <Avatar.Group
                        size={64}
                        shape="square"
                        className="relative basis-1/4 grow flex justify-center"
                      >
                        {order.items[0].map((item) => (
                          <Tooltip
                            title={
                              <p className="REM text-black">
                                {item.comics.title}
                              </p>
                            }
                            color="white"
                          >
                            <Avatar
                              src={item.comics.coverImage}
                              alt={item.comics.title}
                            />
                          </Tooltip>
                        ))}
                        {order.items[0].length > 3 && (
                          <span className="absolute top-1/2 -right-2 z-10 bg-white -translate-y-1/2 rounded-md p-1 border border-gray-300">
                            +{order.items[1] - 3}
                          </span>
                        )}
                      </Avatar.Group>

                      <p className="font-semibold my-auto basis-1/5 grow">
                        {CurrencySplitter(order.totalPrice)} đ
                      </p>

                      <p className="my-auto text-center basis-1/5 min-w-fit grow">
                        {translateStatus(order.status)}
                      </p>
                    </div>
                  )
              )}

              {sellerOrdersData.ongoingOrders?.length > 5 && (
                <button
                  onClick={() => navigate("/sellermanagement/order")}
                  className="self-baseline mx-auto mt-4 duration-200 hover:underline"
                >
                  Xem thêm {sellerOrdersData.ongoingOrders?.length - 5} đơn hàng
                </button>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center py-[10vh]">
            Không có đơn hàng đang chờ xác nhận
          </p>
        )}
      </div>
    </Modal>
  );
}
