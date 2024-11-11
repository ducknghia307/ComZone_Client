import { useState } from "react";
import { ExchangeElement } from "../../common/interfaces/exchange-post.interface";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Popconfirm } from "antd";
import EditComicToExchange from "./EditComicToExchange";
import { UserInfo } from "../../common/base.interface";

interface ComicListToExchangeProps {
  comicList: ExchangeElement[];
  setComicList: React.Dispatch<React.SetStateAction<ExchangeElement[]>>;
  userInfo: UserInfo;
  handleDelete: (index: number) => void;
}

const ComicListToExchange = ({
  comicList,
  setComicList,
  userInfo,
  handleDelete,
}: ComicListToExchangeProps) => {
  const [currentlySelected, setCurrentlySelected] = useState<number | null>(
    null
  );
  const [showEdit, setShowEdit] = useState<boolean>(false);
  const handleSelect = (index: number) => {
    setCurrentlySelected(index === currentlySelected ? null : index);
    setShowEdit(index === currentlySelected ? false : true);
  };
  return (
    <div className="w-full flex flex-wrap gap-x-[2%] gap-y-2 p-2 max-h-[25em] relative overflow-y-auto">
      {comicList.length > 0 ? (
        comicList.map((comics, index) => (
          <button
            key={index}
            className={`${
              currentlySelected === index
                ? "basis-full"
                : "basis-[49%] cursor-default"
            } flex justify-between border border-gray-300 rounded-lg p-1 transition-all duration-300`}
          >
            <div className="flex flex-row w-full items-center justify-between">
              <div className="flex items-center justify-start gap-4">
                <img
                  src={comics.coverImage}
                  alt={comics.title}
                  className={`${
                    currentlySelected === index
                      ? "w-[6em] h-[6em]"
                      : "w-[3em] h-[3em]"
                  }  rounded-lg transition-all duration-300 object-cover`}
                />

                <div
                  className={`flex flex-col items-start gap-2 ${
                    currentlySelected === index && "text-[150%]"
                  }`}
                >
                  <div className="flex flex-col items-start">
                    <p className="font-bold text-start">{comics.title}</p>
                    <p className="font-light text-xs">{comics.author}</p>
                  </div>

                  <div
                    className={`${
                      currentlySelected === index ? "" : "hidden"
                    } flex flex-col items-start text-[0.8rem] font-light transition-all duration-200`}
                  >
                    <p>
                      <span className="font-extralight">Phiên bản:</span>{" "}
                      {comics.edition}
                    </p>
                    <p>
                      <span className="font-extralight">Tình trạng:</span>{" "}
                      {comics.condition}
                    </p>
                  </div>
                </div>
              </div>
              <div className="flex flex-row items-center gap-3 px-4">
                <EditOutlined onClick={() => handleSelect(index)} />
                <Popconfirm
                  title="Delete the task"
                  description="Are you sure to delete this task?"
                  onConfirm={() => handleDelete(index)}
                  okText="Yes"
                  cancelText="No"
                >
                  <DeleteOutlined style={{ color: "#FA4032" }} />
                </Popconfirm>
              </div>
            </div>
            {currentlySelected === index && showEdit && (
              <div className="transition-all duration-500">
                <EditComicToExchange
                  comicData={comics}
                  setComicList={setComicList}
                  userInfo={userInfo}
                />
              </div>
            )}
          </button>
        ))
      ) : (
        <p className="text-center text-gray-500">
          Chưa có truyện nào để hiển thị
        </p>
      )}
    </div>
  );
};

export default ComicListToExchange;
