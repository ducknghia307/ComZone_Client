import React, { useEffect, useState } from "react";
import {
  Chip,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { privateAxios } from "../../middleware/axiosInstance";
import OrderDetailSeller from "./OrderDetailSeller";
import { OrderDetailData } from "../../common/base.interface";
import { Avatar } from "antd";
import moment from "moment";
import EmptyImage from "../../assets/notFound/emptybox.png";
import {
  DeliveryStatus,
  DeliveryStatusGroup,
} from "../../common/interfaces/delivery.interface";

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderDetailData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);

      try {
        const response = await privateAxios.get("/orders/seller");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.orders;
        console.log("orders seller", data);

        if (Array.isArray(data)) {
          const sortedOrders = data.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });

          setOrders(sortedOrders);
        } else {
          console.error("API did not return an array of orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const reload = async () => {
    try {
      const response = await privateAxios.get("/orders/seller");
      const data = Array.isArray(response.data)
        ? response.data
        : response.data.orders;
      setOrders(data);
    } catch (error) {
      console.error("Error reloading orders:", error);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedOrders = orders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  // const closeOrderDetail = () => {
  //   setSelectedOrderId(null);
  // };

  const closeOrderDetail = () => {
    const selectedOrder = orders.find((order) => order.id === selectedOrderId);

    // Kiểm tra nếu thỏa mãn điều kiện
    if (
      selectedOrder &&
      selectedOrder.status === "PACKAGING" &&
      selectedOrder.delivery?.status === "ready_to_pick"
    ) {
      reload();
    }

    setSelectedOrderId(null);
  };

  const translateStatus = (status: string, deliveryStatus?: DeliveryStatus) => {
    if (
      status === "PACKAGING" &&
      deliveryStatus &&
      DeliveryStatusGroup.pickingGroup.some(
        (status) => deliveryStatus === status
      )
    ) {
      return "Hoàn tất đóng gói";
    }
    switch (status) {
      case "PENDING":
        return "Đang chờ xác nhận";
      case "DELIVERED":
        return "Đã giao hàng";
      case "PACKAGING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang chờ xác nhận giao hàng";
      case "SUCCESSFUL":
        return "Hoàn tất";
      case "CANCELED":
        return "Đã hủy";
      default:
        return status;
    }
  };

  const getStatusChipStyles = (
    status: string,
    delivery?: { status: string }
  ) => {
    if (
      status === "PACKAGING" &&
      delivery.status &&
      DeliveryStatusGroup.pickingGroup.some(
        (status) => delivery.status === status
      )
    ) {
      return {
        color: "#7c4af2",
        backgroundColor: "#e0d4fc",
        borderRadius: "8px",
        padding: "8px 20px",
        fontWeight: "bold",
        display: "inline-block",
      };
    }
    switch (status) {
      case "PENDING":
        return {
          color: "#f89b28",
          backgroundColor: "#fff2c9",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "DELIVERED":
        return {
          color: "#ffffff",
          backgroundColor: "#4CAF50",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "PACKAGING":
        return {
          color: "#ff6b1c",
          backgroundColor: "#ffe8db",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "DELIVERING":
        return {
          color: "#52a7bf",
          backgroundColor: "#daf4ff",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "SUCCESSFUL":
        return {
          color: "#4caf50",
          backgroundColor: "#e8f5e9",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
      case "CANCELED":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
    }
  };

  const handleStatusUpdate = (
    orderId: string,
    newStatus: string,
    delivery?: { status: string }
  ) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              delivery: delivery
                ? { ...order.delivery, status: delivery.status }
                : order.delivery,
            }
          : order
      )
    );
  };

  return (
    <div className="REM w-full bg-white p-4 rounded-lg drop-shadow-lg flex flex-col gap-4">
      <p className="text-2xl font-bold uppercase">Quản Lý Đơn Hàng</p>
      {!isLoading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <img src={EmptyImage} alt="" className="w-32 bg-white" />
          <p>Chưa có đơn hàng nào!</p>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          className="order-table-container"
          sx={{ border: "1px solid black" }}
        >
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "black" }}>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Người dùng
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Số Điện Thoại
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Tổng Tiền
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Phương Thức Thanh Toán
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Ngày đặt hàng
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Mã Vận Đơn
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Trạng Thái
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Chi Tiết
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell align="left">
                    <Avatar src={order.user.avatar} /> {order.user.name}
                  </TableCell>
                  <TableCell align="center">
                    {order.delivery.to.phone}
                  </TableCell>
                  <TableCell align="center">
                    {order.totalPrice.toLocaleString()} đ
                  </TableCell>
                  <TableCell align="center">
                    {order.paymentMethod === "WALLET"
                      ? "Ví Comzone"
                      : order.paymentMethod}
                  </TableCell>
                  <TableCell align="center">
                    {moment(order.createdAt).format("HH:mm DD/MM/YYYY")}
                  </TableCell>
                  <TableCell align="center">
                    {order.delivery?.deliveryTrackingCode || "Chưa có"}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      style={{
                        ...getStatusChipStyles(order.status, order.delivery),
                        fontFamily: "REM",
                      }}
                    >
                      {translateStatus(
                        order.status,
                        order.delivery?.status as DeliveryStatus
                      )}
                    </span>
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => openOrderDetail(order.id)}
                    >
                      <EditOutlinedIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={orders.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}
      {selectedOrderId && (
        <OrderDetailSeller
          open={Boolean(selectedOrderId)}
          setSelectedOrderId={setSelectedOrderId}
          onClose={closeOrderDetail}
          orderId={selectedOrderId}
          onStatusUpdate={handleStatusUpdate}
          order={orders.find((order) => order.id === selectedOrderId)}
          reload={reload}
        />
      )}
    </div>
  );
};

export default OrderManagement;
