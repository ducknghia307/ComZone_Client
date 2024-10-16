import { Select } from "antd";
import axios from "axios";
import React, { useEffect, useState } from "react";
import "./antdCSS.css";

interface Province {
  province: string;
  code: number;
}
interface ProvinceDrop {
  label: string;
  value: number;
}
interface Ward {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
}

interface WardDrop {
  label: string;
  value: number;
}

interface District {
  name: string;
  code: number;
  codename: string;
  division_type: string;
  short_codename: string;
  wards: Ward[];
}

interface DistrictDrop {
  label: string;
  value: number;
}
const NewAddressForm = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [provinceDrop, setProvinceDrop] = useState<ProvinceDrop[]>([]);
  const [selectProvince, setSelectProvince] = useState<Province>();
  const [districts, setDistricts] = useState<District[]>([]);
  const [districtDrop, setDistrictDrop] = useState<DistrictDrop[]>([]);
  const [selectDistrict, setSelectDistrict] = useState<District | null>();
  // const [wards, setWards] = useState<Ward[]>([]);
  // const [wardDrop, wardDrop] = useState<WardDrop[]>([]);
  // const [selectDistrict, setSelectDistrict] = useState<District | null>();
  const token = sessionStorage.getItem("accessToken");
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
        label: district.name,
      }));

      setDistrictDrop(formattedData);
      setDistricts(data);
    } catch (error) {
      console.error("Error fetching provinces:", error);
    }
  };

  useEffect(() => {
    fetchProvinces();
  }, []);
  console.log("district", districtDrop);

  const handleProvinceChange = (value: number) => {
    const selectedProvince = provinces.find(
      (province: Province) => province.code === value
    );
    setSelectProvince(selectedProvince);
    setSelectDistrict(null);
    fetchDistricts(value);
  };
  console.log(selectProvince);

  return (
    <div className="flex flex-col w-full REM px-4 mt-8">
      <div className="flex flex-row w-full gap-12">
        <div className="flex flex-col gap-1 w-full">
          <h3 className="font-semibold">Họ và tên người nhận</h3>
          <input
            type="text"
            placeholder="Ví dụ: Nguyễn Văn A"
            className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="font-semibold">Số điện thoại người nhận</h3>
          <input
            type="text"
            placeholder="Ví dụ: 0987-XXX-XXX"
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
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={provinceDrop}
            onChange={handleProvinceChange}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="font-semibold">Quận/Huyện</h3>
          <Select
            showSearch
            placeholder="Chọn quận/huyện"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={districtDrop}
            onChange={handleProvinceChange}
          />
        </div>
        <div className="flex flex-col gap-1 w-full">
          <h3 className="font-semibold">Phường/Xã</h3>
          <input
            type="text"
            placeholder="Chọn phường/xã"
            className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
          />
        </div>
      </div>
      <div className="flex flex-col gap-1 w-full mt-8">
        <h3 className="font-semibold">Địa chỉ cụ thể (Số nhà, tên đường)</h3>
        <input
          type="text"
          placeholder="Ví dụ: 123/32 Hòa Bình"
          className="placeholder-gray-400 font-light border border-black px-2 py-3 rounded-xl w-full"
        />
      </div>
      <div className="container items-center flex mt-8 gap-3">
        <input type="checkbox" />
        <h3 className="text-base">Đặt làm mặc định</h3>
      </div>
    </div>
  );
};

export default NewAddressForm;
