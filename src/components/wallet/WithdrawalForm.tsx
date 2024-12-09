/* eslint-disable react-hooks/exhaustive-deps */
import { useMemo, useState } from "react";
import { BaseInterface, UserInfo } from "../../common/base.interface";
import { IconButton } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CurrencySplitter from "../../assistants/Spliter";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Checkbox, message, notification, Select } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";
import SourcesOfFundModal from "./SourcesOfFundModal";
import OTPVerification from "./OTPVerification";

export interface SourceOfFund extends BaseInterface {
  number: string;
  owner: string;
  bankName: string;
  logo: string;
}

export default function WithdrawalForm({
  onBack,
  user,
}: {
  onBack: () => void;
  user: UserInfo;
}) {
  const [amount, setAmount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [sofList, setSofList] = useState<SourceOfFund[]>([]);
  const [selectedSof, setSelectedSof] = useState<string>();

  const [selectSofOptions, setSelectSofOptions] = useState([]);
  const [checkConfirm, setCheckConfirm] = useState<boolean>(false);

  const [isSofModalOpen, setIsSofModalOpen] = useState<boolean>(false);

  const [isVerifyingOTP, setIsVerifyingOTP] = useState<boolean>(false);

  const fetchUserSof = async () => {
    await privateAxios
      .get("sources-of-fund/user")
      .then((res) => {
        console.log(res.data);
        setSofList(res.data);

        setSelectSofOptions(
          res.data.map((sof: SourceOfFund) => {
            return {
              value: JSON.stringify(sof),
              label: sof.number,
            };
          })
        );
      })
      .catch((err) => console.log(err));
  };

  const handleWithdrawing = async () => {
    const sourceOfFund: SourceOfFund = JSON.parse(selectedSof);

    console.log(sourceOfFund);

    await privateAxios
      .post("withdrawal", {
        sourceOfFund: sourceOfFund.id,
        amount,
      })
      .then(() => {
        notification.success({
          key: "withdrawal",
          message: <p>RÚT TIỀN THÀNH CÔNG</p>,
          description: (
            <p>
              Bạn đã thành công rút {CurrencySplitter(amount)}đ về tài khoản
              ngân hàng.
            </p>
          ),
          duration: 5,
        });
        onBack();
      })
      .catch((err) => console.log(err));
  };

  useMemo(() => {
    fetchUserSof();
  }, [user]);

  return (
    <div className="w-full REM">
      <div className="flex flex-col gap-2">
        <IconButton onClick={onBack} className="self-start">
          <ArrowBackIcon />
        </IconButton>
        <p className="text-[1.7em] font-semibold self-center">
          RÚT TIỀN VỀ TÀI KHOẢN NGÂN HÀNG
        </p>

        <div className="w-full max-w-xl m-auto flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <p>Số dư hiện tại:</p>

            <div className="flex items-center">
              <p>
                {isVisible ? (
                  <span>{CurrencySplitter(Number(user.balance))} đ</span>
                ) : (
                  "******** đ"
                )}
              </p>
              <IconButton onClick={() => setIsVisible(!isVisible)}>
                {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
              </IconButton>
            </div>
          </div>

          <div className="w-full flex items-center justify-between gap-2">
            <p>Chọn nguồn tiền:</p>

            {sofList.length > 0 ? (
              <div className="grow flex items-stretch gap-1">
                <Select
                  className="w-full"
                  placeholder={
                    <p className="font-light italic">Chọn nguồn tiền để rút</p>
                  }
                  options={selectSofOptions}
                  optionFilterProp="value"
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                  onChange={(value) => {
                    setSelectedSof(value);
                  }}
                  optionRender={(option) => {
                    const renderValue = JSON.parse(option.value.toString());
                    return (
                      <div className="w-full flex items-center gap-2">
                        <img
                          src={renderValue.logo}
                          alt=""
                          className="w-[3em] rounded-full"
                        />
                        <p className="font-light">
                          ********** {option.label.toString().slice(-4)}
                        </p>
                      </div>
                    );
                  }}
                  labelRender={(props) => {
                    const renderValue = JSON.parse(props.value.toString());
                    return (
                      <div className="w-fit flex items-center gap-2">
                        <img
                          src={renderValue.logo}
                          alt=""
                          className="w-[3em] rounded-full"
                        />
                        {renderValue.bankName} (****
                        {props.label.toString().slice(-4)})
                      </div>
                    );
                  }}
                />

                <button
                  onClick={() => setIsSofModalOpen(true)}
                  className="min-w-fit bg-gray-800 text-white px-2 rounded-md duration-200 hover:bg-gray-700"
                >
                  Quản lý nguồn tiền
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsSofModalOpen(true)}
                className="flex items-center gap-2 px-2 py-1 rounded-md border border-gray-500 font-light duration-200 hover:bg-gray-100"
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
                Thêm tài khoản liên kết
              </button>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <p>Nhập số tiền rút (VND):</p>
            <input
              type="text"
              value={CurrencySplitter(amount)}
              onChange={(e) => {
                const value = e.target.value.replace(/,/g, "");
                if (value.length === 0) setAmount(0);
                if (/^[0-9]*$/.test(value)) {
                  setAmount(Number(value));
                }
              }}
              className="w-full border border-gray-400 p-2 rounded-md"
            />
            {(user.balance < 50000 || amount < 50000) && (
              <p className="text-red-600 font-light italic">
                Sô tiền rút tối thiểu là 50,000đ
              </p>
            )}
            {user.balance < amount && (
              <p className="text-red-600 font-light italic">
                Số dư khả dụng không đủ
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              checked={checkConfirm}
              onChange={() => {
                if (!checkConfirm) {
                  if (amount < 50000 || amount > user.balance || !selectedSof) {
                    message.warning({
                      key: "check",
                      content: (
                        <p className="REM">
                          Vui lòng chọn nguồn tiền và nhập số tiền rút thích
                          hợp!
                        </p>
                      ),
                      duration: 5,
                    });
                    return;
                  }
                }
                setCheckConfirm(!checkConfirm);
              }}
            />
            Xác nhận rút tiền
          </div>
        </div>

        <button
          disabled={
            amount < 50000 ||
            amount > user.balance ||
            !selectedSof ||
            !checkConfirm
          }
          onClick={() => setIsVerifyingOTP(true)}
          className="bg-black text-white text-xl mt-8 mx-auto px-8 py-2 rounded-md font-semibold duration-200 hover:bg-gray-700 disabled:bg-gray-300"
        >
          RÚT TIỀN
        </button>
      </div>

      <SourcesOfFundModal
        isOpen={isSofModalOpen}
        setIsOpen={setIsSofModalOpen}
        sofList={sofList}
        fetchUserSof={fetchUserSof}
      />

      {isVerifyingOTP && (
        <OTPVerification
          user={user}
          isOpen={isVerifyingOTP}
          setIsOpen={setIsVerifyingOTP}
          handleCallback={handleWithdrawing}
        />
      )}
    </div>
  );
}
