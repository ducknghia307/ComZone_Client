/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
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
import { useSearchParams } from "react-router-dom";

const OrderManagement = () => {
  const [orders, setOrders] = useState<OrderDetailData[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<OrderDetailData[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>(
    searchParams.get("search") || ""
  );

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);

      try {
        const response = await privateAxios.get("/orders/seller");
        const data = Array.isArray(response.data)
          ? response.data
          : response.data.orders;
        console.log("orders seller", data);

        setOrders(data);

        if (
          searchParams.get("search") &&
          searchParams.get("search").length > 0
        ) {
          searchOrders(searchParams.get("search"));
          setSearchInput(searchParams.get("search"));
        } else setFilteredOrders(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const searchOrders = async (key?: string) => {
    if (!key && searchInput.length === 0) return;

    await privateAxios
      .get(`orders/search/seller?search=${key || searchInput}`)
      .then((res) => {
        setFilteredOrders(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    setSearchInput(searchParams.get("search"));
    searchOrders(searchParams.get("search"));
  }, [searchParams.get("search")]);

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

  const paginatedOrders = filteredOrders.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const closeOrderDetail = () => {
    const selectedOrder = orders.find((order) => order.id === selectedOrderId);

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
      return "Chờ bàn giao hàng";
    }
    switch (status) {
      case "PENDING":
        return "Đang chờ xác nhận";
      case "PACKAGING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao hàng";
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
      case "FAILED":
        return {
          color: "#f44336",
          backgroundColor: "#ffebee",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
        };
    }
  };

  const actionRequired = (order) => {
    return (
      order.status === "PENDING" ||
      (order.status === "PACKAGING" && !order.delivery.deliveryTrackingCode)
    );
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

      <div className="relative">
        <input
          type="text"
          disabled={orders.length === 0}
          placeholder="Tìm kiếm theo tên truyện, tên người bán, mã đơn hàng, mã vận đơn..."
          className="w-full border border-gray-300 rounded-md p-2 pl-12 font-light"
          value={searchInput}
          onChange={(e) => {
            setSearchInput(e.target.value);

            if (e.target.value.length === 0) {
              searchParams.delete("search");
              setSearchParams(searchParams);
              setFilteredOrders(orders);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && searchInput.length > 0) {
              setSearchParams({ search: searchInput });
              searchOrders();
            }
          }}
        />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="currentColor"
          className="absolute top-1/2 -translate-y-1/2 left-4"
        >
          <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
        </svg>
      </div>

      {!isLoading && orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16">
          <img src={EmptyImage} alt="" className="w-32 bg-white" />
          <p>Không có đơn hàng!</p>
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
                  Mã đơn hàng
                </TableCell>
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
                  <TableCell align="left">#{order.code}</TableCell>
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
                    <button
                      onClick={() => openOrderDetail(order.id)}
                      className="REM relative flex items-center gap-1 border px-2 py-1 border-gray-300 rounded-md duration-200 hover:bg-gray-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M15.5 5C13.567 5 12 6.567 12 8.5C12 10.433 13.567 12 15.5 12C17.433 12 19 10.433 19 8.5C19 6.567 17.433 5 15.5 5ZM10 8.5C10 5.46243 12.4624 3 15.5 3C18.5376 3 21 5.46243 21 8.5C21 9.6575 20.6424 10.7315 20.0317 11.6175L22.7071 14.2929L21.2929 15.7071L18.6175 13.0317C17.7315 13.6424 16.6575 14 15.5 14C12.4624 14 10 11.5376 10 8.5ZM3 4H8V6H3V4ZM3 11H8V13H3V11ZM21 18V20H3V18H21Z"></path>
                      </svg>
                      <p>Xem</p>

                      {actionRequired(order) && (
                        <span className="absolute w-2 h-2 bg-red-600 top-0 right-0 rounded-full translate-x-1 -translate-y-1"></span>
                      )}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[10, 15]}
            component="div"
            count={filteredOrders.length}
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
