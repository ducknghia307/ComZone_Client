import React, { useEffect, useState } from "react";
import Logo from "../../assets/hcn-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Dropdown } from "antd";
import axios from "axios";
interface UserInfo {
  createdAt: string;
  email: string;
  id: string;
  is_verified: boolean;
  name: string;
  phone: string | null;
  refresh_token: string;
  role: string | null;
  updatedAt: string;
}
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);
  const token = sessionStorage.getItem("accessToken");
  // console.log(token);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  const fetchUserInfo = async () => {
    if (token) {
      try {
        const response = await fetch("http://localhost:3000/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // console.log("User infor:", response.json());

        if (!response.ok) {
          throw new Error("Failed to fetch user info");
        }
        const data = await response.json();
        setUserInfo(data);
      } catch {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };
  const handleLogout = () => {
    axios
      .post(
        "http://localhost:3000/auth/logout",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then(() => {
        console.log("roi nha");
        sessionStorage.removeItem("accessToken");
        navigate("/");
        window.location.reload();
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };
  useEffect(() => {
    fetchUserInfo();
  }, [token]);
  const location = useLocation();
  console.log(userInfo);

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link
          to={"/accountManagement"}
          className="REM text-base text-center w-full"
        >
          Quản lí tài khoản
        </Link>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <div
          className="REM text-base text-center w-full"
          onClick={handleLogout}
        >
          Đăng xuất
        </div>
      ),
    },
  ];
  return (
    <nav className="bg-white border-b shadow-sm w-full ">
      <div className=" flex flex-col items-center py-4 REM list-none w-full lg:px-12 px-8">
        {/* 1 ne */}
        {window.location.pathname !== "/signin" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/forgot" && (
            <div className="lg:flex sm:hidden hidden items-center justify-between lg:text-xl w-full  ">
              <div className="flex py-2">
                <Link
                  className="text-black  px-6 border-r border-r-solid border-r-1 border-r-black hover:text-black"
                  to={""}
                >
                  <li>Kênh Người Bán</li>
                </Link>
                <Link className="text-black px-6 hover:text-black" to={""}>
                  <li>Trở thành Người Bán</li>
                </Link>
              </div>
              <div className="flex py-2 items-center">
                {!userInfo ? (
                  <div className="flex flex-row">
                    <Link
                      className="text-black px-6 border-r border-r-solid border-r-1 border-r-black hover:text-black"
                      to={"/signin"}
                    >
                      <li>Đăng Nhập</li>
                    </Link>
                    <Link
                      className="text-black px-6 hover:text-black"
                      to={"/signup"}
                    >
                      <li>Đăng Ký</li>
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-5">
                    <li className="flex items-center cursor-pointer">
                      <svg
                        width="30"
                        height="30"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.7258 7.34056C12.1397 7.32632 12.4638 6.97919 12.4495 6.56522C12.4353 6.15125 12.0882 5.8272 11.6742 5.84144L11.7258 7.34056ZM7.15843 11.562L6.40879 11.585C6.40906 11.5938 6.40948 11.6026 6.41006 11.6114L7.15843 11.562ZM5.87826 14.979L6.36787 15.5471C6.38128 15.5356 6.39428 15.5236 6.40684 15.5111L5.87826 14.979ZM5.43951 15.342L5.88007 15.949C5.89245 15.94 5.90455 15.9306 5.91636 15.9209L5.43951 15.342ZM9.74998 17.75C10.1642 17.75 10.5 17.4142 10.5 17C10.5 16.5858 10.1642 16.25 9.74998 16.25V17.75ZM11.7258 5.84144C11.3118 5.8272 10.9647 6.15125 10.9504 6.56522C10.9362 6.97919 11.2602 7.32632 11.6742 7.34056L11.7258 5.84144ZM16.2415 11.562L16.9899 11.6113C16.9905 11.6025 16.9909 11.5938 16.9912 11.585L16.2415 11.562ZM17.5217 14.978L16.9931 15.5101C17.0057 15.5225 17.0187 15.5346 17.0321 15.5461L17.5217 14.978ZM17.9605 15.341L17.4836 15.9199C17.4952 15.9294 17.507 15.9386 17.5191 15.9474L17.9605 15.341ZM13.65 16.25C13.2358 16.25 12.9 16.5858 12.9 17C12.9 17.4142 13.2358 17.75 13.65 17.75V16.25ZM10.95 6.591C10.95 7.00521 11.2858 7.341 11.7 7.341C12.1142 7.341 12.45 7.00521 12.45 6.591H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM9.74998 16.25C9.33577 16.25 8.99998 16.5858 8.99998 17C8.99998 17.4142 9.33577 17.75 9.74998 17.75V16.25ZM13.65 17.75C14.0642 17.75 14.4 17.4142 14.4 17C14.4 16.5858 14.0642 16.25 13.65 16.25V17.75ZM10.5 17C10.5 16.5858 10.1642 16.25 9.74998 16.25C9.33577 16.25 8.99998 16.5858 8.99998 17H10.5ZM14.4 17C14.4 16.5858 14.0642 16.25 13.65 16.25C13.2358 16.25 12.9 16.5858 12.9 17H14.4ZM11.6742 5.84144C8.65236 5.94538 6.31509 8.53201 6.40879 11.585L7.90808 11.539C7.83863 9.27613 9.56498 7.41488 11.7258 7.34056L11.6742 5.84144ZM6.41006 11.6114C6.48029 12.6748 6.08967 13.7118 5.34968 14.4469L6.40684 15.5111C7.45921 14.4656 8.00521 13.0026 7.9068 11.5126L6.41006 11.6114ZM5.38865 14.4109C5.23196 14.5459 5.10026 14.6498 4.96265 14.7631L5.91636 15.9209C6.0264 15.8302 6.195 15.6961 6.36787 15.5471L5.38865 14.4109ZM4.99895 14.735C4.77969 14.8942 4.58045 15.1216 4.43193 15.3617C4.28525 15.5987 4.14491 15.9178 4.12693 16.2708C4.10726 16.6569 4.24026 17.0863 4.63537 17.3884C4.98885 17.6588 5.45464 17.75 5.94748 17.75V16.25C5.78415 16.25 5.67611 16.234 5.60983 16.2171C5.54411 16.2004 5.53242 16.1861 5.54658 16.1969C5.56492 16.211 5.59211 16.2408 5.61004 16.2837C5.62632 16.3228 5.62492 16.3484 5.62499 16.3472C5.62513 16.3443 5.62712 16.3233 5.6414 16.2839C5.65535 16.2454 5.67733 16.1997 5.70749 16.151C5.73748 16.1025 5.77159 16.0574 5.80538 16.0198C5.84013 15.981 5.86714 15.9583 5.88007 15.949L4.99895 14.735ZM5.94748 17.75H9.74998V16.25H5.94748V17.75ZM11.6742 7.34056C13.835 7.41488 15.5613 9.27613 15.4919 11.539L16.9912 11.585C17.0849 8.53201 14.7476 5.94538 11.7258 5.84144L11.6742 7.34056ZM15.4932 11.5127C15.3951 13.0024 15.9411 14.4649 16.9931 15.5101L18.0503 14.4459C17.3105 13.711 16.9199 12.6744 16.9899 11.6113L15.4932 11.5127ZM17.0321 15.5461C17.205 15.6951 17.3736 15.8292 17.4836 15.9199L18.4373 14.7621C18.2997 14.6488 18.168 14.5449 18.0113 14.4099L17.0321 15.5461ZM17.5191 15.9474C17.5325 15.9571 17.5599 15.9802 17.5949 16.0193C17.629 16.0573 17.6634 16.1026 17.6937 16.1514C17.7241 16.2004 17.7463 16.2463 17.7604 16.285C17.7748 16.3246 17.7769 16.3457 17.777 16.3485C17.7771 16.3497 17.7756 16.3238 17.792 16.2844C17.81 16.241 17.8375 16.211 17.856 16.1968C17.8702 16.1859 17.8585 16.2002 17.7925 16.217C17.7259 16.234 17.6174 16.25 17.4535 16.25V17.75C17.9468 17.75 18.4132 17.6589 18.7669 17.3885C19.1628 17.0859 19.2954 16.6557 19.2749 16.2693C19.2562 15.9161 19.1151 15.5972 18.9682 15.3604C18.8194 15.1206 18.6202 14.8936 18.4018 14.7346L17.5191 15.9474ZM17.4535 16.25H13.65V17.75H17.4535V16.25ZM12.45 6.591V5H10.95V6.591H12.45ZM9.74998 17.75H13.65V16.25H9.74998V17.75ZM8.99998 17C8.99998 18.5008 10.191 19.75 11.7 19.75V18.25C11.055 18.25 10.5 17.7084 10.5 17H8.99998ZM11.7 19.75C13.2089 19.75 14.4 18.5008 14.4 17H12.9C12.9 17.7084 12.3449 18.25 11.7 18.25V19.75Z"
                          fill="#000000"
                        />
                      </svg>
                      Thông Báo
                    </li>
                    <Dropdown
                      menu={{ items }}
                      placement="topRight"
                      trigger={["click"]}
                    >
                      <li
                        // to={"/profile"}
                        className="flex flex-row gap-1 items-center cursor-pointer"
                      >
                        <svg
                          width="25px"
                          height="25px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M5 21C5 17.134 8.13401 14 12 14C15.866 14 19 17.134 19 21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z"
                            stroke="#000000"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        {userInfo.name}
                      </li>
                    </Dropdown>
                  </div>
                )}
              </div>
            </div>
          )}
        {/* 2 ne */}
        <div className="flex items-center w-full justify-between">
          {location.pathname === "/sellermanagement" ? (
            // Custom Navbar for /sellermanagement
            <Link to={"/"}>
              <img
                className="h-16 w-auto ml-2 sm:h-20 md:h-24 lg:h-28 xl:h-32"
                src={Logo}
                alt="ComZone"
              />
            </Link>
          ) : (
            // Default Navbar
            <>
              {window.location.pathname !== "/signin" &&
                window.location.pathname !== "/signup" &&
                window.location.pathname !== "/forgot" && (
                  <Link to={"/"}>
                    <img
                      className="h-16 w-auto ml-2 sm:h-20 md:h-24 lg:h-28 xl:h-32"
                      src={Logo}
                      alt="ComZone"
                    />
                  </Link>
                )}
            </>
          )}

          {(window.location.pathname === "/signin" ||
            window.location.pathname === "/signup" ||
            window.location.pathname === "/forgot") && (
            <Link to={"/"}>
              <img className="h-16 w-auto ml-2 " src={Logo} alt="ComZone" />
            </Link>
          )}
          {window.location.pathname !== "/signin" &&
            window.location.pathname !== "/signup" &&
            window.location.pathname !== "/forgot" && (
              <div className="flex items-center lg:w-full lg:max-w-4xl lg:flex lg:relative">
                <input
                  type="text"
                  placeholder="Bạn đang tìm kiếm truyện gì ?"
                  className="hidden lg:flex w-full border border-gray-300 rounded-lg py-3 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500 text-md"
                />
                <button className="hidden lg:flex lg:absolute md:absolute lg:right-2 md:right-2 md:top-[22%] lg:top-1/2 transform -translate-y-1/2 bg-black text-white rounded-lg px-3 py-2 ">
                  <svg
                    className="h-5 w-8"
                    aria-labelledby="title desc"
                    role="img"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 19.9 19.7"
                  >
                    <title id="title">Search Icon</title>
                    <desc id="desc">A magnifying glass icon.</desc>
                    <g className="search-path" stroke="#FFFFFF" strokeWidth="2">
                      <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                      <circle cx="8" cy="8" r="7" />
                    </g>
                  </svg>
                </button>
                {/* hamburger */}
                <div className="flex lg:hidden flex-row items-center">
                  <Link
                    className="text-black px-2 border-r border-r-solid border-r-1 border-r-black hover:text-black text-sm md:text-base"
                    to={"/signin"}
                  >
                    <li>Đăng Nhập</li>
                  </Link>
                  <Link
                    className="text-black px-2 hover:text-black text-sm md:text-base"
                    to={"/signup"}
                  >
                    <li>Đăng Ký</li>
                  </Link>
                  {/* menu-btn */}
                  <button
                    className="ml-2 border p-1 rounded-lg"
                    onClick={toggleMenu}
                  >
                    <svg
                      width="28px"
                      height="28px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 6H20M4 12H20M4 18H20"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          {/* cart nha */}
          {window.location.pathname !== "/signin" &&
            window.location.pathname !== "/signup" &&
            window.location.pathname !== "/forgot" && (
              <Link
                className="  px-6 hover:text-black lg:flex hidden"
                to={"/cart"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  width="30"
                  height="30"
                >
                  <rect width="256" height="256" fill="none" />
                  <circle cx="80" cy="216" r="20" />
                  <circle cx="184" cy="216" r="20" />
                  <path
                    d="M42.3,72H221.7l-24.1,84.4A16,16,0,0,1,182.2,168H81.8a16,16,0,0,1-15.4-11.6L32.5,37.8A8,8,0,0,0,24.8,32H12"
                    fill="none"
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="24"
                  />
                </svg>
              </Link>
            )}
        </div>
        {/* 3 ne */}
        {window.location.pathname !== "/signin" &&
          window.location.pathname !== "/signup" &&
          window.location.pathname !== "/forgot" && (
            <div className="hidden lg:flex md:flex lg:w-full py-2 lg:ml-20 my-2 lg:text-lg md:text-sm">
              <Link
                className={`text-black px-6 hover:text-black ${
                  location.pathname === "/" ? "font-bold" : ""
                }`}
                to="/"
              >
                <li>TRANG CHỦ</li>
              </Link>
              <Link
                className={`text-black px-6 hover:text-black ${
                  location.pathname === "/auctions" ? "font-bold" : ""
                }`}
                to="/auctions"
              >
                <li>CÁC CUỘC ĐẤU GIÁ</li>
              </Link>
              <Link
                className={`text-black px-6 hover:text-black ${
                  location.pathname === "/genres" ? "font-bold" : ""
                }`}
                to="/genres"
              >
                <li>TẤT CẢ THỂ LOẠI</li>
              </Link>
              <Link
                className={`text-black px-6 hover:text-black ${
                  location.pathname === "/blog" ? "font-bold" : ""
                }`}
                to="/blog"
              >
                <li>BLOG TRAO ĐỔI</li>
              </Link>
            </div>
          )}
        <div className="flex items-center w-full max-w-full md:max-w-xl lg:max-w-xl relative lg:hidden">
          <input
            type="text"
            placeholder="Bạn đang tìm kiếm truyện gì ?"
            className="flex w-full border border-gray-300 rounded-lg py-3 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500 text-md"
          />
          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-lg px-3 py-2">
            <svg
              className="h-5 w-8"
              aria-labelledby="title desc"
              role="img"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 19.9 19.7"
            >
              <title id="title">Search Icon</title>
              <desc id="desc">A magnifying glass icon.</desc>
              <g className="search-path" stroke="#FFFFFF" strokeWidth="2">
                <path strokeLinecap="square" d="M18.5 18.3l-5.4-5.4" />
                <circle cx="8" cy="8" r="7" />
              </g>
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="lg:hidden flex flex-col w-full mt-4 absolute top-0 left-0 bg-white z-10">
            <div className=" flex justify-end mr-4">
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={toggleMenu}
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M19.207 6.207a1 1 0 0 0-1.414-1.414L12 10.586 6.207 4.793a1 1 0 0 0-1.414 1.414L10.586 12l-5.793 5.793a1 1 0 1 0 1.414 1.414L12 13.414l5.793 5.793a1 1 0 0 0 1.414-1.414L13.414 12l5.793-5.793z"
                  fill="#000000"
                />
              </svg>
            </div>
            <div className="flex flex-col items-center w-full">
              <Link
                className={`text-black px-6 py-2 hover:text-black flex lg:hidden md:hidden ${
                  location.pathname === "/" ? "font-bold" : ""
                }`}
                to="/"
                onClick={toggleMenu}
              >
                TRANG CHỦ
              </Link>
              <Link
                className={`text-black px-6 py-2 hover:text-black flex lg:hidden md:hidden ${
                  location.pathname === "/auctions" ? "font-bold" : ""
                }`}
                to="/auctions"
                onClick={toggleMenu}
              >
                CÁC CUỘC ĐẤU GIÁ
              </Link>
              <Link
                className={`text-black px-6 py-2 hover:text-black flex lg:hidden md:hidden ${
                  location.pathname === "/genres" ? "font-bold" : ""
                }`}
                to="/genres"
                onClick={toggleMenu}
              >
                TẤT CẢ THỂ LOẠI
              </Link>
              <Link
                className={`text-black px-6 py-2 hover:text-black flex lg:hidden md:hidden ${
                  location.pathname === "/blog" ? "font-bold" : ""
                }`}
                to="/blog"
                onClick={toggleMenu}
              >
                BLOG TRAO ĐỔI
              </Link>
              <Link
                className={
                  "text-black px-6 py-2 hover:text-black border-t-2 border-black md:border-none w-3/4 text-center "
                }
                to="/"
                onClick={toggleMenu}
              >
                KÊNH NGƯỜI BÁN
              </Link>
              <Link
                className={"text-black px-6 py-2 hover:text-black "}
                to="/"
                onClick={toggleMenu}
              >
                TRỞ THÀNH NGƯỜI BÁN
              </Link>
              <Link
                className={`text-black px-6 py-2 hover:text-black ${
                  location.pathname === "/cart" ? "font-bold" : ""
                }`}
                to="/cart"
                onClick={toggleMenu}
              >
                GIỎ HÀNG
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
