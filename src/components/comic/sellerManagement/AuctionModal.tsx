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
import moment, { Moment } from "moment";
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
  const startTime = dayjs(form.getFieldValue("startTime"));
  // Handle form submission
  const handleSubmit = async (values: AuctionFormValues) => {
    console.log('11',comic.id);
    try {
      const response = await privateAxios.post("/auction", {
        ...values,
        comicId: comic.id,
        status:"ONGOING" // Add comic ID to the auction data
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
        <Form.Item
          name="reservePrice"
          label="Giá khởi điểm (đ)"
          rules={[{ required: true, message: "Vui lòng nhập giá khởi điểm" }]}
        >
          <InputNumber
            style={{ width: "100%" }}
            min={0}
            placeholder="Nhập giá khởi điểm"
          />
        </Form.Item>

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
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: "100%" }}
                placeholder="Chọn thời gian bắt đầu"
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
                showTime
                format="YYYY-MM-DD HH:mm:ss"
                style={{ width: "100%" }}
                placeholder="Nhập thời gian kết thúc"
                disabledDate={(current) => {
                  const startTime = form.getFieldValue("startTime");
                  if (!startTime) return false; // Don't disable any dates until start time is set

                  const startDayjs = dayjs(startTime); // Convert startTime to dayjs
                  const sevenDaysAfter = startDayjs.add(7, "days"); // Get the date 7 days after startTime

                  // Disable dates before start date or after 7 days from start date
                  return (
                    current.isBefore(startDayjs) ||
                    current.isAfter(sevenDaysAfter)
                  );
                }}
                disabledTime={() => {
                  if (!startTime) return {};
                  return {
                    disabledHours: () => {
                      const hours = startTime.add(7, "days").hour(); // Use dayjs here
                      return Array.from({ length: 24 }, (_, i) => i >= hours);
                    },
                  };
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
