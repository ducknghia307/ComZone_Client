import React, { useState } from "react";
import backgr from "../assets/bookshelf.jpg";
import { publicAxios } from "../middleware/axiosInstance";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    codeOTP: "",
    password: "",
    confirmPassword: "",
  });
  const [stage, setStage] = useState("email"); // "email", "otp", or "newPassword"
 

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await publicAxios.post("otp/reset_password", {
        email: formData.email,
      });
      console.log("erawawewa", response);
      if (response.status === 201) {
        setStage("otp"); // Move to OTP input stage
      } else {
        console.error("Failed to send OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitOTP = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Make API call to verify OTP
    try {
      const response = await publicAxios.post("otp/verify", {
        email: formData.email,
        otp: formData.codeOTP,
      });
      if (response.status === 201) {
        setStage("newPassword"); // Move to new password stage
      } else {
        console.error("Invalid OTP");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleSubmitNewPassword = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      console.error("Passwords do not match");
      return; // Optionally, show a user-friendly error
    }

    // Make API call to reset the password
    try {
      const response = await publicAxios.post("otp/reset", {
        email: formData.email,
        otp: formData.codeOTP,
        newPassword: formData.password,
      });
      console.log("resetpass:::::::::", response);

      // if (response.status === 201) {
      //   // Redirect or show a success message
      //   navigate("/login");
      // } else {
      //   console.error("Failed to reset password");
      // }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div
      className="bg-cover bg-center flex items-center justify-center w-full"
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${backgr})`,
      }}
    >
      <div className="py-12 w-full flex justify-center">
        <div className="bg-white p-8 rounded-md shadow-md w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6">Quên mật khẩu</h2>

          {stage === "email" && (
            <form onSubmit={handleSubmitEmail}>
              <div className="mb-4">
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-0.5"
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

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-2"
              >
                Gửi mã OTP
              </button>
            </form>
          )}

          {stage === "otp" && (
            <form onSubmit={handleSubmitOTP}>
              <div className="mb-4">
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-0.5"
                  htmlFor="codeOTP"
                >
                  Mã OTP <p className="text-red-600 italic">*</p>
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

          {stage === "newPassword" && (
            <form onSubmit={handleSubmitNewPassword}>
              <div className="mb-4">
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-0.5"
                  htmlFor="password"
                >
                  Mật khẩu mới <p className="text-red-600 italic">*</p>
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Nhập mật khẩu mới"
                />
              </div>

              <div className="mb-4">
                <label
                  className="text-sm font-semibold mb-2 flex items-center gap-0.5"
                  htmlFor="confirmPassword"
                >
                  Xác nhận mật khẩu mới <p className="text-red-600 italic">*</p>
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Xác nhận mật khẩu mới"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-2"
              >
                Đặt lại mật khẩu
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
