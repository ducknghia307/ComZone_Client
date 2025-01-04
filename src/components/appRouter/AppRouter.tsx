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
import NotFound from "../notFound/NotFound";
import CurrentUserRecentAct from "../../pages/CurrentUserRecentAct";
import CurrentUserHistoryExchange from "../../pages/CurrentUserHistoryExchange";
import CurrentUserComicExchange from "../exchange/CurrentUserComicExchange";
import CurrentUserComicSelling from "../../pages/CurrentUserComicSelling";
import ModComics from "../../pages/ModComics";
import ModUsers from "../../pages/ModUsers";
import ModOrders from "../../pages/ModOrders";
import ModAuctions from "../../pages/ModAuctions";
import ModExchanges from "../../pages/ModExchanges";
import ModDeposits from "../../pages/ModWallet";
import ModFeedbacks from "../../pages/ModFeedbacks";
import ModRefunds from "../../pages/ModRefunds";

import AdminUsers from "../../pages/AdminUsers";
import AdminDashboard from "../../pages/AdminDashboard";
import AdminSubscription from "../../pages/AdminSubscription";
import ExchangeDetail from "../../pages/ExchangeDetail";
import Announcement from "../../pages/Announcement";
import AnnouncementOrder from "../../pages/AnnouncementOrder";
import AnnouncementAuction from "../../pages/AnnouncementAuction";
import SellerManagementPage from "../../pages/SellerManagement";
import ExchangeManagement from "../../pages/ExchangeManagement";
import AnnouncementExchange from "../../pages/AnnoucementExchange";
import SellerShopPage from "../../pages/SellerShopPage";
import ModDeliveries from "../../pages/ModDeliveries";
import AdminAuctionSetting from "../../pages/AdminAuctionSetting";
import AdminAuctionCriteria from "../../pages/AdminAuctionCriteria";
import AdminComicGenre from "../../pages/AdminComicGenre";
import AdminComicEdition from "../../pages/AdminComicEdition";

const AppRouter = () => {
  return (
    <div className="w-full flex items-start justify-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/detail/:id" element={<ComicDetail />} />
        <Route path="/auctiondetail/:id" element={<AuctionDetails />} />
        {/* <Route path="/accountmanagement" element={<AccountManagement />} /> */}
        <Route path="/accountmanagement/purchase" element={<OrderUser />} />
        <Route path="/accountmanagement/profile" element={<Profile />} />
        <Route
          path="/accountmanagement/announcement"
          element={<Announcement />}
        />
        <Route
          path="/accountmanagement/announcement/orders"
          element={<AnnouncementOrder />}
        />
        <Route
          path="/accountmanagement/announcement/auctions"
          element={<AnnouncementAuction />}
        />
        <Route
          path="/accountmanagement/announcement/exchanges"
          element={<AnnouncementExchange />}
        />
        <Route path="/accountmanagement/auction" element={<AuctionUser />} />
        <Route path="/accountmanagement/wallet" element={<WalletUser />} />
        <Route path="/accountmanagement/exchange" element={<ExchangeUser />} />
        <Route path="/sellermanagement" element={<SellerManagement />} />
        <Route path="/sellermanagement/createcomic" element={<CreateComic />} />
        <Route
          path="/sellermanagement/shop-info"
          element={<SellerManagementPage />}
        />
        <Route
          path="/sellermanagement/comic"
          element={<SellerManagementPage />}
        />
        <Route
          path="/sellermanagement/order"
          element={<SellerManagementPage />}
        />
        <Route
          path="/sellermanagement/auction"
          element={<SellerManagementPage />}
        />
        <Route
          path="/sellermanagement/feedback"
          element={<SellerManagementPage />}
        />
        <Route
          path="/sellermanagement/edit/:id"
          element={<SellerEditComicDetail />}
        />
        <Route path="/search" element={<Genres />} />
        <Route path="/exchange-news-feed" element={<ExchangeNewsFeed />} />
        <Route
          path="/exchange/comics-collection"
          element={<ExchangeManagement />}
        />
        <Route path="/exchange/list/:status" element={<ExchangeManagement />} />
        <Route path="/exchange/detail/:id" element={<ExchangeDetail />} />
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
          path="/profile/comicSelling"
          element={<CurrentUserComicSelling />}
        />
        <Route path="/seller/shop/:category/:id" element={<SellerShopPage />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/mod/comics" element={<ModComics />} />
        <Route path="/mod/users" element={<ModUsers />} />
        <Route path="/mod/orders" element={<ModOrders />} />
        <Route path="/mod/auctions" element={<ModAuctions />} />
        <Route path="/mod/exchanges" element={<ModExchanges />} />
        <Route path="/mod/deliveries" element={<ModDeliveries />} />
        <Route path="/mod/deposits" element={<ModDeposits />} />
        <Route path="/mod/feedbacks" element={<ModFeedbacks />} />
        <Route path="/mod/refunds" element={<ModRefunds />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/subscription" element={<AdminSubscription />} />
        <Route
          path="/admin/auction/settingPrice"
          element={<AdminAuctionSetting />}
        />
        <Route
          path="/admin/auction/auctionCriteria"
          element={<AdminAuctionCriteria />}
        />
        <Route path="/admin/auction/genres" element={<AdminComicGenre />} />
        <Route path="/admin/auction/editions" element={<AdminComicEdition />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
