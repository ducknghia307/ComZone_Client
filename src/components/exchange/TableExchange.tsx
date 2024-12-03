/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { Avatar, Empty, Table, Tag, Tooltip } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";
import {
  Exchange,
  UserExchangeList,
} from "../../common/interfaces/exchange.interface";
import { useLocation, useNavigate } from "react-router-dom";
import { useAppSelector } from "../../redux/hooks";
import { Comic, UserInfo } from "../../common/base.interface";
import moment from "moment/min/moment-with-locales";
import Loading from "../loading/Loading";

moment.locale("vi");

const TableExchange: React.FC = () => {
  const { userId } = useAppSelector((state) => state.auth);

  const [data, setData] = useState<Exchange[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const location = useLocation();
  const navigate = useNavigate();
  const path = location.pathname
    .split("/")
    .pop()
    ?.toUpperCase()
    .replace(/-/g, "_");

  const handleRowClick = (id: string) => {
    navigate(`/exchange/detail/${id}`);
  };

  const columns: TableColumnsType<Exchange> = [
    {
      title: "No",
      dataIndex: "index",
      render: (no: number) => <p className="">{no}</p>,
    },
    {
      title: "Người dùng",
      dataIndex: "user",
      render: (user: UserInfo) => (
        <span className="w-full flex items-center justify-start gap-2">
          <Avatar src={user.avatar} /> {user.name}
        </span>
      ),
      align: "center",
    },
    {
      title: "Truyện của người khác",
      dataIndex: "othersComics",
      render: (othersComics: Comic[], record: Exchange) => {
        const maxShown = 10;
        return (
          <div className="flex flex-col items-start gap-2">
            {othersComics.slice(0, maxShown).map((comics) => (
              <span className="flex items-center gap-2">
                <Avatar
                  key={comics.id}
                  src={comics.coverImage}
                  shape="square"
                  size={32}
                />
                <Tooltip
                  title={<p className="text-black">{comics.title}</p>}
                  color="white"
                >
                  <p className="text-start cursor-default line-clamp-2">
                    {comics.title}
                  </p>
                </Tooltip>
              </span>
            ))}
            {othersComics.length > maxShown && (
              <button
                onClick={() => handleRowClick(record.id)}
                className="font-light p-1 rounded-md bg-black text-white mx-auto duration-200 hover:bg-gray-700"
              >
                + {othersComics.length - maxShown} truyện khác
              </button>
            )}
          </div>
        );
      },
      align: "center",
    },
    {
      title: "Truyện của bạn",
      dataIndex: "myComics",
      render: (myComics: Comic[]) => (
        <Avatar.Group shape="square" size={40} max={{ count: 4 }}>
          {myComics.map((comics) => (
            <Tooltip
              title={<p className="text-black">{comics.title}</p>}
              color="white"
            >
              <Avatar src={comics.coverImage} />
            </Tooltip>
          ))}
        </Avatar.Group>
      ),
      align: "center",
    },
    {
      title: "Thời gian",
      dataIndex: "createdAt",
      render: (createdAt: Date) => (
        <p className="font-light">
          {moment(createdAt).calendar().charAt(0).toUpperCase() +
            moment(createdAt).calendar().slice(1)}
        </p>
      ),
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status: string) => {
        let color = "geekblue";
        let translatedStatus = status;
        switch (status) {
          case "PENDING":
            color = "orange";
            translatedStatus = "Đang chờ";
            break;
          case "DEALING":
            color = "blue";
            translatedStatus = "Đang trao đổi";
            break;
          case "DELIVERING":
            color = "yellow";
            translatedStatus = "Đang chờ xác nhận giao hàng";
            break;
          case "SUCCESSFUL":
            color = "green";
            translatedStatus = "Thành công";
            break;
          case "FAILED":
            color = "red";
            translatedStatus = "Thất bại";
            break;
          case "REJECTED":
            color = "red";
            translatedStatus = "Bị từ chối";
            break;
          default:
            color = "geekblue";
        }

        return <Tag color={color}>{translatedStatus}</Tag>;
      },
      align: "center",
    },
    {
      render: (record: Exchange) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleRowClick(record.id)}
            className="px-2 py-1 rounded-md border border-gray-300 flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
            >
              <path d="M2 4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4ZM4 5V19H20V5H4ZM6 7H8V9H6V7ZM8 11H6V13H8V11ZM6 15H8V17H6V15ZM18 7H10V9H18V7ZM10 15H18V17H10V15ZM18 11H10V13H18V11Z"></path>
            </svg>
            Chi tiết
          </button>
        </div>
      ),
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
    setIsLoading(true);
    try {
      const response = await privateAxios(
        `/exchanges/user/status?status=${path}`
      );

      const transformedData = (response.data || []).map(
        (item: UserExchangeList, index: number) => ({
          key: item.id,
          index: index + 1,
          id: item.id,
          user:
            item.requestUser.id === userId ? item.post.user : item.requestUser,
          depositAmount: item.depositAmount,
          compensationAmount: item.compensationAmount,
          status: item.status,
          createdAt: item.createdAt,
          myComics: item.myComics?.map((c) => c.comics) || [],
          othersComics: item.othersComics?.map((c) => c.comics) || [],
        })
      );

      setData(transformedData);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [location]);

  return (
    <div className="w-full min-h-[80vh]">
      {isLoading && <Loading />}
      <Table<Exchange>
        columns={columns}
        dataSource={data}
        onChange={onChange}
        pagination={{ pageSize: 20, hideOnSinglePage: true }}
        showSorterTooltip={{ target: "sorter-icon" }}
        locale={{
          emptyText: (
            <Empty description="">
              <p className="font-light text-gray-500">Chưa có trao đổi nào!</p>
            </Empty>
          ),
        }}
      />
    </div>
  );
};

export default TableExchange;
