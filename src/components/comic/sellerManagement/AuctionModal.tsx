import { Box, Typography } from "@mui/material";
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
interface AuctionFormValues {
  reservePrice: number;
  maxPrice: number;
  priceStep: number;
  depositAmount: number;
  startTime: Moment | null;
  endTime: Moment | null;
}

type AuctionModalProps = {
  open: boolean;
  comic: Comic | null; // Null-safe typing
  onCancel: () => void;
  onSuccess: () => void;
};

const AuctionModal: React.FC<AuctionModalProps> = ({
  open,
  onCancel,
  comic,
  onSuccess,
}) => {
  const [form] = Form.useForm<AuctionFormValues>();
  console.log(form);

  const startTime = dayjs(form.getFieldValue("startTime"));
  const handleSubmit = async (values: AuctionFormValues) => {
    try {
      await privateAxios.post("/auction", {
        ...values,
        comicsId: comic?.id,
        status: "UPCOMING",
      });

      await privateAxios.patch("seller-subscriptions/auction", { quantity: 1 });

      onSuccess();
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };
  // Custom validator to check that the end time is not more than 7 days after the start time
  const validateEndTime = (value: any) => {
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
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      destroyOnClose={true}
      width={700}
      style={{ borderRadius: "16px" }}
      centered
    >
      <Typography
        variant="h4"
        fontWeight={"bold"}
        textAlign={"center"}
        style={{ borderBottom: "2px solid grey", paddingBottom: "5px" }}
      >
        Đấu giá
      </Typography>
      <Box sx={{ px: 3, py: 1 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            margin: "30px 0",
            p: 2,
            bgcolor: "#f5f5f5",
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 112,
              flexShrink: 0,
              borderRadius: 1,
              overflow: "hidden",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            <img
              src={comic?.coverImage}
              alt="Comic Cover"
              style={{ width: "100%", height: "100%", objectFit: "fill" }}
            />
          </Box>

          <div className="ml-3">
            <Typography sx={{ fontWeight: "bold" }}>{comic?.title}</Typography>
            <Typography fontSize={12}>{comic?.author}</Typography>
          </div>
        </Box>

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
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="maxPrice"
                label="Giá mua ngay (đ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá mua ngay" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  placeholder="Nhập giá mua ngay"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
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
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian bắt đầu",
                  },
                ]}
              >
                <DatePicker
                  showTime={{
                    format: "HH:mm",
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
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian kết thúc",
                  },
                  { validator: validateEndTime }, // Custom validation for end time
                ]}
              >
                <DatePicker
                  showTime={{
                    format: "HH:mm",
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
            <Button
              type="primary"
              style={{ backgroundColor: "#000", color: "white" }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#222")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#000")
              }
              htmlType="submit"
              block
            >
              Tạo đấu giá
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Modal>
  );
};

export default AuctionModal;
