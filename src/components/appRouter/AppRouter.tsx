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
import ComicManagementSeller from "../../pages/ComicManagementSeller";
import OrderManagementSeller from "../../pages/OrderManagementSeller";
import AuctionManagementSeller from "../../pages/AuctionManagementSeller";
import AllHotComics from "../../pages/HotComic";
import ComicZoneMembership from "../membership/ComicZoneMembership";
import NotFound from "../notFound/NotFound";
import CurrentUserRecentAct from "../../pages/CurrentUserRecentAct";
import CurrentUserHistoryExchange from "../../pages/CurrentUserHistoryExchange";
import CurrentUserComicExchange from "../../pages/CurrentUserComicExchange";
import CurrentUserPostExchange from "../../pages/CurrentUserPostExchange";
import CurrentUserComicSelling from "../../pages/CurrentUserComicSelling";
import ModComics from "../../pages/ModComics";
import ModUsers from "../../pages/ModUsers";
import ModOrders from "../../pages/ModOrders";
import ModAuctions from "../../pages/ModAuctions";
import ModExchanges from "../../pages/ModExchanges";
import ModDeposits from "../../pages/ModWallet";
import ModFeedbacks from "../../pages/ModFeedbacks";
import ExchangeWaiting from "../../pages/exchange/ExchangeWaiting";
import ExchangeRequestSend from "../../pages/exchange/ExchangeRequestSend";
import ExchangeDealing from "../../pages/exchange/ExchangeDealing";
import ExchangeDelivering from "../../pages/exchange/ExchangeDelivering";
import ExchangeSuccessful from "../../pages/exchange/ExchangeSuccessful";
import ExchangeCancel from "../../pages/exchange/ExchangeCancel";

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
        <Route
          path="/sellermanagement/comic"
          element={<ComicManagementSeller />}
        />
        <Route
          path="/sellermanagement/order"
          element={<OrderManagementSeller />}
        />
        <Route
          path="/sellermanagement/auction"
          element={<AuctionManagementSeller />}
        />
        <Route
          path="/sellermanagement/edit/:id"
          element={<SellerEditComicDetail />}
        />
        <Route path="/search" element={<Genres />} />
        <Route path="/exchange-news-feed" element={<ExchangeNewsFeed />} />
        <Route path="/exchange/waiting" element={<ExchangeWaiting />} />
        <Route
          path="/exchange/request-send"
          element={<ExchangeRequestSend />}
        />
        <Route path="/exchange/dealing" element={<ExchangeDealing />} />
        <Route path="/exchange/delivering" element={<ExchangeDelivering />} />
        <Route path="/exchange/successful" element={<ExchangeSuccessful />} />
        <Route path="/exchange/cancel" element={<ExchangeCancel />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot" element={<ForgotPassword />} />
        <Route path="/order/complete" element={<OrderComplete />} />

        <Route
          path="/profile/recentActivities"
          element={<CurrentUserRecentAct />}
        />
        <Route
          path="/profile/historyExchange"
          element={<CurrentUserHistoryExchange />}
        />
        <Route
          path="/profile/comicExchange"
          element={<CurrentUserComicExchange />}
        />
        <Route
          path="/profile/postExchange"
          element={<CurrentUserPostExchange />}
        />
        <Route
          path="/profile/comicSelling"
          element={<CurrentUserComicSelling />}
        />
        <Route path="/membership" element={<ComicZoneMembership />} />

        <Route path="*" element={<NotFound />} />

        <Route path="/mod/comics" element={<ModComics />} />
        <Route path="/mod/users" element={<ModUsers />} />
        <Route path="/mod/orders" element={<ModOrders />} />
        <Route path="/mod/auctions" element={<ModAuctions />} />
        <Route path="/mod/exchanges" element={<ModExchanges />} />
        <Route path="/mod/deposits" element={<ModDeposits />} />
        <Route path="/mod/feedbacks" element={<ModFeedbacks />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
