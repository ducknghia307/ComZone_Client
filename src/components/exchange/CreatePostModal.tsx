import { PlusOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import NewExchangeForm from "./NewExchangeForm";
import TextArea from "antd/es/input/TextArea";
import { useState } from "react";

export default function CreatePostModal({
  openCreatePost,
  setOpenCreatePost,
}: {
  openCreatePost: boolean;
  setOpenCreatePost: (open: boolean) => void;
}) {
  const [postContent, setPostContent] = useState("");
  return (
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
        ĐĂNG BÀI YÊU CẦU TRAO ĐỔI TRUYỆN
      </h2>
      <NewExchangeForm />
      <TextArea
        value={postContent}
        onChange={(e) => setPostContent(e.target.value)}
        placeholder="Hãy viết gì đó ở đây..."
        autoSize={{ minRows: 3, maxRows: 5 }}
        className="mt-4 p-3"
      />
      <div className="w-full flex justify-end mt-4 flex-row gap-10">
        <button className="border-none font-semibold hover:opacity-70 duration-200">
          HỦY BỎ
        </button>
        <button className="px-12 py-2 bg-black rounded-md text-white font-bold hover:opacity-70 duration-200 ">
          HOÀN TẤT
        </button>
      </div>
    </Modal>
  );
}
