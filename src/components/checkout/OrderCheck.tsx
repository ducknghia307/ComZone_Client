import React from "react";

const OrderCheck = () => {
  return (
    <div className="w-ful px-8 py-4 bg-white">
      <div className="w-full  flex flex-col ">
        <h2 className=" font-bold">KIỂM TRA LẠI ĐƠN HÀNG</h2>
        <table className="w-full mt-4">
          {/* <thead>
          <tr>
            <th></th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thành tiền</th>
          </tr>
        </thead> */}
          <tbody>
            <tr className="border-t px-2 py-4">
              <td>
                <img
                  src="https://salt.tikicdn.com/cache/750x750/ts/product/46/63/dc/5a1a1692a4141a07e4be3714c239a18f.jpg"
                  alt=""
                  className="h-40 w-auto my-2"
                />
              </td>
              <td>
                <h4 className="max-w-full">
                  Thám Tử Lừng Danh Conan - Tập 74 (Tái Bản 2023)
                </h4>
              </td>
              <td>
                <h4 className="text-center">24,200đ</h4>
              </td>
              <td>
                <h4 className="text-center">2</h4>
              </td>
              <td>
                <h4 className="text-yellow-400 text-center">48,400đ</h4>
              </td>
            </tr>
            <tr className="border-t px-2 py-4">
              <td>
                <img
                  src="https://salt.tikicdn.com/cache/750x750/ts/product/46/63/dc/5a1a1692a4141a07e4be3714c239a18f.jpg"
                  alt=""
                  className="h-40 w-auto my-2"
                />
              </td>
              <td>
                <h4 className="max-w-full">
                  Thám Tử Lừng Danh Conan - Tập 74 (Tái Bản 2023)
                </h4>
              </td>
              <td>
                <h4 className="text-center">24,200đ</h4>
              </td>
              <td>
                <h4 className="text-center">2</h4>
              </td>
              <td>
                <h4 className="text-yellow-400 text-center">48,400đ</h4>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="flex flex-row justify-end w-full  py-4 gap-2 border-b-2">
        <h4 className="font-bold">Tổng số tiền:</h4>
        <h4 className="font-light">600,000đ</h4>
      </div>
    </div>
  );
};

export default OrderCheck;
