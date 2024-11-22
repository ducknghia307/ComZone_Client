import React, { useEffect, useState } from "react";
import { Button, TextField, Typography } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import StoreOutlinedIcon from "@mui/icons-material/StoreOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import "../ui/OrderHistory.css";
// import ModalOrder from "../modal/ModalOrder";
import { privateAxios } from "../../middleware/axiosInstance";
import OrderDetailsModal from "../modal/OrderDetailModal";
import { Comic } from "../../common/base.interface";
import ModalFeedbackSeller from "../modal/ModalFeedbackSeller";

interface Order {
  id: number;
  status: string;
  shopName: string;
  productName: string;
  price: string;
  imgUrl: string;
  totalPrice: string;
  items: Item[];
  type: string;
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
  const [selectedSellerName, setSelectedSellerName] = useState<string | null>(
    null
  );
  const [selectedSellerId, setSelectedSellerId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const [isOrderDetailsOpen, setOrderDetailsOpen] = useState(false);
  //   const [isConfirmationModalOpen, setConfirmationModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      try {
        const response = await privateAxios.get("/orders/user");
        const ordersData = response.data;
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
        return {
          color: "#f89b28",
          backgroundColor: "#fff2c9",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontFamily: "REM",
        };
      case "PACKAGING":
        return {
          color: "#ff6b1c",
          backgroundColor: "#ffe8db",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontFamily: "REM",
        };
      case "DELIVERING":
        return {
          color: "#52a7bf",
          backgroundColor: "#daf4ff",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontFamily: "REM",
        };
      case "DELIVERED":
        return {
          color: "#ffffff",
          backgroundColor: "#4CAF50",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontFamily: "REM",
        };
      case "COMPLETED":
        return {
          color: "#395f18",
          backgroundColor: "#fef6c7",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontFamily: "REM",
        };
      case "CANCELED":
        return {
          color: "#e91e63",
          backgroundColor: "#fce4ec",
          borderRadius: "8px",
          padding: "8px 20px",
          fontWeight: "bold",
          display: "inline-block",
          fontFamily: "REM",
        };
      default:
        return "#000";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "PENDING":
        return "Chờ xử lí";
      case "PACKAGING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao thành công";
      case "COMPLETED":
        return "Hoàn tất";
      case "CANCELED":
        return "Bị hủy";
      default:
        return "Tất cả";
    }
  };

  const handleOpenModal = (
    sellerName: string,
    sellerId: string,
    userId: string,
    orderId: string
  ) => {
    setSelectedSellerName(sellerName);
    setSelectedSellerId(sellerId);
    setSelectedUserId(userId);
    setOpenModal(true);
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSellerName(null);
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

  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div>
      <div className="status-tabs">
        {[
          "all",
          "PENDING",
          "PACKAGING",
          "DELIVERING",
          "DELIVERED",
          "COMPLETED",
          "CANCELED",
        ].map((status) => (
          <span
            key={status}
            className={`status-tab REM ${
              selectedStatus === status ? "active" : ""
            }`}
            onClick={() => setSelectedStatus(status)}
            style={{ whiteSpace: "nowrap" }}
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
            sx: { "& fieldset": { border: "none", fontFamily: "REM" } },
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
                <StoreOutlinedIcon style={{ fontSize: 28 }} />
                <Typography sx={{ fontSize: "18px", fontFamily: "REM" }}>
                  {order.items[0]?.comics.sellerId.name || "N/A"}
                </Typography>
                <div style={{ marginLeft: "20px" }} className="chat-button">
                  <ChatOutlinedIcon />
                  <Typography sx={{ fontFamily: "REM" }}>Chat</Typography>
                </div>
                <div style={{ marginLeft: "10px" }} className="shop-button">
                  <StoreOutlinedIcon />
                  <Typography sx={{ fontFamily: "REM" }}>Xem Shop</Typography>
                </div>
              </div>
              <Typography
                sx={{
                  margin: "auto 0",
                  paddingRight: "20px",
                  color: getStatusColor(order.status),
                  fontSize: "16px",
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
                    <Typography
                      sx={{
                        fontSize: "20px",
                        fontWeight: "500",
                        fontFamily: "REM",
                      }}
                    >
                      {item.comics.title}
                    </Typography>
                    <Typography>{item.type}</Typography>
                    <Typography sx={{ fontSize: "18px", fontFamily: "REM" }}>
                      x1
                    </Typography>
                  </div>

                  <div
                    style={{
                      marginLeft: "auto",
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    <Typography sx={{ fontSize: "20px", fontFamily: "REM" }}>
                      {order.type === "AUCTION"
                        ? Number(order.totalPrice).toLocaleString("vi-VN", {
                            style: "currency",
                            currency: "VND",
                          })
                        : Number(item.comics.price).toLocaleString("vi-VN", {
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
              <Typography sx={{ fontSize: "20px", fontFamily: "REM" }}>
                Thành tiền:{" "}
              </Typography>
              <Typography
                sx={{ fontSize: "28px", color: "#f77157", fontFamily: "REM" }}
              >
                {Number(order.totalPrice).toLocaleString("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })}
              </Typography>
            </div>

            <div
              style={{
                flex: "1 1 auto",
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                paddingBottom: "20px",
                paddingRight: "20px",
              }}
            >
              {order.status === "COMPLETED" ? (
                <>
                  <Button
                    sx={{
                      color: "#000",
                      backgroundColor: "#fff",
                      border: "1px solid black",
                      fontWeight: "bold",
                      fontSize: "16px",
                      padding: "5px 20px",
                      fontFamily: "REM",
                    }}
                    onClick={() => openOrderDetailsModal(order)}
                  >
                    Xem Chi Tiết
                  </Button>
                  <Button
                    sx={{
                      color: "#fff",
                      backgroundColor: "#00BFA6",
                      fontWeight: "bold",
                      fontSize: "16px",
                      padding: "5px 20px",
                      fontFamily: "REM",
                    }}
                    onClick={() => alert("Liên hệ người bán!")}
                  >
                    Liên hệ người bán
                  </Button>
                </>
              ) : order.status === "DELIVERED" ? (
                <>
                  <Button
                    sx={{
                      color: "#000",
                      backgroundColor: "#fff",
                      border: "1px solid black",
                      fontWeight: "bold",
                      fontSize: "16px",
                      padding: "5px 20px",
                      fontFamily: "REM",
                    }}
                    onClick={() => openOrderDetailsModal(order)}
                  >
                    Xem Chi Tiết
                  </Button>
                  <Button
                    sx={{
                      color: "#fff",
                      backgroundColor: "#00BFA6",
                      fontWeight: "bold",
                      fontSize: "16px",
                      padding: "5px 20px",
                      fontFamily: "REM",
                    }}
                    onClick={() =>
                      handleOpenModal(
                        order.items[0].comics.sellerId.name || "N/A",
                        order.items[0].comics.sellerId.id,
                        order.user.id,
                        order.id.toString()
                      )
                    }
                  >
                    Đã Nhận Được Hàng
                  </Button>
                  <Button
                    sx={{
                      color: "#fff",
                      backgroundColor: "#FFB74D",
                      fontWeight: "bold",
                      fontSize: "16px",
                      padding: "5px 20px",
                      fontFamily: "REM",
                    }}
                  >
                    Chưa Nhận Được Hàng
                  </Button>
                </>
              ) : (
                <Button
                  sx={{
                    color: "#000",
                    backgroundColor: "#fff",
                    border: "1px solid black",
                    fontWeight: "bold",
                    fontSize: "16px",
                    padding: "5px 20px",
                    fontFamily: "REM",
                  }}
                  onClick={() => openOrderDetailsModal(order)}
                >
                  Xem Chi Tiết
                </Button>
              )}
            </div>

            {/* Modal xem chi tiết*/}
            <OrderDetailsModal
              open={isOrderDetailsOpen}
              onClose={closeOrderDetailsModal}
              order={selectedOrder}
            />
          </div>
        ))}
        {/* Modal đã nhận được hàng*/}
        <ModalFeedbackSeller
          open={openModal}
          onClose={handleCloseModal}
          sellerName={selectedSellerName}
          sellerId={selectedSellerId} // Truyền sellerId
          userId={selectedUserId}
          orderId={selectedOrderId} // Truyền orderId
          onStatusUpdate={handleStatusUpdate} // Truyền callback
        />
      </div>
    </div>
  );
};

export default OrderHistory;
