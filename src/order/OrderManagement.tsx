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
  Typography,
} from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { privateAxios } from "../middleware/axiosInstance";
import OrderDetailSeller from "./OrderDetailSeller";
import { OrderDetailData } from "../common/base.interface";

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderDetailData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await privateAxios.get("/orders/seller");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.orders;
        console.log("orders seller", data);

        if (Array.isArray(data)) {
          setOrders(data);
        } else {
          console.error("API did not return an array of orders.");
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

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

  const closeOrderDetail = () => {
    setSelectedOrderId(null);
  };

  const translateStatus = (status: string, deliveryStatus?: string) => {
    if (status === "PACKAGING" && deliveryStatus === "ready_to_pick") {
      return "Hoàn tất đóng gói";
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
    if (status === "PACKAGING" && delivery?.status === "ready_to_pick") {
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

  // const handleStatusUpdate = (orderId: string, newStatus: string, delivery?: { status: string }) => {
  //     setOrders((prevOrders) =>
  //         prevOrders.map((order) =>
  //             order.id === orderId
  //                 ? {
  //                     ...order,
  //                     status: newStatus,
  //                     delivery: delivery || order.delivery
  //                 }
  //                 : order
  //         )
  //     );
  // };

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
    <div
      className="seller-container"
      style={{ width: "100%", overflow: "hidden", padding: "10px 10px 0 10px" }}
    >
      <Typography variant="h5" className="content-header">
        Quản Lý Đơn Hàng
      </Typography>
      {orders.length === 0 ? (
        <Chip
          label="Bạn chưa nhận được đơn hàng nào"
          style={{
            margin: "auto",
            display: "inline-flex",
            backgroundColor: "#f0f0f0",
            color: "#000",
            fontSize: "16px",
            padding: "20px",
            borderRadius: "20px",
            fontWeight: "bold",
            alignItems: "center",
            justifyContent: "center",
          }}
        />
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
                  Mã Vận Đơn
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Tên Người Đặt
                </TableCell>
                <TableCell style={{ color: "white", textAlign: "center" }}>
                  Email
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
                  <TableCell align="center">
                    {order.delivery?.deliveryTrackingCode || "N/A"}
                  </TableCell>
                  <TableCell align="center">{order.toName}</TableCell>
                  <TableCell align="center">{order.user.email}</TableCell>
                  <TableCell align="center">{order.toPhone}</TableCell>
                  <TableCell align="center">
                    {order.totalPrice.toLocaleString()} đ
                  </TableCell>
                  <TableCell align="center">
                    {order.paymentMethod === "WALLET"
                      ? "Ví Comzone"
                      : order.paymentMethod}
                  </TableCell>
                  <TableCell align="center">
                    <span
                      style={getStatusChipStyles(order.status, order.delivery)}
                    >
                      {translateStatus(order.status, order.delivery?.status)}
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
          onClose={closeOrderDetail}
          orderId={selectedOrderId}
          onStatusUpdate={handleStatusUpdate}
          order={orders.find((order) => order.id === selectedOrderId)}
        />
      )}
    </div>
  );
};

export default OrderManagement;
