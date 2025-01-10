import { Checkbox, notification, Select, Spin } from "antd";
import { AxiosError } from "axios";
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
import { privateAxios } from "../../middleware/axiosInstance";
import { LoadingOutlined } from "@ant-design/icons";

interface UserComponentProps {
  userInfo?: UserInfo;
  onClose: () => void;
  refreshAddresses: () => void;
}
const NewAddressForm: React.FC<UserComponentProps> = ({
  userInfo,
  onClose,
  refreshAddresses,
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
  const [name, setName] = useState(userInfo?.name);
  const [phone, setPhone] = useState<string>(userInfo?.phone || "");
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
  const [isLoading, setIsLoading] = useState(false);
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
      console.error("Error fetching provinces:", error);
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

  console.log("district", districtDrop);

  const handleProvinceChange = (value: number) => {
    setDistrictDrop([]);
    const selectedProvince = provinces.find(
      (province: Province) => province.id === value
    );
    setSelectProvince(selectedProvince);
    setSelectDistrict(null);
    setSelectWard(null);
    setDistricts([]);
    setWardDrop([]);
    setProvinceError(null);

    fetchDistricts(value);
  };

  const handleDistrictChange = (value: number) => {
    console.log(value);

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
  const handleSubmit = async () => {
    let isValid = true;

    if (!name) {
      setNameError("Please enter your name.");
      isValid = false;
    } else {
      setNameError(null);
    }

    if (!phone || !/^\d{10}$/.test(phone)) {
      setPhoneError("Số điện thoại phải chứa đúng 10 số.");
      isValid = false;
    } else {
      setPhoneError(null);
    }

    if (!selectProvince) {
      setProvinceError("Vui lòng chọn tỉnh/thành phố.");
      isValid = false;
    } else {
      setProvinceError(null);
    }

    if (!selectDistrict) {
      setDistrictError("Vui lòng chọn quận/huyện.");
      isValid = false;
    } else {
      setDistrictError(null);
    }

    if (!selectWard) {
      setWardError("Vui lòng chọn phường/xã.");
      isValid = false;
    } else {
      setWardError(null);
    }

    if (!detailAddress || detailAddress.trim().length < 1) {
      setDetailAddressError(
        "Vui lòng chọn nhập địa chỉ cụ thể (số nhà, tên đường)."
      );
      isValid = false;
    } else {
      setDetailAddressError(null);
    }

    if (!isValid) return;

    const addressData = {
      fullName: name,
      phone,
      province: selectProvince?.id,
      district: selectDistrict?.id,
      ward: selectWard?.id,
      detailedAddress: detailAddress,
      isDefault,
    };

    setIsLoading(true);

    try {
      const response = await privateAxios.post("/user-addresses", addressData);
      console.log(response);

      openNotificationWithIcon(
        "success",
        "Thành công",
        "Bạn đã thêm địa chỉ mới thành công."
      );
      refreshAddresses();
      setTimeout(() => {
        onClose();
      }, 500);
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
          openNotificationWithIcon(
            "error",
            "Lỗi",
            "Lỗi khi lưu địa chỉ của bạn."
          );
        }
      }
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      {contextHolder}
      <div className="flex flex-col w-full REM px-4 mt-8">
        <div className="w-full flex flex-col md:flex-row justify-between mb-4">
          <h3 className="REM text-xl">THÊM ĐỊA CHỈ GIAO HÀNG MỚI</h3>
          <p className="italic font-light">
            Bạn có thể tạo tối đa 3 địa chỉ giao hàng.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row w-full gap-2 lg:gap-12">
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
                if (e.target.value.length < 11) setPhone(e.target.value);
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
        <div className="flex flex-col lg:flex-row w-full gap-5 mt-8">
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
              value={selectProvince?.id}
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
              value={selectDistrict?.id}
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
                setSelectWard(wards.find((ward) => ward.id === value) || null);
                setWardError(null);
              }}
              className="REM"
              disabled={!selectDistrict}
              value={selectWard?.id}
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
        <div className="flex flex-col md:flex-row w-full justify-between items-stretch md:items-center gap-4 mt-8">
          <div
            className="container items-center flex  gap-3 cursor-pointer"
            onClick={() => setIsDefault(!isDefault)}
          >
            <Checkbox checked={isDefault} />
            <h3 className="text-base">Đặt làm mặc định</h3>
          </div>
          <div className="flex flex-row md:justify-end w-full">
            <button
              key="Cancel"
              className="px-6 py-2 font-bold rounded-2xl bg-gray-400 text-white mr-4"
              onClick={onClose}
            >
              HỦY
            </button>
            <button
              key="Accept"
              className="grow px-6 py-2 font-bold rounded-2xl bg-black text-white"
              onClick={handleSubmit}
            >
              {isLoading ? (
                <Spin indicator={<LoadingOutlined spin />} />
              ) : (
                "XÁC NHẬN"
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewAddressForm;
