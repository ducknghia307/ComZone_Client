/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { NavigateFunction } from "react-router-dom";
import { Comic } from "../../../common/base.interface";
import { ExchangePostInterface } from "../../../common/interfaces/exchange.interface";
import { notification } from "antd";
import SelectOfferComicsModal from "../modal/SelectOfferComicsModal";
import { useState } from "react";

export default function OthersPostButtons({
  handleOpenModal,
  post,
  isLoggedIn,
  userExchangeComicsList,
  setIsChatOpen,
  setIsLoading,
  navigate,
}: {
  handleOpenModal: () => void;
  post: ExchangePostInterface;
  isLoggedIn: boolean;
  userExchangeComicsList: Comic[];
  navigate: NavigateFunction;
  setIsChatOpen: Function;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isSelectModalOpen, setIsSelectModalOpen] = useState<string>("");

  return (
    <>
      <div className="flex flex-row gap-4">
        <button
          className="border rounded-lg min-w-max p-2"
          onClick={handleOpenModal}
        >
          Xem truyện của <span className="font-semibold">{post.user.name}</span>
        </button>
        <button
          onClick={() => {
            if (!isLoggedIn) {
              notification.info({
                key: "not-logged-in",
                message: "Bạn cần đăng nhập để bắt đầu trao đổi!",
                description: (
                  <button className="w-full py-2 rounded-md text-white font-semibold bg-sky-600 duration-200 hover:bg-sky-700">
                    Đăng nhập
                  </button>
                ),
                duration: 5,
              });
            } else if (userExchangeComicsList.length === 0) {
              notification.info({
                key: "empty_exchange_comics",
                message: "Bạn chưa có truyện để trao đổi!",
                description: (
                  <p className="text-xs">
                    Bạn phải thực hiện thêm thông tin của truyện mà bạn muốn
                    dùng để trao đổi trên hệ thống trước khi thực hiện trao đổi.
                    <br />
                    <button
                      onClick={() => navigate("")}
                      className="text-sky-600 underline mt-2"
                    >
                      Thêm truyện ngay
                    </button>
                  </p>
                ),
                duration: 8,
              });
            } else setIsSelectModalOpen(post.id);
          }}
          className="min-w-max p-2 bg-sky-700 text-white rounded-lg"
        >
          Bắt đầu trao đổi
        </button>
      </div>

      {isSelectModalOpen === post.id && (
        <SelectOfferComicsModal
          post={post}
          userExchangeComicsList={userExchangeComicsList}
          isSelectModalOpen={isSelectModalOpen}
          setIsSelectModalOpen={setIsSelectModalOpen}
          setIsChatOpen={setIsChatOpen}
          setIsLoading={setIsLoading}
        />
      )}
    </>
  );
}
