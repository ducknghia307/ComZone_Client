import React, { useEffect, useState } from "react";
import { Checkbox, message, Slider } from "antd";
import type { SliderSingleProps } from "antd";
import {
  ComicMainInformation,
  ConditionAndEditionResponse,
} from "./CreateNewComics";
import { Edition } from "../../../common/interfaces/edition.interface";
import { publicAxios } from "../../../middleware/axiosInstance";
import { AuctionCriteria } from "../../../common/interfaces/auction.interface";
import { evidenceAttributes } from "../../../common/constances/evidence-attribute";
import { Condition } from "../../../common/interfaces/condition.interface";
import AuctionCriteriaModal from "./AuctionCriteriaModal";

const formatGradingScaleToMarks = (
  gradingScale: Condition[]
): SliderSingleProps["marks"] => {
  const marks: SliderSingleProps["marks"] = {};

  gradingScale.forEach((item) => {
    marks[item.value] = {
      label: (
        <p className="whitespace-nowrap text-xs sm:text-base">
          {item.isRemarkable ? item.name : ""}
        </p>
      ),
    };
  });

  return marks;
};

export default function EditionAndCondition({
  currentStep,
  setCurrentStep,
  mainInformation,
  handleGettingConditionAndEdition,
  setEditionEvidenceFields,
}: {
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  mainInformation: ComicMainInformation;
  handleGettingConditionAndEdition: (
    value: ConditionAndEditionResponse
  ) => void;
  setEditionEvidenceFields: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const [minimumConditionLevel, setMinimumConditionLevel] = useState<number>();
  const [conditionGradingScales, setConditionGradingScales] = useState<
    Condition[]
  >([]);
  const [condition, setCondition] = useState<Condition>();

  const [editionList, setEditionList] = useState<Edition[]>([]);
  const [edition, setEdition] = useState<Edition>();

  const [evidenceFields, setEvidenceFields] = useState<string[]>([]);

  const [criteriaList, setCriteriaList] = useState<
    { name: string; description: React.ReactNode }[]
  >([]);
  const [isShowingCriteria, setIsShowingCriteria] = useState<boolean>(false);

  const [willNotAuction, setWillNotAuction] = useState<boolean>(false);

  const fetchConditions = async () => {
    await publicAxios
      .get("conditions")
      .then((res) => {
        const fetchedConditions: Condition[] = res.data;
        setConditionGradingScales(fetchedConditions);
        if (fetchedConditions.length > 0)
          setCondition(
            fetchedConditions[Math.floor(fetchedConditions.length / 2)]
          );
      })
      .catch((err) => console.log(err));
  };

  const fetchEditions = async () => {
    await publicAxios
      .get("editions")
      .then((res) => setEditionList(res.data))
      .catch((err) => console.log(err));
  };

  const fetchAuctionCriteria = async () => {
    await publicAxios
      .get("auction-criteria")
      .then((res) => {
        const criteria: AuctionCriteria = res.data;
        setMinimumConditionLevel(criteria.conditionLevel.value);

        const transformedCriteria = [
          {
            name: "Thông tin đầy đủ",
            description:
              "Người bán phải cung cấp đầy đủ thông tin chi tiết về truyện, bao gồm: tên truyện, tác giả, thể loại, mô tả nội dung truyện, loại bìa, và màu sắc của truyện. Những thông tin này không chỉ giúp người mua hiểu rõ hơn về sản phẩm mà còn là yếu tố quan trọng để xây dựng niềm tin và sự minh bạch trong giao dịch.",
          },
          {
            name: "Tình trạng truyện",
            description: (
              <>
                Tình trạng của truyện phải đạt mức{" "}
                <span style={{ color: "red" }}>
                  {criteria.conditionLevel.name.toLowerCase()}
                </span>{" "}
                trở lên, tương đương{" "}
                <span style={{ color: "red" }}>
                  {criteria.conditionLevel.value}
                </span>
                /10 theo thang điểm đánh giá chất lượng.
              </>
            ),
          },
          {
            name: "Phiên bản truyện",
            description:
              "Kiểm tra xem yếu tố thể hiện phiên bản truyện và các ảnh đính kèm có khớp với phiên bản truyện mà người bán đã chọn hay không. Các ảnh đính kèm rất quan trọng trong việc xét duyệt truyện đấu giá.",
          },
        ];

        setCriteriaList(transformedCriteria);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchConditions();
    fetchEditions();
    fetchAuctionCriteria();
  }, []);

  const handleSubmitConditionAndEdition = () => {
    if (!edition) {
      message.error({
        key: "error",
        content: (
          <p className="REM text-start">Vui lòng chọn phiên bản truyện!</p>
        ),
        duration: 5,
      });
      return;
    }

    if (
      !edition.auctionDisabled &&
      !willNotAuction &&
      evidenceFields.length === 0
    ) {
      message.error({
        key: "error",
        content: (
          <p className="REM text-start">
            Vui lòng chọn ít nhất 1 thuộc tính để thể hiện phiên bản truyện!
          </p>
        ),
        duration: 5,
      });
      return;
    }

    setEditionEvidenceFields(evidenceFields);
    handleGettingConditionAndEdition({
      condition: condition.value,
      edition,
      evidenceFields,
      willNotAuction,
    });
  };

  if (currentStep === 1)
    return (
      <div className="flex flex-col items-stretch xl:w-2/3 mx-auto gap-8">
        <div className="flex flex-col items-stretch gap-4">
          <p className="font-semibold uppercase text-lg">
            1. Tình trạng sử dụng
          </p>

          <p className="italic font-light text-sm">
            Chọn một mức độ thể hiện tình trạng hiện tại của{" "}
            {mainInformation.quantity > 1 ? "bộ truyện" : "tập truyện"}:{" "}
            <span className="text-red-600">*</span>
          </p>

          <div className="px-4">
            <Slider
              marks={formatGradingScaleToMarks(conditionGradingScales)}
              step={null}
              tooltip={{ open: false }}
              value={condition.value}
              onChange={(value: number) =>
                setCondition(
                  conditionGradingScales.find(
                    (condition) => condition.value === value
                  )
                )
              }
              max={10}
            />
          </div>

          <div className="xl:w-1/2 mx-auto flex flex-col items-stretch justify-start gap-2 px-2 sm:px-4">
            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                fill="currentColor"
              >
                <path d="M22 20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20ZM11 15H4V19H11V15ZM20 11H13V19H20V11ZM11 5H4V13H11V5ZM20 5H13V9H20V5Z"></path>
              </svg>
              <p className="font-light">Tình trạng:&emsp;</p>
              <p className="text-lg font-semibold">{condition.name}</p>
            </span>

            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                fill="currentColor"
              >
                <path d="M15 3H21V21H3V15H7V11H11V7H15V3ZM17 5V9H13V13H9V17H5V19H19V5H17Z"></path>
              </svg>
              <p className="font-light">Độ mới:&emsp;</p>
              <p className="text-lg font-semibold">{condition.value}/10</p>
            </span>

            {condition.usageLevel && (
              <span className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="18"
                  height="18"
                  fill="currentColor"
                >
                  <path d="M12 22C6.47715 22 2 17.5228 2 12 2 6.47715 6.47715 2 12 2 17.5228 2 22 6.47715 22 12 22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12 20 7.58172 16.4183 4 12 4 7.58172 4 4 7.58172 4 12 4 16.4183 7.58172 20 12 20ZM13 10.5V15H14V17H10V15H11V12.5H10V10.5H13ZM13.5 8C13.5 8.82843 12.8284 9.5 12 9.5 11.1716 9.5 10.5 8.82843 10.5 8 10.5 7.17157 11.1716 6.5 12 6.5 12.8284 6.5 13.5 7.17157 13.5 8Z"></path>
                </svg>
                <p className="font-light">Mức độ sử dụng:&emsp;</p>
                <p className="font-semibold">{condition.usageLevel}</p>
              </span>
            )}

            <span className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M14.5998 8.00033H21C22.1046 8.00033 23 8.89576 23 10.0003V12.1047C23 12.3659 22.9488 12.6246 22.8494 12.8662L19.755 20.3811C19.6007 20.7558 19.2355 21.0003 18.8303 21.0003H2C1.44772 21.0003 1 20.5526 1 20.0003V10.0003C1 9.44804 1.44772 9.00033 2 9.00033H5.48184C5.80677 9.00033 6.11143 8.84246 6.29881 8.57701L11.7522 0.851355C11.8947 0.649486 12.1633 0.581978 12.3843 0.692483L14.1984 1.59951C15.25 2.12534 15.7931 3.31292 15.5031 4.45235L14.5998 8.00033ZM7 10.5878V19.0003H18.1606L21 12.1047V10.0003H14.5998C13.2951 10.0003 12.3398 8.77128 12.6616 7.50691L13.5649 3.95894C13.6229 3.73105 13.5143 3.49353 13.3039 3.38837L12.6428 3.0578L7.93275 9.73038C7.68285 10.0844 7.36341 10.3746 7 10.5878ZM5 11.0003H3V19.0003H5V11.0003Z"></path>
              </svg>
              <p className="font-light">Quyền lợi:&emsp;</p>
              <p
                className={`${
                  condition.value >= minimumConditionLevel
                    ? "text-green-600 font-semibold"
                    : "text-red-600"
                }`}
              >
                {condition.value >= minimumConditionLevel
                  ? "Có thể đấu giá"
                  : "Không thể đấu giá"}
              </p>
            </span>

            <p className="text-sm h-[6em] phone:h-[5em]">
              {condition.description}
            </p>
          </div>
        </div>

        <p className="font-semibold uppercase text-lg">2. Phiên bản truyện</p>

        <p className="italic font-light text-sm">
          Chọn phiên bản của{" "}
          {mainInformation.quantity > 1 ? "bộ truyện" : "tập truyện"}:{" "}
          <span className="text-red-600">*</span>
        </p>

        <div className="flex flex-col items-stretch justify-start gap-2">
          {editionList.map((editionDetails) => {
            const isSelected = edition && edition.id === editionDetails.id;
            return (
              <button
                key={editionDetails.id}
                onClick={() => {
                  if (!edition) {
                    setEdition(editionDetails);
                    return;
                  }
                  if (isSelected) setEdition(undefined);
                  else setEdition(editionDetails);
                }}
                className={`${
                  isSelected
                    ? "ring-2 ring-black"
                    : edition
                    ? "opacity-30 hover:opacity-70"
                    : "hover:bg-gray-50"
                } grow flex flex-col items-start justify-center gap-2 p-4 border border-gray-300 rounded-lg text-start duration-200`}
              >
                <p className="text-xl font-semibold flex items-center gap-4">
                  <span className="capitalize">{editionDetails.name}</span>
                  {!editionDetails.auctionDisabled && (
                    <span className="px-2 py-1 bg-green-700 text-white rounded-md text-sm font-light flex items-center gap-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="16"
                        height="16"
                        fill="currentColor"
                      >
                        <path d="M14.0049 20.0028V22.0028H2.00488V20.0028H14.0049ZM14.5907 0.689087L22.3688 8.46726L20.9546 9.88147L19.894 9.52792L17.4191 12.0028L23.076 17.6597L21.6617 19.0739L16.0049 13.417L13.6007 15.8212L13.8836 16.9525L12.4693 18.3668L4.69117 10.5886L6.10539 9.17437L7.23676 9.45721L13.53 3.16396L13.1765 2.1033L14.5907 0.689087ZM15.2978 4.22462L8.22671 11.2957L11.7622 14.8312L18.8333 7.76015L15.2978 4.22462Z"></path>
                      </svg>
                      Có thể đấu giá
                    </span>
                  )}
                </p>
                <p className="font-light">{editionDetails.description}</p>
              </button>
            );
          })}
        </div>

        {edition && !edition.auctionDisabled && (
          <div className="space-y-6">
            <div className="flex items-center gap-2 mt-4">
              <Checkbox
                checked={willNotAuction}
                onChange={() => {
                  setEvidenceFields([]);
                  setWillNotAuction(!willNotAuction);
                }}
              />
              <p className="font-light text-red-600">
                Tôi sẽ không dùng truyện này để bán dưới hình thức đấu giá.
              </p>
            </div>

            <div className={`space-y-2 ${willNotAuction && "opacity-30"}`}>
              <div className="flex items-center gap-4">
                <p className="font-semibold uppercase">
                  Điều kiện đấu giá truyện
                </p>
                <button
                  onClick={() => setIsShowingCriteria(true)}
                  className="flex items-center gap-1 border border-gray-300 rounded text-sm font-light p-1 duration-200 hover:bg-gray-100"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="16"
                    height="16"
                    fill="currentColor"
                  >
                    <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 7H13V9H11V7ZM11 11H13V17H11V11Z"></path>
                  </svg>
                  Xem điều kiện đấu giá
                </button>

                <AuctionCriteriaModal
                  open={isShowingCriteria}
                  setOpen={setIsShowingCriteria}
                  criteriaList={criteriaList}
                />
              </div>

              <p className="font-light text-sm">
                {mainInformation.quantity > 1 ? "Bộ truyện" : "Truyện"} của bạn
                sẽ phải được hệ thống phê duyệt để đạt điều kiện được bán dưới
                hình thức đấu giá trên nền tảng. Do đó, bạn cần cung cấp thêm
                thông tin để hệ thống sẽ dựa vào đó đánh giá truyện của bạn.
              </p>

              <p className="font-light text-sm">
                Chọn những thuộc tính sau đây thể hiện{" "}
                {mainInformation.quantity > 1 ? "bộ truyện" : "truyện"} của bạn
                thuộc{" "}
                <span className="font-semibold capitalize">{edition.name}</span>
                :
              </p>

              <p className="text-xs italic">
                Ví dụ: Chọn <span className="font-semibold">Ảnh bìa</span> nếu
                truyện của bạn có đánh dấu
                <span className="font-semibold capitalize">
                  "{edition.name}"
                </span>{" "}
                ở trên bìa truyện của bạn.
              </p>

              <div className="space-y-2 text-sm font-light pt-4">
                <p>{mainInformation.quantity > 1 ? "Bộ truyện" : "Truyện"}:</p>
                <div
                  className={`grid grid-cols-${evidenceAttributes.length} items-stretch justify-center gap-2`}
                >
                  {evidenceAttributes.map((attribute) => {
                    const isSelected = evidenceFields.some(
                      (field) => field === attribute
                    );
                    return (
                      <button
                        onClick={() => {
                          if (isSelected)
                            setEvidenceFields(
                              evidenceFields.filter(
                                (field) => field !== attribute
                              )
                            );
                          else
                            setEvidenceFields((prev) => [...prev, attribute]);
                        }}
                        className={`border border-gray-300 rounded p-2 duration-200 ${
                          isSelected &&
                          "border-white ring-2 ring-green-600 text-green-600 font-semibold"
                        }`}
                      >
                        {attribute}
                      </button>
                    );
                  })}
                </div>
              </div>

              {mainInformation.merchandises &&
                mainInformation.merchandises.length > 0 && (
                  <div className="space-y-2 text-sm font-light pt-4">
                    <p>Phụ kiện:</p>
                    <div
                      className={`grid grid-cols-4 items-stretch justify-center gap-2`}
                    >
                      {mainInformation.merchandises.map((merch) => {
                        const isSelected = evidenceFields.some(
                          (field) => field === merch.name
                        );
                        return (
                          <button
                            onClick={() => {
                              if (isSelected)
                                setEvidenceFields(
                                  evidenceFields.filter(
                                    (field) => field !== merch.name
                                  )
                                );
                              else
                                setEvidenceFields((prev) => [
                                  ...prev,
                                  merch.name,
                                ]);
                            }}
                            className={`border border-gray-300 rounded p-2 duration-200 ${
                              isSelected &&
                              "border-white ring-2 ring-green-600 text-green-600 font-semibold"
                            }`}
                          >
                            {merch.name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 mt-8">
          <button
            onClick={() => setCurrentStep(0)}
            className="basis-1/3 min-w-fit p-2 flex items-center justify-center gap-2 duration-200 border border-gray-300 rounded hover:opacity-70 hover:bg-gray-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path>
            </svg>
            Quay lại
          </button>

          <button
            onClick={handleSubmitConditionAndEdition}
            className="grow flex items-center justify-center gap-2 px-8 py-2 bg-cyan-700 text-white rounded duration-200 hover:bg-cyan-900"
          >
            Tiếp tục
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M19.1642 12L12.9571 5.79291L11.5429 7.20712L16.3358 12L11.5429 16.7929L12.9571 18.2071L19.1642 12ZM13.5143 12L7.30722 5.79291L5.89301 7.20712L10.6859 12L5.89301 16.7929L7.30722 18.2071L13.5143 12Z"></path>
            </svg>
          </button>
        </div>
      </div>
    );
}
