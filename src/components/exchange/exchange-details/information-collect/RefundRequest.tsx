/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import React, { useState } from "react";
import { Input, Modal, notification, Select } from "antd";
import { privateAxios } from "../../../../middleware/axiosInstance";
import { Exchange } from "../../../../common/interfaces/exchange.interface";

export default function RefundRequest({
  isOpen,
  setIsOpen,
  exchange,
  setIsLoading,
  fetchExchangeDetails,
}: {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  exchange: Exchange;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fetchExchangeDetails: Function;
}) {
  const [reason, setReason] = useState<{ label: string; value: string }>();
  const [description, setDescription] = useState<string>("");

  const [uploadedImageFiles, setUploadedImageFiles] = useState<any[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);

  const reasonsList = [
    {
      label:
        "Truyện bị hư hỏng, chất lượng kém, bao bì kém chất lượng hoặc lỗi thời.",
      value:
        "Truyện bị hư hỏng, chất lượng kém, bao bì kém chất lượng hoặc lỗi thời.",
    },
    {
      label: "Truyện không đúng mô tả, giao nhầm, không đúng số lượng.",
      value: "Truyện không đúng mô tả, giao nhầm, không đúng số lượng.",
    },
    {
      label: "Giao sai địa chỉ, giao hàng trễ, đơn hàng thất lạc.",
      value: "Giao sai địa chỉ, giao hàng trễ, đơn hàng thất lạc.",
    },
    {
      label:
        "Sai thông tin người nhận, phát sinh phí không rõ ràng, lỗi do shipper, vấn đề thanh toán.",
      value:
        "Sai thông tin người nhận, phát sinh phí không rõ ràng, lỗi do shipper, vấn đề thanh toán.",
    },
    {
      label: "Truyện bị tráo đổi, mất cắp hoặc bị mở niêm phong (nếu có).",
      value: "Truyện bị tráo đổi, mất cắp hoặc bị mở niêm phong (nếu có).",
    },
  ];

  const handleRemoveFile = (index: number) => {
    setUploadedImageFiles(uploadedImageFiles.filter((value, i) => i !== index));
    setPreviewImages(previewImages.filter((value, i) => i !== index));
  };

  const handleSubmitRefundRequest = async () => {
    setIsOpen(false);
    setIsLoading(true);
    const attachedImages: string[] = [];

    if (uploadedImageFiles.length > 0) {
      await Promise.all(
        uploadedImageFiles.map(async (file) => {
          await privateAxios
            .post(
              "file/upload/image",
              {
                image: file,
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            )
            .then((res) => {
              attachedImages.push(res.data.imageUrl);
            })
            .catch((err) => console.log(err));
        })
      );
    }

    await privateAxios
      .post(`refund-requests/exchange`, {
        exchange: exchange.id,
        reason,
        description,
        attachedImages: attachedImages.length > 0 ? attachedImages : null,
      })
      .then(() => {
        fetchExchangeDetails();
        notification.success({
          key: "success-refund-request",
          message: (
            <p className="text-lg REM">
              Yêu cầu đền bù của bạn đã được gửi đi.
            </p>
          ),
          description: (
            <p className="text-sm font-light REM">
              Hệ thống đã ghi nhận được yêu cầu của bạn và sẽ xử lí trong vòng
              72 giờ tiếp theo.
              <br />
              Chúng tôi sẽ gửi thông báo cho bạn khi xử lí hoàn tất.
            </p>
          ),
        });
      })
      .catch((err) => console.log(err))
      .finally(() => setIsLoading(false));
  };

  const handleClose = (e: any) => {
    e.stopPropagation();
    setReason(undefined);
    setDescription("");
    setUploadedImageFiles([]);
    setPreviewImages([]);
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={handleClose}
      footer={null}
      centered
      width={window.innerWidth * 0.4}
    >
      <div className="pt-4 flex flex-col gap-4">
        <p className="font-semibold text-xl pb-4">GẶP VẤN ĐỀ KHI NHẬN TRUYỆN</p>

        <div className="flex items-center gap-2">
          <p className="text-sm whitespace-nowrap">
            Vấn đề bạn gặp phải: <span className="text-red-600">*</span>
          </p>

          <Select
            style={{ width: "100%", height: "auto" }}
            size="large"
            options={reasonsList}
            value={reason}
            onChange={(value) => setReason(value)}
            placeholder={
              <p className="text-sm italic">Chọn một loại vấn đề...</p>
            }
            optionRender={(props) => <p className="text-wrap leading-normal">{props.label}</p>}
            labelRender={(props) => <p className="text-wrap leading-normal">{props.label}</p>}
          />
        </div>

        <div className="pb-4">
          <p>
            Mô tả: <span className="text-red-600">*</span>
          </p>
          <Input.TextArea
            placeholder="Mô tả cụ thể vấn đề bạn của bạn..."
            autoSize={{ minRows: 5, maxRows: 8 }}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={2000}
            showCount
            className="REM text-sm"
            style={{ padding: "0.5em" }}
          />
        </div>

        <div className="pb-4">
          <p>
            Đính kèm hình ảnh mô tả: <span className="text-red-600">*</span>{" "}
            <span className="text-xs font-light italic">
              (Tối đa 8 hình ảnh)
            </span>
          </p>
          <p className="font-light text-xs italic">
            Hình ảnh phải mô tả được rõ tình trạng và vấn đề để được tiến hành
            phê duyệt và giải quyết.
          </p>

          <div className="flex items-center justify-start gap-2 pt-2 pb-4">
            {previewImages.map((image, index) => {
              return (
                <div key={index} className="relative group">
                  <img
                    key={image}
                    src={image}
                    className="rounded-lg w-[10em] h-[15em] object-cover"
                  />

                  <button
                    onClick={() => handleRemoveFile(index)}
                    className="hidden group-hover:inline absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] p-2 rounded-full bg-white duration-200 hover:opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="24"
                      height="24"
                      fill="rgba(239,6,6,1)"
                    >
                      <path d="M17 6H22V8H20V21C20 21.5523 19.5523 22 19 22H5C4.44772 22 4 21.5523 4 21V8H2V6H7V3C7 2.44772 7.44772 2 8 2H16C16.5523 2 17 2.44772 17 3V6ZM18 8H6V20H18V8ZM9 11H11V17H9V11ZM13 11H15V17H13V11ZM9 4V6H15V4H9Z"></path>
                    </svg>
                  </button>
                </div>
              );
            })}

            <input
              type="file"
              multiple
              hidden
              id="add-image"
              accept="image/png, image/gif, image/jpeg"
              onChange={(e) => {
                if (e.target.files !== null && e.target.files.length > 0) {
                  Array.from(e.target.files).map((file) => {
                    setUploadedImageFiles((prev) => [...prev, file]);
                    setPreviewImages((prev) => [
                      ...prev,
                      URL.createObjectURL(file),
                    ]);
                  });
                }
              }}
            />
            <button
              hidden={uploadedImageFiles.length === 8}
              onClick={() => {
                document.getElementById("add-image")?.click();
              }}
              className="px-8 py-8 text-gray-800 duration-200 hover:text-gray-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="48"
                height="48"
                fill="currentColor"
              >
                <path d="M11 11V7H13V11H17V13H13V17H11V13H7V11H11ZM12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-stretch gap-2">
          <button
            onClick={handleClose}
            className="grow py-2 rounded-md border border-gray-300 duration-200 hover:bg-gray-100"
          >
            HỦY BỎ
          </button>
          <button
            disabled={
              !reason ||
              description.length === 0 ||
              uploadedImageFiles.length === 0
            }
            onClick={() => handleSubmitRefundRequest()}
            className="grow py-2 rounded-md bg-sky-800 text-white duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            GỬI YÊU CẦU
          </button>
        </div>
      </div>
    </Modal>
  );
}
