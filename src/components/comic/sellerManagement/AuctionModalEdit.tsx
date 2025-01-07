import React, { useEffect, useState } from "react";
import { Typography, Box } from "@mui/material";
import {
  Form,
  InputNumber,
  DatePicker,
  Modal,
  Col,
  Row,
  notification,
} from "antd";
import dayjs from "dayjs";
import InfoIcon from "@mui/icons-material/Info";
import { privateAxios, publicAxios } from "../../../middleware/axiosInstance";
import { Auction, Comic } from "../../../common/base.interface";
import { RuleObject } from "antd/lib/form";
import { Moment } from "moment";
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
const AuctionModalEdit = ({
  open,
  onCancel,
  comic,
  auctionData,
  onSuccess,
}: {
  open: boolean;
  onCancel: () => void;
  comic: Comic;
  auctionData: Auction;
  onSuccess: (updatedAuctionData: Auction) => void;
}) => {
  const [form] = Form.useForm();
  const now = dayjs();
  const [config, setConfig] = useState({
    priceStepPercentage: 0,
    depositPercentage: 0,
    buyNowMultiplier: 0,
  });
  useEffect(() => {
    const fetchAuctionData = async () => {
      if (comic?.id) {
        try {
          const { data } = await privateAxios.get(
            `/auction/comics/${comic.id}`
          );
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
        console.log('form.getFieldValue("id")', form.getFieldValue("id"));

        await privateAxios.put(`/auction/${form.getFieldValue("id")}/start`, {
          ...values,
          status: "UPCOMING",
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
    if (auctionData) {
      console.log(auctionData.depositAmount);

      form.setFieldsValue({
        reservePrice: auctionData.reservePrice,
        maxPrice: auctionData.maxPrice,
        priceStep: auctionData.priceStep,
        depositAmount: auctionData.depositAmount,
        startTime: dayjs(auctionData.startTime),
        endTime: dayjs(auctionData.endTime),
      });
    }
  }, [auctionData, form]);
  const validateStartTime = (rule: RuleObject, value: dayjs.Dayjs) => {
    const now = dayjs();

    if (value) {
      // Ensure that the start time is at least 1 hour and 1 minute after the current time
      const oneHourAndOneMinuteFromNow = now.add(59, "minute");

      if (value.isBefore(oneHourAndOneMinuteFromNow)) {
        return Promise.reject(
          "Thời gian bắt đầu phải ít nhất 1 giờ 1 phút sau thời gian hiện tại"
        );
      }
    }

    return Promise.resolve();
  };

  const validateEndTime = (rule: RuleObject, value: dayjs.Dayjs) => {
    const startTime = form.getFieldValue("startTime");
    if (!startTime || !value) return Promise.resolve();

    if (dayjs(value).isBefore(dayjs(startTime))) {
      return Promise.reject("Thời gian kết thúc phải sau thời gian bắt đầu");
    }
    if (dayjs(value).diff(dayjs(startTime), "days") < 1) {
      return Promise.reject(
        "Thời gian kết thúc phải cách thời gian bắt đầu ít nhất 1 ngày"
      );
    }

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
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                  min={0}
                  placeholder="Nhập giá mua ngay"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={11}>
              <Form.Item
                name="duration"
                label="Thời lượng đấu giá (1-7 Ngày)"
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
          {/* Submit Button */}
          <Form.Item style={{ marginTop: "10px" }}>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "6px",
                backgroundColor: "#000",
                color: "white",
                border: "none",
                borderRadius: "8px",
                fontSize: "16px",
                fontWeight: 500,
                cursor: "pointer",
                transition: "background-color 0.2s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#222")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#000")
              }
            >
              Mở Lại Phiên Đấu Giá
            </button>
          </Form.Item>
        </Form>
      </Box>
    </Modal>
  );
};

export default AuctionModalEdit;
