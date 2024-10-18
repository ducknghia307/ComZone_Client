import { notification, Select } from "antd";
import axios, { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import "./antdCSS.css";
import {
  District,
  DistrictDrop,
  ProvinceDrop,
  UserInfo,
  Ward,
  WardDrop,
} from "../../common/base.interface";
import { Province } from "../../common/base.interface";

interface UserComponentProps {
  userInfo: UserInfo;
  onClose: () => void;
}
const NewAddressForm: React.FC<UserComponentProps> = ({
  userInfo,
  onClose,
}) => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [provinceDrop, setProvinceDrop] = useState<ProvinceDrop[]>([]);
  const [selectProvince, setSelectProvince] = useState<Province | null>(); //
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtDrop, setDistrictDrop] = useState<DistrictDrop[]>([]);
  const [selectDistrict, setSelectDistrict] = useState<District | null>(); //
  const [wards, setWards] = useState<Ward[]>([]);
  const [wardDrop, setWardDrop] = useState<WardDrop[]>([]);
  const [selectWard, setSelectWard] = useState<Ward | null>(null); //
  const token = sessionStorage.getItem("accessToken");
  const [name, setName] = useState(userInfo.name);
  const [phone, setPhone] = useState<string>(userInfo.phone || "");
  const [detailAddress, setDetailAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const [provinceError, setProvinceError] = useState<string | null>(null);
  const [districtError, setDistrictError] = useState<string | null>(null);
  const [wardError, setWardError] = useState<string | null>(null);
  const [detailAddressError, setDetailAddressError] = useState<string | null>(
    null
  );

  const [api, contextHolder] = notification.useNotification();
  type NotificationType = "success" | "info" | "warning" | "error";
  const openNotificationWithIcon = (
    type: NotificationType,
    message: string,
    description: string
  ) => {
    api[type]({
      message: message,
      description: description,
    });
  };

  const fetchProvinces = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/viet-nam-address/provinces",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      const formattedData = data.map((province: Province) => ({
        value: province.code,
        label: province.province,
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
      const response = await axios.get(
        `http://localhost:3000/viet-nam-address/districts/${value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = response.data;
      const formattedData = data.map((district: District) => ({
        value: district.code,
        label: district.district,
      }));

      setDistrictDrop(formattedData);
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  const fetchWards = async (districtCode: number) => {
    if (!districtCode) return;
    try {
      const response = await axios.get(
        `http://localhost:3000/viet-nam-address/wards/${districtCode}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      const formattedData = data.map((ward: Ward) => ({
        value: ward.code,
        label: ward.ward,
      }));
      setWardDrop(formattedData);
      setWards(data);
    } catch (error) {
      console.error("Error fetching wards:", error);
    }
  };

  console.log("district", districtDrop);

  const handleProvinceChange = (value: number) => {
    setDistrictDrop([]);
    const selectedProvince = provinces.find(
      (province: Province) => province.code === value
    );
    setSelectProvince(selectedProvince);
    setSelectDistrict(null);
    setDistricts([]);
    setWardDrop([]);
    setProvinceError(null);

    fetchDistricts(value);
  };

  const handleDistrictChange = (value: number) => {
    console.log(value);

    const selectedDistrict = districts.find(
      (district: District) => district.code === value
    );
    setSelectDistrict(selectedDistrict || null);
    setSelectWard(null);
    setWardDrop([]);
    setDistrictError(null);
    if (selectProvince && selectedDistrict) {
      fetchWards(selectedDistrict.code);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);
  const handleSubmit = async () => {
    let isValid = true;

    if (!name) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      setPhoneError("Phone number must be 10 digits.");
      isValid = false;
    } else {
      setPhoneError(null);
    }

    if (!selectProvince) {
      setProvinceError("Please choose a province.");
      isValid = false;
    } else {
      setProvinceError(null);
    }

    if (!selectDistrict) {
      setDistrictError("Please choose a district.");
      isValid = false;
    } else {
      setDistrictError(null);
    }

    if (!selectWard) {
      setWardError("Please choose a ward.");
      isValid = false;
    } else {
      setWardError(null);
    }

    if (!detailAddress) {
      setDetailAddressError("Please fill in the detailed address.");
      isValid = false;
    } else {
      setDetailAddressError(null);
    }

    if (!isValid) return;

    const addressData = {
      fullName: name,
      phone,
      province: selectProvince?.province,
      district: selectDistrict?.district,
      ward: selectWard?.ward,
      detailedAddress: detailAddress,
      isDefault,
    };
    console.log(addressData);

    try {
      const response = await axios.post(
        "http://localhost:3000/user-addresses",
        addressData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Address saved successfully:", response.data);
      openNotificationWithIcon(
        "success",
        "Success",
        "Address saved successfully."
      );
      window.location.reload();
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        if (statusCode === 409) {
          openNotificationWithIcon(
            "error",
            "Trùng địa chỉ",
            "Địa chỉ này đã tồn tại."
          );
        } else if (statusCode === 403) {
          openNotificationWithIcon(
            "error",
            "Không thể thêm địa chỉ",
            "Bạn đã có 3 địa chỉ. Nếu muốn thêm hãy xóa 1 địa chỉ."
          );
        } else {
          // Handle errors without a response (e.g., network errors)
          console.error("Error saving address:", error);
          openNotificationWithIcon(
            "error",
            "Error",
            "Failed to save the address."
          );
        }
      }
    }
  };
  return (
    <>
      {contextHolder}
      <div className="flex flex-col w-full REM px-4 mt-8">
        <div className="w-full flex flex-row justify-between mb-4">
          <h3 className="REM text-xl">THÊM ĐỊA CHỈ GIAO HÀNG MỚI</h3>
          <p className="italic font-light">
            Bạn có thể tạo tối đa 3 địa chỉ giao hàng.
          </p>
        </div>
        <div className="flex flex-row w-full gap-12">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Họ và tên người nhận</h3>
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
            <h3 className="font-semibold">Số điện thoại người nhận</h3>
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
        <div className="flex flex-row w-full gap-5 mt-8">
          <div className="flex flex-col gap-1 w-full">
            <h3 className="font-semibold">Tỉnh/Thành phố</h3>
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
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={districtDrop}
              onChange={handleDistrictChange}
              className="REM"
              disabled={!selectProvince}
            />
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
              filterOption={(input, option) =>
                (option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={wardDrop}
              onChange={(value) => {
                setSelectWard(
                  wards.find((ward) => ward.code === value) || null
                );
                setWardError(null);
              }}
              className="REM"
              disabled={!selectDistrict}
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
            onChange={(e) => {
              setDetailAddress(e.target.value);
              setDetailAddressError(null);
            }}
          />
          {detailAddressError && (
            <span className="text-red-500 mt-16 pt-2 absolute italic ">
              {detailAddressError}
            </span>
          )}
        </div>
        <div className="container items-center flex mt-8 gap-3">
          <input type="checkbox" onChange={() => setIsDefault(!isDefault)} />
          <h3 className="text-base">Đặt làm mặc định</h3>
        </div>
        <div className="flex flex-row justify-end w-full">
          <button
            key="Cancel"
            className="px-6 py-2 font-bold rounded-2xl bg-gray-400 text-white mr-4"
            onClick={onClose}
          >
            HỦY
          </button>
          <button
            key="Accept"
            className="px-6 py-2 font-bold rounded-2xl bg-black text-white"
            onClick={handleSubmit}
          >
            XÁC NHẬN
          </button>
        </div>
      </div>
    </>
  );
};

export default NewAddressForm;
