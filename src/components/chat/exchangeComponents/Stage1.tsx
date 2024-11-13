import { Avatar, Collapse, Modal } from "antd";
import { Comic } from "../../../common/base.interface";
import { useState } from "react";
import styles from "../../exchange/style.module.css";
export default function Stage1({
  currentStage,
  comicsGroup,
}: {
  currentStage: number;
  comicsGroup: Comic[];
}) {
  const [isComicListModal, setIsComicListModal] = useState(false);

  // Function to handle the modal visibility toggle
  const handleModalToggle = () => {
    setIsComicListModal(!isComicListModal);
  };
  return (
    <div className="relative flex items-center">
      <Avatar.Group
        shape="square"
        size={40}
        max={{ count: 3 }}
        className={`${currentStage >= 1 && "opacity-50"}`}
      >
        {comicsGroup.map((comics: Comic, index: number) => {
          return <Avatar src={comics.coverImage} key={index} />;
        })}
      </Avatar.Group>

      <span className="text-green-600 absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%]">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="36"
          height="36"
          fill="currentColor"
        >
          <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM11.0026 16L18.0737 8.92893L16.6595 7.51472L11.0026 13.1716L8.17421 10.3431L6.75999 11.7574L11.0026 16Z"></path>
        </svg>
      </span>

      <p
        className={`absolute hover:opacity-85 hover:cursor-pointer duration-200 bottom-[-50%] left-1/2 translate-x-[-50%] text-[0.7em] whitespace-nowrap ${
          currentStage >= 1 && "opacity-50"
        }`}
        onClick={handleModalToggle}
      >
        Xem danh sách truyện
      </p>
      <Modal
        title={
          <h2 className="text-lg p-2">
            Danh sách truyện của {comicsGroup[0].sellerId.name}
          </h2>
        }
        open={isComicListModal}
        onCancel={handleModalToggle}
        footer={null}
        width={800}
      >
        <div
          className={`max-h-[25em] p-2 mt-2 overflow-y-auto ${styles.exchangeRequest}`}
        >
          {comicsGroup.map((comics: Comic, index) => (
            <div key={index} className="mb-4 w-full flex flex-row gap-5">
              <img
                src={comics.coverImage}
                alt={comics.title}
                className="w-32 h-32 mb-2 rounded-lg"
              />
              <div className="w-full flex flex-col gap-2">
                <h3 className="font-bold text-base">{comics.title}</h3>
                <p>
                  <strong></strong> {comics.author}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
