import React, { useEffect, useRef, useState } from "react";
import { SellerDetails, UserInfo } from "../../../common/base.interface";
import { Avatar } from "antd";
import { SellerComicsData, SellerOrdersData } from "../ShopInfo";

export default function SellerDetailsSection({
  user,
  sellerDetails,
  sellerComicsData,
  sellerOrdersData,
  totalFeedback,
  averageRating,
}: {
  user: UserInfo;
  sellerDetails: SellerDetails;
  sellerComicsData: SellerComicsData;
  sellerOrdersData: SellerOrdersData;
  totalFeedback: number;
  averageRating: number;
}) {
  const [newUserInfo, setNewUserInfo] = useState<UserInfo>();
  const [newSellerDetails, setNewSellerDetails] = useState<SellerDetails>();

  const [uploadedAvatarFile, setUploadedAvatarFile] = useState<File>();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [isShowingExtended, setIsShowingExtended] = useState<
    "COMICS" | "ORDERS"
  >();

  const uploadInputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    setNewUserInfo(user);
    setNewSellerDetails(sellerDetails);
  }, [user, sellerDetails]);

  if (!newUserInfo || !newSellerDetails) return;

  return (
    <div className="w-full flex flex-col gap-4">
      <p className="text-2xl font-semibold">THÔNG TIN SHOP</p>

      <div className="flex items-stretch gap-2">
        <span className="relative">
          <Avatar src={newUserInfo.avatar} alt="" size={96} />
          {isEditing && (
            <>
              <button
                onClick={() => {
                  uploadInputRef.current.click();
                }}
                className="absolute -bottom-2 left-1/2 bg-white rounded-full p-1 -translate-x-1/2 hover:ring-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M4 19H20V12H22V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V12H4V19ZM14 9V15H10V9H5L12 2L19 9H14Z"></path>
                </svg>
              </button>

              <input
                ref={uploadInputRef}
                type="file"
                accept="image/png, image/gif, image/jpeg"
                hidden
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    setNewUserInfo({
                      ...newUserInfo,
                      avatar: URL.createObjectURL(e.target.files[0]),
                    });
                    setUploadedAvatarFile(e.target.files[0]);
                  }
                }}
              />
            </>
          )}
        </span>

        <div className="flex flex-col justify-center gap-2">
          <p>
            {isEditing ? (
              <input
                value={newUserInfo.name}
                onChange={(e) =>
                  setNewUserInfo({ ...newUserInfo, name: e.target.value })
                }
                className="text-lg p-1 border border-gray-400 rounded-md"
              />
            ) : (
              <p className="font-semibold text-lg p-1">{user.name}</p>
            )}
          </p>

          <div className="w-full flex items-stretch justify-center gap-4">
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                if (isEditing) {
                  setNewUserInfo(user);
                  setNewSellerDetails(sellerDetails);
                }
              }}
              className="font-light text-sm underline hover:font-semibold"
            >
              {isEditing ? "Hủy thay đổi" : "Chỉnh sửa"}
            </button>
            {isEditing && (
              <button
                onClick={() => {}}
                className="text-sm underline text-sky-800 hover:font-semibold"
              >
                Lưu
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2 px-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-light text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
              className="-translate-y-0.5"
            >
              <path d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"></path>
            </svg>
            Địa chỉ:
          </div>
          <p>{sellerDetails.province.name}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-light text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H14C14.5523 21 15 20.5523 15 20V15.2973L15.9995 19.9996C16.1143 20.5398 16.6454 20.8847 17.1856 20.7699L21.0982 19.9382C21.6384 19.8234 21.9832 19.2924 21.8684 18.7522L18.9576 5.0581C18.8428 4.51788 18.3118 4.17304 17.7716 4.28786L14.9927 4.87853C14.9328 4.38353 14.5112 4 14 4H10C10 3.44772 9.55228 3 9 3H4ZM10 6H13V14H10V6ZM10 19V16H13V19H10ZM8 5V15H5V5H8ZM8 17V19H5V17H8ZM17.3321 16.6496L19.2884 16.2338L19.7042 18.1898L17.7479 18.6057L17.3321 16.6496ZM16.9163 14.6933L15.253 6.86789L17.2092 6.45207L18.8726 14.2775L16.9163 14.6933Z"></path>
            </svg>
            Tổng số truyện:
          </div>

          <span className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isShowingExtended !== "COMICS")
                  setIsShowingExtended("COMICS");
                else setIsShowingExtended(undefined);
              }}
            >
              {isShowingExtended === "COMICS" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                </svg>
              )}
            </button>

            <p className="font-semibold">{sellerComicsData.total || 0}</p>
          </span>
        </div>

        {isShowingExtended === "COMICS" && (
          <div className="flex items-center justify-between pl-4">
            <p className="text-sm font-light">
              Tổng số truyện đang bán hoặc đấu giá:
            </p>
            <p className="font-semibold">
              {sellerComicsData.totalAvailable || 0}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-light text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M12 1L21.5 6.5V17.5L12 23L2.5 17.5V6.5L12 1ZM5.49388 7.0777L12.0001 10.8444L18.5062 7.07774L12 3.311L5.49388 7.0777ZM4.5 8.81329V16.3469L11.0001 20.1101V12.5765L4.5 8.81329ZM13.0001 20.11L19.5 16.3469V8.81337L13.0001 12.5765V20.11Z"></path>
            </svg>
            Tổng số đơn hàng:
          </div>

          <span className="flex items-center gap-2">
            <button
              onClick={() => {
                if (isShowingExtended !== "ORDERS")
                  setIsShowingExtended("ORDERS");
                else setIsShowingExtended(undefined);
              }}
            >
              {isShowingExtended === "ORDERS" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M11.9999 10.8284L7.0502 15.7782L5.63599 14.364L11.9999 8L18.3639 14.364L16.9497 15.7782L11.9999 10.8284Z"></path>
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="16"
                  height="16"
                  fill="currentColor"
                >
                  <path d="M11.9999 13.1714L16.9497 8.22168L18.3639 9.63589L11.9999 15.9999L5.63599 9.63589L7.0502 8.22168L11.9999 13.1714Z"></path>
                </svg>
              )}
            </button>

            <p className="font-semibold">{sellerOrdersData.total || 0}</p>
          </span>
        </div>

        {isShowingExtended === "ORDERS" && (
          <div className="flex flex-col pl-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-light">
                Tổng số đơn hàng đang thực hiện:
              </p>
              <p className="font-semibold">
                {sellerOrdersData.totalOngoing || 0}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm font-light">
                Tổng số đơn hàng đã hoàn tất:
              </p>
              <p className="font-semibold">
                {sellerOrdersData.totalSuccessful || 0}
              </p>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 font-light text-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M4 2H20C20.5523 2 21 2.44772 21 3V22.2763C21 22.5525 20.7761 22.7764 20.5 22.7764C20.4298 22.7764 20.3604 22.7615 20.2963 22.7329L12 19.0313L3.70373 22.7329C3.45155 22.8455 3.15591 22.7322 3.04339 22.4801C3.01478 22.4159 3 22.3465 3 22.2763V3C3 2.44772 3.44772 2 4 2ZM19 19.9645V4H5V19.9645L12 16.8412L19 19.9645ZM12 13.5L9.06107 15.0451L9.62236 11.7725L7.24472 9.45492L10.5305 8.97746L12 6L13.4695 8.97746L16.7553 9.45492L14.3776 11.7725L14.9389 15.0451L12 13.5Z"></path>
            </svg>
            Số đánh giá:
          </div>
          <p className="font-semibold">{totalFeedback}</p>
        </div>

        {totalFeedback > 0 && (
          <div className="flex items-center justify-between">
            <p className="font-light text-sm">Đánh giá trung bình: </p>
            <p className="flex items-center gap-1 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="#fcdb03"
              >
                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
              </svg>
              {averageRating}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
