import React, { useState } from "react";
import backgr from "../assets/bookshelf.jpg";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { LoginUser } from "../redux/features/auth/authActionCreators";

const SignIn = () => {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  console.log(":::", isLoading);
  const { navigateUrl } = useAppSelector((state) => state.navigate);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  // const [showPassword, setShowPassword] = useState(false);

  const [emailRegister, setEmailRegister] = useState("");
  const handleLoginGoogle = async () => {
    try {
      window.location.href = `${
        import.meta.env.VITE_SERVER_BASE_URL
      }auth/google/login`;
      //  window.location.reload();
    } catch (error) {
      console.log("Google login error:", error);
    }
  };
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // Pass email and password as formValues to the LoginUser function
      const formValues = { email, password };

      const loginSuccessful = await dispatch(LoginUser(formValues));

      if (loginSuccessful) {
        // Only navigate if login was successful
        window.location.href = navigateUrl ? `${navigateUrl}` : "/";
      } else {
        // Handle login failure (this case may depend on how you handle responses)
        setErrorMessage("Invalid email or password. Please try again.");
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
                  type={"password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  placeholder="Mật Khẩu"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end items-center mb-3">
              <Link to={"/forgot"} className="text-sm">
                Quên Mật Khẩu?
              </Link>
            </div>
            {errorMessage && (
              <p className="text-red-500 text-sm text-center mb-1">
                {errorMessage}
              </p>
            )}
            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition duration-300"
              disabled={isLoading}
            >
              {isLoading ? "Đang Đăng Nhập..." : "Đăng Nhập"}
            </button>
            <h4 className="font-thin text-sm italic text-center mt-2">hoặc</h4>
          </form>

          <div className="mt-2 text-center">
            <button
              className="w-full bg-white border border-gray-300 text-black py-2 rounded-md flex items-center justify-center hover:bg-gray-100 transition duration-300"
              onClick={handleLoginGoogle}
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
