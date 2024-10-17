import React, { useState } from "react";
import backgr from "../assets/bookshelf.jpg";
import { Link, useNavigate } from "react-router-dom";
import { publicAxios } from "../middleware/axiosInstance";

const SignUp = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    codeOTP: "",
  });

  // State to manage the current stage
  const [stage, setStage] = useState("email");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle email submission
  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await publicAxios.post("otp/register", {
        email: formData.email,
      });
      console.log(response);
      if (response.status === 201) {
        setStage("otp");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setError("An error occurred while sending OTP.");
    }
  };

  // Handle OTP submission
  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await publicAxios.post("/otp/verify", {
        email: formData.email,
        otp: formData.codeOTP,
      });

      console.log(response);

      if (response.status === 201) {
        setStage("password");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setError("An error occurred during OTP verification.");
    }
  };

  // Handle form submission for final step (password)
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setError(""); // Clear error if passwords match

    try {
      const response = await publicAxios.post("auth/register", {
        email: formData.email,
        name: formData.username,
        password: formData.password,
      });

      if (response.status === 201) {
        navigate("/signin", { state: { email: formData.email } });
      } else {
        setError("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("An error occurred during registration.");
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
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Đăng Ký</h2>

          {stage === "email" && (
            <form onSubmit={handleSubmitEmail}>
              <div className="mb-4">
                <label className="text-sm font-semibold mb-2" htmlFor="email">
                  Email
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

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-2"
              >
                Xác thực email
              </button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={handleSubmitOTP}>
              <div className="mb-4">
                <label className="text-sm font-semibold mb-2" htmlFor="codeOTP">
                  Mã OTP
                </label>
                <input
                  type="text"
                  id="codeOTP"
                  value={formData.codeOTP}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Nhập mã OTP"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-2"
              >
                Xác nhận OTP
              </button>
            </form>
          )}

          {stage === "password" && (
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label
                  className="text-sm font-semibold mb-2"
                  htmlFor="username"
                >
                  Tên người dùng
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
                  className="text-sm font-semibold mb-2"
                  htmlFor="password"
                >
                  Mật Khẩu
                </label>
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

              <div className="mb-4">
                <label
                  className="text-sm font-semibold mb-2"
                  htmlFor="confirmPassword"
                >
                  Xác Nhận Lại Mật Khẩu
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Xác Nhận Lại Mật Khẩu"
                />
                {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-4"
              >
                Đăng Ký
              </button>
            </form>
          )}

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
