import React from "react";
import "../components/ui/AccountUser.css";
import Grid from "@mui/material/Grid2";
import Sidebar from "../components/accountmanagement/Sidebar";
import AuctionHistory from "../components/auction/AuctionHistory";

const AuctionUser: React.FC = () => {
  // const [selectedMenuItem, setSelectedMenuItem] = useState('purchase');

  // const handleMenuItemClick = (item: string) => {
  //     setSelectedMenuItem(item);
  // };

  const auctions = [
    {
      id: 1,
      status: "ongoing",
      shopName: "Tạp Hóa Truyện",
      productName: "Thám Tử Lừng Danh Conan - Tập 102",
      currentPrice: "29.000đ",
      userBid: "300.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg",
    },
    {
      id: 2,
      status: "completed",
      shopName: "Abc Shop",
      productName: "One Piece - Tập 101",
      userBid: "39.000đ",
      finalPrice: "50.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/catalog/product/o/n/one_piece_-_tap_101_-_ban_bia_ao_bia_gap_bia_1__1.jpg",
      isWin: true,
    },
    {
      id: 3,
      status: "completed",
      shopName: "Abc Shop",
      productName: "Naruto - Tập 50",
      userBid: "49.000đ",
      finalPrice: "59.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/naruto_tap_50_thuy_lao_tu_chien_tai_ban_2022/2024_04_05_09_50_39_1-390x510.jpg",
      isWin: false,
    },
    {
      id: 1,
      status: "canceled",
      shopName: "Tạp Hóa Truyện",
      productName: "Attack On Titan - Tập 24",
      currentPrice: "129.000đ",
      imgUrl:
        "https://cdn0.fahasa.com/media/flashmagazine/images/page_images/_24___attack_on_titan_24/2023_04_14_15_19_24_1-390x510.jpg",
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
            <AuctionHistory auctions={auctions} />
          </div>
        </Grid>
      </Grid>
    </div>
  );
};

export default AuctionUser;
