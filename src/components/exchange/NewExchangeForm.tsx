import { InputNumber, Radio, RadioChangeEvent, Select } from "antd";
import React, { useState } from "react";

const NewExchangeForm = () => {
  const [used, setUsed] = useState(1);
  const [quantity, setQuantity] = useState(1);
  const [newComicRes, setNewComicRes] = useState(false);
  const onUsedChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setUsed(e.target.value);
  };
  const onQuantityChange = (e: RadioChangeEvent) => {
    console.log("radio checked", e.target.value);
    setQuantity(e.target.value);
  };

  return (
    <div className="w-full flex flex-col">
      {newComicRes && (
        <div className="w-full border-2 rounded-md flex flex-col">
          <div className="flex flex-row w-full gap-5">
            <div className="flex flex-col w-1/5 p-4">
              <div className="border-2 rounded-md bg-gray-300 h-60 w-full"></div>
              <p className="text-green-700 text-[7px] italic max-w-52 text-center mt-2">
                * Lời khuyên: Đính kèm 1 hình ảnh để truyện dễ được nhận dạng
                hơn.
              </p>
            </div>
            <div className="flex flex-col w-5/6 justify-center gap-7">
              <input
                type="text"
                name=""
                id=""
                placeholder="Tựa đề của truyện..."
                className="py-2 border-b-2 px-2 w-[20em] border-black"
              />
              <div className="flex flex-row w-full  gap-5">
                <div className="w-1/2">
                  <div className="flex flex-row gap-1">
                    <h2 className="font-sm">Tác giả:</h2>
                    <p className="text-red-500">*</p>
                  </div>
                  <input
                    type="text"
                    className="border border-gray-300 rounded-lg mt-2 p-2 min-w-[20em]"
                  />
                </div>
                <div className="w-1/2">
                  <div className="flex flex-row gap-1">
                    <h2 className="font-sm">Phiên bản:</h2>
                    <p className="text-red-500">*</p>
                  </div>
                  <Select
                    size="large"
                    defaultValue="REGULAR"
                    style={{
                      width: 300,
                      borderRadius: 9,
                    }}
                    options={[
                      { value: "REGULAR", label: "Phiên bản thường" },
                      { value: "SPECIAL", label: "Phiên bản đặc biệt" },
                      { value: "LIMITTED", label: "Phiên bản giới hạn" },
                    ]}
                    className="mt-2 border-1 "
                  />
                </div>
              </div>
              <div className="flex flex-row gap-5 w-full">
                <div className="flex flex-col w-1/2">
                  <div className="flex flex-row">
                    <h2 className="font-sm">Tình trạng tối thiểu:</h2>
                    <p className="text-red-500">*</p>
                  </div>
                  <div className="flex flex-row w-full mt-4">
                    <Radio.Group value={used} onChange={onUsedChange}>
                      <Radio value={1}>Đã qua sử dụng</Radio>
                      <Radio value={2}>Còn nguyên seal</Radio>
                    </Radio.Group>
                  </div>
                </div>
                <div className="flex flex-col w-1/2">
                  <div className="flex flex-row">
                    <h2 className="font-sm">Tình trạng tối thiểu:</h2>
                    <p className="text-red-500">*</p>
                  </div>
                  <div className="flex flex-row w-full items-center mt-4">
                    <Radio.Group value={quantity} onChange={onQuantityChange}>
                      <Radio value={1}>Truyện lẻ</Radio>
                      <Radio value={2}>Bộ truyện</Radio>
                    </Radio.Group>
                    {quantity === 2 && (
                      <div className="flex flex-row items-center">
                        <h2 className="font-sm">Số lượng:</h2>
                        <p className="text-red-500 mr-2">*</p>
                        <InputNumber
                          min={2}
                          max={10}
                          defaultValue={2}
                          className="w-12 absolute right-14"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full flex justify-end py-2 px-14">
            <button
              className="px-14 py-2 font-bold border border-black rounded-lg hover:opacity-70 duration-200"
              onClick={() => setNewComicRes(!newComicRes)}
            >
              XONG
            </button>
          </div>
        </div>
      )}
      {!newComicRes && (
        <div className="w-full flex items-start">
          <button
            className="px-3 py-1 border-2 rounded-md flex items-center hover:opacity-70 duration-200 gap-2"
            onClick={() => setNewComicRes(!newComicRes)}
          >
            <p className="text-2xl font-light opacity-55">+</p>
            <p className="text-base font-light opacity-55">Thêm</p>
          </button>
        </div>
      )}
    </div>
  );
};

export default NewExchangeForm;
