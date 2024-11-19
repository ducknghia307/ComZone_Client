import { Modal } from "antd";
import { ReactNode } from "react";

export default function ActionConfirm({
  isOpen,
  setIsOpen,
  title,
  description,
  confirmCallback,
  cancelCallback,
  extraWarning,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  title: string;
  description?: string | ReactNode;
  confirmCallback: Function;
  cancelCallback?: Function;
  extraWarning?: string;
}) {
  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setIsOpen(false);
        cancelCallback && cancelCallback();
      }}
      destroyOnClose={true}
      footer={null}
      width={500}
      centered
    >
      <div className="flex flex-col items-stretch justify-start gap-4 REM">
        <p className="font-semibold text-lg">{title}</p>
        {description || null}
        {extraWarning && (
          <div className="flex items-center gap-2 text-yellow-600">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="16"
              height="16"
              fill="currentColor"
            >
              <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM11 7H13V13H11V7Z"></path>
            </svg>
            <p className="font-light text-xs">{extraWarning}</p>
          </div>
        )}

        <div className="flex items-center justify-end gap-8 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              if (cancelCallback) cancelCallback();
            }}
            className="p-2 hover:underline"
          >
            Quay lại
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
              confirmCallback();
            }}
            className="px-12 py-2 rounded-lg font-semibold bg-sky-900 text-white duration-200 hover:bg-sky-800"
          >
            XÁC NHẬN
          </button>
        </div>
      </div>
    </Modal>
  );
}
