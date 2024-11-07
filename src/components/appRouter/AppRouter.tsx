import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Genres from "../../pages/Genres";
import Auctions from "../../pages/Auctions";
import Cart from "../../pages/Cart";
import ComicDetail from "../../pages/ComicDetails";
import Checkout from "../../pages/Checkout";
import AuctionDetails from "../../pages/AuctionDetails";
import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";
import ForgotPassword from "../../pages/ForgotPassword";
import SellerManagement from "../../pages/SellerManagement";
import CreateComic from "../../pages/CreateComic";
import ExchangeNewsFeed from "../../pages/ExchangeNewsFeed";
import SellerEditComicDetail from "../comic/SellerEditComicDetail";
import OrderComplete from "../../pages/OrderComplete";
import OrderUser from "../../pages/OrderUser";
import Profile from "../../pages/Profile";
import AuctionUser from "../../pages/AuctionUser";
import WalletUser from "../../pages/WalletUser";
import ExchangeUser from "../../pages/ExchangeUser";
import RegisterSeller from "../../pages/RegisterSeller";
import ComicManagementSeller from "../../pages/ComicManagementSeller";
import OrderManagementSeller from "../../pages/OrderManagementSeller";
import AuctionManagementSeller from "../../pages/AuctionManagementSeller";
import { ConfigProvider } from "antd";
import AllHotComics from "../../pages/HotComic";
import ComicZoneMembership from "../membership/ComicZoneMembership";
import NotFound from "../notFound/NotFound";

const AppRouter = () => {
  return (
    <div className="w-full flex items-start justify-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/hotcomic" element={<AllHotComics />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/detail/:id" element={<ComicDetail />} />
        <Route path="/auctiondetail/:id" element={<AuctionDetails />} />
        {/* <Route path="/accountmanagement" element={<AccountManagement />} /> */}
        <Route path="/accountmanagement/purchase" element={<OrderUser />} />
        <Route path="/accountmanagement/profile" element={<Profile />} />
        <Route path="/accountmanagement/auction" element={<AuctionUser />} />
        <Route path="/accountmanagement/wallet" element={<WalletUser />} />
        <Route path="/accountmanagement/exchange" element={<ExchangeUser />} />
        <Route path="/sellermanagement" element={<SellerManagement />} />
        <Route path="/sellermanagement/createcomic" element={<CreateComic />} />
        <Route path="/sellermanagement/comic" element={<ComicManagementSeller />} />
        <Route path="/sellermanagement/order" element={<OrderManagementSeller />} />
        <Route path="/sellermanagement/auction" element={<AuctionManagementSeller />} />
        <Route
          path="/sellermanagement/edit/:id"
          element={<SellerEditComicDetail />}
        />
        <Route path="/search" element={<Genres />} />
        <Route path="/exchange" element={<ExchangeNewsFeed />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/order/complete" element={<OrderComplete />} />

        <Route path="/registerSeller" element={<RegisterSeller />} />

        <Route path="/membership" element={<ComicZoneMembership />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
