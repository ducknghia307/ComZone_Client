import InfiniteScroll from "react-infinite-scroll-component";
import CurrencySplitter from "../../../assistants/Spliter";
import { Comic } from "../../../common/base.interface";

export default function RecommendedComicsList({
  comicsList,
  fetchMoreData,
  hasMore,
}: {
  comicsList: Comic[] | [];
  fetchMoreData: () => void;
  hasMore: boolean;
}) {
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">Có thể bạn sẽ thích</p>

      <InfiniteScroll
        dataLength={comicsList.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={<p className="text-center">No more comics to show</p>}
      >
        <div className="grid grid-cols-[repeat(auto-fill,10rem)] gap-x-4 gap-y-4 justify-between">
          {comicsList.map((comics: Comic) => {
            return (
              <div
                key={comics.id}
                className="min-w-40 w-1/2 flex flex-col justify-start items-start border border-gray-300 rounded-lg overflow-hidden"
              >
                <div
                  className="w-full h-64 bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${comics.coverImage})` }}
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
      </InfiniteScroll>
    </div>
  );
}
