import React, { useEffect, useState } from "react";
import { message, notification, Popconfirm, Select } from "antd";
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

  const fetchProvinces = async () => {
    try {
      const response = await privateAxios("/viet-nam-address/provinces");
      setProvinceDrop(
        response.data.map((province: Province) => ({
          value: province.code,
          label: province.province,
        }))
      );
      setProvinces(response.data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchAddressCode = async () => {
    try {
      const response = await privateAxios(
        `/user-addresses/address-code/${address.id}`
      );
      setAddressCode(response.data);
      setSelectedProvince(response.data.provinceCode);
      setSelectedDistrict(response.data.districtCode);
      setSelectedWard(response.data.wardCode);
      fetchDistricts(response.data.provinceCode);
      fetchWards(response.data.districtCode);
    } catch (error) {
      console.error("Error fetching code address:", error);
    }
  };

  const fetchDistricts = async (provinceCode: number) => {
    try {
      const response = await privateAxios(
        `/viet-nam-address/districts/${provinceCode}`
      );
      setDistrictDrop(
        response.data.map((district: District) => ({
          value: district.code,
          label: district.district,
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
          value: ward.code,
          label: ward.ward,
        }))
      );
      setWards(response.data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  useEffect(() => {
    fetchAddressCode();
    fetchProvinces();
  }, [address]);

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
    setSelectedDistrict(value);
  };

  const handleWardChange = (value: number) => {
    setSelectedWard(value);
    console.log(value);
  };

  const handleSubmit = async () => {
    const updatedAddress = {
      fullName: name,
      phone,
      province: provinces.find((province) => province.code === selectedProvince)
        ?.province,
      district: districts.find((district) => district.code === selectedDistrict)
        ?.district,
      ward: wards.find((ward) => ward.code === selectedWard)?.ward,
      detailedAddress: detailAddress,
    };

    try {
      // Update the address first
      const response = await privateAxios.patch(
        `/user-addresses/${address.id}`,
        updatedAddress
      );
      console.log(response);

      // Only attempt to set as default if the checkbox is checked
      if (setAsDefault) {
        try {
          await privateAxios.patch(`/user-addresses/default/${address.id}`);
        } catch (error) {
          console.error("Error setting address as default:", error);
          throw new Error("Failed to set the address as default.");
        }
      }

      notification.success({
        message: "Success",
        description: "Address updated successfully.",
      });

      await refreshAddresses();
      onCancel();
    } catch (error) {
      console.error("Error updating address:", error);
      notification.error({
        message: "Error",
        description: "Failed to update the address.",
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
        message: "Success",
        description: "Address deleted successfully.",
      });
      // setTimeout(() => {
      await refreshAddresses();
      onCancel();
      // }, 2000);
    } catch (error) {
      console.error("Error deleting address:", error);
      notification.error({
        message: "Error",
        description: "Failed to delete the address.",
      });
    }
  };
  const confirm: PopconfirmProps["onConfirm"] = (e) => {
    handleDelete();
    console.log(e);
  };

  const cancel: PopconfirmProps["onCancel"] = (e) => {
    console.log(e);
    message.error("Click on No");
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col w-full px-4 mt-8 REM">
        <div className="flex flex-row w-full justify-between items-center mb-4">
          <h3 className="text-xl font-bold  ">Thay đổi thông tin giao hàng</h3>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            onConfirm={confirm}
            onCancel={cancel}
            okText="Yes"
            cancelText="No"
          >
            <button
              className="py-2 px-4 text-white bg-red-500 rounded-lg"
              // onClick={handleDelete}
            >
              Xóa địa chỉ giao hàng
            </button>
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
              value={selectedProvince || addressCode?.provinceCode}
            />
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
              value={selectedDistrict || addressCode?.districtCode}
            />
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
              value={selectedWard || addressCode?.wardCode}
            />
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
          />
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
