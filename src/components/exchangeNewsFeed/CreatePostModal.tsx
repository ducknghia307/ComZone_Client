import { message, Modal, notification } from "antd";
import NewExchangeForm from "./NewExchangeForm";
import TextArea from "antd/es/input/TextArea";
import { useEffect, useState } from "react";
import ComicListToExchange from "./ComicListToExchange";
import { ExchangeElement } from "../../common/interfaces/exchange-post.interface";
import { UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
import Loading from "../loading/Loading";
import { PictureOutlined } from "@ant-design/icons";

export default function CreatePostModal({
  openCreatePost,
  setOpenCreatePost,
}: {
  openCreatePost: boolean;
  setOpenCreatePost: (open: boolean) => void;
}) {
  const [postContent, setPostContent] = useState("");
  const [postContentError, setPostContentError] = useState(false);
  const [comicList, setComicList] = useState<ExchangeElement[]>([]);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState(false);
  const fetchUserInfo = async () => {
    try {
      const res = await privateAxios("/users/profile");
      setUserInfo(res.data);
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleDelete = (index: number) => {
    const updatedComicList = comicList.filter((_, i) => i !== index);
    setComicList(updatedComicList);

    if (userInfo) {
      const storedComics = JSON.parse(
        sessionStorage.getItem("newComicData") || "{}"
      );
      const userComics = storedComics[userInfo.id] || [];
      const newUserComics = userComics.filter((_: any, i: any) => i !== index);
      storedComics[userInfo.id] = newUserComics;
      sessionStorage.setItem("newComicData", JSON.stringify(storedComics));
    }

    message.success("Comic deleted successfully!");
  };

  const handleSubmit = async () => {
    if (comicList.length === 0) {
      notification.error({
        message: "Lỗi",
        description:
          "Bạn cần thêm ít nhất thông tin về 1 cuốn truyện bạn muốn trao đổi.",
        duration: 2,
      });

      return;
    }
    if (!postContent.trim()) {
      setPostContentError(true);
      notification.error({
        message: "Lỗi",
        description: "Bạn phải nhập nội dung bài đăng",
        duration: 2,
      });
      return;
    }
    // if (!postContent.trim()) {
    //   return;
    // }
    setLoading(true);
    try {
      const requestedComics = comicList.map((comic) => ({
        title: comic.title,
        author: comic.author,
        coverImage: comic.coverImage,
        edition: comic.edition,
        condition: comic.condition,
        quantity: comic.quantity,
      }));

      const payload = {
        requestedComics,
        postContent: postContent,
      };

      const response = await privateAxios.post("/exchange-requests", payload);
      console.log(response.data);

      notification.success({
        message: "Thành công",
        description: "Đăng bài để trao đổi truyện thành công!",
      });
      if (userInfo) {
        const storedComics = JSON.parse(
          sessionStorage.getItem("newComicData") || "{}"
        );
        delete storedComics[userInfo.id];

        sessionStorage.setItem("newComicData", JSON.stringify(storedComics));
      }
      setOpenCreatePost(false);
    } catch (error) {
      console.error("Error posting exchange request:", error);
      notification.error({
        message: "Error",
        description: "Something went wrong, please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserInfo();
  }, []);
  useEffect(() => {
    if (userInfo) {
      const storedComics = JSON.parse(
        sessionStorage.getItem("newComicData") || "{}"
      );
      const userComics = storedComics[userInfo.id] || [];
      setComicList(userComics);
    }
  }, [openCreatePost, userInfo]);

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
        {/* {userInfo && (
          <ComicListToExchange
            comicList={comicList}
            setComicList={setComicList}
            userInfo={userInfo}
            handleDelete={handleDelete}
          />
        )}
        {comicList.length === 0 && (
          <p className="text-red-500 text-xs mt-1">
            Bạn cần thêm ít nhất thông tin về 1 cuốn truyện bạn muốn trao đổi
          </p>
        )}
        {userInfo && (
          <NewExchangeForm
            comicList={comicList.length}
            setComicList={setComicList}
            userInfo={userInfo}
          />
        )} */}
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
          placeholder="Hãy viết gì đó ở đây..."
          autoSize={{ minRows: 3, maxRows: 5 }}
          className="mt-2 p-3"
        />
        <p className="text-sm italic text-green-600 mt-2">
          Hãy mô tả chi tiết truyện của bạn. Việc mô tả càng chi tiết sẽ giúp
          người khác hiểu rõ hơn về điều bạn mong muốn.
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
            className="border-none font-semibold hover:opacity-70 duration-200"
            onClick={() => setOpenCreatePost(false)}
          >
            HỦY BỎ
          </button>
          <button
            className="px-12 py-2 bg-black rounded-md text-white font-bold hover:opacity-70 duration-200 "
            onClick={handleSubmit}
            disabled={loading}
          >
            HOÀN TẤT
          </button>
        </div>
      </Modal>
    </>
  );
}
