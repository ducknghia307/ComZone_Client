import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";
import { Exchange } from "../../common/interfaces/exchange.interface";
import { useLocation, useNavigate } from "react-router-dom";
import dateFormat from "../../assistants/date.format";
import { useAppSelector } from "../../redux/hooks";

const TableExchange: React.FC = () => {
  const { userId } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<Exchange[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname
    .split("/")
    .pop()
    ?.toUpperCase()
    .replace(/-/g, "_");
  console.log(path);

  // Define handleRowClick above columns definition
  const handleRowClick = (id: string) => {
    navigate(`/exchange/detail/${id}`);
  };

  const columns: TableColumnsType<Exchange> = [
    {
      title: "ID",
      dataIndex: "id",
      render: (id: string, record: Exchange) => (
        <span>
          <p
            className="cursor-pointer hover:opacity-70 duration-200"
            onClick={() => handleRowClick(record.id)} // Use handleRowClick here
          >
            {id.slice(-6)}
          </p>
          <br />
          <span className="text-gray-500 italic text-xs">
            Ngày tạo: {dateFormat(record.createdAt, "dd/mm/yy")}
          </span>
        </span>
      ),
    },
    {
      title: "Người yêu cầu",
      dataIndex: "requestUser",
      render: (user: string) => <span>{user}</span>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        let color = "geekblue"; // Default color
        let translatedStatus = status;
        switch (status) {
          case "PENDING":
            color = "orange";
            translatedStatus = "Đang chờ";
            break;
          case "DEALING":
            color = "blue";
            translatedStatus = "Đang xử lý";
            break;
          case "DELIVERING":
            color = "yellow";
            translatedStatus = "Đang giao hàng";
            break;
          case "DELIVERED":
          case "SUCCESSFUL":
            color = "green";
            translatedStatus = "Thành công";
            break;
          case "FAILED":
          case "REJECTED":
            color = "red";
            translatedStatus = "Thất bại";
            break;
          case "CANCELED":
            color = "gray";
            translatedStatus = "Đã hủy";
            break;
          default:
            color = "geekblue";
        }

        return <Tag color={color}>{translatedStatus}</Tag>;
      },
    },
    {
      title: "Tiền cọc",
      dataIndex: "depositAmount",
      render: (amount: number) => (amount ? `${amount} VND` : "N/A"),
    },
    {
      title: "Tiền bù",
      dataIndex: "compensationAmount",
      render: (amount: number) => (amount ? `${amount} VND` : "N/A"),
    },
  ];

  const onChange: TableProps<Exchange>["onChange"] = (
    pagination,
    sorter,
    extra
  ) => {
    console.log("params", pagination, sorter, extra);
  };

  const fetchData = async () => {
    try {
      const response = await privateAxios(
        `/exchanges/user/status?status=${path}`
      );
      console.log(response);

      const transformedData = response.data.map((item: any) => ({
        key: item.id,
        requestUser:
          userId === item.requestUser.id ? "Bạn" : item.rerequestUser.name,
        depositAmount: item.depositAmount,
        compensationAmount: item.compensationAmount,
        id: item.id,
        status: item.status,
        createdAt: item.createdAt,
      }));
      setData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return (
    <Table<Exchange>
      columns={columns}
      dataSource={data}
      onChange={onChange}
      pagination={{ pageSize: 20 }}
      showSorterTooltip={{ target: "sorter-icon" }}
    />
  );
};

export default TableExchange;
