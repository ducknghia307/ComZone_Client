import { Modal, notification, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import { SourceOfFund } from "./WithdrawalForm";
import axios from "axios";
import { privateAxios } from "../../middleware/axiosInstance";

export default function SourcesOfFundModal({
  isOpen,
  setIsOpen,
  sofList,
  fetchUserSof,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  sofList: SourceOfFund[];
  fetchUserSof: () => void;
}) {
  const [isCreatingSof, setIsCreatingSof] = useState<boolean>(false);
  const [bankList, setBankList] = useState([]);
  const [selectedBank, setSelectedBank] = useState();
  const [bankAccountNumber, setBankAccountNumber] = useState("");
  const [owner, setOwner] = useState("");

  useMemo(() => {
    axios
      .get("https://api.vietqr.io/v2/banks")
      .then((res) => {
        const banksRes: any[] = res.data.data;
        setBankList(
          banksRes.map((bank) => {
            return {
              label: bank.name,
              value: JSON.stringify({ logo: bank.logo, name: bank.shortName }),
            };
          })
        );
      })
      .catch((err) => console.log(err));
  }, []);

  const createSourceOfFund = async () => {
    const bankInfo = JSON.parse(selectedBank);

    await privateAxios
      .post("sources-of-fund", {
        number: bankAccountNumber,
        owner,
        bankName: bankInfo.name,
        logo: bankInfo.logo,
      })
      .then(() => {
        notification.success({
          key: "sof",
          message: "Liên kết thành công",
          description:
            "Tài khoản ngân hàng của bạn đã được liên kết thành công để thực hiện rút tiền.",
          duration: 5,
        });
        fetchUserSof();
        setIsCreatingSof(false);
      })
      .catch((err) => console.log(err));
  };

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen(false);
      }}
      centered
      footer={null}
    >
      <div className="REM flex flex-col gap-4">
        <div className="flex flex-col">
          <p className="flex items-center gap-2 text-[1.5em] font-semibold">
            {isCreatingSof && (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                onClick={() => setIsCreatingSof(false)}
              >
                <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
              </svg>
            )}
            {isCreatingSof ? "LIÊN KẾT NGUỒN TIỀN" : "QUẢN LÝ NGUỒN TIỀN"}
          </p>
          <p className="font-light text-sm italic">
            Bạn có thể liên kết tối đa 3 nguồn tiền.
          </p>
        </div>

        {isCreatingSof ? (
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <p className="font-light">
                Chọn ngân hàng liên kết: <span className="text-red-600">*</span>
              </p>
              <Select
                showSearch
                placeholder={<p className="text-sm REM">Chọn ngân hàng...</p>}
                allowClear
                options={bankList}
                optionFilterProp="value"
                filterSort={(optionA, optionB) =>
                  (optionA?.label ?? "")
                    .toLowerCase()
                    .localeCompare((optionB?.label ?? "").toLowerCase())
                }
                onChange={(value) => {
                  setOwner("");
                  setBankAccountNumber("");
                  setSelectedBank(value);
                }}
                optionRender={(option) => {
                  const renderValue = JSON.parse(option.value.toString());
                  return (
                    <div className="flex items-center gap-2">
                      <img
                        src={renderValue.logo}
                        alt=""
                        className="w-[3em] rounded-full"
                      />
                      {option.label}
                    </div>
                  );
                }}
                labelRender={(props) => {
                  const renderValue = JSON.parse(props.value.toString());
                  return (
                    <div className="flex items-center gap-2">
                      <img
                        src={renderValue.logo}
                        alt=""
                        className="w-[3em] rounded-full"
                      />
                      {renderValue.name}
                    </div>
                  );
                }}
                notFoundContent={
                  <p className="font-light">Không tìm thấy ngân hàng</p>
                }
              />
            </div>

            {selectedBank && (
              <>
                <div className="flex flex-col gap-2">
                  <p className="font-light">
                    Nhập số thẻ / số tài khoản:{" "}
                    <span className="text-red-600">*</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Số tài khoản hoặc số thẻ"
                    value={bankAccountNumber}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value.length === 0) setBankAccountNumber("");
                      if (/^[0-9]*$/.test(value) && value.length < 21) {
                        setBankAccountNumber(value);
                      }
                    }}
                    className="w-full border border-gray-400 font-light px-2 py-1 rounded-md"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <p className="font-light">
                    Nhập tên chủ thẻ / tài khoản (không dấu):{" "}
                    <span className="text-red-600">*</span>
                  </p>
                  <input
                    type="text"
                    placeholder="Tên chủ tài khoản hoặc thẻ"
                    value={owner}
                    onChange={(e) => {
                      if (e.target.value.length === 0) setOwner("");
                      if (/^[0-9]*$/.test(e.target.value)) return;
                      setOwner(e.target.value.toUpperCase());
                    }}
                    className="w-full border border-gray-400 font-light px-2 py-1 rounded-md"
                  />
                </div>

                <button
                  disabled={
                    !selectedBank ||
                    bankAccountNumber.length < 8 ||
                    owner.length === 0
                  }
                  onClick={createSourceOfFund}
                  className="w-full mt-4 py-2 rounded-md text-white bg-sky-700 duration-200 hover:bg-sky-800 disabled:bg-gray-300"
                >
                  LIÊN KẾT NGUỒN TIỀN
                </button>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-stretch gap-2">
            {sofList.map((sof) => (
              <div
                key={sof.id}
                className="flex items-center gap-2 p-4 font-light border border-gray-300 rounded-md"
              >
                <img src={sof.logo} alt="" className="w-[5em]" />
                <span className="flex flex-col">
                  <p className="font-semibold uppercase">{sof.bankName}</p>
                  <p className="font-light">
                    ********** {sof.number.slice(-4)}
                  </p>
                </span>
              </div>
            ))}
            {sofList.length < 3 && (
              <button
                onClick={() => setIsCreatingSof(true)}
                className="flex items-center gap-2 p-4 font-light border border-gray-300 rounded-md duration-200 hover:bg-gray-100"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="24"
                  height="24"
                  fill="currentColor"
                >
                  <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
                </svg>
                Thêm tài khoản ngân hàng liên kết
              </button>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
