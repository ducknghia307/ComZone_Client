import React, { useState, useEffect } from "react";
import {
  Button,
  Input,
  Typography,
  Form,
  notification,
  Card,
  Switch,
} from "antd";
import { publicAxios } from "../../middleware/axiosInstance";

const AdminAuction: React.FC = () => {
  const [config, setConfig] = useState({
    id: "",
    priceStepConfig: 0,
    depositAmountConfig: 0,
    maxPriceConfig: 0,
  });
  const [originalConfig, setOriginalConfig] = useState({
    id: "",
    priceStepConfig: 0,
    depositAmountConfig: 0,
    maxPriceConfig: 0,
  });
  const [isEdited, setIsEdited] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicAxios
      .get("/auction-config")
      .then((response) => {
        const fetchedConfig = response.data[0];
        if (fetchedConfig && fetchedConfig.id) {
          setConfig({
            id: fetchedConfig.id,
            priceStepConfig: fetchedConfig.priceStepConfig || 0,
            depositAmountConfig: fetchedConfig.depositAmountConfig || 0,
            maxPriceConfig: fetchedConfig.maxPriceConfig || 0,
          });
          setOriginalConfig({
            id: fetchedConfig.id,
            priceStepConfig: fetchedConfig.priceStepConfig || 0,
            depositAmountConfig: fetchedConfig.depositAmountConfig || 0,
            maxPriceConfig: fetchedConfig.maxPriceConfig || 0,
          });
        } else {
          throw new Error("Invalid configuration data received");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching config:", error);
        notification.error({
          message: "Lỗi",
          description: "Không thể tải cấu hình đấu giá. Vui lòng thử lại sau!",
        });
        setLoading(false);
      });
  }, []);

  const handleInputChange = (field: string, value: string | number) => {
    const updatedConfig = { ...config, [field]: value };
    setConfig(updatedConfig);

    const isConfigEdited =
      JSON.stringify(updatedConfig) !== JSON.stringify(originalConfig);
    setIsEdited(isConfigEdited);
  };

  const handleSave = () => {
    publicAxios
      .put(`/auction-config/${config.id}`, config)
      .then((response) => {
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
          Cài đặt thông số đấu giá
        </Typography.Title>
        <Form layout="vertical">
          <Form.Item label="Bước Giá (%)" style={{ width: "100%" }}>
            <Typography.Text type="secondary">
              Bước giá sẽ dựa trên bao nhiêu % của giá của truyện.
            </Typography.Text>
            <Input
              type="number"
              value={config.priceStepConfig}
              onChange={(e) =>
                handleInputChange("priceStepConfig", Number(e.target.value))
              }
              className="w-full"
            />
          </Form.Item>
          <Form.Item label="Mức Cọc (%)" style={{ width: "100%" }}>
            <Typography.Text type="secondary">
              Mức cọc sẽ là tỷ lệ phần trăm của giá trị đấu giá.
            </Typography.Text>
            <Input
              type="number"
              value={config.depositAmountConfig}
              onChange={(e) =>
                handleInputChange("depositAmountConfig", Number(e.target.value))
              }
            />
          </Form.Item>
          <Form.Item label="Giá Mua Ngay (Lần)" style={{ width: "100%" }}>
            <Typography.Text type="secondary">
              Giá mua ngay là giá tối đa mà người dùng có thể đặt.
            </Typography.Text>
            <Input
              type="number"
              value={config.maxPriceConfig}
              onChange={(e) =>
                handleInputChange("maxPriceConfig", Number(e.target.value))
              }
              className="w-full"
            />
          </Form.Item>
          <Form.Item style={{ width: "100%" }}>
            <div className="flex flex-row gap-3 items-center">
              <p>Cho phép người dùng nhập giá mua ngay</p>
              <Switch defaultChecked />
            </div>
          </Form.Item>
          <div className="flex justify-center">
            <Button
              type="primary"
              onClick={handleSave}
              disabled={!isEdited} // Disable button if no field is edited
              style={{
                backgroundColor: isEdited ? "#71002b" : "#d3d3d3",
                borderColor: isEdited ? "#71002b" : "#d3d3d3",
                cursor: isEdited ? "pointer" : "not-allowed",
              }}
              className="w-full h-8"
            >
              Lưu Cấu Hình
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default AdminAuction;
