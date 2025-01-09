import InfiniteScroll from "react-infinite-scroll-component";
import CurrencySplitter from "../../../assistants/Spliter";
import { Comic } from "../../../common/base.interface";
import { useNavigate } from "react-router-dom";

export default function RecommendedComicsList({
  comicsList,
  fetchMoreData,
  hasMore,
}: {
  comicsList: Comic[] | [];
  fetchMoreData: () => void;
  hasMore: boolean;
}) {
  const navigate = useNavigate();
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">Có thể bạn sẽ thích</p>

      <InfiniteScroll
        dataLength={comicsList.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
      >
        <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-[repeat(auto-fill,10rem)] items-stretch gap-2 lg:gap-4 justify-between">
          {comicsList.map((comics: Comic) => {
            return (
              <div
                key={comics.id}
                className="lg:min-w-40 lg:w-1/2 flex flex-col justify-start items-start border border-gray-300 rounded-lg overflow-hidden cursor-pointer duration-200 hover:bg-gray-100"
                onClick={() => navigate(`/detail/${comics.id}`)}
              >
                <div
                  className="w-full aspect-[2/3] bg-cover bg-center bg-no-repeat"
                  style={{ backgroundImage: `url(${comics.coverImage})` }}
                />
                <p className="wrapTitle font-semibold px-1 pt-2">
                  {comics.title}
                </p>
                <p className="text-red-600 flex items-start gap-1 font-semibold lg:text-lg p-2">
                  {CurrencySplitter(comics.price)}
                  &#8363;
                </p>
              </div>
            );
          })}
        </div>
      </InfiniteScroll>
    </div>
  );
}
