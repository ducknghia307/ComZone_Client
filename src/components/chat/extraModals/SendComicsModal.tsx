/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import { Avatar, Modal } from "antd";
import { privateAxios } from "../../../middleware/axiosInstance";
import { useEffect, useState } from "react";
import { Comic } from "../../../common/base.interface";
import { toLowerCaseNonAccentVietnamese } from "../../../assistants/non-accent-vietnamese";
import ActionConfirm from "../../actionConfirm/ActionConfirm";

export default function SendComicsModal({
  isOpen,
  setIsOpen,
  sentComicsList,
  setSentComicsList,
  handleSendMessageAsComics,
}: {
  isOpen: boolean;
  setIsOpen: Function;
  sentComicsList: Comic[];
  setSentComicsList: Function;
  handleSendMessageAsComics: Function;
}) {
  const [comicsList, setComicsList] = useState<Comic[]>([]);
  const [searchedList, setSearchedList] = useState<Comic[]>([]);
  const [searchKey, setSearchKey] = useState<string>("");
  const [isConfirming, setIsConfirming] = useState<boolean>(false);

  const fetchUserComics = async () => {
    await privateAxios
      .get(`comics/exchange/user`)
      .then((res) => {
        setComicsList(res.data);
        setSearchedList(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchUserComics();
  }, [isOpen]);

  useEffect(() => {
    if (searchKey.length > 0)
      setSearchedList(
        comicsList.filter(
          (comics) =>
            toLowerCaseNonAccentVietnamese(comics.title.toLowerCase()).includes(
              searchKey
            ) ||
            comics.title.toLowerCase().includes(searchKey) ||
            comics.author.toLowerCase().includes(searchKey)
        )
      );
    else setSearchedList(comicsList);
  }, [searchKey]);

  const handleConfirmSend = async () => {
    await handleSendMessageAsComics();
    setIsConfirming(false);
    setIsOpen(false);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={(e) => {
        e.stopPropagation();
        setSentComicsList([]);
        setIsConfirming(false);
        setIsOpen(false);
      }}
      centered
      footer={null}
      width={800}
    >
      <div className="flex flex-col items-stretch gap-4 pt-4">
        <div className="flex items-center justify-between gap-4 pr-8">
          <p className="font-semibold text-lg">Chọn truyện của bạn để gửi:</p>
          <p className="italic font-light text-xs">
            Đã chọn: {sentComicsList.length} / 10
          </p>
        </div>

        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchKey}
            onChange={(e) => {
              setSearchKey(e.target.value.toLowerCase());
            }}
            className="w-1/2 border rounded-lg px-10 py-2"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="absolute top-1/2 left-4 translate-y-[-50%]"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
          </svg>
        </div>

        <div className="flex flex-col min-h-[40vh] max-h-[40vh] items-stretch gap-2 overflow-y-auto">
          {searchedList.map((comics: Comic) => {
            const isSelected = sentComicsList.some((c) => c.id === comics.id);
            return (
              <button
                onClick={() => {
                  if (isSelected)
                    setSentComicsList(
                      sentComicsList.filter((c) => c.id !== comics.id)
                    );
                  else if (sentComicsList.length < 10)
                    setSentComicsList((prev: any) => [...prev, comics]);
                }}
                key={comics.id}
                className={`flex items-center text-start gap-4 border rounded-lg px-2 py-1 relative transition-all duration-200 ${
                  isSelected ? "border-black font-semibold" : "border-gray-300"
                } ${
                  sentComicsList.length === 10 &&
                  !isSelected &&
                  "opacity-40 cursor-default"
                }`}
              >
                <img src={comics.coverImage} alt="" className="w-[3em]" />
                <div className="flex flex-col items-start justify-center">
                  <p className="line-clamp-1 max-w-[50em]">{comics.title}</p>
                  <p className="text-[0.7em] font-light">{comics.author}</p>
                </div>
                <span
                  className={`${
                    !isSelected && "hidden"
                  } flex items-center absolute right-8`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="currentColor"
                  >
                    <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-end gap-8 mt-8">
          <button
            onClick={() => {
              if (sentComicsList.length === 0) setIsOpen(false);
              else setSentComicsList([]);
            }}
            className="hover:underline"
          >
            {sentComicsList.length === 0 ? "Quay lại" : "Chọn lại"}
          </button>
          <button
            disabled={sentComicsList.length === 0}
            onClick={() => setIsConfirming(true)}
            className="px-16 py-2 rounded-lg bg-sky-700 text-white duration-200 hover:bg-sky-900 disabled:bg-gray-300"
          >
            GỬI
          </button>

          <ActionConfirm
            isOpen={isConfirming}
            setIsOpen={setIsConfirming}
            title={`Xác nhận gửi ${sentComicsList.length} truyện?`}
            description={
              <Avatar.Group shape="square" max={{ count: 5 }}>
                {sentComicsList.map((comics, index) => {
                  return (
                    <Avatar key={index} size={100}>
                      <img src={comics.coverImage} alt="" />
                    </Avatar>
                  );
                })}
              </Avatar.Group>
            }
            cancelCallback={() => {
              setIsConfirming(false);
            }}
            confirmCallback={() => handleConfirmSend()}
          />
        </div>
      </div>
    </Modal>
  );
}
