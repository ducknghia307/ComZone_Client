/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Comic, UserInfo } from "../../common/base.interface";
import { useNavigate, useParams } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
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
import ChatModal from "../../pages/ChatModal";
import {
  SellerFeedback,
  SellerFeedbackResponse,
} from "../../common/interfaces/seller-feedback.interface";
import Loading from "../loading/Loading";
import socket from "../../services/socket";

export default function ComicsDetailTemp() {
  const { userId, isLoggedIn } = useAppSelector((state) => state.auth);

  const [currentComics, setCurrentComics] = useState<Comic>();
  const [seller, setSeller] = useState<UserInfo>();
  const [imageList, setImageList] = useState<string[]>([]);
  const [currentImage, setCurrentImage] = useState<string>("");
  const [relatedComicsList, setRelatedComicsList] = useState<Comic[]>([]);
  const [feedbackList, setFeedbackList] = useState<SellerFeedback[]>([]);
  const [averageRating, setAverageRating] = useState<number>();
  const [totalFeedback, setTotalFeedback] = useState<number>(0);
  const [comicsListFromSeller, setComicsListFromSeller] = useState<
    Comic[] | []
  >([]);

  const [hasMore, setHasMore] = useState(true);
  const dispatch = useAppDispatch();
  const [userInfo, setUserInfo] = useState<UserInfo>();
  const [isInCart, setIsInCart] = useState<boolean>(false);
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  const fetchCurrentComics = async () => {
    await privateAxios
      .get(`/comics/${id}`)
      .then(async (res) => {
        setCurrentComics(res.data);
        setSeller(res.data.sellerId);
        const images = [res.data.coverImage, ...res.data.previewChapter];
        setCurrentImage(images[0]);
        setImageList(images);

        await privateAxios
          .get(`/comics/seller/available/${res.data.sellerId.id}`)
          .then((res1) => {
            setComicsListFromSeller(res1.data);
          });

        await fetchSellerFeedback(res.data.sellerId.id);
      })
      .catch((err) => console.log(err));
  };

  const fetchUserInfo = async () => {
    try {
      const res = await privateAxios("/users/profile");
      setUserInfo(res.data);
    } catch (error) {
      console.log("Error to fetch user information:", error);
    }
  };

  const fetchSellerFeedback = async (sellerId: string) => {
    await publicAxios
      .get(`seller-feedback/seller/some/${sellerId}`)
      .then((res) => {
        const resFeedback: SellerFeedbackResponse = res.data;
        setFeedbackList(resFeedback.feedback);
        setTotalFeedback(resFeedback.totalFeedback);
        setAverageRating(resFeedback.averageRating);
      })
      .catch((err) => console.log(err));
  };

  const fetchRelatedComicsList = async () => {
    await publicAxios
      .get("comics/status/AVAILABLE")
      .then((res) => {
        setRelatedComicsList(res.data);
      })
      .catch((err) => console.log(err));
  };

  const checkIsInCart = () => {
    const cartKey = "cart";

    if (userId) {
      const allCarts = JSON.parse(localStorage.getItem(cartKey) || "{}");
      const userCart = allCarts[userId] || [];

      const exists = userCart.some((comic: Comic) => comic.id === id);
      setIsInCart(exists);
    }
  };

  const handleBuyNow = async () => {
    if (!currentComics) return;

    sessionStorage.setItem(
      "selectedComics",
      JSON.stringify({
        [currentComics.sellerId?.id]: {
          sellerName: currentComics.sellerId?.name,
          comics: [{ comic: currentComics, quantity: 1 }],
        },
      })
    );

    navigate("/checkout");
  };

  const handleAddToCart = async () => {
    const cartKey = "cart";
    const userId = userInfo?.id;

    if (userId) {
      try {
        const allCarts = JSON.parse(localStorage.getItem(cartKey) || "{}");

        if (!allCarts[userId]) {
          allCarts[userId] = [];
        }

        const exists = allCarts[userId].some((comic: Comic) => comic.id === id);

        if (exists) {
          messageApi.warning({
            key: "cart",
            type: "info",
            content: "Truyện này đã được thêm vào giỏ hàng.",
          });
        } else {
          allCarts[userId].push(currentComics);
          localStorage.setItem(cartKey, JSON.stringify(allCarts));

          window.dispatchEvent(new Event("cartUpdated"));

          messageApi.success({
            key: "cart",
            content: "Thêm truyện vào giỏ hàng thành công.",
            duration: 5,
          });
        }
      } catch (error) {
        console.error("Error adding item to cart:", error);
      }
    } else {
      message.error("You need to sign in to add items to your cart.");

      dispatch(callbackUrl({ navigateUrl: location.pathname }));
      navigate("/signin");
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchCurrentComics();
    fetchRelatedComicsList();
  }, [id]);

  useEffect(() => {
    checkIsInCart();
  }, [currentComics]);

  const handleOpenChat = async (comics: Comic) => {
    if (!isLoggedIn) {
      alert("Chưa đăng nhập!");
      return;
    } else {
      setIsLoading(true);
      await privateAxios
        .post("chat-rooms/comics", {
          secondUser: comics.sellerId.id,
          comics: comics.id,
        })
        .then((res) => {
          sessionStorage.setItem("connectedChat", res.data.id);
          socket.emit("join-room", { userId: comics.sellerId.id });
          socket.emit("join-room", { userId: userInfo.id });
          setIsChatOpen(true);
        })
        .catch((err) => console.log(err))
        .finally(() => setIsLoading(false));
    }
  };

  return (
    <>
      {contextHolder}
      {isLoading && <Loading />}
      <div className="REM min-h-[200vh] bg-gray-100 pb-8">
        <div className="flex flex-col justify-start items-center gap-4 px-2 pt-4 pb-8 relative">
          <div className="w-full flex flex-col lg:flex-row items-start justify-center gap-4 relative">
            <div className="w-full lg:basis-2/3 lg:max-w-[80em] flex flex-col items-stretch justify-end gap-4 relative">
              <div className="w-full flex flex-col lg:flex-row items-stretch justify-center gap-4">
                <ComicsImages
                  currentImage={currentImage}
                  setCurrentImage={setCurrentImage}
                  imageList={imageList}
                />

                <div className="grow min-w-[20em] flex flex-col gap-2">
                  <ComicsMainInfo currentComics={currentComics} />

                  <div className="block lg:hidden bg-white px-4 py-4 rounded-xl drop-shadow-md">
                    <ComicsBillingSection
                      currentComics={currentComics}
                      handleAddToCart={handleAddToCart}
                      handleBuyNow={handleBuyNow}
                      isInCart={isInCart}
                      setIsInCart={setIsInCart}
                    />
                  </div>

                  <ComZonePros />
                  <ComicsDetailedInfo currentComics={currentComics} />
                  <ComicsDescription currentComics={currentComics} />

                  <div className="block lg:hidden bg-white px-4 py-4 rounded-xl drop-shadow-md top-1 sticky">
                    <ComicsSeller
                      seller={seller}
                      comics={currentComics}
                      handleOpenChat={handleOpenChat}
                      currentId={userInfo?.id}
                      totalFeedback={totalFeedback}
                      averageRating={averageRating}
                    />
                  </div>
                </div>
              </div>
              <div className="flex justify-start max-w-[80em]">
                <SellerFeedbackSection
                  seller={seller}
                  feedbackList={feedbackList}
                  totalFeedback={totalFeedback}
                />
              </div>
            </div>
            <div className="hidden lg:block w-1/4 min-w-[20em] max-w-[40em] bg-white px-4 py-4 rounded-xl drop-shadow-md top-1 sticky">
              <ComicsSeller
                seller={seller}
                comics={currentComics}
                handleOpenChat={handleOpenChat}
                currentId={userInfo?.id}
                totalFeedback={totalFeedback}
                averageRating={averageRating}
              />
              {userInfo?.id !== seller?.id && (
                <ComicsBillingSection
                  currentComics={currentComics}
                  handleAddToCart={handleAddToCart}
                  handleBuyNow={handleBuyNow}
                  isInCart={isInCart}
                  setIsInCart={setIsInCart}
                />
              )}
            </div>
          </div>

          <div className="w-full">
            <RecommendedComicsList
              comicsList={relatedComicsList}
              fetchMoreData={fetchCurrentComics}
              hasMore={hasMore}
            />
          </div>
        </div>

        <ChatModal isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />
      </div>
    </>
  );
}
