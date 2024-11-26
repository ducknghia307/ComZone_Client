import { Typography } from "@mui/material";
import {
  Modal,
  Form,
  InputNumber,
  Button,
  DatePicker,
  Row,
  Col,
  notification,
} from "antd";
import { Moment } from "moment";
import dayjs from "dayjs";
import { privateAxios } from "../../../middleware/axiosInstance";

// Define types for the comic and props
interface Comic {
  id: string;
  coverImage: string;
  title: string;
  author: string;
}

interface AuctionModalProps {
  open: boolean;
  onCancel: () => void;
  comic: Comic;
  onSuccess: () => void;
}

interface AuctionFormValues {
  reservePrice: number;
  maxPrice: number;
  priceStep: number;
  depositAmount: number;
  startTime: Moment | null;
  endTime: Moment | null;
}

const AuctionModal: React.FC<AuctionModalProps> = ({
  open,
  onCancel,
  comic,
  onSuccess,
}) => {
  const [form] = Form.useForm<AuctionFormValues>();
  console.log(form);

  const startTime = dayjs(form.getFieldValue("startTime"));
  // Handle form submission
  const handleSubmit = async (values: AuctionFormValues) => {
    try {
      const response = await privateAxios.post("/auction", {
        ...values,
        comicsId: comic.id,
        status: "UPCOMING", // Add comic ID to the auction data
      });
      console.log(response.data);
      onSuccess(); // Trigger success action after successful API call
    } catch (error) {
      console.error("Error during API call:", error);
      // Handle any error state or show notification
    }
  };
  // Custom validator to check that the end time is not more than 7 days after the start time
  const validateEndTime = (rule, value) => {
    const startTime = form.getFieldValue("startTime");
    if (!startTime || !value) {
      return Promise.resolve();
    }

    // Use dayjs instead of moment
    if (dayjs(value).isBefore(dayjs(startTime))) {
      return Promise.reject("Thời gian kết thúc phải sau thời gian bắt đầu");
    }
    if (dayjs(value).diff(dayjs(startTime), "days") < 1) {
      return Promise.reject(
        "Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 ngày"
      );
    }

    // Check if the end time is more than 7 days after the start time
    if (dayjs(value).isAfter(dayjs(startTime).add(7, "days"))) {
      return Promise.reject(
        "Thời gian kết thúc không được vượt quá 7 ngày kể từ thời gian bắt đầu"
      );
    }
    return Promise.resolve();
  };

  return (
    <Modal open={open} onCancel={onCancel} footer={null} destroyOnClose={true}>
      <Typography
        variant="h4"
        fontWeight={"bold"}
        textAlign={"center"}
        style={{ borderBottom: "2px solid grey", paddingBottom: "5px" }}
      >
        Đấu giá
      </Typography>

      <div
        style={{
          display: "flex",
          margin: "10px 0",
          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 80,
            height: 100,
            border: "2px solid grey",
            borderRadius: "6px",
          }}
        >
          <img
            src={comic?.coverImage}
            alt="Comic Cover"
            style={{ width: "100%", height: "100%", objectFit: "fill" }}
          />
        </div>
        <div className="ml-3">
          <Typography sx={{ fontWeight: "bold" }}>{comic?.title}</Typography>
          <Typography fontSize={12}>{comic?.author}</Typography>
        </div>
      </div>

      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="reservePrice"
              label="Giá khởi điểm (đ)"
              rules={[
                { required: true, message: "Vui lòng nhập giá khởi điểm" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập giá khởi điểm"
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="maxPrice"
              label="Giá tối đa (đ)"
              rules={[{ required: true, message: "Vui lòng nhập giá tối đa" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập giá tối đa"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="priceStep"
              label="Bước giá (đ)"
              rules={[{ required: true, message: "Vui lòng nhập bước giá" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập bước giá"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              name="depositAmount"
              label="Mức cọc (đ)"
              rules={[{ required: true, message: "Vui lòng nhập mức cọc" }]}
            >
              <InputNumber
                style={{ width: "100%" }}
                min={0}
                placeholder="Nhập mức cọc"
              />
            </Form.Item>
          </Col>
        </Row>
        {/* Row to display start and end time next to each other */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startTime"
              label="Thời gian bắt đầu"
              rules={[
                { required: true, message: "Vui lòng chọn thời gian bắt đầu" },
              ]}
            >
              <DatePicker
                showTime={{
                  format: "HH:mm",
                  second: false, // Disable seconds
                }}
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
                placeholder="Chọn thời gian bắt đầu"
                disabledDate={(current) => {
                  // Disable all dates before now
                  return current && current.isBefore(dayjs().startOf("day"));
                }}
                disabledTime={(current) => {
                  // Only allow times that are at least 1 hour after the current time
                  if (!current) return {};
                  const now = dayjs();
                  const oneHourFromNow = now.add(1, "hour");
                  if (current.isSame(now, "day")) {
                    return {
                      disabledHours: () =>
                        Array.from({ length: 24 }, (_, i) =>
                          i < oneHourFromNow.hour() ? i : -1
                        ).filter((x) => x !== -1),
                      disabledMinutes: () =>
                        current.isSame(oneHourFromNow, "hour")
                          ? Array.from({ length: 60 }, (_, i) =>
                              i < oneHourFromNow.minute() ? i : -1
                            ).filter((x) => x !== -1)
                          : [],
                    };
                  }
                  return {};
                }}
              />
            </Form.Item>
          </Col>

          <Col span={12}>
            <Form.Item
              name="endTime"
              label="Thời gian kết thúc"
              rules={[
                { required: true, message: "Vui lòng chọn thời gian kết thúc" },
                { validator: validateEndTime }, // Custom validation for end time
              ]}
            >
              <DatePicker
                showTime={{
                  format: "HH:mm",
                  second: false, // Disable seconds
                }}
                format="YYYY-MM-DD HH:mm"
                style={{ width: "100%" }}
                placeholder="Nhập thời gian kết thúc"
                disabledDate={(current) => {
                  const startTime = form.getFieldValue("startTime");
                  if (!startTime) return false;

                  const startDayjs = dayjs(startTime);
                  const oneDayAfter = startDayjs.add(1, "day");
                  const sevenDaysAfter = startDayjs.add(7, "days");

                  return (
                    current.isBefore(oneDayAfter.startOf("day")) ||
                    current.isAfter(sevenDaysAfter.endOf("day"))
                  );
                }}
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Tạo đấu giá
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuctionModal;
