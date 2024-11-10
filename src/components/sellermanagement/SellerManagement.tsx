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
import OrderManagement from "../../order/OrderManagement";

const SellerManagement = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("comic");
  const [selectionModel, setSelectionModel] = useState([]);
  const [comics, setComics] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const handleViewMore = (comic) => {
    // Logic for viewing more details about the comic
    console.log("View more details for", comic);
  };

  const handleSell = (comic) => {
    // Logic for setting the comic for sale
    console.log("Set comic for sale", comic);
  };

  const handleAuction = (comic) => {
    // Logic for starting an auction for the comic
    console.log("Start auction for", comic);
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
  }, []);

  const handleMenuItemClick = (item) => {
    setSelectedMenuItem(item);
    if (item === "comic") {
      navigate("/sellermanagement/comic");
    }
  };

  const getGenreNames = (genreArray) => {
    if (!Array.isArray(genreArray) || genreArray.length === 0) {
      return "No genres";
    }
    // Lấy tất cả tên thể loại
    return genreArray.map((genre) => genre.name).join(", ");
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
      headerName: "Giá (đ)",
      flex: 0.5,
      headerClassName: "custom-header",
      headerAlign: "center",
      align: "center",
      sortComparator: (v1, v2) => Number(v1) - Number(v2),
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
          AVAILABLE: "Khả dụng",
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
                <Button
                  variant="contained"
                  color="success"
                  sx={{ marginRight: 1 }}
                  onClick={() => handleSell(params.row)}
                >
                  Chọn bán
                </Button>
                <Button
                  variant="contained"
                  color="info"
                  onClick={() => handleAuction(params.row)}
                >
                  Đấu giá
                </Button>
              </div>
            </div>
          );
        }

        return <span>{status}</span>;
      },
    },
    {
      field: "actions",
      headerName: "Xem/Xóa",
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
            component={Link}
            to="/sellermanagement/createcomic"
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
                  component={Link}
                  to="/sellermanagement/createcomic"
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

  const currentUrl = window.location.pathname;
  console.log("URL", currentUrl);

  return <div className="seller-container">{renderContent()}</div>;
};

export default SellerManagement;
