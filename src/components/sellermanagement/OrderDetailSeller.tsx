import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  IconButton,
  Box,
  Paper,
  Stack,
  Divider,
  useTheme,
  alpha,
  styled,
  Chip,
  Button,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Close as CloseIcon } from "@mui/icons-material";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { privateAxios } from "../../middleware/axiosInstance";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { OrderDetailData } from "../../common/base.interface";
import { Modal, notification } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "../ui/OrderDetailSeller.css";
import CurrencySplitter from "../../assistants/Spliter";

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: theme.spacing(2),
    maxHeight: "90vh",
    boxShadow: theme.shadows[10],
  },
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(3),
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.spacing(2),
  transition: "transform 0.2s, box-shadow 0.2s",
  "&:hover": {
    boxShadow: theme.shadows[4],
  },
}));

const StatusChip = styled("span")<{ status: string; deliveryStatus?: string }>(
  ({ theme, status, deliveryStatus }) => {
    const getStatusColor = () => {
      if (status === "PACKAGING" && deliveryStatus === "ready_to_pick") {
        return { color: "#7c4af2", backgroundColor: "#e0d4fc" };
      }
      switch (status) {
        case "PENDING":
          return { color: "#ff9800", backgroundColor: "#fff3e0" };
        case "DELIVERED":
          return { color: "#32CD32", backgroundColor: "#ccfccc" };
        case "PACKAGING":
          return { color: "#ff6b1c", backgroundColor: "#ffe8db" };
        case "DELIVERING":
          return { color: "#2196f3", backgroundColor: "#e3f2fd" };
        case "SUCCESSFUL":
          return { color: "#4caf50", backgroundColor: "#e8f5e9" };
        case "FAILED":
          return { color: "#f44336", backgroundColor: "#ffebee" };
        case "CANCELED":
          return { color: "#ff0000", backgroundColor: "#ffe1e1" };
        default:
          return {
            color: theme.palette.info.main,
            bgColor: alpha(theme.palette.info.light, 0.2),
          };
      }
    };

    const { color, backgroundColor } = getStatusColor();
    return {
      color: color,
      backgroundColor: backgroundColor,
      borderRadius: theme.spacing(1),
      padding: theme.spacing(1, 2.5),
      fontWeight: 600,
      display: "inline-flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
      fontSize: "0.875rem",
      textTransform: "uppercase",
      letterSpacing: "0.5px",
    };
  }
);

interface OrderDetailProps {
  open: boolean;
  setSelectedOrderId: React.Dispatch<React.SetStateAction<string>>;
  onClose: () => void;
  orderId: string;
  onStatusUpdate: (
    orderId: string,
    newStatus: string,
    delivery?: { status: string }
  ) => void;
  order: OrderDetailData | undefined;
  reload: () => void;
}

