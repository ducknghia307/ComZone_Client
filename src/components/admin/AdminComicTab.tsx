import React from "react";
import { Link } from "react-router-dom";

const AdminComicTab = () => {
  return (
    <div className="flex flex-col shadow-md rounded-lg w-full h-fit">
      <Link
        to={"/admin/comic/genres"}
        className={`p-3 rounded-t-lg ${
          location.pathname === "/admin/comic/genres"
            ? "bg-gray-200"
            : "bg-white hover:bg-gray-200"
        } hover:cursor-pointer duration-300 transition-all`}
      >
        Thể loại truyện
      </Link>
      <Link
        to={"/admin/comic/merchandises"}
        className={`p-3  ${
          location.pathname === "/admin/comic/merchandises"
            ? "bg-gray-200"
            : "bg-white hover:bg-gray-200"
        } hover:cursor-pointer duration-300 transition-all`}
      >
        Phụ kiện
      </Link>
      <Link
        to={"/admin/comic/editions"}
        className={`p-3 ${
          location.pathname === "/admin/comic/editions"
            ? "bg-gray-200"
            : "bg-white hover:bg-gray-200"
        } hover:cursor-pointer duration-300 transition-all`}
      >
        Phiên bản
      </Link>
      <Link
        to={"/admin/comic/conditions"}
        className={`p-3 rounded-b-lg ${
          location.pathname === "/admin/comic/editions"
            ? "bg-gray-200"
            : "bg-white hover:bg-gray-200"
        } hover:cursor-pointer duration-300 transition-all`}
      >
        Tình trạng
      </Link>
    </div>
  );
};

export default AdminComicTab;
