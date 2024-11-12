import React, { useEffect, useState } from "react";
import Logo from "../../assets/hcn-logo.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Badge, Dropdown } from "antd";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { authSlice } from "../../redux/features/auth/authSlice";
import { LogoutUser } from "../../redux/features/auth/authActionCreators";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { UserInfo } from "../../common/base.interface";
import {
  BookOutlined,
  ControlOutlined,
  LogoutOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import RegisterSellerModal from "./RegisterSellerModal";
import ChatModal from "../../pages/ChatModal";
const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector((state) => state.auth);
  const [cartLength, setCartLength] = useState(0);
  const [isRegisterSellerModal, setIsRegisterSellerModal] =
    useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatUnreadCount, setChatUnreadCount] = useState<number>(0);
  const navigate = useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const userId = query.get("userId");
    const accessToken = query.get("accessToken");
    const refreshToken = query.get("refreshToken");

    if (accessToken && refreshToken) {
      dispatch(authSlice.actions.login({ accessToken, refreshToken, userId }));
      console.log("Dispatched tokens to Redux");

      window.history.replaceState(null, "", window.location.pathname);

      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    const updateCartLength = () => {
      const cartData = localStorage.getItem("cart");
      const parsedCartData = cartData ? JSON.parse(cartData) : {};

      const userId = userInfo?.id;

      if (userId && parsedCartData[userId]) {
        setCartLength(parsedCartData[userId].length);
      } else {
        setCartLength(0);
      }
    };

    updateCartLength();

    window.addEventListener("cartUpdated", updateCartLength);

    return () => {
      window.removeEventListener("cartUpdated", updateCartLength);
    };
  }, [userInfo]);

  const fetchUserInfo = async () => {
    if (accessToken) {
      try {
        const response = await privateAxios.get("users/profile");

        console.log(response);
        setUserInfo(response.data);
      } catch (error) {
        console.error("Error fetching user info:", error);
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await dispatch(LogoutUser());
    window.location.href = "/";
    // window.location.reload();
  };
  useEffect(() => {
    fetchUserInfo();
  }, [accessToken]);

  const handleSearch = () => {
    if (searchTerm.trim()) {
      window.location.href = `/search?query=${encodeURIComponent(searchTerm)}`;
    }
  };

  const location = useLocation();

  const items: MenuProps["items"] = [
    {
      key: "1",
      label: (
        <Link to={"/accountManagement/profile"} className="REM text-base ">
          Hồ sơ của tôi
        </Link>
      ),
      icon: <UserOutlined style={{ fontSize: 18 }} />,
    },
    {
      type: "divider",
    },
    {
      key: "2",
      label: (
        <Link to={"/profile/recentActivities"} className="REM text-base ">
          Trang cá nhân
        </Link>
      ),
      icon: <BookOutlined style={{ fontSize: 18 }} />,
    },
    {
      type: "divider",
    },
    {
      key: "3",
      label: (
        <Link to={"/accountManagement/profile"} className="REM text-base ">
          Quản lí tài khoản
        </Link>
      ),
      icon: <ControlOutlined style={{ fontSize: 18 }} />,
    },
    {
      type: "divider",
    },
    {
      key: "4",
      label: (
        <>
          {userInfo?.role === "MEMBER" && (
            <p
              className="REM text-base"
              onClick={() => setIsRegisterSellerModal(!isRegisterSellerModal)}
            >
              Trở thành Người bán
            </p>
          )}
          {userInfo?.role === "SELLER" && (
            <Link to={"/sellermanagement/comic"} className="REM text-base ">
              Quản lí Shop
            </Link>
          )}
        </>
      ),
      icon: <ShopOutlined style={{ fontSize: 18 }} />,
    },
    {
      type: "divider",
    },
    {
      key: "5",
      label: (
        <div className="REM text-base " onClick={handleLogout}>
          Đăng xuất
        </div>
      ),
      icon: <LogoutOutlined style={{ fontSize: 18 }} />,
    },
  ];

  const getMessageUnreadList = (value: number) => {
    setChatUnreadCount(value);
  };

  return (
    <>
      <nav className="bg-white border-b shadow-sm w-full ">
        <div className=" flex flex-col  items-center py-4 REM list-none w-full lg:px-12 px-8">
          <div className="flex items-center w-full flex-row md:justify-between ">
            {(window.location.pathname === "/signin" ||
              window.location.pathname === "/signup" ||
              window.location.pathname === "/forgot") && (
              <Link to={"/"}>
                <img className="h-16 w-auto ml-2 " src={Logo} alt="ComZone" />
              </Link>
            )}
            <div className="px-4 max-w-64">
              {window.location.pathname !== "/signin" &&
                window.location.pathname !== "/signup" &&
                window.location.pathname !== "/forgot" && (
                  <Link to={"/"}>
                    <img
                      className="lg:w-full object-cover md:w-48 sm:w-32"
                      src={Logo}
                      alt="ComZone"
                    />
                  </Link>
                )}
            </div>

            {/* logo signin signup forgot */}
            {window.location.pathname !== "/signin" &&
              window.location.pathname !== "/signup" &&
              window.location.pathname !== "/forgot" && (
                <div className="flex items-center lg:w-full lg:flex lg:relative grow mx-10 md:justify-end sm:justify-end">
                  <div className="lg:flex hidden w-full">
                    <input
                      type="search"
                      placeholder="Bạn đang tìm kiếm truyện gì ?"
                      className="grow border rounded-lg pl-10 pr-4 py-2 font-light bg-white"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleSearch();
                        }
                      }}
                    />
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      className="absolute top-1/2 left-4 translate-y-[-50%] fill-gray-600"
                    >
                      <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
                    </svg>
                  </div>
                  {/* hamburger */}
                  <div className="flex lg:hidden flex-row items-center">
                    <Link
                      className="text-black px-2 border-r border-r-solid border-r-1 border-r-black hover:text-black text-sm md:text-base"
                      to={"/signin"}
                    >
                      <li className="text-nowrap">Đăng Nhập</li>
                    </Link>
                    <Link
                      className="text-black px-2 hover:text-black text-sm md:text-base"
                      to={"/signup"}
                    >
                      <li className="text-nowrap">Đăng Ký</li>
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
            {window.location.pathname !== "/signin" &&
              window.location.pathname !== "/signup" &&
              window.location.pathname !== "/forgot" && (
                <>
                  <div className="flex flex-row justify-center items-center gap-6">
                    <li className=" items-center cursor-pointer duration-200 hover:opacity-50 ml-4 lg:flex hidden">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="30"
                        height="30"
                        fill="currentColor"
                      >
                        <path d="M6.00008 5.91424L3.70718 8.20714L2.29297 6.79292L7.00008 2.08582L11.7072 6.79292L10.293 8.20714L8.00008 5.91424L8.00007 11H6.00008L6.00008 5.91424ZM17.0001 9.50003C18.3808 9.50003 19.5001 8.38074 19.5001 7.00003C19.5001 5.61932 18.3808 4.50003 17.0001 4.50003C15.6194 4.50003 14.5001 5.61932 14.5001 7.00003C14.5001 8.38074 15.6194 9.50003 17.0001 9.50003ZM17.0001 11.5C14.5148 11.5 12.5001 9.48531 12.5001 7.00003C12.5001 4.51475 14.5148 2.50003 17.0001 2.50003C19.4854 2.50003 21.5001 4.51475 21.5001 7.00003C21.5001 9.48531 19.4854 11.5 17.0001 11.5ZM21.7072 17.2071L20.293 15.7929L18.0001 18.0858V13H16.0001V18.0858L13.7072 15.7929L12.293 17.2071L17.0001 21.9142L21.7072 17.2071ZM5.00008 19H9.00007L9.00008 15H5.00008L5.00008 19ZM10.0001 13C10.5524 13 11.0001 13.4477 11.0001 14V20C11.0001 20.5523 10.5524 21 10.0001 21H4.00007C3.44779 21 3.00007 20.5523 3.00008 20L3.00008 14C3.00008 13.4477 3.44779 13 4.00008 13H10.0001Z"></path>
                      </svg>
                    </li>
                    {/* Chat */}
                    <li
                      className=" items-center cursor-pointer duration-200 hover:opacity-50 ml-4 lg:flex hidden"
                      onClick={() => setIsChatOpen(!isChatOpen)}
                    >
                      <Badge
                        count={chatUnreadCount}
                        overflowCount={9}
                        showZero={false}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="30"
                          height="30"
                          fill="currentColor"
                        >
                          <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path>
                        </svg>
                      </Badge>
                    </li>
                    {/* noti */}
                    <li className="items-center cursor-pointer duration-200 hover:opacity-50 ml-4 lg:flex hidden">
                      <svg
                        width="40"
                        height="40"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M11.7258 7.34056C12.1397 7.32632 12.4638 6.97919 12.4495 6.56522C12.4353 6.15125 12.0882 5.8272 11.6742 5.84144L11.7258 7.34056ZM7.15843 11.562L6.40879 11.585C6.40906 11.5938 6.40948 11.6026 6.41006 11.6114L7.15843 11.562ZM5.87826 14.979L6.36787 15.5471C6.38128 15.5356 6.39428 15.5236 6.40684 15.5111L5.87826 14.979ZM5.43951 15.342L5.88007 15.949C5.89245 15.94 5.90455 15.9306 5.91636 15.9209L5.43951 15.342ZM9.74998 17.75C10.1642 17.75 10.5 17.4142 10.5 17C10.5 16.5858 10.1642 16.25 9.74998 16.25V17.75ZM11.7258 5.84144C11.3118 5.8272 10.9647 6.15125 10.9504 6.56522C10.9362 6.97919 11.2602 7.32632 11.6742 7.34056L11.7258 5.84144ZM16.2415 11.562L16.9899 11.6113C16.9905 11.6025 16.9909 11.5938 16.9912 11.585L16.2415 11.562ZM17.5217 14.978L16.9931 15.5101C17.0057 15.5225 17.0187 15.5346 17.0321 15.5461L17.5217 14.978ZM17.9605 15.341L17.4836 15.9199C17.4952 15.9294 17.507 15.9386 17.5191 15.9474L17.9605 15.341ZM13.65 16.25C13.2358 16.25 12.9 16.5858 12.9 17C12.9 17.4142 13.2358 17.75 13.65 17.75V16.25ZM10.95 6.591C10.95 7.00521 11.2858 7.341 11.7 7.341C12.1142 7.341 12.45 7.00521 12.45 6.591H10.95ZM12.45 5C12.45 4.58579 12.1142 4.25 11.7 4.25C11.2858 4.25 10.95 4.58579 10.95 5H12.45ZM9.74998 16.25C9.33577 16.25 8.99998 16.5858 8.99998 17C8.99998 17.4142 9.33577 17.75 9.74998 17.75V16.25ZM13.65 17.75C14.0642 17.75 14.4 17.4142 14.4 17C14.4 16.5858 14.0642 16.25 13.65 16.25V17.75ZM10.5 17C10.5 16.5858 10.1642 16.25 9.74998 16.25C9.33577 16.25 8.99998 16.5858 8.99998 17H10.5ZM14.4 17C14.4 16.5858 14.0642 16.25 13.65 16.25C13.2358 16.25 12.9 16.5858 12.9 17H14.4ZM11.6742 5.84144C8.65236 5.94538 6.31509 8.53201 6.40879 11.585L7.90808 11.539C7.83863 9.27613 9.56498 7.41488 11.7258 7.34056L11.6742 5.84144ZM6.41006 11.6114C6.48029 12.6748 6.08967 13.7118 5.34968 14.4469L6.40684 15.5111C7.45921 14.4656 8.00521 13.0026 7.9068 11.5126L6.41006 11.6114ZM5.38865 14.4109C5.23196 14.5459 5.10026 14.6498 4.96265 14.7631L5.91636 15.9209C6.0264 15.8302 6.195 15.6961 6.36787 15.5471L5.38865 14.4109ZM4.99895 14.735C4.77969 14.8942 4.58045 15.1216 4.43193 15.3617C4.28525 15.5987 4.14491 15.9178 4.12693 16.2708C4.10726 16.6569 4.24026 17.0863 4.63537 17.3884C4.98885 17.6588 5.45464 17.75 5.94748 17.75V16.25C5.78415 16.25 5.67611 16.234 5.60983 16.2171C5.54411 16.2004 5.53242 16.1861 5.54658 16.1969C5.56492 16.211 5.59211 16.2408 5.61004 16.2837C5.62632 16.3228 5.62492 16.3484 5.62499 16.3472C5.62513 16.3443 5.62712 16.3233 5.6414 16.2839C5.65535 16.2454 5.67733 16.1997 5.70749 16.151C5.73748 16.1025 5.77159 16.0574 5.80538 16.0198C5.84013 15.981 5.86714 15.9583 5.88007 15.949L4.99895 14.735ZM5.94748 17.75H9.74998V16.25H5.94748V17.75ZM11.6742 7.34056C13.835 7.41488 15.5613 9.27613 15.4919 11.539L16.9912 11.585C17.0849 8.53201 14.7476 5.94538 11.7258 5.84144L11.6742 7.34056ZM15.4932 11.5127C15.3951 13.0024 15.9411 14.4649 16.9931 15.5101L18.0503 14.4459C17.3105 13.711 16.9199 12.6744 16.9899 11.6113L15.4932 11.5127ZM17.0321 15.5461C17.205 15.6951 17.3736 15.8292 17.4836 15.9199L18.4373 14.7621C18.2997 14.6488 18.168 14.5449 18.0113 14.4099L17.0321 15.5461ZM17.5191 15.9474C17.5325 15.9571 17.5599 15.9802 17.5949 16.0193C17.629 16.0573 17.6634 16.1026 17.6937 16.1514C17.7241 16.2004 17.7463 16.2463 17.7604 16.285C17.7748 16.3246 17.7769 16.3457 17.777 16.3485C17.7771 16.3497 17.7756 16.3238 17.792 16.2844C17.81 16.241 17.8375 16.211 17.856 16.1968C17.8702 16.1859 17.8585 16.2002 17.7925 16.217C17.7259 16.234 17.6174 16.25 17.4535 16.25V17.75C17.9468 17.75 18.4132 17.6589 18.7669 17.3885C19.1628 17.0859 19.2954 16.6557 19.2749 16.2693C19.2562 15.9161 19.1151 15.5972 18.9682 15.3604C18.8194 15.1206 18.6202 14.8936 18.4018 14.7346L17.5191 15.9474ZM17.4535 16.25H13.65V17.75H17.4535V16.25ZM12.45 6.591V5H10.95V6.591H12.45ZM9.74998 17.75H13.65V16.25H9.74998V17.75ZM8.99998 17C8.99998 18.5008 10.191 19.75 11.7 19.75V18.25C11.055 18.25 10.5 17.7084 10.5 17H8.99998ZM11.7 19.75C13.2089 19.75 14.4 18.5008 14.4 17H12.9C12.9 17.7084 12.3449 18.25 11.7 18.25V19.75Z"
                          fill="#000000"
                        />
                      </svg>
                    </li>
                    {/* cart nha */}

                    <Link
                      className="  px-6 hover:text-black lg:flex hidden"
                      to={userInfo ? "/cart" : "/signin"}
                    >
                      <Badge count={userInfo ? cartLength : 0} color="black">
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
                      </Badge>
                    </Link>
                  </div>

                  {userInfo ? (
                    <Dropdown
                      menu={{ items }}
                      placement="topRight"
                      trigger={["click"]}
                    >
                      <li className="flex flex-row gap-1 items-center cursor-pointer duration-200 hover:opacity-50  min-w-[10rem] justify-end">
                        <img
                          src={userInfo.avatar || ""}
                          alt={userInfo.name}
                          className="h-10 w-10 rounded-full"
                        />
                        <p className="text-nowrap line-clamp-2 text-lg">
                          {userInfo.name}
                        </p>
                      </li>
                    </Dropdown>
                  ) : (
                    <div className=" flex-row lg:flex hidden">
                      <Link
                        className="text-black px-3 border-r border-r-solid border-r-1 border-r-black hover:text-black duration-200 hover:opacity-50"
                        to={"/signin"}
                      >
                        <li className="text-nowrap text-lg">Đăng Nhập</li>
                      </Link>
                      <Link
                        className="text-black px-3 hover:text-black duration-200 hover:opacity-50"
                        to={"/signup"}
                      >
                        <li className="text-nowrap text-lg">Đăng Ký</li>
                      </Link>
                    </div>
                  )}
                </>
              )}
          </div>
          {/* 3 ne */}
          {window.location.pathname !== "/signin" &&
            window.location.pathname !== "/signup" &&
            window.location.pathname !== "/forgot" && (
              <div className="hidden lg:flex md:flex lg:w-full lg:ml-20 lg:mb-0 mb-2 mt-2 lg:text-base md:text-sm">
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
                    location.pathname === "/exchange" ? "font-bold" : ""
                  }`}
                  to="/exchange"
                >
                  <li>TRAO ĐỔI TRUYỆN</li>
                </Link>
              </div>
            )}
          <div className="flex items-center w-full max-w-full md:max-w-xl lg:max-w-xl relative lg:hidden">
            <input
              type="text"
              placeholder="Bạn đang tìm kiếm truyện gì ?"
              className="flex w-full border border-gray-300 rounded-lg py-3 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-gray-500 text-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={handleSearch}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black text-white rounded-lg px-3 py-2"
            >
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
                    fillRule="evenodd"
                    clipRule="evenodd"
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
                    location.pathname === "/exchange" ? "font-bold" : ""
                  }`}
                  to="/exchange"
                  onClick={toggleMenu}
                >
                  TRAO ĐỔI TRUYỆN
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
      <RegisterSellerModal
        isRegisterSellerModal={isRegisterSellerModal}
        setIsRegisterSellerModal={setIsRegisterSellerModal}
      />
      <ChatModal
        isChatOpen={isChatOpen}
        setIsChatOpen={setIsChatOpen}
        getMessageUnreadList={getMessageUnreadList}
      />
    </>
  );
};

export default Navbar;
