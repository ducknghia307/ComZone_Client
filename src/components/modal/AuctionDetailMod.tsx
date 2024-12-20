import React, { ReactNode, useEffect, useState } from "react";
import {
  Typography,
  Box,
  DialogTitle,
  alpha,
  IconButton,
  Chip,
  DialogContent,
  Stack,
  Divider,
  useTheme,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  styled,
  Dialog,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Form, Modal, notification, Popconfirm } from "antd";
import dayjs from "dayjs";
import { Close as CloseIcon } from "@mui/icons-material";
import { Comic, UserInfo } from "../../common/base.interface";
import { privateAxios } from "../../middleware/axiosInstance";
interface AuctionDetailModProps {
  open: boolean;
  onCancel: () => void;
  // onClose: () => void;
  onSuccess: () => void;
  comic: Comic;
  auctionData: {
    id: string;
    reservePrice: number;
    maxPrice: number;
    priceStep: number;
    startTime: string;
    endTime: string;
    currentPrice?: number;
    sellerInfo: UserInfo;
    status: string;
  };
}
const AuctionDetailMod: React.FC<AuctionDetailModProps> = ({
  open,
  onCancel,
  comic,
  auctionData,
  onSuccess,
}) => {
  const [form] = Form.useForm();

  const sellerInfo: UserInfo = auctionData?.sellerInfo || null;
  console.log("seller info", sellerInfo);

  const theme = useTheme();

  useEffect(() => {
    if (auctionData) {
      form.setFieldsValue({
        title: comic.title,
        reservePrice: auctionData.reservePrice,
        maxPrice: auctionData.maxPrice,
        priceStep: auctionData.priceStep,
        startTime: dayjs(auctionData.startTime),
        endTime: dayjs(auctionData.endTime),
      });
    }
    console.log("Auction Status:", auctionData.status);
  }, [auctionData, comic, form]);

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      borderRadius: theme.spacing(2),
      maxHeight: "90vh",
      maxWidth: "50vw",
      boxShadow: theme.shadows[10],
    },
  }));

  const handleAdjustEndtime = async () => {
    if (!auctionData) return;

    await privateAxios
      .patch(`auction/endtime/now/${auctionData.id}`)
      .then(() => {
        notification.success({
          key: "adjust",
          message: (
            <p className="REM">Chỉnh thời gian kết thúc đấu giá thành công</p>
          ),
          duration: 5,
        });
        onSuccess();
      })
      .catch((err) => console.log(err));
  };

  const InfoRow = ({
    label,
    value,
    isPaid,
  }: {
    label: string;
    value: ReactNode;
    isPaid?: boolean;
  }) => {
    const theme = useTheme();

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
            fontFamily: "REM",
          }}
        >
          {label}
        </Typography>
        <Typography
          variant="body1"
          fontWeight={400}
          sx={{
            paddingLeft: 3,
            color:
              isPaid !== undefined ? (isPaid ? "#32CD32" : "#ff9800") : "#000",
            whiteSpace: "nowrap",
            wordWrap: "break-word",
            fontFamily: "REM",
          }}
        >
          {value}
        </Typography>
      </Box>
    );
  };

  const getStatusChipStyles = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return {
          color: "#4caf50",
          backgroundColor: "#e8f5e9",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "UPCOMING":
        return {
          color: "#6226EF",
          backgroundColor: "#EDE7F6",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "COMPLETED":
        return {
          color: "#009688",
          backgroundColor: "#e0f2f1",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "PROCESSING":
        return {
          color: "#ff9800",
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "ONGOING":
        return {
          color: "#2196f3",
          backgroundColor: "#e3f2fd",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "FAILED":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "REJECTED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "CANCELED":
        return {
          color: "#757575",
          backgroundColor: "#eeeeee",
          padding: "8px 20px",
          borderRadius: "8px",
          fontWeight: "bold",
          fontSize: "16px",
          whiteSpace: "nowrap",
        };
    }
  };

  const translateStatus = (status: string) => {
    switch (status) {
      case "SUCCESSFUL":
        return "Thành công";
      case "COMPLETED":
        return "Hoàn thành";
      case "UPCOMING":
        return "Sắp diễn ra";
      case "PROCESSING":
        return "Đang xử lí";
      case "ONGOING":
        return "Đang diễn ra";
      case "FAILED":
        return "Thất bại";
      case "REJECTED":
        return "Bị từ chối";
      case "CANCELED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  return (
    <Modal
      open={open}
      onCancel={(e) => {
        e.stopPropagation();
        onCancel();
      }}
      footer={null}
      width={1000}
      centered
      closeIcon={null}
      styles={{ content: { padding: "0" } }}
    >
      <DialogTitle
        sx={{
          p: 3,
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Chip
            label={translateStatus(auctionData.status)}
            sx={{
              ...getStatusChipStyles(auctionData.status),
              fontSize: "14px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          />

          <Typography
            variant="h5"
            fontWeight="bold"
            sx={{
              fontSize: "1.5rem",
              color: theme.palette.text.primary,
              textTransform: "uppercase",
              fontFamily: "REM",
            }}
          >
            Chi tiết đấu giá
          </Typography>
          <IconButton
            onClick={onCancel}
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

        <Box mt={2}>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 400,
              mb: "10px",
              fontFamily: "REM",
            }}
          >
            Thời gian bắt đầu:{" "}
            {new Date(auctionData.startTime).toLocaleString("vi-VN")}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 400,
              fontFamily: "REM",
            }}
          >
            Thời gian kết thúc:{" "}
            {new Date(auctionData.endTime).toLocaleString("vi-VN")}
          </Typography>

          {auctionData.status === "ONGOING" && (
            <Popconfirm
              title={
                <p className="REM font-semibold text-red-600">
                  Xác nhận chỉnh thời gian kết thúc đấu giá đến hiện tại (TEST)
                </p>
              }
              description={
                <p className="REM italic">
                  Cuộc đấu giá sẽ kết thúc sau 30 giây tính từ khi xác nhận.
                </p>
              }
              onConfirm={handleAdjustEndtime}
              onCancel={() => {}}
              okText={<p className="REM">Xác nhận</p>}
              cancelText={<p className="REM">Hủy bỏ</p>}
            >
              <button className="REM text-sm underline">
                Chỉnh thời gian kết thúc đấu giá đến hiện tại
              </button>
            </Popconfirm>
          )}
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
                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                  <Chip
                    label="Thông tin đấu giá"
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
                    label="Giá khởi điểm"
                    value={auctionData.reservePrice.toLocaleString()}
                  />
                  <InfoRow
                    label="Bước giá"
                    value={auctionData.priceStep.toLocaleString()}
                  />
                  <InfoRow
                    label="Giá hiện tại"
                    value={auctionData?.currentPrice?.toLocaleString() ?? "N/A"}
                  />
                </Box>

                <Divider orientation="vertical" flexItem />

                <Box display="flex" flexDirection="column" flex={1} gap={1}>
                  <Chip
                    label="Thông tin người bán"
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
                    value={
                      <Box display="flex" alignItems="center" gap="10px">
                        <img
                          src={sellerInfo.avatar || "/placeholder.png"}
                          alt={sellerInfo.avatar}
                          style={{
                            width: "32px",
                            height: "32px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        {sellerInfo.name}
                      </Box>
                    }
                  />
                  <InfoRow label="Số điện thoại" value={sellerInfo.phone} />
                  <InfoRow label="Địa chỉ" value={sellerInfo.address} />
                </Box>
              </Stack>
            </Grid>

            <Grid size={12} sx={{ paddingLeft: "20px", paddingRight: "20px" }}>
              <Chip
                label="Thông tin truyện"
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
                      <TableCell
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          fontFamily: "REM",
                        }}
                      >
                        Ảnh Chính
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          fontFamily: "REM",
                        }}
                      >
                        Tên Truyện
                      </TableCell>
                      <TableCell
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          fontFamily: "REM",
                        }}
                      >
                        Tác giả
                      </TableCell>
                      {/* <TableCell sx={{ color: 'black', fontSize: '16px' }}>Giá (đ)</TableCell> */}
                      <TableCell
                        sx={{
                          color: "black",
                          fontSize: "16px",
                          fontFamily: "REM",
                        }}
                      >
                        Tập/Bộ
                      </TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <img
                          src={comic.coverImage}
                          alt={comic.title}
                          style={{ width: 50, height: "auto", margin: "auto" }}
                        />
                      </TableCell>
                      <TableCell sx={{ fontFamily: "REM" }}>
                        {comic.title || "N/A"}
                      </TableCell>
                      <TableCell sx={{ fontFamily: "REM" }}>
                        {comic.author || "N/A"}
                      </TableCell>
                      {/* <TableCell>{comic.price?.toLocaleString() || 'N/A'} đ</TableCell> */}
                      <TableCell sx={{ fontFamily: "REM" }}>
                        {comic.quantity > 1 ? "Bộ truyện" : "Tập Truyện"}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
    </Modal>
  );
};

export default AuctionDetailMod;
