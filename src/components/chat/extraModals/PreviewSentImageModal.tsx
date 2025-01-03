/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Modal, notification } from "antd";

export default function PreviewSentImageModal({
  isOpen,
  setIsOpen,
  sentImage,
  setSentImage,
  handleSendMessageAsImage,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  sentImage: File | undefined;
  setSentImage: Function;
  handleSendMessageAsImage: Function;
}) {
  const handleConfirmSend = async () => {
    setIsOpen(false);
    await handleSendMessageAsImage();
  };

  if (isOpen && !sentImage) {
    notification.warning({
      key: "upload",
      message: "Tải hình ảnh lên không thành công",
      description: "Vui lòng thử lại!",
      duration: 5,
    });
    setIsOpen(false);
  } else
    return (
      <Modal
        open={isOpen}
        onCancel={(e) => {
          e.stopPropagation();
          setSentImage(undefined);
          setIsOpen(false);
        }}
        centered
        footer={null}
      >
        <div className="flex flex-col items-stretch gap-4 pt-4">
          <div className="flex flex-col items-center justify-between gap-4">
            <p className="font-semibold text-lg">Ảnh đã tải lên:</p>

            <img
              src={sentImage && URL.createObjectURL(sentImage)}
              className="w-64 rounded-lg"
            />
          </div>

          <div className="flex items-center justify-end gap-8 mt-8">
            <button
              onClick={() => {
                setIsOpen(false);
              }}
              className="hover:underline"
            >
              Quay lại
            </button>
            <button
              disabled={!sentImage}
              onClick={() => handleConfirmSend()}
              className="px-16 py-2 rounded-lg bg-sky-700 text-white duration-200 hover:bg-sky-900 disabled:bg-gray-300"
            >
              GỬI
            </button>
          </div>
        </div>
      </Modal>
    );
}
