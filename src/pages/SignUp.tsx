import React, { useState } from "react";
import backgr from "../assets/bookshelf.jpg";
import { Link, useNavigate } from "react-router-dom";

const SignUp = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Password matching validation
    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError(""); // Clear error if passwords match

    try {
      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          name: formData.username,
          password: formData.password,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log("Registration successful:", result);
        navigate("/signin", { state: { email: formData.email } });
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Đăng ký thất bại, vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Có lỗi xảy ra khi đăng ký. Vui lòng thử lại sau.");
    }
  };

  return (
    <div
      className=" bg-cover bg-center flex items-center justify-center w-full "
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgr})`,
      }}
    >
      <div className="py-12 w-full flex justify-center">
        <div className="bg-white  p-8 rounded-md shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Đăng Ký</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className=" text-sm font-semibold mb-2 flex items-center gap-0.5"
                htmlFor="email"
              >
                Email <p className="text-red-600 italic">*</p>
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Email"
              />
            </div>
            <div className="mb-4">
              <label
                className=" text-sm font-semibold mb-2 flex items-center gap-0.5"
                htmlFor="username"
              >
                Tên người dùng <p className="text-red-600 italic">*</p>
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Tên"
              />
            </div>

            <div className="mb-4">
              <label
                className=" text-sm font-semibold mb-2 flex items-center gap-0.5"
                htmlFor="password"
              >
                Mật Khẩu <p className="text-red-600 italic">*</p>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Mật Khẩu"
                />
              </div>
            </div>

            <div className="mb-4">
              <label
                className="flex items-center gap-0.5 text-sm font-semibold mb-2"
                htmlFor="confirmPassword"
              >
                Xác Nhận Lại Mật Khẩu <p className="text-red-600 italic">*</p>
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Xác Nhận Lại Mật Khẩu"
                />
              </div>
              {/* Error message for password mismatch */}
              {error && (
                <p className="absolute text-red-500 text-sm mt-1">{error}</p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-4"
            >
              Đăng Ký
            </button>

            <h4 className="font-thin text-sm italic text-center mt-2">hoặc</h4>

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
          </form>

          <p className="mt-4 text-center text-sm">
            Đã có tài khoản?{" "}
            <Link to="/signin" className="font-semibold">
              Đăng Nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
