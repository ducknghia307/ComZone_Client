import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  Form,
  notification,
  Card,
  Switch,
  Slider,
  Select,
} from "antd";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { AuctionCriteria } from "../../common/interfaces/auction.interface";
import {
  ConditionGradingScale,
  conditionGradingScales,
  getComicsCondition,
} from "../../common/constances/comicsConditions";
import type { SliderSingleProps } from "antd";
import { Edition } from "../../common/interfaces/edition.interface";
const formatGradingScaleToMarks = (
  gradingScale: ConditionGradingScale[]
): SliderSingleProps["marks"] => {
  const marks: SliderSingleProps["marks"] = {};

  gradingScale.forEach((item) => {
    marks[item.value] = {
      label: (
        <p className="whitespace-nowrap text-xs sm:text-base">
          {[0, 2, 5, 8, 10].some((v) => v === item.value) ? item.symbol : ""}
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
  const [condition, setCondition] = useState<number>();
  const [editions, setEditions] = useState<Edition[]>([]);
  const [selectedEditions, setSelectedEditions] = useState<string[]>([]);
  const [unSelectedEditions, setUnSelectedEditions] = useState<string[]>([]);
  const [isFullInfoFilled, setIsFullInfoFilled] = useState<boolean>(false);
  const [isEditionRestricted, setIsEdtionRestricted] = useState<boolean>(false);
  const [editionRestricted, setEditionRestricter] = useState<boolean>(false);
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
      console.log("editon", isEditionRestricted);

      if (isEditionRestricted) {
        const disabledEditions = response.data
          .filter((edition: Edition) => edition.auctionDisabled)
          .map((edition: Edition) => edition.id);
        setSelectedEditions(disabledEditions);
      }
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  };
  const handleSave = () => {
    console.log("config", config);
    console.log("is fill info", isFullInfoFilled);
    console.log("condition", condition);
    console.log("edition", editionRestricted);
    console.log("haha", unSelectedEditions);

    const payload = {
      isFullInfoFilled: isFullInfoFilled,
      conditionLevel: condition,
      disallowedEdition: editionRestricted ? unSelectedEditions : [],
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
  };
  const handleSwitchChange = (checked: boolean) => {
    setIsEdited(true);
    setEditionRestricter(checked);
    if (checked) {
      fetchEditions();
    } else {
      console.log("No editions selected:", selectedEditions);
      setSelectedEditions([]);
    }
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
          setEditionRestricter(fetchedConfig.editionRestricted);
          if (fetchedConfig.editionRestricted) {
            console.log("a");
            setIsEdtionRestricted(fetchedConfig.editionRestricted);
            fetchEditions();
          }
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
  }, []);
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
                Đầy đủ thông tin về cuốn truyện
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
              <p className="text-lg font-bold">Tình trạng truyện</p>
              <div className="px-4 w-full">
                <Slider
                  marks={formatGradingScaleToMarks(conditionGradingScales)}
                  step={null}
                  tooltip={{ open: false }}
                  value={condition}
                  onChange={(value: number) => {
                    setCondition(value);
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
                  <p className="text-lg font-semibold">
                    {getComicsCondition(condition).conditionState}
                  </p>
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
                  <p className="text-lg font-semibold">
                    {getComicsCondition(condition).value}/10
                  </p>
                </span>
              </div>
            </div>
          </Form.Item>
          <Form.Item style={{ width: "100%" }}>
            <div className="flex flex-row gap-3 items-center">
              <p className="text-lg font-bold">Phiên bản của cuốn truyện</p>
              <Switch
                checked={editionRestricted}
                onChange={handleSwitchChange}
              />
            </div>
            {editionRestricted && editions.length > 0 && (
              <Select
                mode="multiple"
                style={{ width: "100%", marginTop: "10px" }}
                placeholder="Chọn phiên bản"
                onChange={handleEditionChange}
                value={selectedEditions}
              >
                {editions.map((edition) => (
                  <Select.Option key={edition.id} value={edition.id}>
                    {edition.name}
                  </Select.Option>
                ))}
              </Select>
            )}
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
