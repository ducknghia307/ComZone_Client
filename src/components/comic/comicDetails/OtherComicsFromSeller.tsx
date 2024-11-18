import { Comic, UserInfo } from "../../../common/base.interface";
import ComicsHorizontalMenu from "../../horizontal-menu/ComicsHorizontalMenu";

export default function OtherComicsFromSeller({
  seller,
  comicsListFromSeller,
  currentComics,
}: {
  seller: UserInfo | undefined;
  comicsListFromSeller: Comic[] | [];
  currentComics?: Comic;
}) {
  return (
    <div className="w-full flex flex-col gap-2 bg-white px-4 py-4 rounded-xl drop-shadow-md">
      <p className="text-sm pb-2">
        Các truyện khác của{" "}
        <span className="font-semibold">{seller?.name}</span>
      </p>

      <ComicsHorizontalMenu
        comicsList={comicsListFromSeller.filter(
          (comics) => comics.id !== currentComics?.id
        )}
      />
    </div>
  );
}