const InfoRow = ({
  label,
  value,
  paymentMethod,
}: {
  label: string;
  value: string | number;
  paymentMethod?: string;
}) => {
  const theme = useTheme();

  const paymentStatusColor =
    paymentMethod === "WALLET"
      ? "#32CD32"
      : paymentMethod === "COD"
        ? "#ff9800"
        : "#000";

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      py={1}
      px={3}
      sx={{
        "&:hover": {
          backgroundColor: alpha(theme.palette.primary.light, 0.05),
          borderRadius: 1,
        },
      }}
    >
      <Typography
        color="text.secondary"
        variant="body2"
        sx={{
          whiteSpace: "nowrap",
          fontWeight: "bold",
          color: "#000",
          fontSize: "16px",
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        fontWeight={500}
        sx={{
          paddingLeft: 2,
          color: paymentMethod ? paymentStatusColor : "#000",
          whiteSpace: "normal",
          wordWrap: "break-word",
        }}
      >
        {value}
      </Typography>
    </Box>
  );
};

const OrderDetailSeller: React.FC<OrderDetailProps> = ({
  open,
  setSelectedOrderId,
  onClose,
  orderId,
  onStatusUpdate,
  order,
  reload,
}) => {
  const [orderDetail, setOrderDetail] = useState<OrderDetailData | null>(null);
  const theme = useTheme();
  const [orders, setOrders] = useState<OrderDetailData[]>([]);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await privateAxios.get(`/orders/${orderId}`);
        let ordersData = response.data;
        if (typeof ordersData === "string") {
          ordersData = JSON.parse(ordersData);
        }
        setOrderDetail(ordersData);

        const ordersArray = Array.isArray(ordersData)
          ? ordersData
          : [ordersData];
        console.log(ordersArray);

        const ordersWithItems = await Promise.all(
          ordersArray.map(async (order: any) => {
            const itemsResponse = await privateAxios.get(
              `/order-items/order/${order.id}`
            );
            const itemsData = itemsResponse.data;
            return { ...order, items: itemsData };
          })
        );

        setOrders(ordersWithItems);
        console.log("Orders with items:", ordersWithItems);
      } catch (error) {
        console.error("Error fetching order details:", error);
      }
    };

    if (open) {
      fetchOrderDetail();
    }
  }, [open, orderId]);

  const translateStatus = (status: string, deliveryStatus?: string) => {
    if (status === "PACKAGING" && deliveryStatus === "ready_to_pick") {
      return "Chờ bàn giao hàng";
    }
    switch (status) {
      case "PENDING":
        return "Đang chờ xử lý";
      case "DELIVERED":
        return "Đã giao hàng";
      case "PACKAGING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang giao hàng";
      case "SUCCESSFUL":
        return "Hoàn tất";
      case "CANCELED":
        return "Đã hủy";
      case "FAILED":
        return "Thất bại";
      default:
        return status;
    }
  };

  const handleConfirmAction = async (actionType: string) => {
    const confirmConfig = {
      start: {
        title: "Xác nhận đơn hàng",
        content: "Bạn có chắc chắn muốn bắt đầu đóng gói đơn hàng này không?",
      },
      finish: {
        title: "Hoàn tất đóng gói",
        content:
          "Bạn có chắc chắn muốn hoàn tất đóng gói để shipper có thể đến lấy hàng không?",
      },
    };

    const { title, content } =
      confirmConfig[actionType as keyof typeof confirmConfig];

    Modal.confirm({
      title: <p className="text-lg font-bold">{title}</p>,
      icon: (
        <ExclamationCircleOutlined
          style={{ fontSize: "36px", color: "#faad14" }}
        />
      ),
      content: <p className="text-base text-justify">{content}</p>,
      okText: "Xác nhận",
      cancelText: "Hủy",
      centered: true,
      className: "styled-modal-confirm",
      onOk: async () => {
        try {
          const endpoint =
            actionType === "start"
              ? `/orders/status/start-packaging/${orderId}`
              : `/orders/status/finish-packaging/${orderId}`;

          const response = await privateAxios.post(endpoint);

          if (actionType === "start") {
            const updatedDetail = { ...orderDetail, status: "PACKAGING" };
            setOrderDetail(updatedDetail);
            onStatusUpdate(orderId, "PACKAGING");

            notification.success({
              message: "Thành công",
              description: "Đã xác nhận đơn hàng thành công",
              duration: 3,
            });
          } else if (actionType === "finish") {
            const updatedDeliveryStatus = "ready_to_pick";
            const updatedDetail = {
              ...orderDetail,
              status: "PACKAGING",
              delivery: {
                ...orderDetail?.delivery,
                status: updatedDeliveryStatus,
              },
            };

            setOrderDetail(updatedDetail);
            onStatusUpdate(orderId, "PACKAGING", {
              status: updatedDeliveryStatus,
            });

            reload();

            notification.success({
              message: "Thành công",
              description: "Trạng thái đơn hàng đã được cập nhật thành công",
              duration: 3,
            });
          }

          setSelectedOrderId(null);
        } catch (error: any) {
          if (actionType === "finish" && error.response?.status === 400) {
            Modal.confirm({
              title: "Lỗi đơn hàng",
              icon: <ExclamationCircleOutlined />,
              content: "Đơn hàng bị lỗi. Bạn cần phải hủy đơn hàng.",
              okText: "Hủy đơn hàng",
              cancelText: "Đóng",
              onOk: async () => {
                try {
                  await privateAxios.patch("/orders/cancel", {
                    orderId: orderId,
                    cancelReason: "Lỗi tạo đơn vận chuyển giao hàng.",
                  });

                  const updatedDetail = { ...orderDetail, status: "CANCELED" };
                  setOrderDetail(updatedDetail);
                  onStatusUpdate(orderId, "CANCELED");

                  notification.success({
                    message: "Thành công",
                    description: "Đơn hàng đã được hủy thành công",
                    duration: 3,
                  });

                  reload();
                } catch (cancelError) {
                  notification.error({
                    message: "Lỗi",
                    description: "Có lỗi xảy ra khi hủy đơn hàng",
                    duration: 3,
                  });
                }
              },
            });
          } else {
            notification.error({
              message: "Lỗi",
              description: "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng",
              duration: 3,
            });
          }
        }
      },
    });
  };

  useEffect(() => {
    if (order) {
      setOrderDetail(order);
    }
  }, [order]);

  if (!orderDetail) return null;

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        sx={{
          p: 3,
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <StatusChip
            status={orderDetail.status}
            deliveryStatus={orderDetail.delivery?.status}
            sx={{ textTransform: "none", fontFamily: 'REM', fontWeight: 'bold' }}
          >
            {translateStatus(orderDetail.status, orderDetail.delivery?.status)}
          </StatusChip>
          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: "1.5rem",
              color: theme.palette.text.primary,
              textTransform: "none",
              marginRight: "100px",
              fontFamily: "REM",
            }}
          >
            Chi tiết đơn hàng
          </Typography>
          <IconButton
            onClick={onClose}
            size="small"
            sx={{
              color: theme.palette.grey[500],
              "&:hover": {
                backgroundColor: alpha(theme.palette.grey[500], 0.1),
              },
            }}
          >
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: theme.palette.text.secondary,
                fontWeight: 500,
              }}
            >
              Ngày tạo đơn hàng:{" "}
              {new Date(orderDetail.createdAt).toLocaleString()}
            </Typography>

            {orderDetail.delivery.deliveryTrackingCode && (
              <span className="REM flex items-center gap-4">
                <Typography
                  variant="body2"
                  sx={{
                    color: theme.palette.text.secondary,
                    fontWeight: 500,
                  }}
                >
                  Mã đơn hàng: {orderDetail.delivery.deliveryTrackingCode}
                </Typography>

                <button
                  onClick={() =>
                    window
                      .open(
                        `https://tracking.ghn.dev/?order_code=${order.delivery.deliveryTrackingCode}`,
                        "_blank"
                      )
                      ?.focus()
                  }
                  className="italic text-gray-600 text-sm font-light underline duration-200 hover:text-black"
                >
                  Tra cứu vận chuyển
                </button>
              </span>
            )}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "20px",
              alignItems: "center",
            }}
          >
            {orderDetail.status === "CANCELED" && (
              <Chip
                label={
                  <Box display="flex" alignItems="center">
                    <Typography
                      component="span"
                      fontWeight="bold"
                      sx={{ marginRight: 0.5 }}
                    >
                      Lý do hủy:
                    </Typography>
                    <Typography component="span">
                      {orderDetail.cancelReason}
                    </Typography>
                  </Box>
                }
                variant="outlined"
                sx={{
                  color: theme.palette.error.main,
                  borderColor: theme.palette.error.main,
                  fontWeight: 500,
                }}
              />
            )}
          </div>
        </Box>
      </DialogTitle>

      <DialogContent
        sx={{
          p: 3,
          backgroundColor: "alpha(theme.palette.background.default, 0.5)",
        }}
      >
        <Stack spacing={3}>
          <Grid container spacing={3}>
            <Grid
              size={12}
              sx={{
                borderBottom: `1px solid ${theme.palette.divider}`,
                borderTop: `1px solid ${theme.palette.divider}`,
                paddingTop: "10px",
                paddingBottom: "10px",
              }}
            >
              <Stack
                divider={<Divider />}
                spacing={2}
                direction="row"
                justifyContent="space-between"
                padding={"10px 20px"}
              >
                <Box
                  display="flex"
                  flexDirection="column"
                  flex={1}
                  gap={1}
                  textAlign="end"
                >
                  <Chip
                    label="Thông tin người nhận"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      backgroundColor: "#fff",
                      color: "#000",
                      padding: "18px 25px",
                      fontFamily: "REM",
                      border: "2px solid black",
                    }}
                  />
                  <InfoRow
                    label="Họ tên"
                    value={orderDetail.delivery?.to?.name}
                  />
                  <InfoRow
                    label="Số điện thoại"
                    value={orderDetail.delivery?.to?.phone}
                  />
                  {orderDetail.delivery?.to?.fullAddress && (
                    <InfoRow
                      label="Địa chỉ"
                      value={orderDetail.delivery?.to?.fullAddress}
                    />
                  )}
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                  <Chip
                    label="Thông tin thanh toán"
                    sx={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      backgroundColor: "#fff",
                      color: "#000",
                      padding: "18px 25px",
                      fontFamily: "REM",
                      border: "2px solid black",
                    }}
                  />
                  <InfoRow
                    label="Tổng tiền"
                    value={`${CurrencySplitter(orderDetail.totalPrice)} đ`}
                  />
                  <InfoRow
                    label="Phương thức thanh toán"
                    value={
                      orderDetail.paymentMethod === "WALLET"
                        ? "Ví Comzone"
                        : orderDetail.paymentMethod
                    }
                  />
                  <InfoRow
                    label="Trạng thái thanh toán"
                    value={
                      orderDetail.paymentMethod === "WALLET"
                        ? "Đã thanh toán"
                        : "Chưa thanh toán"
                    }
                    paymentMethod={orderDetail.paymentMethod}
                  />
                </Box>
              </Stack>
            </Grid>

            <Grid size={12} sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
              <Chip
                label="Thông tin sản phẩm"
                sx={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "18px 25px",
                  fontFamily: "REM",
                  border: "2px solid black",
                  marginBottom: "20px",
                }}
              />
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: "rgba(0,0,0,0.05)" }}>
                      <TableCell sx={{ color: "black", fontSize: "16px" }}>
                        Ảnh truyện
                      </TableCell>
                      <TableCell sx={{ color: "black", fontSize: "16px" }}>
                        Tên truyện
                      </TableCell>
                      <TableCell sx={{ color: "black", fontSize: "16px" }}>
                        Tác giả
                      </TableCell>
                      <TableCell sx={{ color: "black", fontSize: "16px" }}>
                        Giá (đ)
                      </TableCell>
                      <TableCell sx={{ color: "black", fontSize: "16px" }}>
                        Truyện lẻ / Bộ
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {orders.length > 0 &&
                      orders[0].items &&
                      orders[0].items.length > 0 ? (
                      orders[0].items.map((item: any, index: number) => (
                        <TableRow key={index}>
                          <TableCell>
                            <img
                              src={item.comics.coverImage}
                              alt={item.comics.title}
                              style={{
                                width: 50,
                                height: "auto",
                                margin: "auto",
                              }}
                            />
                          </TableCell>
                          <TableCell className="!font-semibold !text-start">
                            {item.comics.title}
                          </TableCell>
                          <TableCell>{item.comics.author || "N/A"}</TableCell>
                          <TableCell>
                            {item.comics.price.toLocaleString()}
                          </TableCell>
                          <TableCell>
                            {item.comics.quantity > 1
                              ? "Bộ truyện"
                              : "Truyện lẻ"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          Không có thông tin sản phẩm.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
            {orderDetail.note && (
              <Grid
                size={12}
                sx={{ paddingLeft: "20px", paddingRight: "20px" }}
              >
                <StyledPaper
                  sx={{
                    padding: "16px",
                    backgroundColor: "rgba(0, 0, 0, 0.05)",
                    borderRadius: "8px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: "5px",
                      alignItems: "center",
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: "16px" }} />
                    <Typography fontSize="16px" fontWeight="bold">
                      Ghi chú từ người mua:
                    </Typography>
                  </div>
                  <Typography variant="body1" marginTop={"5px"}>
                    {orderDetail.note}
                  </Typography>
                </StyledPaper>
              </Grid>
            )}
          </Grid>
        </Stack>
      </DialogContent>
      <Box
        display="flex"
        justifyContent="flex-end"
        gap={2}
        mt={3}
        mb={3}
        px={5}
      >
        {orderDetail.status === "PENDING" && (
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              padding: "5px 20px",
              fontWeight: "bold",
              border: "1px solid black",
            }}
            onClick={() => handleConfirmAction("start")}
          >
            Xác nhận đơn hàng
          </Button>
        )}
        {orderDetail.status === "PACKAGING" &&
          orderDetail.delivery?.status !== "ready_to_pick" && (
            <Button
              sx={{
                backgroundColor: "#4A4A4A",
                color: "#fff",
                padding: "5px 20px",
                fontWeight: "bold",
              }}
              onClick={() => handleConfirmAction("finish")}
            >
              Hoàn tất đóng gói
            </Button>
          )}
      </Box>
    </StyledDialog>
  );
};

export default OrderDetailSeller;
