import React, { useEffect, useRef, useState } from "react";
import { UserInfo } from "../common/base.interface";
import { privateAxios } from "../middleware/axiosInstance";
import { message, Modal, notification } from "antd";
import Loading from "../components/loading/Loading";
import OTPVerification from "../components/wallet/OTPVerification";

export default function ProfileUser({
  setIsLoading,
}: {
  setIsLoading?: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [user, setUser] = useState<UserInfo>();
  const [currentUserData, setCurrentUserData] = useState<UserInfo>();

  const [uploadedAvatar, setUploadedAvatar] = useState<File>();

  const [oldPass, setOldPass] = useState<string>("");
  const [newPass, setNewPass] = useState<string>("");
  const [confirmPass, setConfirmPass] = useState<string>("");

  const [isChangingPass, setIsChangingPass] = useState<boolean>(false);
  const [isChangingPhone, setIsChangingPhone] = useState<boolean>(false);

  const avatarInputRef = useRef<HTMLInputElement>();

  const [api, contextHolder] = notification.useNotification();

  const isChanged =
    currentUserData &&
    user &&
    (currentUserData.name !== user.name ||
      currentUserData.avatar !== user.avatar ||
      currentUserData.phone !== user.phone);

  const fetchUserInfo = async () => {
    await privateAxios
      .get("users/profile")
      .then((res) => {
        setUser(res.data);
        setCurrentUserData(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleUploadAvatar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedAvatar(e.target.files[0]);

      setCurrentUserData({
        ...currentUserData,
        avatar: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  const handleUpdateInfo = async () => {
    setIsLoading(true);

    let newAvatar = user.avatar;
    if (uploadedAvatar) {
      await privateAxios
        .post(
          "file/upload/image",
          {
            image: uploadedAvatar,
          },
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        )
        .then((res) => {
          newAvatar = res.data.imageUrl;
        });
    }

    await privateAxios
      .patch("users/profile", {
        name: currentUserData.name,
        avatar: newAvatar,
      })
      .then(() => {
        setUploadedAvatar(undefined);

        fetchUserInfo();
        api.success({
          key: "info",
          message: "Cập nhật thông tin tài khoản thành công.",
          duration: 5,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleChangePassword = async () => {
    if (newPass.length < 8 || newPass.length > 20) {
      message.warning({
        key: "pass",
        content: (
          <p className="REM">
            Mật khẩu phải chứa từ 8-20 kí tự. Vui lòng thử lại!
          </p>
        ),
        duration: 5,
      });

      return;
    }

    if (newPass !== confirmPass) {
      message.warning({
        key: "pass",
        content: (
          <p className="REM">
            Mật khẩu mới không trùng khớp. Vui lòng thử lại!
          </p>
        ),
        duration: 5,
      });

      return;
    }

    setIsLoading(true);

    await privateAxios
      .patch("auth/change-password", {
        oldPassword: oldPass,
        newPassword: newPass,
      })
      .then(() => {
        fetchUserInfo();
        api.success({
          key: "password",
          message: "Thay đổi mật khẩu thành công.",
          duration: 5,
        });
        reset();
        setIsChangingPass(false);
      })
      .catch((err) => {
        if (err.response.status === 400)
          message.warning({
            key: "pass",
            content: (
              <p className="REM">
                Mật khẩu hiện tại không chính xác. Vui lòng thử lại!
              </p>
            ),
            duration: 5,
          });
        else console.log(err);
      })
      .finally(() => setIsLoading(false));
  };

  const handleUpdatePhone = async () => {
    setIsLoading(true);

    await privateAxios
      .patch("users/phone/verify", {
        phone: currentUserData.phone,
      })
      .then(() => {
        fetchUserInfo();
        setIsChangingPhone(false);
        api.success({
          key: "phone",
          message: "Cập nhật số điện thoại thành công.",
          duration: 5,
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const reset = () => {
    setOldPass("");
    setNewPass("");
    setConfirmPass("");
  };

  if (!user) return;

  return (
    <div className="REM w-full bg-white flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 sm:gap-8 p-8">
      {contextHolder}

      <div className="flex flex-col items-stretch justify-start gap-4">
        <img
          src={currentUserData.avatar}
          alt="avatar"
          className="w-[7em] sm:w-[10em] aspect-square rounded-full p-2 object-cover mx-auto"
        />

        <button
          onClick={() => {
            if (avatarInputRef) avatarInputRef.current.click();
          }}
          className="flex items-center justify-center gap-2 border border-gray-500 rounded-md p-1 duration-200 hover:bg-gray-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
          >
            <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM13 9V16H11V9H6L12 3L18 9H13Z"></path>
          </svg>
          Tải ảnh lên
        </button>

        <input
          ref={avatarInputRef}
          type="file"
          accept="image/png, image/gif, image/jpeg"
          hidden
          onChange={handleUploadAvatar}
        />
      </div>

      <div className="basis-full sm:basis-1/3 flex flex-col items-stretch justify-center gap-2">
        <div className="flex flex-col items-start">
          <p className="font-light">Email:</p>
          <input
            type="text"
            value={currentUserData.email}
            disabled
            className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
          />
        </div>

        <div className="flex flex-col items-start">
          <p className="font-light">Số điện thoại:</p>
          <div className="w-full relative">
            <input
              type="text"
              placeholder="Số điện thoại"
              value={currentUserData.phone}
              onChange={(e) => {
                if (e.target.value.length === 0)
                  setCurrentUserData({
                    ...currentUserData,
                    phone: "",
                  });
                if (
                  e.target.value.length < 13 &&
                  /^[0-9]+$/.test(e.target.value)
                )
                  setCurrentUserData({
                    ...currentUserData,
                    phone: e.target.value,
                  });
              }}
              className="w-full p-2 border border-gray-300 rounded-md"
            />

            <button
              disabled={
                currentUserData.phone === user.phone ||
                currentUserData.phone.length === 0
              }
              onClick={() => {
                if (/^(0[3|5|7|8|9])[0-9]{8}$/.test(currentUserData.phone))
                  setIsChangingPhone(true);
                else {
                  message.warning({
                    key: "phone",
                    content: (
                      <p className="REM">
                        Số điện thoại không hợp lệ. Vui lòng thử lại!
                      </p>
                    ),
                    duration: 5,
                  });
                }
              }}
              className={`${
                (!currentUserData.phone ||
                  currentUserData.phone.length === 0) &&
                "hidden"
              } absolute top-1/2 right-1 -translate-y-1/2 px-2 py-1 rounded-md bg-white border border-gray-500 duration-200 hover:bg-gray-100 disabled:border-green-600 disabled:hover:bg-white`}
            >
              {currentUserData.phone === user.phone ||
              currentUserData.phone.length === 0 ? (
                <span className="flex items-center gap-1 text-green-600">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                  </svg>
                  Đã xác thực
                </span>
              ) : (
                "Cập nhật"
              )}
            </button>

            {isChangingPhone && (
              <OTPVerification
                user={user}
                isOpen={isChangingPhone}
                setIsOpen={setIsChangingPhone}
                handleCallback={handleUpdatePhone}
                phoneNumber={currentUserData.phone}
              />
            )}
          </div>
        </div>

        <div className="flex flex-col items-start">
          <p className="font-light">Tên người dùng:</p>
          <input
            type="text"
            value={currentUserData.name}
            onChange={(e) =>
              setCurrentUserData({ ...currentUserData, name: e.target.value })
            }
            className="w-full p-2 border border-gray-300 rounded-md disabled:bg-gray-100"
          />
        </div>
        <button
          onClick={() => {
            if (isChanged) handleUpdateInfo();
            else setIsChangingPass(true);
          }}
          className="mt-4 py-2 border border-gray-300 rounded-md bg-gray-900 text-white duration-200 hover:bg-gray-700 capitalize"
        >
          {isChanged ? "Cập nhật thông tin" : "Thay đổi mật khẩu"}
        </button>

        <button
          onClick={() => setCurrentUserData(user)}
          className={`${
            !isChanged && "invisible"
          } rounded-md border border-gray-300 py-1 duration-200 hover:bg-gray-100`}
        >
          Đặt lại
        </button>

        <Modal
          open={isChangingPass}
          onCancel={(e) => {
            e.stopPropagation();
            reset();
            setIsChangingPass(false);
          }}
          centered
          width={"auto"}
          footer={null}
        >
          <div className="REM w-full min-w-[30em] flex flex-col items-stretch gap-4">
            <p className="font-semibold text-xl uppercase">Thay Đổi Mật Khẩu</p>

            <div className="w-full flex flex-col items-stretch gap-1">
              <p>Mật khẩu hiện tại:</p>
              <input
                type="password"
                placeholder="Nhập mật khẩu hiện tại"
                value={oldPass}
                onChange={(e) => setOldPass(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="w-full flex flex-col items-stretch gap-1">
              <p>Mật khẩu mới:</p>
              <input
                type="password"
                placeholder="Nhập mật khẩu mới"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <div className="w-full flex flex-col items-stretch gap-1">
              <p>Xác nhận mật khẩu:</p>
              <input
                type="password"
                placeholder="Xác nhận mật khẩu mới"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="border border-gray-300 p-2 rounded-md"
              />
            </div>

            <button
              disabled={
                oldPass.length === 0 ||
                newPass.length === 0 ||
                confirmPass.length === 0
              }
              onClick={handleChangePassword}
              className="py-2 rounded-md bg-sky-800 text-white duration-200 hover:bg-sky-900 disabled:bg-gray-300"
            >
              Đổi Mật Khẩu
            </button>
          </div>
        </Modal>
      </div>
    </div>
  );
}
