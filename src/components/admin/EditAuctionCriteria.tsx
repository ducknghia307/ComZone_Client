import React, { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Form,
  notification,
  Switch,
  Slider,
  Select,
} from "antd";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { AuctionCriteria } from "../../common/interfaces/auction.interface";
import type { SliderSingleProps } from "antd";
import { Edition } from "../../common/interfaces/edition.interface";
import { Condition } from "../../common/interfaces/condition.interface";

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

const EditAuctionCriteria: React.FC = () => {
  const [config, setConfig] = useState<AuctionCriteria>();
  const [originalConfig, setOriginalConfig] = useState<AuctionCriteria>();
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(true);
  const [condition, setCondition] = useState<Condition>();
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedEditions, setSelectedEditions] = useState<string[]>([]);
  const [unSelectedEditions, setUnSelectedEditions] = useState<string[]>([]);
  const [isFullInfoFilled, setIsFullInfoFilled] = useState<boolean>(false);
  const [isEditionRestricted, setIsEditionRestricted] =
    useState<boolean>(false);
  const [editionRestricted, setEditionRestricted] = useState<boolean>(false);
  const [conditionGradingScales, setConditionGradingScales] = useState<
    Condition[]
  >([]);
  const handleInputChange = (field: string, value: boolean) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);

    const isConfigEdited =
      JSON.stringify(updatedConfig) !== JSON.stringify(originalConfig);
    setIsEdited(isConfigEdited);
  };
  const fetchEditions = async () => {
    try {
      const response = await privateAxios.get("/editions");
      setEditions(response.data);
      console.log("edition", isEditionRestricted);

      if (isEditionRestricted) {
        const selectedEditions = response.data
          .filter((edition: Edition) => !edition.auctionDisabled)
          .map((edition: Edition) => edition.id);

        setSelectedEditions(selectedEditions);
        const unselectedEditions = response.data
          .filter((edition: Edition) => edition.auctionDisabled)
          .map((edition: Edition) => edition.id);
        setUnSelectedEditions(unselectedEditions);
      }
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  };
  const fetchComicsCondition = async () => {
    return await publicAxios
      .get("conditions")
      .then((res) => {
        setConditionGradingScales(res.data);
      })
      .catch((err) => console.log(err));
  };
  const handleSave = () => {
    const payload = {
      isFullInfoFilled: isFullInfoFilled,
      conditionLevel: condition.value,
      disallowedEdition: unSelectedEditions,
    };
    console.log("payload:", payload);

    privateAxios
      .patch(`/auction-criteria`, payload)
      .then((response) => {
        console.log("res", response.data);

        notification.success({
          message: "Thành công",
          description: "Cấu hình đã được cập nhật thành công!",
        });
        setOriginalConfig(config);
        setIsEdited(false);
      })
      .catch((error) => {
        console.error("Error updating config:", error);
        notification.error({
          message: "Lỗi",
          description: "Cập nhật thất bại. Vui lòng thử lại!",
        });
      });
  };
  const handleEditionChange = (values: string[]) => {
    setSelectedEditions(values);
    console.log("Selected editions:", values);

    const unselectedEditions = editions
      .filter((edition) => !values.includes(edition.id))
      .map((edition) => edition.id);
    setUnSelectedEditions(unselectedEditions);
    console.log("Unselected editions:", unselectedEditions);

    setIsEdited(true);
  };
  const handleEditionClick = (editionId: string) => {
    setEditions((prevEditions) =>
      prevEditions.map((edition) =>
        edition.id === editionId
          ? { ...edition, auctionDisabled: !edition.auctionDisabled }
          : edition
      )
    );

    setEditions((prevEditions) => {
      const newUnselectedEditions = prevEditions
        .filter((edition) => edition.auctionDisabled)
        .map((edition) => edition.id);

      setUnSelectedEditions(newUnselectedEditions);
      console.log("Updated unselected editions:", {
        unselectedEditions: newUnselectedEditions,
      });

      return prevEditions;
    });

    setIsEdited(true);
  };

  useEffect(() => {
    publicAxios
      .get("/auction-criteria")
      .then((response) => {
        const fetchedConfig = response.data;
        console.log("asdasd", fetchedConfig);

        if (fetchedConfig && fetchedConfig.id) {
          setConfig({
            id: fetchedConfig.id,
            isFullInfoFilled: fetchedConfig.isFullInfoFilled || false,
            conditionLevel: fetchedConfig.conditionLevel || 0,
            editionRestricted: fetchedConfig.editionRestricted || false,
            updatedAt: fetchedConfig.updatedAt || new Date(),
          });
          setOriginalConfig({
            id: fetchedConfig.id,
            isFullInfoFilled: fetchedConfig.isFullInfoFilled || false,
            conditionLevel: fetchedConfig.conditionLevel || 0,
            editionRestricted: fetchedConfig.editionRestricted || false,
            updatedAt: fetchedConfig.updatedAt || new Date(),
          });
          setEditionRestricted(fetchedConfig.editionRestricted);
          if (fetchedConfig.editionRestricted) {
            setIsEditionRestricted(fetchedConfig.editionRestricted);
          }
          fetchEditions();
          setCondition(fetchedConfig.conditionLevel);
          setIsFullInfoFilled(fetchedConfig.isFullInfoFilled);
        } else {
          throw new Error("Invalid configuration data received");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching config:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải tiêu chí đánh giá. Vui lòng thử lại sau!",
        });
        setLoading(false);
      });

    fetchComicsCondition();
  }, []);

  useEffect(() => {
    if (editionRestricted) {
      fetchEditions();
    } else {
      setSelectedEditions([]);
      setUnSelectedEditions([]);
    }
  }, [editionRestricted]);
  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <div className=" w-full bg-gray-50  h-fit">
      <div className="w-full shadow-md rounded-lg border border-gray-200 bg-white p-5 ">
        <Typography.Title
          level={4}
          style={{ color: "#71002b" }}
          className="text-center mb-11 text-[#71002b]"
        >
          Cài đặt tiêu chí đánh giá
        </Typography.Title>
        <Form layout="vertical">
          <Form.Item style={{ width: "100%" }}>
            <div className="flex flex-row gap-3 items-center">
              <p className="text-lg font-bold">
                Yêu cầu toàn bộ thông tin của truyện
              </p>
              <Switch
                checked={isFullInfoFilled}
                onChange={(checked) => {
                  setIsEdited(false);
                  setIsFullInfoFilled(checked);
                  handleInputChange("isFullInfoFilled", checked);
                }}
              />
            </div>
          </Form.Item>
          <Form.Item style={{ width: "100%" }}>
            <div className="flex flex-col gap-3 ">
              <p className="text-lg font-bold">Tình trạng tối thiểu</p>
              <div className="px-4 w-full">
                <Slider
                  marks={formatGradingScaleToMarks(conditionGradingScales)}
                  step={null}
                  tooltip={{ open: false }}
                  value={condition.value}
                  onChange={(value: number) => {
                    setCondition(
                      conditionGradingScales.find(
                        (condition) => condition.value === value
                      )
                    );
                    setIsEdited(true);
                  }}
                  max={10}
                />
              </div>
              <div className="mx-auto flex flex-row w-full items-stretch justify-start gap-10 px-2 sm:px-4">
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
              </div>
            </div>
          </Form.Item>
          <Form.Item style={{ width: "100%" }}>
            <div className="flex flex-row gap-3 items-center">
              <p className="text-lg font-bold">Chọn phiên bản để đấu giá</p>
            </div>
            <div className="flex flex-col gap-2">
              {editions.map((edition, index) => (
                <button
                  key={index}
                  onClick={() => handleEditionClick(edition.id)}
                  className={`px-4 py-2 text-black rounded-lg hover:bg-gray-100 duration-300 flex flex-col text-start border-2 ${
                    !edition.auctionDisabled
                      ? "border-green-500"
                      : "border-gray-300"
                  }`}
                >
                  <p
                    className={`font-semibold ${
                      !edition.auctionDisabled
                        ? "text-green-500"
                        : "text-gray-500"
                    }`}
                  >
                    {edition.name}
                  </p>
                  <p className="opacity-80 text-xs">{edition.description}</p>
                </button>
              ))}
            </div>
          </Form.Item>
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={handleSave}
              disabled={!isEdited}
              style={{
                backgroundColor: isEdited ? "#71002b" : "#d3d3d3",
                borderColor: isEdited ? "#71002b" : "#d3d3d3",
                cursor: isEdited ? "pointer" : "not-allowed",
              }}
              className="w-full h-8"
            >
              Lưu Tiêu Chí Đánh Giá
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default EditAuctionCriteria;
