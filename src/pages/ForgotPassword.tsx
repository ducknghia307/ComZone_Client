import React, { useState } from "react";
import backgr from "../assets/bookshelf.jpg";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [formData, setFormData] = useState({
    email: "",
    codeOTP: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("Data:", formData);
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
          <h2 className="text-3xl font-bold text-center mb-6">Quên mật khẩu</h2>

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

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300 mt-2"
            >
              Gửi mã OTP
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
