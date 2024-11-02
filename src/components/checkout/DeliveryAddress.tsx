import { Modal } from "antd";
import React, { useEffect, useState } from "react";
import NewAddressForm from "./NewAddressForm";
import { Address, UserInfo } from "../../common/base.interface";
import AddressList from "./AddressList";
import { privateAxios } from "../../middleware/axiosInstance";
interface DeliveryAddressProps {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address | null) => void;
}

const DeliveryAddress: React.FC<DeliveryAddressProps> = ({
  selectedAddress,
  setSelectedAddress,
}) => {
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  // const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [newAddress, setNewAddress] = useState(false);
  const [handleModal, setHandleModal] = useState<boolean>();
  const showModal = () => {
    setIsModalOpen(true);
    setNewAddress(false);
  };

  const handleOk = () => {
    setNewAddress(false);
    setIsModalOpen(false);
  };

  const fetchUserInfo = async () => {
    try {
      const response = await privateAxios("/users/profile");
      const data = await response.data;
      console.log(data);

      setUserInfo(data);
      fetchUserAddress();
    } catch {
      console.log("...");
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await privateAxios("/user-addresses/user");

      const data = response.data;

      const sortedAddresses = data.sort((a: Address, b: Address) => {
        return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0);
      });
      console.log(sortedAddresses);

      setSelectedAddress(sortedAddresses[0] || null);
      setAddresses(sortedAddresses);
    } catch {
      console.log("...");
    }
  };
  const refreshAddresses = () => {
    fetchUserAddress();
  };
  const handleSetSelectedAddress = (addressId: string) => {
    const address = addresses.find((addr) => addr.id === addressId) || null;
    setSelectedAddress(address);
  };
  const updateAddress = (addressId: string, updatedAddress: Address) => {
    const updatedAddresses = addresses.map((addr) =>
      addr.id === addressId ? updatedAddress : addr
    );
    setAddresses(updatedAddresses);
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  return (
    <div className="w-full bg-white px-8 py-4 rounded-lg mb-4">
      <div className="flex flex-row justify-between w-full">
        <h2 className="font-bold">THÔNG TIN NHẬN HÀNG</h2>
        <div
          className="flex flex-row gap-1 items-center cursor-pointer"
          onClick={showModal}
        >
          <svg
            width="16px"
            height="16px"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18.3785 8.44975L11.4637 15.3647C11.1845 15.6439 10.8289 15.8342 10.4417 15.9117L7.49994 16.5L8.08829 13.5582C8.16572 13.1711 8.35603 12.8155 8.63522 12.5363L15.5501 5.62132M18.3785 8.44975L19.7927 7.03553C20.1832 6.64501 20.1832 6.01184 19.7927 5.62132L18.3785 4.20711C17.988 3.81658 17.3548 3.81658 16.9643 4.20711L15.5501 5.62132M18.3785 8.44975L15.5501 5.62132"
              stroke="#1D6199"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 20H19"
              stroke="#1D6199"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <h2 className="font-light text-slate-500">
            {selectedAddress ? "Thay đổi" : "Thêm địa chỉ giao hàng"}
          </h2>
        </div>
        <Modal
          title={null}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={(e) => {
            e.stopPropagation();
            setIsModalOpen(false);
            setHandleModal(!handleModal);
          }}
          width={1000}
          footer={null}
        >
          <>
            {newAddress ? (
              <NewAddressForm
                userInfo={userInfo}
                onClose={() => setNewAddress(false)}
                refreshAddresses={refreshAddresses}
              />
            ) : (
              <>
                <AddressList
                  addresses={addresses}
                  selectedAddress={selectedAddress}
                  setSelectedAddress={handleSetSelectedAddress}
                  updateAddress={updateAddress}
                  onAddAddress={() => setNewAddress(true)}
                  handleSetIsEdit={handleModal}
                  refreshAddresses={refreshAddresses}
                />
              </>
            )}
          </>
        </Modal>
      </div>
      <div className="flex flex-col w-full mt-3">
        {selectedAddress ? (
          <>
            {" "}
            <div className="flex flex-row w-full gap-5 items-center">
              <svg
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z"
                  fill="#000"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z"
                  fill="#000"
                />
              </svg>
              <div className="flex flex-row gap-3">
                <h3 className="font-semibold">{selectedAddress?.fullName}</h3>
                <h3>|</h3>
                <h3 className="font-light">{selectedAddress?.phone}</h3>
              </div>
            </div>
            <div className="flex flex-row gap-5 mt-2 items-center">
              <svg
                width="30px"
                height="35px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                  stroke="#000000"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <div className="flex flex-row gap-1">
                <h3 className="font-light">{selectedAddress?.fullAddress},</h3>
              </div>
            </div>
          </>
        ) : (
          "Vui lòng thêm địa chỉ giao hàng"
        )}
      </div>
    </div>
  );
};

export default DeliveryAddress;
