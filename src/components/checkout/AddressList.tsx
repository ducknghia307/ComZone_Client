import React, { useState } from "react";
import { Address } from "../../common/base.interface";
import EditAddress from "./EditAddress"; // Import the EditAddress component

interface AddressListProps {
  addresses: Address[];
  selectedAddress: Address | null;
  setSelectedAddress: (addressId: string) => void;
  updateAddress: (addressId: string, updatedAddress: Address) => void;
  onAddAddress?: () => void;
}

const AddressList: React.FC<AddressListProps> = ({
  addresses,
  selectedAddress,
  setSelectedAddress,
  updateAddress,
  onAddAddress,
}) => {
  const [isEdit, setIsEdit] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);

  const handleEdit = (address: Address) => {
    setEditingAddress(address);
    setIsEdit(true);
  };

  const handleSave = (updatedAddress: Address) => {
    if (editingAddress) {
      updateAddress(editingAddress.id, updatedAddress);
    }
    setIsEdit(false);
    setEditingAddress(null);
  };

  const handleCancel = () => {
    setIsEdit(false);
    setEditingAddress(null);
  };
  console.log(addresses);

  return (
    <>
      {isEdit ? (
        ""
      ) : (
        <h3 className="REM text-xl py-4">CHỌN THÔNG TIN GIAO HÀNG</h3>
      )}
      {isEdit
        ? editingAddress && (
            <EditAddress
              address={editingAddress}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )
        : addresses.map((address) => {
            const isSelected = selectedAddress?.id === address.id;
            return (
              <div
                key={address.id}
                className={`w-full py-4 px-10 mb-4 rounded-lg border h-28 ${
                  isSelected
                    ? "border-black border-2 bg-black text-white"
                    : "border-gray-300 hover:bg-gray-100 hover:border-black cursor-pointer"
                } flex flex-row items-center justify-between REM duration-200`}
                onClick={() => setSelectedAddress(address.id)}
              >
                <div className="flex items-center">
                  <div className="flex flex-col gap-1 w-full">
                    <div className="flex flex-row w-full gap-5 items-center">
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`${
                          isSelected ? "fill-white" : "fill-black"
                        }`}
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M8.25 9C8.25 6.92893 9.92893 5.25 12 5.25C14.0711 5.25 15.75 6.92893 15.75 9C15.75 11.0711 14.0711 12.75 12 12.75C9.92893 12.75 8.25 11.0711 8.25 9ZM12 6.75C10.7574 6.75 9.75 7.75736 9.75 9C9.75 10.2426 10.7574 11.25 12 11.25C13.2426 11.25 14.25 10.2426 14.25 9C14.25 7.75736 13.2426 6.75 12 6.75Z"
                        />
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C6.06294 22.75 1.25 17.9371 1.25 12ZM12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 14.5456 3.77827 16.851 5.4421 18.5235C5.6225 17.5504 5.97694 16.6329 6.68837 15.8951C7.75252 14.7915 9.45416 14.25 12 14.25C14.5457 14.25 16.2474 14.7915 17.3115 15.8951C18.023 16.6329 18.3774 17.5505 18.5578 18.5236C20.2217 16.8511 21.25 14.5456 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM17.1937 19.6554C17.0918 18.4435 16.8286 17.5553 16.2318 16.9363C15.5823 16.2628 14.3789 15.75 12 15.75C9.62099 15.75 8.41761 16.2628 7.76815 16.9363C7.17127 17.5553 6.90811 18.4434 6.80622 19.6553C8.28684 20.6618 10.0747 21.25 12 21.25C13.9252 21.25 15.7131 20.6618 17.1937 19.6554Z"
                        />
                      </svg>
                      <div className="flex flex-row gap-3">
                        <h3 className="font-semibold">{address.fullName}</h3>
                        <h3>|</h3>
                        <h3 className="font-light">{address.phone}</h3>
                        {address.isDefault && (
                          <div
                            className={`px-2 bg-cyan-900 rounded-lg text-white `}
                          >
                            Mặc định
                          </div>
                        )}
                        <button
                          className={`font-normal  cursor-pointer${
                            isSelected ? "text-gray-700" : "text-blue-400"
                          }  hover:underline duration-200`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent the click from firing on the address item
                            handleEdit(address); // Trigger edit
                          }}
                        >
                          Chỉnh sửa
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-row gap-5 mt-2">
                      <svg
                        width="24px"
                        height="24px"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M12 13C13.6569 13 15 11.6569 15 10C15 8.34315 13.6569 7 12 7C10.3431 7 9 8.34315 9 10C9 11.6569 10.3431 13 12 13Z"
                          stroke={isSelected ? "#fff" : "#000"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M12 22C16 18 20 14.4183 20 10C20 5.58172 16.4183 2 12 2C7.58172 2 4 5.58172 4 10C4 14.4183 8 18 12 22Z"
                          stroke={isSelected ? "#fff" : "#000"}
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                      <div className="flex flex-col gap-1">
                        <h3 className="font-light">
                          {address.detailedAddress}
                        </h3>
                        <h3 className="font-light">
                          {address.ward}, {address.district}, {address.province}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
                {isSelected && (
                  <div>
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#fff"
                      stroke="#fff"
                    >
                      <g id="SVGRepo_bgCarrier" strokeWidth="0" />
                      <g
                        id="SVGRepo_tracerCarrier"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <g id="SVGRepo_iconCarrier">
                        <title />
                        <g id="Complete">
                          <g id="tick">
                            <polyline
                              fill="none"
                              points="3.7 14.3 9.6 19 20.3 5"
                              stroke="#fff"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2"
                            />
                          </g>
                        </g>
                      </g>
                    </svg>
                  </div>
                )}
              </div>
            );
          })}

      {!isEdit && addresses.length !== 3 && (
        <button
          onClick={onAddAddress}
          className="rounded-lg w-full border-2 flex items-center justify-center py-4 REM text-lg border-gray-200 h-24 duration-200 hover:bg-gray-100"
        >
          <svg
            width="40"
            height="40"
            viewBox="0 -0.5 21 21"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs></defs>
            <g
              id="Page-1"
              stroke="none"
              strokeWidth="1"
              fill="none"
              fillRule="evenodd"
            >
              <g
                id="Dribbble-Light-Preview"
                transform="translate(-419.000000, -520.000000)"
                fill="#ccc"
              >
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <path
                    d="M374.55,369 L377.7,369 L377.7,371 L374.55,371 L374.55,374 L372.45,374 L372.45,371 L369.3,371 L369.3,369 L372.45,369 L372.45,366 L374.55,366 L374.55,369 Z M373.5,378 C368.86845,378 365.1,374.411 365.1,370 C365.1,365.589 368.86845,362 373.5,362 C378.13155,362 381.9,365.589 381.9,370 C381.9,374.411 378.13155,378 373.5,378 L373.5,378 Z M373.5,360 C367.70085,360 363,364.477 363,370 C363,375.523 367.70085,380 373.5,380 C379.29915,380 384,375.523 384,370 C384,364.477 379.29915,360 373.5,360 L373.5,360 Z"
                    id="plus_circle-[#1441]"
                  ></path>
                </g>
              </g>
            </g>
          </svg>
        </button>
      )}
    </>
  );
};

export default AddressList;
