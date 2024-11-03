import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import "../ui/OrderHistory.css";
import ModalOrder from "../modal/ModalOrder";
import { privateAxios } from "../../middleware/axiosInstance";
import OrderDetailsModal from "../modal/OrderDetailModal";
import { Comic } from "../../common/base.interface";

interface Order {
  id: number;
  status: string;
  shopName: string;
  productName: string;
  price: string;
  imgUrl: string;
  totalPrice: string;
  items: Item[];
}
interface Item {
  comics: Comic;
}
interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [openModal, setOpenModal] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);

  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);
  //   const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      try {
        const response = await privateAxios.get("/orders/user");
        const ordersData = response.data;

        // Lọc đơn hàng có order_type là NON_AUCTION
        // const nonAuctionOrders = ordersData.filter(
        //   (order: any) => order.order_type === "NON_AUCTION"
        // );
        // console.log(nonAuctionOrders);

        // Fetch items for each order
        const ordersWithItems = await Promise.all(
          ordersData.map(async (order: any) => {
            const itemsResponse = await privateAxios.get(
              `/order-items/order/${order.id}`
            );
            const itemsData = itemsResponse.data;

            return { ...order, items: itemsData }; // order với order items
          })
        );

        setOrders(ordersWithItems);
        console.log("Orders with items:", ordersWithItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrdersWithItems();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING":
        return "#f28144";
      case "PACKING":
        return "#fc65fc";
      case "DELIVERING":
        return "#28bacf";
      case "DELIVERED":
        return "#32CD32";
      case "COMPLETED":
        return "#228B22";
      case "CANCELLED":
        return "#FF4500";
      default:
        return "#000";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lí";
      case "PACKING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao thành công";
      case "COMPLETED":
        return "Hoàn tất";
      case "CANCELLED":
        return "Bị hủy";
      default:
        return "Tất cả";
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const openOrderDetailsModal = (order: Order) => {
    setSelectedOrder(order);
    setOrderDetailsOpen(true);
  };

  const closeOrderDetailsModal = () => {
    setOrderDetailsOpen(false);
    setSelectedOrder(null);
  };

  const filteredOrders =
    selectedStatus === "all"
      ? orders
      : orders.filter((order) => order.status === selectedStatus);
  console.log(filteredOrders);

  return (
    <div>
      <div className="status-tabs">
        {[
          "all",
          "PENDING",
          "PACKING",
          "DELIVERING",
          "DELIVERED",
          "COMPLETED",
          "CANCELLED",
        ].map((status) => (
          <span
            key={status}
            className={`status-tab ${
              selectedStatus === status ? "active" : ""
            }`}
            onClick={() => setSelectedStatus(status)}
          >
            {getStatusText(status)}
          </span>
        ))}
      </div>

      <div className="searchbar">
        <SearchOutlinedIcon sx={{ color: "#8d8d8d", fontSize: "24px" }} />
        <TextField
          variant="outlined"
          fullWidth
          size="small"
          placeholder="Tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
          InputProps={{
            disableUnderline: true,
            sx: { "& fieldset": { border: "none" } },
          }}
        />
      </div>

      <div className="purchase-history-content">
        {filteredOrders.map((order) => (
          <div
            key={order.id}
            className="status-detail"
            style={{
              marginBottom: "20px",
              backgroundColor: "#fff",
              borderRadius: "8px",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <div className="status-content" style={{ padding: "10px 30px" }}>
              <div className="status-content-detail">
                <StoreOutlinedIcon style={{ fontSize: 35 }} />
                <Typography sx={{ fontSize: "20px" }}>
                  {order.items[0].comics.sellerId.name || "N/A"}
                </Typography>
                <div style={{ marginLeft: "20px" }} className="chat-button">
                  <ChatOutlinedIcon />
                  <Typography>Chat</Typography>
                </div>
                <div style={{ marginLeft: "10px" }} className="shop-button">
                  <StoreOutlinedIcon />
                  <Typography>Xem Shop</Typography>
                </div>
              </div>
              <Typography
                sx={{
                  margin: "auto 0",
                  paddingRight: "20px",
                  color: getStatusColor(order.status),
                  fontSize: "20px",
                }}
              >
                {getStatusText(order.status)}
              </Typography>
            </div>

            <div
              className="status-content1"
              style={{
                padding: "20px 50px",
                display: "flex",
                gap: "20px",
                flexDirection: "column",
              }}
            >
              {order.items.map((item: any) => (
                <div
                  key={item.id}
                  style={{ display: "flex", gap: "20px", marginBottom: "10px" }}
                >
                  {/* Hình ảnh sản phẩm */}
                  <img
                    src={
                      item.comics.coverImage ||
                      "https://via.placeholder.com/150"
                    }
                    alt={item.name}
                    style={{
                      width: "100px",
                      height: "140px",
                      objectFit: "cover",
                    }}
                  />

                  {/* Tên và giá sản phẩm */}
                  <div>
                    <Typography sx={{ fontSize: "20px", fontWeight: "bold" }}>
                      {item.comics.title}
                    </Typography>
                    <Typography sx={{ fontSize: "18px" }}>x1</Typography>
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "20px" }}>
                      {Number(item.comics.price).toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      })}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                padding: "20px",
                gap: "10px",
                backgroundColor: "#fff",
                alignItems: "center",
              }}
            >
              <Typography sx={{ fontSize: "20px" }}>Thành tiền: </Typography>
              <Typography sx={{ fontSize: "28px", color: "#f77157" }}>
                {Number(order.totalPrice).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0px 20px 20px 20px",
              }}
            >
              {order.status === "DELIVERED" ? (
                <>
                  <div
                    style={{
                      flex: "1 1 auto",
                      display: "flex",
                      justifyContent: "flex-start",
                      gap: "10px",
                      // paddingLeft:'10px'
                    }}
                  >
                    <Button
                      sx={{
                        color: "#000",
                        backgroundColor: "#fff",
                        border: "1px solid black",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      onClick={() => openOrderDetailsModal(order)}
                    >
                      Xem Chi Tiết
                    </Button>
                  </div>

                  <div
                    style={{
                      flex: "1 1 auto",
                      display: "flex",
                      justifyContent: "flex-end",
                      gap: "20px",
                    }}
                  >
                    <Button
                      sx={{
                        color: "#fff",
                        backgroundColor: "#00BFA6",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                      onClick={handleOpenModal}
                    >
                      Đã Nhận Được Hàng
                    </Button>
                    <Button
                      sx={{
                        color: "#fff",
                        backgroundColor: "#FFB74D",
                        fontWeight: "bold",
                        fontSize: "16px",
                      }}
                    >
                      Chưa Nhận Được Hàng
                    </Button>
                  </div>
                </>
              ) : (
                <div
                  style={{
                    flex: "1 1 auto",
                    display: "flex",
                    justifyContent: "flex-end",
                  }}
                >
                  <Button
                    sx={{
                      color: "#000",
                      backgroundColor: "#fff",
                      border: "1px solid black",
                      fontWeight: "bold",
                      fontSize: "16px",
                      padding: "5px 20px",
                    }}
                    onClick={() => openOrderDetailsModal(order)}
                  >
                    Xem Chi Tiết
                  </Button>
                </div>
              )}
            </div>

            {/* Modal đã nhận được hàng*/}
            <ModalOrder open={openModal} onClose={handleCloseModal} />

            {/* Modal xem chi tiết*/}
            <OrderDetailsModal
              open={isOrderDetailsOpen}
              onClose={closeOrderDetailsModal}
              order={selectedOrder}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
