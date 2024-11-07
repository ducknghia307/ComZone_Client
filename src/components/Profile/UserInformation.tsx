import React from "react";
import { UserInfo } from "../../common/base.interface";

interface UserInforProp {
  userInfo: UserInfo;
}

const UserInformation: React.FC<UserInforProp> = ({ userInfo }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg pb-4">
      <div className="relative">
        <div className="h-32 overflow-hidden rounded-t-lg">
          <img
            src="https://i.pinimg.com/564x/8c/52/3d/8c523d77f98322cef7ec9d4ca4674dc9.jpg" // Replace with the actual background image URL
            alt="background"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
          <img
            src={userInfo.avatar || ""}
            alt="profile"
            className="w-24 h-24 rounded-full border-4 border-white shadow-md"
          />
        </div>
      </div>

      <div className="pt-14 text-center">
        <h2 className="text-xl font-bold text-gray-800">{userInfo.name}</h2>

        <div className="flex justify-center items-center mt-2 space-x-2 text-gray-600">
          <span className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="w-5 h-5 text-yellow-500"
              viewBox="0 0 20 20"
            >
              <path d="M10 15l-5.9 3.1 1.1-6.4L.4 7.3l6.5-.9L10 1l2.1 5.4 6.5.9-4.7 4.3 1.1 6.4z" />
            </svg>
            <span className="ml-1">5/5</span>
          </span>
          <span className="text-sm">•</span>
          <span className="text-sm">2,5k người theo dõi</span>
        </div>

        {/* Follow Button */}
        <button className="mt-4 px-6 py-2 bg-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-300">
          + Theo dõi
        </button>
      </div>
    </div>
  );
};

export default UserInformation;
