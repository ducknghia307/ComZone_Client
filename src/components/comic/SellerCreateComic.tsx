import React, { useEffect, useRef, useState } from "react";
import Grid from "@mui/material/Grid2";
import {
  TextField,
  Button,
  Typography,
  Autocomplete,
  IconButton,
  Chip,
} from "@mui/material";
import "../ui/SellerCreateComic.css";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";

interface Genre {
  id: string;
  name: string;
}

interface ComicFormData {
  title: string;
  author: string;
  genre: Genre[];
  price: string;
  quantity: string;
  description: string;
}

const SellerCreateComic = () => {
  const navigate = useNavigate();
  const [selectedMenuItem, setSelectedMenuItem] = useState<string>("comic");
  const [formData, setFormData] = useState<ComicFormData>({
    title: "",
    author: "",
    genre: [],
    price: "",
    quantity: "1",
    description: "",
  });

  const [genres, setGenres] = useState<Genre[]>([]);
  const [coverImages, setCoverImages] = useState<string[]>([]);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  console.log("frontImage:::::::::", frontImage);

  const [backImage, setBackImage] = useState<string | null>(null);

  const frontImageInputRef = useRef<HTMLInputElement | null>(null);
  const backImageInputRef = useRef<HTMLInputElement | null>(null);

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

      setCoverImages(coverResponse.data.imageUrls);
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
      alert("Content images uploaded successfully!");
      return {
        coverImageUrls: coverResponse.data.imageUrls, // Assuming this contains the cover image URLs
        previewChapterUrls: contentResponse.data.imageUrls, // Assuming this contains the content image URLs
      };
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  useEffect(() => {
    publicAxios
      .get("/genres")
      .then((response) => {
        const genreData = response.data;

        // Đảm bảo genres là một mảng
        const genresData: Genre[] = genreData.genres || [];

        // Lấy tên các thể loại và in ra console
        const genreNames = genresData.map((genre) => genre.name);
        console.log("Genre Names:", genreNames);

        // Cập nhật comic để bao gồm tên thể loại
        const updatedComic = {
          ...genreData,
          genreNames: genreNames,
        };

        console.log("Updated Comic with Genres:", updatedComic);

        setGenres(genreData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages: number
  ) => {
    if (event.target.files) {
      const newImages = Array.from(event.target.files).map((file) =>
        URL.createObjectURL(file)
      );
      setImageState((prevImages) => {
        const combinedImages = [...prevImages, ...newImages];
        // Ensure we don't exceed the maximum number of images allowed
        return combinedImages.slice(0, maxImages);
      });
    }
  };

  const handleGenreChange = (event: any, newValue: Genre[]) => {
    setFormData({ ...formData, genre: newValue });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRemoveImage = (
    index: number,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setImageState((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!frontImage || !backImage) {
      alert("Both front and back images must be provided.");
      return; // Exit early
    }

    const response = await handleUpload(
      { frontImage, backImage },
      contentImages
    );
    console.log("RESPONSE", response);
    // Chuẩn bị dữ liệu gửi đi
    const comicData = {
      // sellerId: "your-seller-id",
      genreIds: formData.genre.map((g) => g.id),
      title: formData.title,
      author: formData.author,
      description: formData.description,
      coverImage: response?.coverImageUrls,
      previewChapter: response?.previewChapterUrls,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity) || 1,
    };

    console.log("Comic Data to Send:", comicData);
    // console.log("Comic Data to Send:", JSON.stringify(comicData, null, 2));

    // Gửi dữ liệu lên API
    privateAxios
      .post("/comics", comicData)
      .then((response) => {
        console.log("Comic Created:", response.data);
        alert("Truyện mới đã được thêm thành công!");
        navigate("/sellermanagement");
      })
      .catch((error) => {
        console.error("Error creating comic:", error);
        alert("Đã có lỗi xảy ra khi thêm truyện.");
      });
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
          {title} ({images.length}/4)
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
          <div
            key={index}
            style={{ position: "relative", width: "120px", height: "120px" }}
          >
            <img
              src={image}
              alt={`uploaded-${index}`}
              style={{
                width: "100%",
                height: "100%",
                objectFit: "contain",
                borderRadius: "8px",
                border: "1px solid #DCDCDC",
              }}
            />
            <IconButton
              onClick={() => handleRemoveImage(index, setImageState)}
              sx={{
                position: "absolute",
                top: "1px",
                right: "0px",
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

  const renderCreateComicForm = () => (
    <div className="form-container">
      <div className="create-comic-form">
        <form onSubmit={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <ArrowBackIcon
              sx={{ fontSize: "40px", cursor: "pointer" }}
              onClick={() => navigate("/sellermanagement")}
            />
            <Typography
              sx={{
                paddingBottom: "35px",
                color: "#000",
                fontWeight: "bold",
                margin: "0 auto",
              }}
              variant="h4"
              className="form-title"
            >
              THÊM TRUYỆN MỚI
            </Typography>
          </div>

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
              <Typography className="image-upload-text">Ảnh Bìa</Typography>
            </div>
            <input
              type="file"
              id="frontImageUpload"
              style={{ display: "none" }}
              accept="image/*"
              ref={frontImageInputRef}
              onChange={(e) => handleImageChange(e, setFrontImage)}
            />
          </div>
          <Typography
            sx={{
              paddingBottom: "20px",
              color: "grey",
              textAlign: "center",
            }}
          >
            (Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm. Việc sử
            dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của bạn)
          </Typography>
          {/* Phần tải lên ảnh nội dung - tối đa 4 ảnh */}
          {renderImageUploadSection(
            "Ảnh Nội Dung",
            contentImages,
            setContentImages,
            4
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
            <Grid size={6}>
              <Typography
                sx={{
                  paddingBottom: "10px",
                  color: "#000",
                  fontWeight: "bold",
                }}
              >
                Thể Loại
              </Typography>
              <Autocomplete
                multiple
                options={genres}
                getOptionLabel={(option) => option.name}
                value={formData.genre}
                onChange={handleGenreChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="outlined"
                    label="Chọn Thể Loại"
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      // key={option.id}
                      label={option.name}
                      {...getTagProps({ index })}
                      onDelete={() => {
                        const newGenres = formData.genre.filter(
                          (_, i) => i !== index
                        );
                        setFormData({ ...formData, genre: newGenres });
                      }}
                    />
                  ))
                }
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
          <div className="form-submit-section">
            <Button type="submit" variant="contained" className="submit-button">
              Xác Nhận
            </Button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "comic":
        return renderCreateComicForm();
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

  return (
    <div className="seller-container">
      <Grid container spacing={3}>
        <Grid size={10} sx={{ padding: "0 80px", margin: "auto" }}>
          <div className="content-section">{renderContent()}</div>
        </Grid>
      </Grid>
    </div>
  );
};

export default SellerCreateComic;
