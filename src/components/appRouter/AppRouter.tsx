import React from "react";
import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/HomePage";

const AppRouter = () => {
  return (
    <div className="w-full flex items-start justify-center">
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </div>
  );
};

export default AppRouter;
