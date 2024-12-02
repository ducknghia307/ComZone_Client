/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../ui/SellerCreateComic.css";
import IconButton from "@mui/material/IconButton";
import { privateAxios } from "../../middleware/axiosInstance";
import AuctionManagement from "../auctions/AuctionManagement";
import DeliveryManagement from "../delivery/DeliveryManagement";
import GavelIcon from "@mui/icons-material/Gavel";
import OrderManagement from "./OrderManagement";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Modal, notification } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";
import AuctionModal from "../comic/sellerManagement/AuctionModal";
import { Comic } from "../../common/base.interface";
import { SellerSubscription } from "../../common/interfaces/seller-subscription.interface";
import SellerSubsModal from "./SellerSubsModal";
import { RenderCell } from "./RenderCell";
import moment from "moment/min/moment-with-locales";

moment.locale("vi");

const { confirm } = Modal;

const SellerComicsManagement = ({
  sellerSubscription,
  fetchSellerSubscription,
}: {
  sellerSubscription?: SellerSubscription | null;
  fetchSellerSubscription?: () => void;
}) => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("comic");
  const [comics, setComics] = useState<Comic[]>([]);
  const [filteredComics, setFilteredComics] = useState<Comic[]>([]);
  const [genres, setGenres] = useState([]);

  const [searchParams, setSearchParams] = useSearchParams();

  const [loading, setLoading] = useState(true);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [isRegisteringPlan, setIsRegisteringPlan] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleAuction = (comic: any) => {
    if (!sellerSubscription.canAuction) {
      notification.warning({
        message:
          "Gói đăng ký bán ComZone của bạn đã hết lượt đấu giá! Vui lòng đăng ký thêm!",
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
    notification.success({
      key: "success",
      message: "Thành công",
      description: "Tạo đấu giá thành công!",
      duration: 5,
    });
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

            notification.success({
              key: "success",
              message: "Thành công",
              description: "Truyện đã được dừng bán thành công!",
              duration: 5,
            });
            console.log("stopselling", res);

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
            .patch(`comics/${comic.id}/status`, { status: "AVAILABLE" })
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
                  className="REM mt-2 px-4 py-1 bg-sky-700 text-white rounded-md duration-200 hover:bg-sky-800"
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

  useEffect(() => {
    Promise.all([
      privateAxios.get("/comics/seller").then((response) => response.data),
      privateAxios.get("/genres").then((response) => response.data),
    ])
      .then(([comicsData, genresData]) => {
        setComics(comicsData);
        setFilteredComics(comicsData);
        setGenres(genresData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleAddComicsClick = () => {
    if (!sellerSubscription) {
      notification.warning({
        key: "subs",
        message: <p>Yêu cầu đăng ký gói bán ComZone.</p>,
        duration: 5,
      });
      setIsRegisteringPlan(true);
    } else if (!sellerSubscription.isActive) {
      notification.warning({
        key: "subs",
        message: <p>Gói đăng ký bán ComZone của bạn đã hết hiệu lực.</p>,
        duration: 5,
      });
      setIsRegisteringPlan(true);
    } else navigate("/sellermanagement/createcomic");
  };

  const fetchSellerComics = async () => {
    await privateAxios
      .get("/comics/seller")
      .then((res) => {
        setComics(res.data);
        setFilteredComics(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    fetchSellerSubscription();
  }, [comics]);

  const searchSellerComics = async (key: string) => {
    await privateAxios
      .get(`comics/search/seller?search=${key}`)
      .then((res) => {
        console.log(res.data.length);
        setFilteredComics(res.data);
      })
      .catch((err) => console.log(err));
  };

  const columns: GridColDef[] = [
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
          AVAILABLE: params.row.type === "SELL" ? "Đang bán" : "Đang đấu giá",
          UNAVAILABLE: "Không khả dụng",
          SOLD: "Đã bán",
        };

        const status = statusMap[params.value] || "N/A";

        if (status === "Không khả dụng") {
          return (
            <div className="my-auto">
              <div>
                <IconButton
                  aria-label="edit"
                  color="success"
                  onClick={() => handleAuction(params.row)}
                >
                  <GavelIcon
                    sx={{ border: "1px solid #D5D5D5", borderRadius: "5px" }}
                  />
                </IconButton>
                <IconButton
                  aria-label="edit"
                  color="success"
                  onClick={() => handleSell(params.row)}
                >
                  <AddBusinessIcon
                    sx={{ border: "1px solid #D5D5D5", borderRadius: "5px" }}
                  />
                </IconButton>
              </div>
            </div>
          );
        }

        return <span className="my-auto">{status}</span>;
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
      renderCell: (params) => (
        <RenderCell
          params={params}
          handleStopSelling={handleStopSelling}
          handleDeleteComics={handleDeleteComics}
        />
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const renderContent = () => {
    if (loading) {
      return <Typography>Đang tải...</Typography>;
    }

    if (comics && comics.length === 0) {
      return (
        <Typography>
          <Button
            variant="contained"
            sx={{
              borderRadius: "20px",
              backgroundColor: "#D9D9D9",
              color: "#000",
            }}
            startIcon={<AddIcon />}
            onClick={() => handleAddComicsClick()}
          >
            Thêm truyện đầu tiên
          </Button>
        </Typography>
      );
    }

    switch (selectedMenuItem) {
      case "comic":
        return (
          <div className="REM flex flex-col gap-4">
            <p className="text-2xl font-bold uppercase">Quản lí truyện tranh</p>

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
                onClick={() => handleAddComicsClick()}
              >
                Thêm truyện mới
              </Button>

              <div className="relative basis-1/3">
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchParams.get("search")}
                  onChange={(e) => {
                    if (e.target.value.length > 0) {
                      setSearchParams({ search: e.target.value });
                      searchSellerComics(e.target.value);
                    } else {
                      searchParams.delete("search");
                      setFilteredComics(comics);
                    }
                  }}
                  className="w-full font-light text-sm pl-8 rounded-lg border-gray-300 focus:!border-gray-500"
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
                rows={filteredComics}
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
              fetchSellerComics={fetchSellerComics}
            />
          </div>
        );
      case "order":
        return <OrderManagement />;
      case "auction":
        return <AuctionManagement />;
      case "delivery":
        return <DeliveryManagement />;
      default:
        return (
          <Typography variant="h4">
            Chọn một mục để hiển thị nội dung
          </Typography>
        );
    }
  };

  return (
    <div className="seller-container">
      {renderContent()}{" "}
      {(!sellerSubscription || !sellerSubscription.isActive) && (
        <SellerSubsModal
          isOpen={isRegisteringPlan}
          setIsOpen={setIsRegisteringPlan}
        />
      )}
    </div>
  );
};

export default SellerComicsManagement;
