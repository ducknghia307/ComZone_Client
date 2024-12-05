import React, { useState } from "react";
import ActionConfirm from "../../../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../../../middleware/axiosInstance";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { ExchangeDetails } from "../../../../../common/interfaces/exchange.interface";
import { Address } from "../../../../../common/base.interface";

export default function ConfirmDeliveryButton({
  selectedAddress,
  exchangeId,
  fetchExchangeDetails,
}: {
  selectedAddress: Address | null;
  exchangeId: string;
  fetchExchangeDetails: () => void;
}) {
  const [isAccepting, setIsAccepting] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleConfirm = async () => {
    console.log("address", selectedAddress);
    try {
      const resDeliveryInformation = await privateAxios.post(
        "/delivery-information",
        {
          name: selectedAddress?.fullName,
          phone: selectedAddress?.phone,
          provinceId: selectedAddress?.province.id,
          districtId: selectedAddress?.district.id,
          wardId: selectedAddress?.ward.id,
          address: selectedAddress?.detailedAddress,
        }
      );
      const resDeliveryExchange = await privateAxios.post(
        "/deliveries/exchange",
        {
          exchange: exchangeId,
          addressId: resDeliveryInformation.data.id,
        }
      );
      console.log(resDeliveryExchange);
      notification.success({
        message: "Thêm thông tin nhận hàng thành công",
        duration: 2,
      });
      fetchExchangeDetails();
    } catch (error) {
      if (error.response.data.statusCode === 400)
        notification.error({
          message: "Địa chỉ ngoài vùng dịch vụ",
          description: error.response.data.message,
          duration: 5,
        });
      else
        notification.error({
          message: "Lỗi khi thêm thông tin nhận hàng",
          duration: 5,
        });
    }
  };

  return (
    <div className="flex items-stretch gap-2">
      <button
        onClick={() => setIsAccepting(true)}
        className="grow py-2 rounded-lg bg-sky-700  text-white hover:opacity-80 duration-200"
      >
        Xác nhận địa chỉ giao hàng
      </button>
      <ActionConfirm
        isOpen={isAccepting}
        setIsOpen={setIsAccepting}
        title="Xác nhận địa chỉ giao hàng"
        description={
          <p className="text-xs">
            Bạn có chắc chắn muốn hệ thống ghi nhận địa chỉ giao hàng này?
            <br />
            <span className="text-red-600">
              Lưu ý: Sau khi chấp nhận, hệ thống sẽ ghi nhận địa chỉ giao hàng
              của bạn và bạn không thể thay đổi địa chỉ này.
            </span>
          </p>
        }
        confirmCallback={() => handleConfirm()}
      />
    </div>
  );
}
