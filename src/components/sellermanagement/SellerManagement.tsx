import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Typography,
  TextField,
  Box,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import "../ui/SellerCreateComic.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { privateAxios } from "../../middleware/axiosInstance";
import AuctionManagement from "../auctions/AuctionManagement";
import DeliveryManagement from "../delivery/DeliveryManagement";
import GavelIcon from "@mui/icons-material/Gavel";
import OrderManagement from "../../order/OrderManagement";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import { Modal, notification } from "antd"; // For confirmation modal
import { CheckOutlined, CheckCircleOutlined } from "@ant-design/icons";
import AuctionModal from "../comic/sellerManagement/AuctionModal";
import { Comic } from "../../common/base.interface";
import { SellerSubscription } from "../../common/interfaces/seller-subscription.interface";
import SellerSubsModal from "./SellerSubsModal";

const { confirm } = Modal;

const SellerManagement = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("comic");
  const [selectionModel, setSelectionModel] = useState([]);
  const [comics, setComics] = useState<Comic[]>([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedComic, setSelectedComic] = useState<Comic | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [sellerSubscription, setSellerSubscription] =
    useState<SellerSubscription | null>();
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
      setSelectedComic(comic); // Set the selected comic
      setIsModalVisible(true); // Show the modal
    }
  };

  const handleModalCancel = () => {
    setIsModalVisible(false); // Close the modal
  };

  const handleModalSuccess = () => {
    setIsModalVisible(false); // Close the modal
    setComics((prevComics) =>
      prevComics.map((prevComic) =>
        prevComic.id === selectedComic?.id
          ? { ...prevComic, status: "AUCTION" }
          : prevComic
      )
    );
    notification.success({
      key: "success",
      message: "Thành công",
      description: "Tạo đấu giá thành công!",
      duration: 5,
    });
  };

  const handleSell = (comic: Comic) => {
    // Show a confirmation modal before selling
    if (!sellerSubscription.canSell)
      notification.warning({
        message:
          "Gói đăng ký bán ComZone của bạn đã hết lượt bán. Vui lòng đăng ký thêm!",
        duration: 5,
      });
    else
      confirm({
        title: "Xác nhận bán sản phẩm?",
        icon: <CheckCircleOutlined style={{ color: "green" }} />,
        content: `Bạn có chắc chắn muốn bán truyện "${comic.title}" không?`,
        onOk() {
          // Update the comic status to "AVAILABLE"
          privateAxios
            .patch(`comics/${comic.id}/status`, { status: "AVAILABLE" })
            .then(async () => {
              await privateAxios.patch("seller-subscriptions/seller", {
                quantity: 1,
              });

              notification.success({
                key: "success",
                message: "Thành công",
                description: "Truyện đăng bán thành công!",
                duration: 5,
              });
              console.log(`Truyện "${comic.title}" đã được đưa vào bán`);
              // Update the comic list after selling
              setComics((prevComics) =>
                prevComics.map((prevComic) =>
                  prevComic.id === comic.id
                    ? { ...prevComic, status: "AVAILABLE" }
                    : prevComic
                )
              );
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

  const getGenreNames = (genreArray: any) => {
    if (!Array.isArray(genreArray) || genreArray.length === 0) {
      return "No genres";
    }
    // Lấy tất cả tên thể loại
    return genreArray.map((genre) => genre.name).join(", ");
  };

  const fetchSellerSubscription = async () => {
    await privateAxios
      .get("seller-subscriptions/user")
      .then((res) => {
        setSellerSubscription(res.data);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    // Gọi API để lấy danh sách comics và genres
    Promise.all([
      privateAxios.get("/comics/seller").then((response) => response.data),
      privateAxios.get("/genres").then((response) => response.data),
    ])
      .then(([comicsData, genresData]) => {
        console.log("Comics:", comicsData);
        console.log("Genres:", genresData);
        setComics(comicsData);
        setGenres(genresData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });

    fetchSellerSubscription();
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
    },
    {
      field: "author",
      headerName: "Tác giả",
      flex: 1,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
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
        return <span>{formattedPrice}₫</span>; // Display the formatted price with "đ"
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
        return <span>{getGenreNames(genres)}</span>;
      },
    },
    {
      field: "quantity",
      headerName: "Tập/Bộ",
      flex: 0.75,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (params.value > 1 ? "Bộ" : "Tập"),
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
          AVAILABLE: "Đang bán",
          UNAVAILABLE: "Không khả dụng",
          SOLD: "Đã bán",
          EXCHANGE: "Đổi",
          AUCTION: "Đấu giá",
        };

        const status = statusMap[params.value] || "N/A";

        // Check if the status is "Không khả dụng"
        if (status === "Không khả dụng") {
          return (
            <div>
              <div>
                {/* <Button
                  variant="outlined"
                  color="primary"
                  sx={{ marginRight: 1 }}
                  onClick={() => handleViewMore(params.row)}
                >
                  Xem thêm
                </Button> */}
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

        return <span>{status}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Sửa/Xóa",
      flex: 1,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      renderCell: (params) => (
        <>
          <IconButton
            aria-label="edit"
            color="primary"
            onClick={() => navigate(`/sellermanagement/edit/${params.row.id}`)}
          >
            <EditOutlinedIcon
              sx={{ border: "1px solid #D5D5D5", borderRadius: "5px" }}
            />
          </IconButton>
          <IconButton aria-label="delete" color="error">
            <DeleteOutlineOutlinedIcon
              sx={{ border: "1px solid #D5D5D5", borderRadius: "5px" }}
            />
          </IconButton>
        </>
      ),
    },
  ];

  const paginationModel = { page: 0, pageSize: 10 };

  const renderContent = () => {
    if (loading) {
      return <Typography>Loading comics...</Typography>;
    }

    if (comics.length === 0) {
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
          <div>
            <Typography variant="h5" className="content-header">
              Quản lí truyện tranh
            </Typography>
            <Box sx={{ marginBottom: "20px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
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
                  Thêm truyện mới
                </Button>
                <TextField
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchOutlinedIcon />
                        </InputAdornment>
                      ),
                    },
                  }}
                  size="small"
                  placeholder="Tìm kiếm truyện..."
                  variant="outlined"
                />
              </div>
            </Box>
            <div style={{ height: "auto", width: "100%" }}>
              <DataGrid
                rows={comics}
                columns={columns}
                initialState={{ pagination: { paginationModel } }}
                pageSizeOptions={[5, 10]}
                rowHeight={120}
                // disableExtendRowFullWidth={false}
                sx={{
                  border: 1,
                  "& .MuiDataGrid-columnHeader": {
                    backgroundColor: "#000000",
                    color: "#ffffff",
                  },
                  "& .MuiDataGrid-cell": {
                    justifyContent: "center",
                    display: "flex",
                    alignItems: "center",
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
              open={isModalVisible} // Replace 'visible' with 'open'
              comic={selectedComic} // Passing the selected comic as a prop
              onCancel={handleModalCancel} // Event handler for closing the modal
              onSuccess={handleModalSuccess} // Event handler for successful auction creation
            />
            ;
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
          redirect="/sellermanagement/comic"
        />
      )}
    </div>
  );
};

export default SellerManagement;
