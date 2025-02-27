/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../ui/SellerCreateComic.css";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import GavelIcon from "@mui/icons-material/Gavel";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Modal, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import AuctionModal from "../comic/sellerManagement/AuctionModal";
import { Comic } from "../../common/base.interface";
import { SellerSubscription } from "../../common/interfaces/seller-subscription.interface";
import SellerSubsModal from "./SellerSubsModal";
import { RenderCell } from "./RenderCell";
import moment from "moment/min/moment-with-locales";
import CreateNewComics from "./create-new-comics/CreateNewComics";
import EditComics from "./edit-comics/EditComics";
import { AuctionCriteria } from "../../common/interfaces/auction.interface";

moment.locale("vi");

const { confirm } = Modal;

const SellerComicsManagement = ({
  sellerSubscription,
  fetchSellerSubscription,
  loading,
  setLoading,
}: {
  sellerSubscription?: SellerSubscription | null;
  fetchSellerSubscription?: () => void;
  loading: boolean;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [comics, setComics] = useState<Comic[]>([]);
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);

  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState<string>("");

  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isCreatingComics, setIsCreatingComics] = useState<boolean>(false);
  const [isEditingComics, setIsEditingComics] = useState<Comic>();

  const [isRegisteringPlan, setIsRegisteringPlan] = useState<boolean>(false);

  const [auctionCriteria, setAuctionCriteria] = useState<AuctionCriteria>();

  const fetchSellerComics = async () => {
    setLoading(true);
    await privateAxios
      .get("/comics/seller")
      .then((res) => {
        setComics(res.data);
        setFilteredComics(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setLoading(false));
  };

  const fetchAuctionCriteria = async () => {
    await publicAxios
      .get("auction-criteria")
      .then((res) => {
        setAuctionCriteria(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    fetchSellerComics();
    fetchAuctionCriteria();
  }, []);

  const handleAuction = (comic: Comic) => {
    if (!sellerSubscription.canAuction) {
      notification.warning({
        key: "auction",
        message: (
          <p className="REM text-start">
            Gói đăng ký bán ComZone của bạn đã hết lượt đấu giá! Vui lòng đăng
            ký thêm!
          </p>
        ),
        duration: 5,
      });
    } else if (
      auctionCriteria &&
      auctionCriteria.isFullInfoFilled &&
      Object.entries(comic).some(
        ([key, value]) =>
          ![
            "onSaleSince",
            "deletedAt",
            "page",
            "episodesList",
            "merchandises",
            "editionEvidence",
          ].includes(key) &&
          (value === null || value === undefined)
      )
    ) {
      console.log({ comic });
      notification.error({
        key: "auction",
        message: (
          <p className="REM text-start font-light">
            Truyện của bạn cần được cập nhật đầy đủ thông tin (bao gồm những
            thông tin không bắt buộc) để được gửi yêu cầu duyệt đấu giá!
          </p>
        ),
        description: (
          <button
            onClick={() => setIsEditingComics(comic)}
            className="REM px-4 py-1 font-light border border-gray-300 rounded-md duration-200 hover:bg-gray-100"
          >
            Cập nhật thông tin truyện
          </button>
        ),
        duration: 8,
      });
    } else if (
      auctionCriteria &&
      auctionCriteria.conditionLevel &&
      comic.condition.value < auctionCriteria.conditionLevel.value
    ) {
      notification.error({
        key: "auction",
        message: (
          <p className="REM text-start font-light">
            Tình trạng truyện{" "}
            <span className="font-semibold">"{comic.title}"</span> không đạt yêu
            cầu tối thiểu để được phê duyệt đấu giá!
          </p>
        ),
        description: (
          <div className="REM space-y-1">
            <p className="font-light text-xs">
              Yêu cầu tình trạng tối thiểu:{" "}
              <span className="font-medium">
                {auctionCriteria.conditionLevel.name} (
                {auctionCriteria.conditionLevel.value}/10)
              </span>
            </p>
            <p className="font-light text-xs">
              Tình trạng hiện tại:{" "}
              <span className="font-medium">
                {comic.condition.name} ({comic.condition.value}/10)
              </span>
            </p>
          </div>
        ),
        duration: 8,
      });
    } else if (comic.edition.auctionDisabled) {
      notification.error({
        key: "auction",
        message: (
          <p className="REM text-start font-light">
            Truyện <span className="font-semibold">"{comic.title}"</span> không
            thuộc phiên bản có thể được bán qua đấu giá!
          </p>
        ),
        description: (
          <p className="text-xs REM">
            Phiên bản hiện tại:{" "}
            <span className="font-semibold">{comic.edition.name}</span>
          </p>
        ),
        duration: 5,
      });
    } else {
      setSelectedComic(comic);
      setIsModalVisible(true);
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false);
    fetchSellerComics();
  };

  const handleStopSelling = (comic: Comic) => {
    confirm({
      title: <p>Xác nhận dừng bán truyện?</p>,
      icon: <CheckCircleOutlined style={{ color: "red" }} />,
      content: `Bạn có chắc chắn muốn dừng bán truyện "${comic.title}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk() {
        privateAxios
          .get(`/comics/${comic.id}/stop-sell`)
          .then(async (res) => {
            await privateAxios.patch("seller-subscriptions/sell/stop", {
              quantity: 1,
            });

            notification.info({
              key: "success",
              message: <p className="REM">Đã dừng bán truyện</p>,
              description: (
                <p className="REM">
                  Truyện "{comic.title}" đã được dừng bán khỏi các trang tìm
                  kiếm.
                </p>
              ),
              duration: 5,
            });
            fetchSellerComics();
          })
          .catch((error) => {
            console.error("Lỗi khi dừng bán truyện:", error);
            notification.error({
              message: "Lỗi",
              description: "Không thể dừng bán truyện. Vui lòng thử lại.",
              duration: 5,
            });
          });
      },
      onCancel() {
        console.log("Hủy dừng bán truyện.");
      },
    });
  };

  const handleSell = (comic: Comic) => {
    if (!sellerSubscription.canSell)
      notification.warning({
        message:
          "Gói đăng ký bán ComZone của bạn đã hết lượt bán. Vui lòng đăng ký thêm!",
        duration: 5,
      });
    else
      confirm({
        title: <p className="REM">Xác nhận bắt đầu bán truyện?</p>,
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
        content: (
          <p className="REM">
            Bạn có chắc chắn muốn bán truyện "{comic.title}" không?
          </p>
        ),
        okText: "Xác nhận",
        cancelText: "Hủy",
        onOk() {
          privateAxios
            .patch(`comics/${comic.id}/startSelling`, { status: "AVAILABLE" })
            .then(async () => {
              await privateAxios.patch("seller-subscriptions/sell", {
                quantity: 1,
              });

              notification.success({
                key: "success",
                message: "Thành công",
                description: "Truyện đăng bán thành công!",
                duration: 5,
              });
              fetchSellerComics();
            })
            .catch((error) => {
              console.error("Lỗi khi đưa truyện vào bán:", error);
            });
        },
        onCancel() {
          console.log("Không bán truyện.");
        },
      });
  };

  const undoDelete = async (comics: Comic) => {
    await privateAxios.delete(`/comics/undo/${comics.id}`).then(() => {
      notification.success({
        key: "delete",
        message: `Đã khôi phục truyện "${comics.title}".`,
        duration: 5,
      });
      fetchSellerComics();
    });
  };

  const handleDeleteComics = (comic: Comic) => {
    confirm({
      title: <p>Xác nhận xóa truyện này?</p>,
      icon: <CheckCircleOutlined style={{ color: "red" }} />,
      content: `Bạn có chắc chắn muốn xóa truyện "${comic.title}" không?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk() {
        privateAxios
          .delete(`/comics/soft/${comic.id}`)
          .then(async () => {
            notification.info({
              key: "delete",
              message: `Đã xóa truyện "${comic.title}".`,
              description: (
                <button
                  onClick={() => undoDelete(comic)}
                  className="REM mt-2 px-4 py-1 border border-gray-300 rounded-md duration-200 hover:bg-gray-100"
                >
                  Hoàn tác
                </button>
              ),
              duration: 5,
            });

            fetchSellerComics();
          })
          .catch((error) => {
            console.error("Lỗi khi dừng bán truyện:", error);
            notification.error({
              message: "Lỗi",
              description: "Không thể dừng bán truyện. Vui lòng thử lại.",
              duration: 5,
            });
          });
      },
      onCancel() {
        console.log("Hủy dừng bán truyện.");
      },
    });
  };

  const getGenreNames = (genreArray: any) => {
    if (!Array.isArray(genreArray) || genreArray.length === 0) {
      return "No genres";
    }
    return genreArray.map((genre) => genre.name).join(", ");
  };

  const handleAddComicsClick = () => {
    if (!sellerSubscription) {
      notification.warning({
        key: "subs",
        message: (
          <p className="REM">
            Bạn không có lượt bán hay đấu giá. Vui lòng đăng ký gói bán để thêm
            truyện!
          </p>
        ),
        duration: 5,
      });
      setIsRegisteringPlan(true);
    } else if (!sellerSubscription.isActive) {
      notification.warning({
        key: "subs",
        message: (
          <p className="REM">
            Gói đăng ký bán ComZone của bạn đã hết hiệu lực. Vui lòng đăng ký
            thêm!
          </p>
        ),
        duration: 5,
      });
      setIsRegisteringPlan(true);
    } else setIsCreatingComics(true);
  };

  useEffect(() => {
    fetchSellerSubscription();
  }, [comics]);

  const searchSellerComics = async (key: string) => {
    await privateAxios
      .get(`comics/search/seller?search=${key}`)
      .then((res) => {
        setSearchParams({ search: searchInput });
        setFilteredComics(res.data);
      })
      .catch((err) => console.log(err));
  };

  const onSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);

    if (e.target.value.length === 0) {
      searchParams.delete("search");
      setSearchParams(searchParams);
      setFilteredComics(comics);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "Số TT",
      flex: 0.75,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => <p className="my-auto">{params.value}</p>,
    },
    {
      field: "coverImage",
      headerName: "Ảnh truyện",
      flex: 0.75,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <img
          src={params.value}
          alt="Truyện"
          style={{ width: 70, height: 100 }}
        />
      ),
    },
    {
      field: "title",
      headerName: "Tên truyện",
      flex: 1.5,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell(params) {
        return (
          <p className="text-start my-auto font-semibold">{params.value}</p>
        );
      },
    },
    {
      field: "author",
      headerName: "Tác giả",
      flex: 1,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell(params) {
        return <p className="my-auto">{params.value}</p>;
      },
    },
    {
      field: "price",
      headerName: "Giá",
      flex: 0.5,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
      renderCell: (params) => {
        const formattedPrice = Number(params.value).toLocaleString("vi-VN");
        return <span className="my-auto">{formattedPrice}₫</span>;
      },
    },
    {
      field: "genreIds",
      headerName: "Thể loại",
      flex: 1.25,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const genres = params.row.genres;
        return <span className="my-auto">{getGenreNames(genres)}</span>;
      },
    },
    {
      field: "quantity",
      headerName: "Lẻ / Bộ",
      flex: 0.75,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <p className="my-auto">{params.value > 1 ? "Bộ" : "Truyện lẻ"}</p>
      ),
    },
    {
      field: "status",
      headerName: "Trạng thái",
      flex: 0.75,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        const statusMap: Record<string, string> = {
          AVAILABLE:
            params.row.type === "SELL"
              ? "Đang bán"
              : params.row.type === "AUCTION"
              ? "Đang đấu giá"
              : params.row.type === "AUCTION_REQUEST"
              ? "Chờ duyệt"
              : "Không xác định",

          UNAVAILABLE: "Chưa bán",
          PRE_ORDER: "Đang được mua",
          SOLD: "Đã bán",
        };

        const status = statusMap[params.value] || "N/A";

        if (status === "Chưa bán") {
          return (
            <div className="my-auto flex flex-col gap-1 items-stretch">
              <button
                onClick={() => handleSell(params.row)}
                className="flex items-center justify-center gap-1 text-green-700 phone:whitespace-nowrap p-1 border border-green-700 rounded-md duration-200 hover:bg-green-700 hover:text-white"
              >
                <AddBusinessIcon />
                <p>Bán</p>
              </button>

              <button
                onClick={() => handleAuction(params.row)}
                className="flex items-center justify-center gap-1 text-red-600 phone:whitespace-nowrap p-1 border border-red-600 rounded-md duration-200 hover:bg-red-600 hover:text-white"
              >
                <GavelIcon />
                <p>Đấu giá</p>
              </button>
            </div>
          );
        }

        return (
          <span
            className={`my-auto phone:whitespace-nowrap ${
              params.value === "AVAILABLE" && "text-sky-600"
            } ${params.value === "PRE_ORDER" && "text-green-700"} ${
              params.value === "SOLD" && "text-red-600"
            }`}
          >
            {status}
          </span>
        );
      },
    },
    {
      field: "onSaleSince",
      headerName: "Đăng bán từ",
      flex: 1,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <p className="my-auto">
          {params.value
            ? moment(params.value).format("HH:MM - DD/MM/YYYY")
            : "Chưa bán"}
        </p>
      ),
    },
    {
      field: "actions",
      headerName: "",
      flex: 0.5,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) =>
        ["UNAVAILABLE", "AVAILABLE"].some(
          (status) => params.row.status === status
        ) && (
          <RenderCell
            params={params}
            handleStopSelling={handleStopSelling}
            handleDeleteComics={handleDeleteComics}
            setIsEditingComics={setIsEditingComics}
          />
        ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const renderComicsTable = () => {
    if (!loading && (!comics || (comics && comics.length === 0))) {
      return (
        <div
          className={`${
            loading && "hidden"
          } REM w-full min-h-[30vh] h-full flex flex-col items-center justify-center gap-8 bg-gray-900 rounded-lg p-4`}
        >
          <p className="text-[2em] uppercase text-center lg:whitespace-nowrap bg-clip-text text-transparent font-bold bg-gradient-to-r from-green-500 via-red-400 to-sky-400">
            Bắt đầu đăng bán truyện tranh ngay
          </p>
          <button
            onClick={handleAddComicsClick}
            className="flex items-center gap-2 bg-green-600 text-gray-100 p-2 rounded-md font-semibold text-lg duration-200 hover:bg-green-700"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M11 11V5H13V11H19V13H13V19H11V13H5V11H11Z"></path>
            </svg>
            TẠO TRUYỆN ĐẦU TIÊN
          </button>
        </div>
      );
    } else
      return (
        <div className="REM flex flex-col gap-4">
          <p className="text-2xl font-bold uppercase">Quản lý truyện tranh</p>

          <div className="flex items-center justify-between my-2">
            <Button
              variant="contained"
              sx={{
                borderRadius: "20px",
                backgroundColor: "green",
                color: "#fff",
                fontFamily: "inherit",
              }}
              startIcon={<AddIcon />}
              onClick={handleAddComicsClick}
            >
              Thêm truyện mới
            </Button>

            <div className="relative basis-1/3">
              <input
                type="text"
                placeholder="Tìm kiếm theo tên truyện hoặc tác giả..."
                value={searchInput}
                onChange={onSearchInputChange}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && searchInput.length > 0) {
                    searchSellerComics(searchInput);
                  }
                }}
                className="w-full py-2 font-light text-sm pl-8 rounded-lg border border-gray-300"
              />

              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                className="absolute top-1/4 left-2"
              >
                <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
              </svg>
            </div>
          </div>

          <div style={{ height: "auto", width: "100%" }}>
            <DataGrid
              rows={filteredComics.map((comics, index) => {
                return { ...comics, index: index + 1 };
              })}
              columns={columns}
              initialState={{ pagination: { paginationModel } }}
              pageSizeOptions={[20, 30]}
              getRowHeight={() => "auto"}
              autosizeOptions={{
                columns: [
                  "title",
                  "author",
                  "price",
                  "status",
                  "quantity",
                  "genreIds",
                  "onSaleSince",
                ],
                includeOutliers: true,
                includeHeaders: true,
              }}
              rowSelection={false}
              sx={{
                border: 1,
                "& .MuiDataGrid-columnHeader": {
                  backgroundColor: "#000000",
                  color: "#ffffff",
                  fontFamily: "REM",
                },
                "& .MuiDataGrid-cell": {
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "start",
                  fontFamily: "REM",
                },
                "& .MuiDataGrid-sortIcon": {
                  color: "#ffffff !important",
                },
                "& .MuiDataGrid-iconButtonContainer": {
                  color: "#ffffff !important",
                },
                "& .MuiDataGrid-menuIconButton": {
                  color: "#ffffff !important",
                },
              }}
            />
          </div>
          <AuctionModal
            open={isModalVisible}
            comic={selectedComic}
            onCancel={handleModalCancel}
            onSuccess={handleModalSuccess}
          />
        </div>
      );
  };

  if (loading) return;

  return (
    <div className="w-full bg-white p-4 rounded-lg drop-shadow-lg">
      {isCreatingComics && (
        <CreateNewComics
          setIsCreatingComics={setIsCreatingComics}
          fetchSellerComics={fetchSellerComics}
        />
      )}

      {isEditingComics && (
        <EditComics
          comics={isEditingComics}
          setIsEditingComics={setIsEditingComics}
          fetchSellerComics={fetchSellerComics}
        />
      )}

      {!isCreatingComics && !isEditingComics && renderComicsTable()}

      {(!sellerSubscription || !sellerSubscription.isActive) && (
        <SellerSubsModal
          isOpen={isRegisteringPlan}
          setIsOpen={setIsRegisteringPlan}
          callback={fetchSellerSubscription}
        />
      )}
    </div>
  );
};

export default SellerComicsManagement;
