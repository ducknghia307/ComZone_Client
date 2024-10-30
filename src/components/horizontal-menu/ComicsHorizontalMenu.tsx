import { Comic } from "../../common/base.interface";
import "./style.css";
import CurrencySplitter from "../../assistants/Spliter";

export default function ComicsHorizontalMenu({
  comicsList,
}: {
  comicsList: Comic[] | [];
}) {
  return (
    <div className="w-full relative">
      <div className="listContainer w-full flex items-start justify-start gap-8 overflow-x-auto">
        {comicsList.map((comics: Comic) => {
          return (
            <div
              key={comics.id}
              className="min-w-40 w-1/2 flex flex-col justify-start items-start border border-gray-300 rounded-lg overflow-hidden"
            >
              <div
                className={`w-full h-64 bg-cover bg-center bg-no-repeat`}
                style={{ backgroundImage: `url(${comics.coverImage[0]})` }}
              />
              <p className="wrapTitle px-1 pt-2">{comics.title}</p>
              <p className="flex items-start gap-1 font-semibold text-xl p-2">
                {CurrencySplitter(comics.price)}
                <span className="underline text-[0.6em]">đ</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
