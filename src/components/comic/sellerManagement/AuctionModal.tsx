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
import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import { useEffect, useState } from "react";
import InfoIcon from "@mui/icons-material/Info";
import { Comic } from "../../../common/base.interface";

interface AuctionFormValues {
  id: string;
  reservePrice: number;
  maxPrice: number;
  priceStep: number;
  depositAmount: number;
  duration: number;
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
  const [config, setConfig] = useState({
    priceStepPercentage: 0,
    depositPercentage: 0,
    buyNowMultiplier: 0,
  });
  const [form] = Form.useForm<AuctionFormValues>();

  useEffect(() => {
    publicAxios
      .get("/auction-config")
      .then((response) => {
        console.log("123", response);

        setConfig({
          priceStepPercentage: response.data[0].priceStepConfig,
          depositPercentage: response.data[0].depositAmountConfig,
          buyNowMultiplier: response.data[0].maxPriceConfig,
        });
      })
      .catch((error) => console.error("Error fetching config:", error));
  }, []);

  const startTime = dayjs(form.getFieldValue("startTime"));
  const handleSubmit = async (values: AuctionFormValues) => {
    try {
      const reservePrice = form.getFieldValue("reservePrice");

      // Use the buyNowMultiplier from config state to calculate maxAllowedPrice
      const maxAllowedPrice = reservePrice * config.buyNowMultiplier;

      const maxPrice = form.getFieldValue("maxPrice");

      if (maxPrice < reservePrice) {
        form.setFields([
          {
            name: "maxPrice",
            errors: [
              `Giá mua ngay không được thấp hơn giá khởi điểm (${reservePrice.toLocaleString()}đ)`,
            ],
          },
        ]);
        return;
      }

      if (maxPrice > maxAllowedPrice) {
        form.setFields([
          {
            name: "maxPrice",
            errors: [
              `Giá mua ngay không được vượt quá ${maxAllowedPrice.toLocaleString()}đ (${
                config.buyNowMultiplier
              } lần giá khởi điểm)`,
            ],
          },
        ]);
        return;
      }

      if (form.getFieldValue("id")) {
        await privateAxios.post("/auction-request", {
          ...values,
          comicId: comic?.id,
        });
      } else {
        await privateAxios.post("/auction-request", {
          ...values,
          comicId: comic?.id,
        });
      }
      await privateAxios.patch("seller-subscriptions/auction", {
        quantity: 1,
      });

      notification.success({
        message: "Tạo đấu giá thành công",
        description: `Đấu giá cho truyện "${comic?.title}" đã được tạo.`,
        duration: 5,
      });

      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Error during API call:", error);

      notification.error({
        message: "Lỗi",
        description:
          "Không thể thực hiện thao tác đấu giá. Vui lòng kiểm tra lại dữ liệu.",
        duration: 5,
      });
    }
  };

