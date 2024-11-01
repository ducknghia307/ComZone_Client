import React, { useEffect, useState } from "react";
import { Button, message, notification, Popconfirm, Select } from "antd";
import axios from "axios";
import type { PopconfirmProps } from "antd";
import {
  Address,
  District,
  DistrictDrop,
  GetAddressCode,
  Province,
  ProvinceDrop,
  Ward,
  WardDrop,
} from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import { DeleteOutlined } from "@ant-design/icons";

const EditAddress: React.FC<{
  address: Address;
  onSave: (updatedAddress: Address) => void;
  onCancel: () => void;
  refreshAddresses: () => void;
}> = ({ address, onSave, onCancel, refreshAddresses }) => {
  console.log("Edit Address:", address);

  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [provinceDrop, setProvinceDrop] = useState<ProvinceDrop[]>([]);
  const [districtDrop, setDistrictDrop] = useState<DistrictDrop[]>([]);
  const [wardDrop, setWardDrop] = useState<WardDrop[]>([]);
  const [addressCode, setAddressCode] = useState<GetAddressCode>();

  const [name, setName] = useState(address.fullName);
  const [phone, setPhone] = useState(address.phone);
  const [detailAddress, setDetailAddress] = useState(address.detailedAddress);
  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);
  const [setAsDefault, setSetAsDefault] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [districtError, setDistrictError] = useState<string | null>(null);
  const [wardError, setWardError] = useState<string | null>(null);
  const [detailAddressError, setDetailAddressError] = useState<string | null>(
    null
  );

  console.log(refreshAddresses);
  useEffect(() => {
    fetchAddressCode();
    fetchProvinces();
  }, [address]);
  const fetchProvinces = async () => {
    try {
      const response = await privateAxios("/viet-nam-address/provinces");
      setProvinceDrop(
        response.data.map((province: Province) => ({
          value: province.id,
          label: province.name,
        }))
      );
      setProvinces(response.data);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchAddressCode = async () => {
    setSelectedProvince(address.province.id);
    setSelectedDistrict(address.district.id);
    setSelectedWard(address.ward.id);
    fetchDistricts(address.province.id);
    fetchWards(address.district.id);
  };

  const fetchDistricts = async (provinceCode: number) => {
    try {
      const response = await privateAxios(
        `/viet-nam-address/districts/${provinceCode}`
      );
      setDistrictDrop(
        response.data.map((district: District) => ({
          value: district.id,
          label: district.name,
        }))
      );
      setDistricts(response.data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtCode: number) => {
    try {
      const response = await privateAxios(
        `/viet-nam-address/wards/${districtCode}`
      );
      setWardDrop(
        response.data.map((ward: Ward) => ({
          value: ward.id,
          label: ward.name,
        }))
      );
      setWards(response.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
    }
  }, [selectedDistrict]);

  const handleProvinceChange = (value: number) => {
    setSelectedProvince(value);
    setSelectedDistrict(null);
    setSelectedWard(null);

    setDistrictDrop([]);
    setWardDrop([]);
    fetchDistricts(value);
    setAddressCode(undefined);
  };

  const handleDistrictChange = (value: number) => {
    setSelectedWard(null);
    setSelectedDistrict(value);
  };

  const handleWardChange = (value: number) => {
    setSelectedWard(value);
    console.log(value);
  };

  const handleSubmit = async () => {
    let isValid = true;

    if (!name) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!phone || !/^\d{10,11}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits.");
      isValid = false;
    } else {
      setPhoneError(null);
    }

    if (!selectedProvince) {
      setProvinceError("Please choose a province.");
      isValid = false;
    } else {
      setProvinceError(null);
    }

    if (!selectedDistrict) {
      setDistrictError("Please choose a district.");
      isValid = false;
    } else {
      setDistrictError(null);
    }

    if (!selectedWard) {
      setWardError("Please choose a ward.");
      isValid = false;
    } else {
      setWardError(null);
    }

    if (!detailAddress || detailAddress.trim().length < 1) {
      setDetailAddressError(
        "Please fill in the detailed address with more than one space."
      );
      isValid = false;
    } else {
      setDetailAddressError(null);
    }

    if (!isValid) return;

    const updatedAddress = {
      fullName: name,
      phone,
      province: provinces.find((province) => province.id === selectedProvince)
        ?.id,
      district: districts.find((district) => district.id === selectedDistrict)
        ?.id,
      ward: wards.find((ward) => ward.id === selectedWard)?.id,
      detailedAddress: detailAddress,
    };
    console.log(updatedAddress);

    try {
      const response = await privateAxios.patch(
        `/user-addresses/${address.id}`,
        updatedAddress
      );
      console.log(response);

      if (setAsDefault) {
        try {
          await privateAxios.patch(`/user-addresses/default/${address.id}`);
        } catch (error) {
          console.error("Error setting address as default:", error);
          throw new Error("Failed to set the address as default.");
        }
      }

      api.success({
        key: "a",
        message: "Thành công",
        description: "Cập nhật địa chỉ thành công.",
        duration: 2,
      });

      refreshAddresses();
      setTimeout(() => {
        onCancel();
      }, 2000);
      return;
    } catch (error) {
      console.error("Error updating address:", error);
      api.error({
        key: "a",
        message: "Error",
        description: "Failed to update the address.",
        duration: 5,
      });
    }
  };

  const handleDelete = async () => {
    try {
      const response = await privateAxios.delete(
        `/user-addresses/${address.id}`
      );

      console.log("Address deleted successfully:", response.data);
      notification.success({
        message: "Thành công",
        description: "Đã xóa địa chỉ này.",
      });
      refreshAddresses();
      onCancel();
    } catch (error) {
      console.error("Error deleting address:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete the address.",
      });
    }
  };
  const confirm = () => {
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(null);
        handleDelete();
      }, 3000);
    });
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };
  console.log("province drop:", provinceDrop);
  console.log(selectedProvince);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col w-full px-4 mt-8 REM">
        <div className="flex flex-row w-full justify-between items-center mb-4">
          <h3 className="text-xl font-bold  ">Thay đổi thông tin giao hàng</h3>
          <Popconfirm
            title="Xóa địa chỉ"
            description="Bạn có chắc chắn khi xóa địa chỉ này?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Có"
            cancelText="Không"
          >
            <Button
              color="danger"
              variant="solid"
              size="large"
              icon={<DeleteOutlined />}
            >
              Xóa địa chỉ giao hàng
            </Button>
          </Popconfirm>
        </div>
        <div className="flex flex-row w-full gap-12">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Họ và tên người nhận</h3>
            <input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A"
              className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <span className="text-red-500  top-1">{nameError}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Số điện thoại người nhận</h3>
            <input
              type="text"
              placeholder="Ví dụ: 0987XXXXXX"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
            />
            {phoneError && (
              <span className="text-red-500 mt-20 absolute italic">
                {phoneError}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-row w-full gap-5 mt-8">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Tỉnh/Thành phố</h3>
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành phố"
              options={provinceDrop}
              onChange={handleProvinceChange}
              className="REM"
              value={selectedProvince}
            />
            {provinceError && (
              <span className="text-red-500 mt-16 pt-2 absolute italic ">
                {provinceError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Quận/Huyện</h3>
            <Select
              showSearch
              placeholder="Chọn quận/huyện"
              options={districtDrop}
              onChange={handleDistrictChange}
              className="REM"
              disabled={!selectedProvince}
              value={selectedDistrict}
            />{" "}
            {districtError && (
              <span className="text-red-500 mt-16 pt-2 absolute italic ">
                {districtError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Phường/Xã</h3>
            <Select
              showSearch
              placeholder="Chọn phường/xã"
              options={wardDrop}
              onChange={handleWardChange}
              className="REM"
              disabled={!selectedDistrict}
              value={selectedWard}
            />
            {wardError && (
              <span className="text-red-500 mt-16 pt-2 absolute italic ">
                {wardError}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full mt-10">
          <h3 className="font-semibold">Địa chỉ cụ thể (Số nhà, tên đường)</h3>
          <input
            type="text"
            placeholder="Ví dụ: 123/32 Hòa Bình"
            className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
          />{" "}
          {detailAddressError && (
            <span className="text-red-500 mt-16 pt-2 absolute italic ">
              {detailAddressError}
            </span>
          )}
        </div>
        <div className="flex flex-row w-full justify-between items-center mt-8">
          {!address.isDefault ? (
            <div className="container items-center flex gap-3">
              <input
                type="checkbox"
                onChange={() => setSetAsDefault(!setAsDefault)}
              />
              <h3 className="text-base">Đặt làm mặc định</h3>
            </div>
          ) : (
            ""
          )}
          <div className="flex flex-row justify-end w-full ">
            <button
              className="px-6 py-2 font-bold rounded-2xl bg-gray-400 text-white mr-4"
              onClick={onCancel}
            >
              HỦY
            </button>
            <button
              className="px-6 py-2 font-bold rounded-2xl bg-black text-white"
              onClick={handleSubmit}
            >
              XÁC NHẬN THAY ĐỔI
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditAddress;
