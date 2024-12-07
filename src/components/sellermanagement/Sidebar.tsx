import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import "../ui/SellerCreateComic.css";
import TextSnippetOutlinedIcon from "@mui/icons-material/TextSnippetOutlined";
import { SellerSubscription } from "../../common/interfaces/seller-subscription.interface";
import moment from "moment/min/moment-with-locales";
import SellerSubsModal from "./SellerSubsModal";
import StarSVG from "../../assets/svg/star-origami-paper-svgrepo-com.svg";

moment.locale("vi");

interface SidebarProps {
  currentUrl: string;
  handleMenuItemClick: (item: string) => void;
  sellerSubscription?: SellerSubscription | null;
  fetchSellerSubscription?: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}

const Sidebar: React.FC<SidebarProps> = ({
  currentUrl,
  handleMenuItemClick,
  sellerSubscription,
  fetchSellerSubscription,
  loading,
}) => {
  const [isBuyingPlan, setIsBuyingPlan] = useState<boolean>(false);
  const navigate = useNavigate();

  const fullActive =
    sellerSubscription &&
    sellerSubscription.isActive &&
    sellerSubscription.canSell &&
    sellerSubscription.canAuction &&
    sellerSubscription.plan.price > 0;

  const isUnlimited =
    sellerSubscription &&
    sellerSubscription.plan.sellTime === 0 &&
    sellerSubscription.plan.auctionTime === 0 &&
    sellerSubscription.plan.duration > 0;

  return (
    <div>
      {sellerSubscription && (
        <div className="self-stretch REM pb-4 flex flex-col gap-2 p-2 rounded-md bg-white drop-shadow-xl border border-gray-300 mb-1">
          <p className="flex items-center gap-2">
            <img src={StarSVG} alt="" className="w-8 h-8" />
            <p className="text-sky-600 font-bold text-xl">GÓI CỦA BẠN</p>
          </p>
          {isUnlimited ? (
            <p className="italic text-sm">
              Không giới hạn số lần bán & đấu giá
            </p>
          ) : (
            <>
              <p className="flex justify-between gap-2 font-light text-sm">
                Số lượt bán còn lại:{" "}
                <span className="font-semibold">
                  {sellerSubscription.remainingSellTime}
                </span>
              </p>
              <p className="flex justify-between gap-2 font-light text-sm">
                Số lượt đấu giá còn lại:{" "}
                <span className="font-semibold">
                  {sellerSubscription.remainingAuctionTime}
                </span>
              </p>
            </>
          )}

          <p className="flex justify-between gap-2 font-light text-sm">
            Tình trạng:{" "}
            {sellerSubscription.isActive ? (
              <span className="font-semibold text-green-600">
                &#8226; Hoạt động
              </span>
            ) : (
              <span className="font-semibold text-red-600">Hết hạn</span>
            )}
          </p>

          {sellerSubscription.plan.duration > 0 &&
            sellerSubscription.isActive && (
              <p className="flex justify-between gap-2 font-light text-sm">
                Hết hạn sau:
                <span className="font-semibold">
                  {moment(sellerSubscription.activatedTime)
                    .add(sellerSubscription.plan.duration * 30, "days")
                    .fromNow(true)}
                </span>
              </p>
            )}
        </div>
      )}

      {(!fullActive || !isUnlimited) && (
        <>
          <button
            onClick={() => setIsBuyingPlan(true)}
            className="self-stretch w-full REM py-2 px-4 mb-4 uppercase font-semibold bg-sky-800 text-white flex items-center justify-center gap-2 rounded-lg duration-200 hover:bg-sky-900"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z" />
              <path d="M20 3v4" />
              <path d="M22 5h-4" />
              <path d="M4 17v2" />
              <path d="M5 18H3" />
            </svg>
            Đăng ký gói bán
          </button>
          <SellerSubsModal
            isOpen={isBuyingPlan}
            setIsOpen={setIsBuyingPlan}
            callback={fetchSellerSubscription}
          />
        </>
      )}
      <ul className="REM p-4 rounded-md drop-shadow-xl bg-white">
        <li
          className={`menu-item ${
            currentUrl === "/sellermanagement/comic"
              ? "active"
              : "duration-200 opacity-60"
          } flex items-center`}
          onClick={() => {
            handleMenuItemClick("comic");
            navigate("/sellermanagement/comic");
          }}
          style={{ whiteSpace: "nowrap" }}
        >
          <ImportContactsRoundedIcon /> Quản Lý Truyện
        </li>
        <li
          className={`menu-item ${
            currentUrl === "/sellermanagement/order"
              ? "active"
              : "duration-200 opacity-60"
          }`}
          onClick={() => {
            handleMenuItemClick("order");
            navigate("/sellermanagement/order");
          }}
          style={{ whiteSpace: "nowrap" }}
        >
          <InventoryOutlinedIcon /> Quản Lý Đơn Hàng
        </li>
        <li
          className={`menu-item ${
            currentUrl === "/sellermanagement/auction"
              ? "active"
              : "duration-200 opacity-60"
          }`}
          onClick={() => {
            handleMenuItemClick("auction");
            navigate("/sellermanagement/auction");
          }}
          style={{ whiteSpace: "nowrap" }}
        >
          <TvOutlinedIcon /> Quản Lý Đấu Giá
        </li>
        <li
          className={`menu-item ${
            currentUrl === "/sellermanagement/feedback"
              ? "active"
              : "duration-200 opacity-60"
          }`}
          onClick={() => {
            handleMenuItemClick("feedback");
            navigate("/sellermanagement/feedback");
          }}
          style={{ whiteSpace: "nowrap" }}
        >
          <TextSnippetOutlinedIcon /> Quản Lý Đánh Giá
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