  useEffect(() => {
    const fetchAuctionData = async () => {
      if (comic?.id) {
        try {
          const { data } = await publicAxios.get(`/auction/comics/${comic.id}`);
          console.log("z", data);

          const roundToNearest = (
            value: number,
            denomination: number
          ): number => Math.round(value / denomination) * denomination;

          // Use the priceStepPercentage and depositPercentage from config state
          const priceStep = roundToNearest(
            comic.price * (config.priceStepPercentage / 100),
            500
          );
          const depositAmount = roundToNearest(
            comic.price * (config.depositPercentage / 100),
            500
          );

          if (data.status === "STOPPED") {
            form.setFieldsValue({
              id: data.id,
              reservePrice: comic.price,
              maxPrice: data.maxPrice,
              priceStep: priceStep,
              depositAmount: depositAmount,
              duration: data.duration,
              startTime: dayjs(data.startTime),
              endTime: dayjs(data.endTime),
            });
          } else {
            form.setFieldsValue({
              reservePrice: comic.price,
              priceStep: priceStep,
              depositAmount: depositAmount,
            });
          }
        } catch (error) {
          console.error("Error fetching auction data:", error);
          form.resetFields();
        }
      }
    };

    if (open) {
      fetchAuctionData();
    }
  }, [comic?.id, open, form, config]);

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
            margin: "20px 0 10px",
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
        <div>
          <Typography
            variant="body2"
            style={{
              marginBottom: "10px",
              fontFamily: "REM",
              fontStyle: "italic",
              color: "#333",
              padding: "10px",
              backgroundColor: "#f0f0f0",
              borderRadius: "10px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <InfoIcon fontSize="small" style={{ marginRight: "5px" }} />
              Giá khởi điểm dựa trên giá của truyện.
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <InfoIcon fontSize="small" style={{ marginRight: "5px" }} />
              Bước giá dựa trên {config.priceStepPercentage}% của giá khởi điểm.
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "3px",
              }}
            >
              <InfoIcon fontSize="small" style={{ marginRight: "5px" }} /> Mức
              cọc dựa trên {config.depositPercentage}% của giá khởi điểm.
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <InfoIcon fontSize="small" style={{ marginRight: "5px" }} />
              Giá mua ngay không vượt quá {config.buyNowMultiplier} lần giá khởi
              điểm.
            </div>
          </Typography>
        </div>

        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Row gutter={16}>
            <Col span={8}>
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
                  disabled
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="priceStep"
                label="Bước giá tối thiểu (đ)"
                rules={[{ required: true, message: "Vui lòng nhập bước giá" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled
                  placeholder="Nhập bước giá"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="depositAmount"
                label="Mức cọc (đ)"
                rules={[{ required: true, message: "Vui lòng nhập mức cọc" }]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={0}
                  disabled
                  placeholder="Nhập mức cọc"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={13}>
              <Form.Item
                name="maxPrice"
                label="Giá mua ngay (đ)"
                rules={[
                  { required: true, message: "Vui lòng nhập giá mua ngay" },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  placeholder="Nhập giá mua ngay"
                  formatter={(value) =>
                    value === undefined || value === null
                      ? ""
                      : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
                  }
                  parser={(value) => (value ? value.replace(/\./g, "") : "")}
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="duration"
                label="Thời lượng đấu giá (1 - 7 Ngày)"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng nhập thời lượng đấu giá",
                  },
                  {
                    type: "number",
                    min: 1,
                    max: 7,
                    message: "Thời lượng đấu giá phải từ 1 đến 7 ngày",
                  },
                ]}
              >
                <InputNumber
                  style={{ width: "100%" }}
                  min={1}
                  max={7}
                  placeholder="Nhập thời lượng đấu giá"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
          </Row>

          {/* Row to display start and end time  next to each other */}
          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Thời gian bắt đầu"
                rules={[
                  {
                    required: true,
                    message: "Vui lòng chọn thời gian bắt đầu",
                  },
                  {
                    validator: (_, value) => {
                      if (!value) return Promise.resolve();

                      const now = dayjs();
                      const minStartTime = now.add(9, "minute");

                      if (dayjs(value).isBefore(minStartTime)) {
                        return Promise.reject(
                          "Thời gian bắt đầu phải cách hiện tại ít nhất 10 phút"
                        );
                      }
                      return Promise.resolve();
                    },
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
                    // Disable dates before today
                    return current && current.isBefore(dayjs().startOf("day"));
                  }}
                  disabledTime={(current) => {
                    // Only allow times at least 15 minutes from now
                    if (!current) return {};
                    const now = dayjs();
                    const fifteenMinutesFromNow = now.add(10, "minute");

                    if (current.isSame(now, "day")) {
                      return {
                        disabledHours: () =>
                          Array.from({ length: 24 }, (_, i) =>
                            i < fifteenMinutesFromNow.hour() ? i : -1
                          ).filter((x) => x !== -1),
                        disabledMinutes: () =>
                          current.isSame(fifteenMinutesFromNow, "hour")
                            ? Array.from({ length: 60 }, (_, i) =>
                                i < fifteenMinutesFromNow.minute() ? i : -1
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
                  {
                    validator: (_, value) => validateEndTime(value), // Attach custom validator
                  },
                ]}
              >
                <DatePicker
                  showTime={{
                    format: "HH:mm",
                  }}
                  format="YYYY-MM-DD HH:mm"
                  style={{ width: "100%" }}
                  placeholder="Chọn thời gian kết thúc"
                  disabledDate={(current) => {
                    const startTime = form.getFieldValue("startTime");
                    if (!startTime) return true;

                    const startDayjs = dayjs(startTime);
                    const oneDayAfter = startDayjs.add(1, "day");
                    const sevenDaysAfter = startDayjs.add(7, "days");

                    return (
                      current.isBefore(oneDayAfter.startOf("day")) ||
                      current.isAfter(sevenDaysAfter.endOf("day"))
                    );
                  }}
                  disabledTime={(current) => {
                    const startTime = form.getFieldValue("startTime");
                    if (!startTime || !current) return {};

                    const startDayjs = dayjs(startTime);
                    const exactOneDayAfter = startDayjs.add(1, "day");

                    if (current.isSame(exactOneDayAfter, "day")) {
                      return {
                        disabledHours: () =>
                          Array.from({ length: 24 }, (_, i) =>
                            i < exactOneDayAfter.hour() ? i : -1
                          ).filter((x) => x !== -1),
                        disabledMinutes: () =>
                          current.hour() === exactOneDayAfter.hour()
                            ? Array.from({ length: 60 }, (_, i) =>
                                i < exactOneDayAfter.minute() ? i : -1
                              ).filter((x) => x !== -1)
                            : [],
                      };
                    }

                    return {};
                  }}
                />
              </Form.Item>
            </Col>
          </Row> */}

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
              Gửi yêu cầu đấu giá
            </Button>
          </Form.Item>
        </Form>
      </Box>
    </Modal>
  );
};

export default AuctionModal;
