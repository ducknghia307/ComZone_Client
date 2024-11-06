import { Modal } from "antd";

export default function CreatePostModal({
  openCreatePost,
  setOpenCreatePost,
}: {
  openCreatePost: boolean;
  setOpenCreatePost: Function;
}) {
  return (
    <Modal
      open={openCreatePost}
      onCancel={(e) => {
        e.stopPropagation();
        setOpenCreatePost(false);
      }}
    >
      hey
    </Modal>
  );
}
