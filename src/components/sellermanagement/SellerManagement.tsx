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
import Grid from "@mui/material/Grid2";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import "../ui/SellerCreateComic.css";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import IconButton from "@mui/material/IconButton";
import { privateAxios } from "../../middleware/axiosInstance";
import AuctionManagement from "../auctions/AuctionManagement";
import DeliveryManagement from "../delivery/DeliveryManagement";
import OrderManagement from "../../order/OrderManagement";
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';

const SellerManagement = () => {
  const [selectedMenuItem, setSelectedMenuItem] = useState("comic");
  const [selectionModel, setSelectionModel] = useState([]);
  const [comics, setComics] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Gọi API để lấy danh sách comics và genres
    Promise.all([
      privateAxios.get("/comics").then((response) => response.data),
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
      navigate("/sellermanagement");
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
        console.log("Genres params:", genres);
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

  return (
    <div className="seller-container">
      <Grid container spacing={3}>
        <Grid size={2} className="seller-menu">
          <div className="menu-seller-section">
            <ul>
              <li
                className={selectedMenuItem === "comic" ? "active" : ""}
                onClick={() => handleMenuItemClick("comic")}
              >
                <ImportContactsRoundedIcon /> Quản Lý Truyện
              </li>
              <li
                className={selectedMenuItem === "order" ? "active" : ""}
                onClick={() => handleMenuItemClick("order")}
                style={{whiteSpace: "nowrap"}}
              >
                <InventoryOutlinedIcon /> Quản Lý Đơn Hàng
              </li>
              <li
                className={selectedMenuItem === "auction" ? "active" : ""}
                onClick={() => handleMenuItemClick("auction")}
              >
                <TvOutlinedIcon /> Quản Lý Đấu Giá
              </li>
              <li
                className={selectedMenuItem === "delivery" ? "active" : ""}
                onClick={() => handleMenuItemClick("delivery")}
                style={{whiteSpace: "nowrap"}}
              >
                <DeliveryDiningOutlinedIcon /> Thông Tin Giao Hàng
              </li>
            </ul>
          </div>
        </Grid>

        <Grid size={10}>
          <div style={{ padding: "20px" }}>{renderContent()}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SellerManagement;
