import { useState } from "react";
import SingleOfferedComics from "./SingleOfferedComics";
import RequestedComicsSection from "./RequestedComicsSection";
import styles from "./style.module.css";

export default function ExchangePost({
  refs,
  index,
}: {
  refs: any[];
  index: number;
}) {
  const samples = [
    {
      name: "The Incredible Hulk",
      image:
        "https://m.media-amazon.com/images/I/71NAM2u0vSL._AC_UF1000,1000_QL80_.jpg",
      preview: [
        "https://i.ebayimg.com/images/g/6NcAAOSwpbFis5Pn/s-l400.jpg",
        "https://cdn.marvel.com/content/1x/marvread2020001014_col.jpg",
        "https://external-preview.redd.it/8FZF_qB2K69JikYe4_51gmeLbr6cqWeyFP58vofznZk.jpg?auto=webp&s=d7df093e31b0928af7393c2e655751d85eb0ee0e",
        "https://i0.wp.com/www.comicon.com/wp-content/uploads/2017/04/Spider-Man_Digest_1-674x1024.jpg?resize=660%2C1003",
      ],
    },
    {
      name: "Doctor Strange #1",
      image:
        "https://i.etsystatic.com/22143117/r/il/6e3642/3719333822/il_fullxfull.3719333822_bm60.jpg",
    },
    {
      name: "Doctor Strange #2",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVagle8MiW0fLw9lNu7AvoxGIJcwWTfpRccg&s",
    },
    {
      name: "Doctor Strange #3",
      image:
        "https://assets.comic-odyssey.com/products/covers/000/003/991/original/open-uri20171124-23-12pxyt0?1511531812",
    },
    {
      name: "Winter Soldier: The Ultimate Civilization Bản đặc biệt",
      image:
        "https://cdn.marvel.com/u/prod/marvel/i/mg/d/20/4f26f05e79cff/clean.jpg",
    },
    {
      name: "Winter Soldier #1",
      image:
        "https://cdn.marvel.com/u/prod/marvel/i/mg/f/30/56bb9b8c01dce/clean.jpg",
    },
    {
      name: "Winter Soldier #1",
      image:
        "https://cdn.marvel.com/u/prod/marvel/i/mg/f/30/56bb9b8c01dce/clean.jpg",
    },
    {
      name: "Winter Soldier #1",
      image:
        "https://cdn.marvel.com/u/prod/marvel/i/mg/f/30/56bb9b8c01dce/clean.jpg",
    },
    {
      name: "Winter Soldier #1",
      image:
        "https://cdn.marvel.com/u/prod/marvel/i/mg/f/30/56bb9b8c01dce/clean.jpg",
    },
    {
      name: "Winter Soldier #1",
      image:
        "https://cdn.marvel.com/u/prod/marvel/i/mg/f/30/56bb9b8c01dce/clean.jpg",
    },
  ];

  const samples2 = [
    {
      name: "One Piece 1000th Volume Limited Edition One Piece 1000th Volume Limited Edition One Piece 1000th Volume Limited Edition",
      image:
        "https://japan-forward.com/wp-content/uploads/2021/09/ONE-PIECE-Volume-100-Calligraphy-%C2%A9-Eiichiro-Oda-Shueisha.jpg",
    },
    {
      name: "One Piece 1111th Volume of 5000: Romance Dawn",
      image:
        "https://preview.redd.it/rare-one-piece-volume-1-romance-dawn-limited-edition-1111-v0-xdltws7bwyua1.png?width=1080&crop=smart&auto=webp&s=d54e14469f0dc702ef871875ae48cb2252280026",
    },
    {
      name: "One Piece Wano Arc: Special",
      image:
        "https://i.pinimg.com/736x/d2/dd/f5/d2ddf51c34df889832d6d4c6af28d5d1.jpg",
    },
  ];

  const [currentlySelected, setCurrentlySelected] = useState<number>(-1);

  const handleSelect = (value: number) => {
    if (currentlySelected === value) setCurrentlySelected(-1);
    else setCurrentlySelected(value);
  };
  return (
    <div className="w-full flex rounded-lg px-4 max-w-[100em] bg-white drop-shadow-md">
      <div className="grow flex flex-col min-w-[30em] py-4">
        <div className="w-full flex items-center gap-4">
          <img
            src="https://img.freepik.com/free-photo/androgynous-avatar-non-binary-queer-person_23-2151100270.jpg"
            className="w-[4em] rounded-full"
          />
          <p className="font-semibold text-lg">Công Trừ</p>
          <p className="font-light text-[0.7em] italic">3 giờ trước</p>
          <span className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500 text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="12"
              height="12"
              fill="currentColor"
            >
              <path d="M14 4.4375C15.3462 4.4375 16.4375 3.34619 16.4375 2H17.5625C17.5625 3.34619 18.6538 4.4375 20 4.4375V5.5625C18.6538 5.5625 17.5625 6.65381 17.5625 8H16.4375C16.4375 6.65381 15.3462 5.5625 14 5.5625V4.4375ZM1 11C4.31371 11 7 8.31371 7 5H9C9 8.31371 11.6863 11 15 11V13C11.6863 13 9 15.6863 9 19H7C7 15.6863 4.31371 13 1 13V11ZM4.87601 12C6.18717 12.7276 7.27243 13.8128 8 15.124 8.72757 13.8128 9.81283 12.7276 11.124 12 9.81283 11.2724 8.72757 10.1872 8 8.87601 7.27243 10.1872 6.18717 11.2724 4.87601 12ZM17.25 14C17.25 15.7949 15.7949 17.25 14 17.25V18.75C15.7949 18.75 17.25 20.2051 17.25 22H18.75C18.75 20.2051 20.2051 18.75 22 18.75V17.25C20.2051 17.25 18.75 15.7949 18.75 14H17.25Z"></path>
            </svg>
            <p className="text-xs">Người bán trên ComZone</p>
          </span>
        </div>

        <div className="pl-2 py-2">
          <p>
            Cần tìm gấp manga One Piece bản giới hạn để sưu tầm!!!
            <br />
            Mình cần trao đổi bộ truyện Marvel giới hạn của mình để sưu tầm
            truyện One Piece bản giới hạn. Ai có thì đổi cho mình nha, có bù giá
            nhé!
          </p>
        </div>

        <div
          ref={index === 0 ? refs[0] : null}
          className="w-full border border-gray-300 rounded-lg relative overflow-hidden"
        >
          <div className="w-full bg-[rgba(0,0,0,0.03)] border-b border-gray-300 py-2 top-0 sticky">
            <p className="px-4 font-light">
              Danh sách truyện <span className="font-semibold">Công Trừ</span>{" "}
              đang sẵn có để trao đổi:
            </p>
          </div>

          <div
            className={`w-full flex flex-wrap gap-x-[2%] gap-y-2 p-2 max-h-[25em] relative overflow-y-auto ${styles.exchange}`}
          >
            {samples.map((value, index) => {
              return (
                <SingleOfferedComics
                  comics={value}
                  index={index}
                  currentlySelected={currentlySelected}
                  handleSelect={handleSelect}
                />
              );
            })}
            <button
              className={`${
                samples.length < 21 && "hidden"
              } mx-auto my-2 py-2 hover:underline`}
            >
              Xem thêm trong trang cá nhân
            </button>
          </div>
        </div>
      </div>

      <div className="basis-1/3 min-w-[20em] flex flex-col justify-start gap-8 px-2 py-4 pl-8 border-l ml-8">
        <RequestedComicsSection list={samples2} ref2={refs[1]} index={index} />
        <button
          ref={index === 0 ? refs[2] : null}
          className="flex items-center justify-center gap-2 border border-gray-400 py-2 rounded-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="currentColor"
          >
            <path d="M10 3H14C18.4183 3 22 6.58172 22 11C22 15.4183 18.4183 19 14 19V22.5C9 20.5 2 17.5 2 11C2 6.58172 5.58172 3 10 3ZM12 17H14C17.3137 17 20 14.3137 20 11C20 7.68629 17.3137 5 14 5H10C6.68629 5 4 7.68629 4 11C4 14.61 6.46208 16.9656 12 19.4798V17Z"></path>
          </svg>
          <p>
            Chat với <span className="font-semibold">Công Trừ</span>
          </p>
        </button>
      </div>
    </div>
  );
}
