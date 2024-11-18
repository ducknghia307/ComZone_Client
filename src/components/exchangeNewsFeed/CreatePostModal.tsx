import { Modal, notification } from "antd";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import Loading from "../loading/Loading";
import { PictureOutlined } from "@ant-design/icons";
import ActionConfirm from "../actionConfirm/ActionConfirm";

export default function CreatePostModal({
  openCreatePost,
  setOpenCreatePost,
  fetchExchangeNewsFeed,
}: {
  openCreatePost: boolean;
  setOpenCreatePost: (open: boolean) => void;
  fetchExchangeNewsFeed: () => void;
}) {
  const [postContent, setPostContent] = useState("");
  const [postContentError, setPostContentError] = useState(false);

  const [loading, setLoading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);

  const handleSubmit = async () => {
    if (!postContent.trim()) {
      setPostContentError(true);
      notification.info({
        key: "empty_post_content",
        message: "Thêm nội dung",
        description: "Bạn phải nhập nội dung cho bài viết của bạn.",
        duration: 5,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await privateAxios.post("exchanges", {
        postContent,
        images: [],
      });
      console.log(response.data);

      notification.success({
        key: "success",
        message: "Thành công",
        description: "Đăng bài để trao đổi truyện thành công!",
        duration: 5,
      });

      setOpenCreatePost(false);
      fetchExchangeNewsFeed();
    } catch (error) {
      console.error("Error posting exchange request:", error);
      notification.error({
        key: "error",
        message: "Đã xảy ra lỗi!",
        description: "Vui lòng thử lại sau.",
        duration: 5,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loading />}
      <Modal
        open={openCreatePost}
        onCancel={(e) => {
          e.stopPropagation();
          setOpenCreatePost(false);
        }}
        footer={null}
        width={1000}
      >
        <h2 className="text-xl font-medium my-4">
          ĐĂNG BÀI TÌM KIẾM TRUYỆN ĐỂ TRAO ĐỔI
        </h2>

        <div className="flex flex-row gap-1 mt-4">
          <h2>Nội dung bài viết:</h2>
          <p className="text-red-500">*</p>
        </div>
        <TextArea
          value={postContent}
          onChange={(e) => {
            setPostContent(e.target.value);
            setPostContentError(false);
          }}
          placeholder="Mô tả truyện mà bạn đang tìm kiếm để trao đổi..."
          autoSize={{ minRows: 3, maxRows: 10 }}
          className="font-light mt-2 p-3"
        />
        <p
          className={`${
            postContent.trim().length > 0 && "invisible"
          } text-xs font-light italic text-green-600 mt-2`}
        >
          Việc mô tả chi tiết sẽ giúp người khác hiểu rõ hơn về truyện bạn đang
          tìm kiếm.
        </p>
        {postContentError && (
          <p className="text-red-500 text-xs mt-1">
            Cần nhập nội dung bài đăng
          </p>
        )}
        <div className="flex mt-4"></div>
        <button
          className=" h-20 w-20 p-4 border bg-gray-100 hover:opacity-75 duration-200 rounded-lg flex flex-col items-center justify-center gap-2"
          onClick={() =>
            document.getElementById("previewChapterUpload")?.click()
          }
        >
          <PictureOutlined />
          <p className="text-nowrap">Thêm ảnh</p>
          <input
            type="file"
            // onChange={handlePreviewChapterChange}
            className="hidden"
            id="previewChapterUpload"
          />
        </button>
        <div className="w-full flex justify-end mt-4 flex-row gap-10">
          <button
            className="border-none hover:opacity-70 duration-200"
            onClick={() => setOpenCreatePost(false)}
          >
            Hủy bỏ
          </button>
          <button
            disabled={loading || postContent.trim().length === 0}
            onClick={() => setIsConfirming(true)}
            className="px-12 py-2 bg-black rounded-md text-white font-bold hover:opacity-70 duration-200 disabled:bg-gray-300"
          >
            HOÀN TẤT
          </button>

          <ActionConfirm
            isOpen={isConfirming}
            setIsOpen={setIsConfirming}
            title="Xác nhận đăng bài?"
            confirmCallback={() => handleSubmit()}
          />
        </div>
      </Modal>
    </>
  );
}
