import { Dropdown, MenuProps, notification } from "antd";
import React, { useState } from "react";
import { ExchangePostInterface } from "../../../common/interfaces/exchange.interface";
import ActionConfirm from "../../actionConfirm/ActionConfirm";
import { privateAxios } from "../../../middleware/axiosInstance";
import EditPostModal from "../modal/EditPostModal";

export default function SelfPostButton({
  post,
  fetchExchangeNewsFeed,
  setIsLoading,
}: {
  post: ExchangePostInterface;
  fetchExchangeNewsFeed: () => void;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [isEditingPost, setIsEditingPost] = useState<string>("");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState<string>("");

  const handleDeletePost = async () => {
    await privateAxios
      .delete(`exchange-posts/soft/${post.id}`)
      .then(() => {
        notification.info({
          key: "delete",
          message: "Bài viết trao đổi đã được xóa",
          description: (
            <button
              onClick={() => handleUndoDelete()}
              className="REM px-4 py-1 underline hover:font-semibold"
            >
              Hoàn tác
            </button>
          ),
          duration: 8,
        });
        fetchExchangeNewsFeed();
      })
      .catch((err) => console.log(err));
  };

  const handleUndoDelete = async () => {
    await privateAxios
      .delete(`exchange-posts/undo/${post.id}`)
      .then(() => {
        notification.success({
          key: "delete",
          message: "Hoàn tác thành công",
          description: (
            <p className="REM">
              Bài viết của bạn đã được khôi phục thành công.
            </p>
          ),
          duration: 5,
        });
        fetchExchangeNewsFeed();
      })
      .catch((err) => console.log(err));
  };

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: <button>Chỉnh sửa bài viết</button>,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M5 18.89H6.41421L15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89ZM21 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L9.24264 18.89H21V20.89ZM15.7279 6.74785L17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785Z"></path>
        </svg>
      ),
      onClick: () => setIsEditingPost(post.id),
    },
    {
      key: "2",
      label: <button>Xóa bài viết</button>,
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
        </svg>
      ),
      danger: true,
      onClick: () => setIsConfirmingDelete(post.id),
    },
  ];

  return (
    <>
      <Dropdown menu={{ items }} trigger={["click"]} placement="bottom">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
        </svg>
      </Dropdown>

      {isEditingPost === post.id && (
        <>
          <EditPostModal
            open={isEditingPost === post.id}
            setOpen={setIsEditingPost}
            post={post}
            setIsLoading={setIsLoading}
            fetchExchangeNewsFeed={fetchExchangeNewsFeed}
          />
        </>
      )}

      {isConfirmingDelete === post.id && (
        <ActionConfirm
          isOpen={isConfirmingDelete === post.id}
          setIsOpen={(isOpen) => {
            if (!isOpen) setIsConfirmingDelete("");
          }}
          title="Xác nhận xóa bài viết trao đổi này?"
          confirmCallback={() => handleDeletePost()}
        />
      )}
    </>
  );
}
