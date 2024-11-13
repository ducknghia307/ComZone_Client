import { Modal, Select } from "antd";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  District,
  DistrictDrop,
  Province,
  ProvinceDrop,
  Ward,
  WardDrop,
} from "../../../common/base.interface";
import { privateAxios } from "../../../middleware/axiosInstance";

interface DeliveryAddressModalProps {
  isDeliveryModal: boolean;
  setDeliveryModal: Dispatch<SetStateAction<boolean>>;
}

const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isDeliveryModal,
  setDeliveryModal,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [provinceDrop, setProvinceDrop] = useState<ProvinceDrop[]>([]);
  const [selectProvince, setSelectProvince] = useState<Province | null>(null);
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtDrop, setDistrictDrop] = useState<DistrictDrop[]>([]);
  const [selectDistrict, setSelectDistrict] = useState<District | null>(null);
  const [wards, setWards] = useState<Ward[]>([]);
  const [wardDrop, setWardDrop] = useState<WardDrop[]>([]);
  const [selectWard, setSelectWard] = useState<Ward | null>(null);
  const [detailAddress, setDetailAddress] = useState("");
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [districtError, setDistrictError] = useState<string | null>(null);
  const [wardError, setWardError] = useState<string | null>(null);
  const [detailAddressError, setDetailAddressError] = useState<string | null>(
    null
  );

  const handleClose = () => {
    setDeliveryModal(false);
  };

  const fetchProvinces = async () => {
    try {
      const response = await privateAxios("/viet-nam-address/provinces");
      const data = response.data;
      const formattedData = data.map((province: Province) => ({
        value: province.id,
        label: province.name,
      }));
      setProvinceDrop(formattedData);
      setProvinces(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchDistricts = async (value: number) => {
    if (!value) {
      setDistricts([]);
    }
    try {
      const response = await privateAxios(
        `/viet-nam-address/districts/${value}`
      );
      const data = response.data;
      const formattedData = data.map((district: District) => ({
        value: district.id,
        label: district.name,
      }));
      setDistrictDrop(formattedData);
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching districts:", error);
    }
  };

  const fetchWards = async (districtCode: number) => {
    if (!districtCode) return;
    try {
      const response = await privateAxios(
        `/viet-nam-address/wards/${districtCode}`
      );
      const data = response.data;
      const formattedData = data.map((ward: Ward) => ({
        value: ward.id,
        label: ward.name,
      }));
      setWardDrop(formattedData);
      setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  const handleProvinceChange = (value: number) => {
    setDistrictDrop([]);
    const selectedProvince = provinces.find(
      (province: Province) => province.id === value
    );
    setSelectProvince(selectedProvince || null);
    setSelectDistrict(null);
    setSelectWard(null);
    setDistricts([]);
    setWardDrop([]);
    setProvinceError(null);
    fetchDistricts(value);
  };

  const handleDistrictChange = (value: number) => {
    const selectedDistrict = districts.find(
      (district: District) => district.id === value
    );
    setSelectDistrict(selectedDistrict || null);
    setSelectWard(null);
    setWardDrop([]);
    setDistrictError(null);
    fetchWards(value);
  };

  //   const isAddressValid = (): boolean => {
  //     return (
  //       !!selectProvince &&
  //       !!selectDistrict &&
  //       !!selectWard &&
  //       detailAddress.trim() !== ""
  //     );
  //   };

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    // validateAddress(isAddressValid());
  }, [selectProvince, selectDistrict, selectWard, detailAddress]);

  // Log the selected address details
  const logAddress = () => {
    console.log("Province:", selectProvince?.name);
    console.log("District:", selectDistrict?.name);
    console.log("Ward:", selectWard?.name);
    console.log("Detail Address:", detailAddress);
    handleClose();
  };

  return (
    <Modal
      title={<h2 className="text-xl p-2">NHẬP THÔNG TIN GIAO HÀNG</h2>}
      open={isDeliveryModal}
      onCancel={handleClose}
      footer={null}
      width={800}
    >
      <div className="p-2 bg-white rounded-md">
        <div className="flex flex-row w-full gap-5 mt-2">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold flex flex-row gap-2">
              Tỉnh/Thành phố <p className="text-red-500">*</p>
            </h3>
            <Select
              showSearch
              placeholder="Chọn tỉnh/thành phố"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={provinceDrop}
              onChange={handleProvinceChange}
              className="REM"
              value={selectProvince?.id}
            />
            {provinceError && (
              <span className="text-red-500 mt-16 pt-2 absolute italic">
                {provinceError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold flex flex-row gap-2">
              Quận/Huyện <p className="text-red-500">*</p>
            </h3>
            <Select
              showSearch
              placeholder="Chọn quận/huyện"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={districtDrop}
              onChange={handleDistrictChange}
              className="REM"
              disabled={!selectProvince}
              value={selectDistrict?.id}
            />
            {districtError && (
              <span className="text-red-500 mt-16 pt-2 absolute italic">
                {districtError}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold flex flex-row gap-2">
              Phường/Xã <p className="text-red-500">*</p>
            </h3>
            <Select
              showSearch
              placeholder="Chọn phường/xã"
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={wardDrop}
              onChange={(value) => {
                setSelectWard(wards.find((ward) => ward.id === value) || null);
                setWardError(null);
              }}
              className="REM"
              disabled={!selectDistrict}
              value={selectWard?.id}
            />
            {wardError && (
              <span className="text-red-500 mt-16 pt-2 absolute italic">
                {wardError}
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-1 w-full mt-10">
          <h3 className="font-semibold flex flex-row gap-2">
            Địa chỉ cụ thể (Số nhà, tên đường) <p className="text-red-500">*</p>
          </h3>
          <input
            type="text"
            placeholder="Ví dụ: 123/32 Hòa Bình"
            className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
            onChange={(e) => {
              setDetailAddress(e.target.value);
              setDetailAddressError(null);
            }}
          />
          {detailAddressError && (
            <span className="text-red-500 mt-16 pt-2 absolute italic">
              {detailAddressError}
            </span>
          )}
        </div>

        <div className="w-full flex justify-end gap-3 mt-4">
          <button
            className="font-semibold px-3 py-2 rounded-md hover:opacity-75 duration-200"
            onClick={handleClose}
          >
            HỦY
          </button>
          <button
            className="font-semibold px-5 py-2 text-white bg-black rounded-md hover:opacity-75 duration-200"
            onClick={logAddress}
          >
            XÁC NHẬN
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryAddressModal;
