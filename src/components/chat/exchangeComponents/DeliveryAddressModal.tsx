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
import { ExchangeRequest } from "../../../common/interfaces/exchange-request.interface";

interface DeliveryAddressModalProps {
  isDeliveryModal: boolean;
  setDeliveryModal: Dispatch<SetStateAction<boolean>>;
  exchangeRequest: ExchangeRequest;
}

const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({
  isDeliveryModal,
  setDeliveryModal,
  exchangeRequest,
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
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState<string | null>(null);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState<string | null>(null);

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

  useEffect(() => {
    fetchProvinces();
  }, []);

  const handleSubmitAddress = () => {
    let hasError = false;

    if (!name.trim()) {
      setNameError("Vui lòng nhập họ tên người nhận");
      hasError = true;
    }

    if (!phone.trim()) {
      setPhoneError("Vui lòng nhập số điện thoại");
      hasError = true;
    } else if (!/^[0-9]{10}$/.test(phone)) {
      setPhoneError("Số điện thoại không hợp lệ");
      hasError = true;
    }

    if (!selectProvince) {
      setProvinceError("Vui lòng chọn tỉnh/thành phố");
      hasError = true;
    }

    if (!selectDistrict) {
      setDistrictError("Vui lòng chọn quận/huyện");
      hasError = true;
    }

    if (!selectWard) {
      setWardError("Vui lòng chọn phường/xã");
      hasError = true;
    }

    if (!detailAddress.trim()) {
      setDetailAddressError("Vui lòng nhập địa chỉ cụ thể");
      hasError = true;
    }

    if (!hasError) {
      const dataPayload = {
        name: name,
        phone,
        province: selectProvince?.id,
        district: selectDistrict?.id,
        ward: selectWard?.id,
        detailAddress,
      };
      // console.log(dataPayload);

      // const resDeliveryInfo = await privateAxios.post("/delivery-information", dataPayload)
    }
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
        <div className="flex flex-row w-full gap-12">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold flex flex-row gap-2">
              Họ và tên người nhận <p className="text-red-500">*</p>
            </h3>
            <input
              type="text"
              placeholder="Ví dụ: Nguyễn Văn A"
              className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setNameError(null);
              }}
            />
            {nameError && (
              <span className="text-red-500  top-1">{nameError}</span>
            )}
          </div>
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold flex flex-row gap-2">
              Số điện thoại người nhận <p className="text-red-500">*</p>
            </h3>
            <input
              type="text"
              placeholder="Ví dụ: 0987XXXXXX"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                setPhoneError(null);
              }}
              className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
            />
            {phoneError && (
              <span className="text-red-500 mt-20 absolute italic">
                {phoneError}
              </span>
            )}
          </div>
        </div>
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
            onClick={handleSubmitAddress}
          >
            XÁC NHẬN
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeliveryAddressModal;
