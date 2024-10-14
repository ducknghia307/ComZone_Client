import React, { useEffect, useState } from "react";
import backgr from "../assets/bookshelf.jpg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const location = useLocation();
  const [emailRegister, setEmailRegister] = useState("");
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });
      console.log("Response:", response);
      if (response.data) {
        console.log("Login successful:", response.data);
        console.log("token:", response.data.accessToken);
        sessionStorage.setItem("accessToken", response.data.accessToken);
        navigate("/");
      } else {
        console.error("Login failed:", response.data.message);
        setEmail("");
        setEmailRegister("");
        setPassword("");
      }
    } catch (error) {
      console.error("Error logging in:", error);
      setEmail("");
      setPassword("");
      setEmailRegister("");
    }
  };

  //   const togglePasswordVisibility = () => {
  //     setShowPassword(!showPassword);
  //   };
  useEffect(() => {
    if (location.state?.email) {
      setEmailRegister(location.state.email);
      navigate(location.pathname, { state: {} });
    }
  }, [location]);

  return (
    <div
      className="bg-cover bg-center flex items-center justify-center w-full"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1)), url(${backgr})`,
      }}
    >
      <div className="py-12 w-full flex justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Đăng Nhập</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="email"
              >
                Email/Số Điện Thoại
              </label>
              <input
                type="email"
                id="email"
                value={emailRegister ? emailRegister : email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Email/Số Điện Thoại"
                required
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-sm font-semibold mb-2"
                htmlFor="password"
              >
                Mật Khẩu
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Mật Khẩu"
                  required
                />
                {/* <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                  onClick={togglePasswordVisibility}
                >
                  {showPassword ? (
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15C10.343 15 9 13.657 9 12C9 10.343 10.343 9 12 9C13.657 9 15 10.343 15 12C15 13.657 13.657 15 12 15Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 4C7.523 4 3.733 7.943 2.459 12C3.733 16.057 7.523 20 12 20C16.478 20 20.269 16.057 21.543 12C20.269 7.943 16.478 4 12 4Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <svg
                      width="20px"
                      height="20px"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 15C10.343 15 9 13.657 9 12C9 10.343 10.343 9 12 9C13.657 9 15 10.343 15 12C15 13.657 13.657 15 12 15Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 4C7.523 4 3.733 7.943 2.459 12C3.733 16.057 7.523 20 12 20C16.478 20 20.269 16.057 21.543 12C20.269 7.943 16.478 4 12 4Z"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M3 3L21 21"
                        stroke="#000000"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button> */}
              </div>
            </div>

            <div className="flex justify-end items-center mb-6">
              <Link to={"/forgot"} className="text-sm">
                Quên Mật Khẩu?
              </Link>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
            >
              Đăng Nhập
            </button>
            <h4 className="font-thin text-sm italic text-center mt-2">hoặc</h4>
          </form>

          <div className="mt-2 text-center">
            <button
              className="w-full bg-white border border-gray-300 text-black py-2 rounded-md flex items-center justify-center hover:bg-gray-100 transition duration-300"
              onClick={() =>
                (window.location.href =
                  "http://localhost:3000/auth/google/login")
              }
            >
              <svg
                width="20px"
                height="20px"
                viewBox="0 0 32 32"
                data-name="Layer 1"
                className="mr-2"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M23.75,16A7.7446,7.7446,0,0,1,8.7177,18.6259L4.2849,22.1721A13.244,13.244,0,0,0,29.25,16"
                  fill="#00ac47"
                />
                <path
                  d="M23.75,16a7.7387,7.7387,0,0,1-3.2516,6.2987l4.3824,3.5059A13.2042,13.2042,0,0,0,29.25,16"
                  fill="#4285f4"
                />
                <path
                  d="M8.25,16a7.698,7.698,0,0,1,.4677-2.6259L4.2849,9.8279a13.177,13.177,0,0,0,0,12.3442l4.4328-3.5462A7.698,7.698,0,0,1,8.25,16Z"
                  fill="#ffba00"
                />
                <polygon
                  fill="#2ab2db"
                  points="8.718 13.374 8.718 13.374 8.718 13.374 8.718 13.374"
                />
                <path
                  d="M16,8.25a7.699,7.699,0,0,1,4.558,1.4958l4.06-3.7893A13.2152,13.2152,0,0,0,4.2849,9.8279l4.4328,3.5462A7.756,7.756,0,0,1,16,8.25Z"
                  fill="#ea4435"
                />
                <polygon
                  fill="#2ab2db"
                  points="8.718 18.626 8.718 18.626 8.718 18.626 8.718 18.626"
                />
                <path
                  d="M29.25,15v1L27,19.5H16.5V14H28.25A1,1,0,0,1,29.25,15Z"
                  fill="#4285f4"
                />
              </svg>
              Đăng nhập bằng Google
            </button>
          </div>

          <p className="mt-4 text-center text-sm">
            Chưa có tài khoản?{" "}
            <Link to={"/signup"} className="font-semibold">
              Đăng Ký
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;