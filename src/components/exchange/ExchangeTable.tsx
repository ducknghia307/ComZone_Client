import React from "react";

const ExchangeTable = () => {
  return (
    <div className="w-full">
      <table className="table-fixed w-full">
        <thead>
          <tr>
            <th>Người đăng bài trao đổi</th>
            <th>Người gửi yêu cầu trao đổi</th>
            <th>Tiền cọc</th>
            <th>Tiền bù</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>The Sliding Mr. Bones (Next Stop, Pottersville)</td>
            <td>Malcolm Lockyer</td>
            <td>1961</td>
          </tr>
          <tr>
            <td>Witchy Woman</td>
            <td>The Eagles</td>
            <td>1972</td>
          </tr>
          <tr>
            <td>Shining Star</td>
            <td>Earth, Wind, and Fire</td>
            <td>1975</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ExchangeTable;
