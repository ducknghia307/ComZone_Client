import { useNavigate } from "react-router-dom";
import CurrencySplitter from "../../../assistants/Spliter";
import { Comic } from "../../../common/base.interface";

export default function ComicsSectionInChat({ comics }: { comics: Comic }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col justify-between items-stretch py-4">
      <div className="flex flex-col items-center gap-4">
        <p className="w-full text-start text-lg font-bold px-4">
          THÔNG TIN TRUYỆN
        </p>
        <img src={comics.coverImage} alt="" className="w-2/3 rounded-lg" />
        <div className="flex flex-col text-center gap-1">
          <p className="text-lg font-bold line-clamp-2">{comics.title}</p>
          <p className="font-light text-sm">{comics.author}</p>
        </div>
      </div>

      <div className="flex flex-col items-stretch gap-2">
        <button className="py-3 bg-sky-800 font-bold text-white rounded-lg duration-200 hover:bg-sky-950">
          MUA NGAY VỚI GIÁ {CurrencySplitter(comics.price)}đ
        </button>
        <button
          onClick={() => navigate(`/detail/${comics.id}`)}
          className="py-2 font-semibold border border-black rounded-lg duration-200 hover:bg-gray-100"
        >
          Xem thông tin đầy đủ
        </button>
      </div>
    </div>
  );
}
