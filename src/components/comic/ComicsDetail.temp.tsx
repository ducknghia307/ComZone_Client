import { useEffect, useState } from "react";
import { Comic, Genre, UserInfo } from "../../common/base.interface";
import { useParams } from "react-router-dom";
import { privateAxios } from "../../middleware/axiosInstance";
import ComicsImages from "./comicDetails/ComicsImages";
import ComicsMainInfo from "./comicDetails/ComicsMainInfo";
import ComicsSellerAndButtons from "./comicDetails/ComicsSeller";
import ComZonePros from "./comicDetails/ComZonePros";
import ComicsDetailedInfo from "./comicDetails/ComicsDetailedInfo";
import ComicsDescription from "./comicDetails/ComicsDescription";
import SellerFeedbackSection from "./comicDetails/SellerFeedbackSection";
import OtherComicsFromSeller from "./comicDetails/OtherComicsFromSeller";

export default function ComicsDetailTemp() {
  const [currentComics, setCurrentComics] = useState<Comic>();
  const [seller, setSeller] = useState<UserInfo>();
  const [imageList, setImageList] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [sellerDetails, setSellerDetails] = useState();
  const [feedbackList, setFeedbackList] = useState();
  const [comicsListFromSeller, setComicsListFromSeller] = useState<
    Comic[] | []
  >([]);

  const { id } = useParams();

  const fetchCurrentComics = async () => {
    await privateAxios
      .get(`/comics/${id}`)
      .then(async (res) => {
        console.log(res.data);
        setCurrentComics(res.data);
        setSeller(res.data.sellerId);
        const images = res.data.coverImage.concat(res.data.previewChapter);
        setCurrentImage(images[0]);
        setImageList(images);

        await privateAxios
          .get(`/comics/seller/${res.data.sellerId.id}`)
          .then((res1) => {
            setComicsListFromSeller(res1.data);
          });
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchCurrentComics();
  }, [id]);

  return (
    <div className="REM min-h-[200vh] bg-gray-100">
      <div className="flex flex-col justify-start items-center gap-4 px-4 pt-4 pb-8 relative">
        <div className="w-full flex items-start justify-center gap-4 relative">
          <div className="w-2/3 max-w-[80em] flex flex-col justify-end gap-4 relative">
            <div className="flex justify-end gap-4">
              <div className="grow max-w-[30em] gap-2">
                <ComicsImages
                  currentImage={currentImage}
                  setCurrentImage={setCurrentImage}
                  imageList={imageList}
                />
              </div>
              <div className="grow max-w-[40em] flex flex-col gap-2">
                <ComicsMainInfo currentComics={currentComics} />
                <ComZonePros />
                <ComicsDetailedInfo currentComics={currentComics} />
                <ComicsDescription currentComics={currentComics} />
              </div>
            </div>
            <div className="flex justify-start">
              <SellerFeedbackSection
                seller={seller}
                feedbackList={feedbackList}
              />
            </div>
          </div>
          <ComicsSellerAndButtons
            seller={seller}
            currentComics={currentComics}
          />
        </div>

        <div className="w-full max-w-[122em] px-4">
          <OtherComicsFromSeller
            seller={seller}
            comicsListFromSeller={comicsListFromSeller}
          />
        </div>
      </div>
    </div>
  );
}
