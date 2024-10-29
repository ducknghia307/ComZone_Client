import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Autocomplete,
  Chip,
  IconButton,
} from "@mui/material";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import Grid from "@mui/material/Grid2";
import "../ui/SellerCreateComic.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

const EditComicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("comic");

  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  console.log("frontImage:::::::::", frontImage);

  const [backImage, setBackImage] = useState<string | null>(null);

  const frontImageInputRef = useRef<HTMLInputElement | null>(null);
  const backImageInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: [],
    price: "",
    language: "",
    series: "",
    quantity: "1",
    description: "",
    isAuction: false,
    isExchange: false,
    comicCommission: "0",
  });
  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]); // Only take the first file
      setImageState(imageUrl);
    }
  };
  const handleUpload = async (
    coverImages: { frontImage: string; backImage: string }, // Blob URLs for cover images
    contentImages: string[] // Blob URLs for content images
  ) => {
    try {
      // Step 1: Upload cover images
      const coverFormData = new FormData();

      // Convert cover image Blob URLs to actual File objects
      const frontBlobResponse = await fetch(coverImages.frontImage);
      const frontBlob = await frontBlobResponse.blob();
      const frontFile = new File([frontBlob], "frontImage.jpg", {
        type: frontBlob.type,
      });
      coverFormData.append("images", frontFile); // Append front cover image under 'images'

      const backBlobResponse = await fetch(coverImages.backImage);
      const backBlob = await backBlobResponse.blob();
      const backFile = new File([backBlob], "backImage.jpg", {
        type: backBlob.type,
      });
      coverFormData.append("images", backFile); // Append back cover image under 'images'

      console.log("Cover FormData:", coverFormData);
      // Upload cover images
      const coverResponse = await publicAxios.post(
        "/file/upload/multiple-images",
        coverFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Cover Images Response:", coverResponse);
      alert("Cover images uploaded successfully!");

      // Step 2: Upload content images
      const contentFormData = new FormData();

      // Convert content Blob URLs to actual File objects
      const contentBlobs = await Promise.all(
        contentImages.map(async (blobUrl) => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          const file = new File([blob], "image.jpg", { type: blob.type });
          return file;
        })
      );

      // Append each content image file to contentFormData
      contentBlobs.forEach((file) => {
        contentFormData.append("images", file); // 'images' matches the backend field name
      });

      console.log("Content FormData:", contentFormData);

      // Upload content images
      const contentResponse = await publicAxios.post(
        "/file/upload/multiple-images",
        contentFormData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setCoverImages(coverResponse.data.imageUrls);
      setContentImages(contentResponse.data.imageUrls);
      console.log("Content Images Response:", contentResponse);
      alert("Content images uploaded successfully!");
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  useEffect(() => {
    privateAxios
      .get(`/comics/${id}`)
      .then((response) => {
        const comic = response.data;
        setFormData(comic);
        setBackImage(comic.coverImage[1])
        setFrontImage(comic.coverImage[0])
        setCoverImages(comic.coverImage || []);
        setContentImages(comic.previewChapter || []);
      })
      .catch((error) => console.error("Error fetching comic:", error));
  }, [id]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages: number
  ) => {
    const files = event.target.files;
    const fileArray = files
      ? Array.from(files).map((file) => URL.createObjectURL(file))
      : [];
    if (fileArray.length > maxImages) {
      alert(`Bạn chỉ có thể tải lên tối đa ${maxImages} ảnh!`);
      return;
    }
    setImageState(fileArray);
  };

  const handleRemoveImage = (
    index: number,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setImageState((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    privateAxios
      .put(`/comics/${id}`, {
        ...formData,
        coverImage: coverImages,
        previewChapter: contentImages,
      })
      .then(() => {
        alert("Cập nhật truyện thành công!");
        navigate("/sellermanagement");
      })
      .catch((error) => console.error("Error updating comic:", error));
  };

  const renderImageUploadSection = (
    title: string,
    images: string[],
    setImageState: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages: number
  ) => (
    <>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
          {title}
        </Typography>
        <input
          accept="image/*"
          type="file"
          multiple
          onChange={(e) => handleFileChange(e, setImageState, maxImages)}
          style={{ display: "none" }}
          id={`${title.replace(/\s/g, "-")}-upload`}
        />
        <label htmlFor={`${title.replace(/\s/g, "-")}-upload`}>
          <Button
            component="span"
            sx={{
              textTransform: "none",
              fontWeight: "bold",
              marginLeft: "10px",
              color: "#000",
              backgroundColor: "#fff",
              border: "1px solid black",
              borderRadius: "10px",
              padding: "5px 15px",
            }}
            startIcon={<CloudUploadOutlinedIcon />}
          >
            Tải lên
          </Button>
        </label>
      </div>
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginTop: "15px",
          flexWrap: "wrap",
        }}
      >
        {images.map((image, index) => (
          <div key={index} style={{ position: "relative" }}>
            <img
              src={image}
              alt={`uploaded-${index}`}
              style={{
                width: "120px",
                height: "180px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
            <IconButton
              onClick={() => handleRemoveImage(index, setImageState)}
              sx={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "2px",
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
      </div>
    </>
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const renderEditComicForm = () => (
    <div className="form-container">
      <div className="create-comic-form">
        <div style={{ display: "flex", alignItems: "center" }}>
          <ArrowBackIcon
            sx={{ fontSize: "40px", cursor: "pointer" }}
            onClick={() => navigate("/sellermanagement")}
          />
          <Typography
            sx={{
              paddingBottom: "50px",
              color: "#000",
              fontWeight: "bold",
              margin: "0 auto",
            }}
            variant="h4"
            className="form-title"
          >
            CHỈNH SỬA TRUYỆN
          </Typography>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="image-upload-section">
            <div
              className="image-upload"
              onClick={() => frontImageInputRef.current?.click()}
            >
              <div className="image-upload-circle mb-8">
                {frontImage ? (
                  <img
                    style={{ height: "160px", width: "130px" }}
                    src={frontImage}
                    alt="Front"
                    className="uploaded-image"
                  />
                ) : (
                  <CameraAltOutlinedIcon />
                )}
              </div>
              <Typography className="image-upload-text">
                Ảnh Mặt Trước
              </Typography>
            </div>
            <input
              type="file"
              id="frontImageUpload"
              style={{ display: "none" }}
              accept="image/*"
              ref={frontImageInputRef}
              onChange={(e) => handleImageChange(e, setFrontImage)}
            />
            <div
              className="image-upload"
              onClick={() => backImageInputRef.current?.click()}
            >
              <div className="image-upload-circle mb-8">
                {backImage ? (
                  <img
                    style={{ height: "160px", width: "130px" }}
                    src={backImage}
                    alt="Back"
                    className="uploaded-image"
                  />
                ) : (
                  <CameraAltOutlinedIcon />
                )}
              </div>
              <Typography className="image-upload-text">
                Ảnh Mặt Khác
              </Typography>
            </div>
            <input
              type="file"
              id="backImageUpload"
              style={{ display: "none" }}
              accept="image/*"
              ref={backImageInputRef}
              onChange={(e) => handleImageChange(e, setBackImage)}
            />
          </div>
          {renderImageUploadSection(
            "Ảnh Nội Dung",
            contentImages,
            setContentImages,
            5
          )}
          <Grid
            container
            columnSpacing={7}
            rowSpacing={3}
            sx={{ paddingTop: "20px" }}
          >
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Tên Truyện
              </Typography>
              <TextField
                fullWidth
                label="Tên Truyện"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
              />
            </Grid>
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Tác Giả
              </Typography>
              <TextField
                fullWidth
                label="Tác Giả"
                name="author"
                value={formData.author}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
              />
            </Grid>
            {/* <Grid size={6}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Thể Loại</Typography>
                            <Autocomplete
                                multiple
                                options={genres}
                                getOptionLabel={(option) => option.name}
                                value={formData.genre}
                                onChange={handleGenreChange}
                                renderInput={(params) => (
                                    <TextField {...params} variant="outlined" label="Chọn Thể Loại" />
                                )}
                                renderTags={(tagValue, getTagProps) =>
                                    tagValue.map((option, index) => (
                                        <Chip
                                            // key={option.id}
                                            label={option.name}
                                            {...getTagProps({ index })}
                                            onDelete={() => {
                                                const newGenres = formData.genre.filter((_, i) => i !== index);
                                                setFormData({ ...formData, genre: newGenres });
                                            }}
                                        />
                                    ))
                                }
                            />
                        </Grid> */}
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Giá
              </Typography>
              <TextField
                fullWidth
                label="Giá"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
              />
            </Grid>
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Ngôn Ngữ
              </Typography>
              <TextField
                fullWidth
                label="Ngôn Ngữ"
                name="language"
                value={formData.language}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
              />
            </Grid>
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Tập/Bộ
              </Typography>
              <TextField
                fullWidth
                label="Tập/Bộ"
                name="series"
                value={formData.series}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
              />
            </Grid>
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Số Lượng
              </Typography>
              <TextField
                fullWidth
                label="Số Lượng"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
                type="number"
              />
            </Grid>
            {/* <Grid size={2}>
                            <Typography sx={{ paddingBottom: '10px', fontWeight: 'bold' }}>Đấu Giá</Typography>
                            <TextField
                                select
                                value={formData.isAuction}
                                onChange={(e) => handleDropdownChange('isAuction', e.target.value)}
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                            >
                                <option value="0">Không</option>
                                <option value="1">Có</option>
                            </TextField>
                        </Grid>
                        <Grid size={2}>
                            <Typography sx={{ paddingBottom: '10px', fontWeight: 'bold' }}>Trao Đổi</Typography>
                            <TextField
                                select
                                value={formData.isExchange}
                                onChange={(e) => handleDropdownChange('isExchange', e.target.value)}
                                SelectProps={{
                                    native: true,
                                }}
                                variant="outlined"
                            >
                                <option value="0">Không</option>
                                <option value="1">Có</option>
                            </TextField>
                        </Grid>
                        <Grid size={2}>
                            <Typography sx={{ paddingBottom: '10px', color: '#000', fontWeight: 'bold' }}>Phí Hoa Hồng</Typography>
                            <TextField
                                fullWidth
                                label="Phí Hoa Hồng"
                                name="comicCommission"
                                value={formData.comicCommission}
                                onChange={handleInputChange}
                                variant="outlined"
                                className="text-field"
                            />
                        </Grid> */}
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Mô Tả Truyện
              </Typography>
              <TextField
                fullWidth
                label="Mô Tả Truyện"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                variant="outlined"
                className="text-field"
              />
            </Grid>
          </Grid>
          <Button type="submit" variant="contained" sx={{ marginTop: "20px" }}>
            Cập Nhật
          </Button>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "comic":
        return renderEditComicForm();
      case "auction":
        return <Typography variant="h4">Quản Lý Đấu Giá</Typography>;
      case "delivery":
        return <Typography variant="h4">Thông Tin Giao Hàng</Typography>;
      default:
        return (
          <Typography variant="h4">
            Chọn một mục để hiển thị nội dung
          </Typography>
        );
    }
  };

  const handleMenuItemClick = (item: string) => {
    setSelectedMenuItem(item);
  };

  return (
    <div className="seller-container">
      <Grid container spacing={3}>
        {/* <Grid size={2} className="seller-menu">
                    <div className="menu-seller-section">
                        <ul>
                            <li
                                className={selectedMenuItem === 'comic' ? 'active' : ''}
                                onClick={() => handleMenuItemClick('comic')}
                            >
                                <ImportContactsRoundedIcon /> Quản Lý Truyện
                            </li>
                            <li
                                className={selectedMenuItem === 'auction' ? 'active' : ''}
                                onClick={() => handleMenuItemClick('auction')}
                            >
                                <TvOutlinedIcon /> Quản Lý Đấu Giá
                            </li>
                            <li
                                className={selectedMenuItem === 'delivery' ? 'active' : ''}
                                onClick={() => handleMenuItemClick('delivery')}
                            >
                                <DeliveryDiningOutlinedIcon /> Thông Tin Giao Hàng
                            </li>
                        </ul>
                    </div>
                </Grid> */}
        {/* <Grid size={10} sx={{ padding: '0 80px' }}> */}
        <Grid size={10} sx={{ padding: "0 80px", margin: "auto" }}>
          <div className="content-section">{renderContent()}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditComicDetail;
