import React from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import OrderHistory from "../components/order/OrderHistory";
import Sidebar from "../components/accountmanagement/Sidebar";

const OrderUser: React.FC = () => {
  // const [selectedMenuItem, setSelectedMenuItem] = useState('purchase');

  // const handleMenuItemClick = (item: string) => {
  //     setSelectedMenuItem(item);
  // };

  const orders = [
    {
      id: 1,
      status: "pending",
      shopName: "Tạp Hóa Truyện",
      productName: "Thám Tử Lừng Danh Conan - Tập 102",
      price: "29.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg",
    },
    {
      id: 2,
      status: "packing",
      shopName: "Abc Shop",
      productName: "One Piece - Tập 101",
      price: "39.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/catalog/product/o/n/one_piece_-_tap_101_-_ban_bia_ao_bia_gap_bia_1__1.jpg?_gl=1*t4s1ch*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk3ODcuMzEuMC4xNTg5MzI2OQ..",
    },
    {
      id: 3,
      status: "delivering",
      shopName: "Abc Shop",
      productName: "Naruto - Tập 50",
      price: "49.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/naruto_tap_50_thuy_lao_tu_chien_tai_ban_2022/2024_04_05_09_50_39_1-390x510.jpg?_gl=1*m22ao5*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk4MTIuNi4wLjE1ODkzMjY5",
    },
    {
      id: 4,
      status: "delivered",
      shopName: "Abc Shop",
      productName: "Attack on Titan - Tập 24",
      price: "59.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/_24___attack_on_titan_24/2023_04_14_15_19_24_1-390x510.jpg",
    },
    {
      id: 5,
      status: "completed",
      shopName: "Abc Shop",
      productName: "Doraemon - Tập 15",
      price: "19.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/doraemon___chu_meo_may_den_tu_tuong_lai___tap_15_tai_ban_2023/2024_06_08_10_37_33_1-390x510.jpg?_gl=1*9asfdx*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk4OTkuMi4wLjE1ODkzMjY5",
    },
    {
      id: 6,
      status: "cancelled",
      shopName: "Abc Shop",
      productName: "Dragon Ball - Tập 24",
      price: "99.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/catalog/product/2/4/24_3b445abed5484fbca9eb0cf899682_1.jpg",
    },
  ];

  return (
    <div className="account-user-container w-full">
      <Grid container spacing={3}>
        <Grid size={2} className="account-menu">
          <Sidebar />
        </Grid>
        <Grid size={10}>
          <div className="content-section">
            <OrderHistory orders={orders} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default OrderUser;
