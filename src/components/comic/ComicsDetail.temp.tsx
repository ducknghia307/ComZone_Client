import { useEffect, useState } from "react";
import { Comic, UserInfo } from "../../common/base.interface";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios } from "../../middleware/axiosInstance";
import ComicsImages from "./comicDetails/ComicsImages";
import ComicsMainInfo from "./comicDetails/ComicsMainInfo";
import ComZonePros from "./comicDetails/ComZonePros";
import ComicsDetailedInfo from "./comicDetails/ComicsDetailedInfo";
import ComicsDescription from "./comicDetails/ComicsDescription";
import SellerFeedbackSection from "./comicDetails/SellerFeedbackSection";
import OtherComicsFromSeller from "./comicDetails/OtherComicsFromSeller";
import ComicsBillingSection from "./comicDetails/ComicsBillingSection";
import ComicsSeller from "./comicDetails/ComicsSeller";
import RecommendedComicsList from "./comicDetails/RecommendedComicsList";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { message } from "antd";
import { callbackUrl } from "../../redux/features/navigate/navigateSlice";

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
  const [hasMore, setHasMore] = useState(true);
  const accessToken = useAppSelector((state) => state.auth.accessToken);
  const dispatch = useAppDispatch();
  // const [recommendedList, setRecommendedList] = useState<Comic[] | []>([]);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();
  // const [open, setOpen] = useState(false);
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
  const comics = currentComics;

  const handleAddToCart = async () => {
    const cartKey = "cart";
    if (accessToken) {
      try {
        const currentCart = JSON.parse(localStorage.getItem(cartKey) || "[]");

        const existingComicIndex = currentCart.findIndex(
          (item: { comics: Comic }) => item.comics.id === id
        );

        if (existingComicIndex >= 0) {
          messageApi.warning({
            key: "a",
            type: "info",
            content: "Truyện này đã được thêm vào giỏ hàng.",
          });
        } else {
          currentCart.push({ comics });
          localStorage.setItem(cartKey, JSON.stringify(currentCart));

          // setOpen(true);
          // setTimeout(() => {
          //   setOpen(false);
          // }, 2000);
          console.log("Item added to cart:", id);
          window.dispatchEvent(new Event("cartUpdated"));
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      console.log("Redirecting to sign-in from:", location.pathname);

      message.error("You need to sign in to add items to your cart.");

      dispatch(callbackUrl({ navigateUrl: location.pathname }));
      navigate("/signin");
    }
  };

  useEffect(() => {
    fetchCurrentComics();
  }, [id]);

  return (
    <>
      {contextHolder}
      <div className="REM min-h-[200vh] bg-gray-100 pb-8">
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
            <div className="w-[30%] max-w-[40em] bg-white px-4 py-4 rounded-xl drop-shadow-md top-4 sticky">
              <ComicsSeller seller={seller} />
              <ComicsBillingSection
                currentComics={currentComics}
                handleAddToCart={handleAddToCart}
              />
            </div>
          </div>

          <div className="w-full max-w-[122em] px-4">
            <OtherComicsFromSeller
              seller={seller}
              comicsListFromSeller={comicsListFromSeller}
            />
          </div>
        </div>

        <div className="w-full max-w-[122em] px-8">
          <RecommendedComicsList
            comicsList={comicsListFromSeller}
            fetchMoreData={fetchCurrentComics}
            hasMore={hasMore}
          />
        </div>
      </div>
    </>
  );
}
