import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage";
import Genres from "../../pages/Genres";
import Auctions from "../../pages/Auctions";
import ComicDetail from "../../pages/ComicDetails";
import AuctionDetails from "../../pages/AuctionDetails";
import AccountManagement from "../../pages/AccountManagement";
// import Blogs from "../../pages/Blogs";


const AppRouter = () => {
  return (
    <div className="w-full flex items-start justify-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/genres" element={<Genres />} />
        <Route path="/auctions" element={<Auctions />} />
        <Route path="/detail" element={<ComicDetail />} />
        <Route path="/auctiondetail" element={<AuctionDetails />} />
        <Route path="/accountmanagement" element={<AccountManagement />} />
        {/* <Route path="/blog" element={<Blogs />} /> */}
      </Routes>
    </div>
  );
};

export default AppRouter;
