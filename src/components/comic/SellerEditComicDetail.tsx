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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
import dayjs from "dayjs";
import { Grid } from "@mui/system";

interface EditComicFormData {
  title: string;
  author: string;
  genres: Genre[];
  price: string;
  quantity: string;
  description: string;
  publishedDate: Dayjs | null;
  edition: string;
  condition: string;
  page: string;
}
interface Genre {
  id: string;
  name: string;
}

const EditComicDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const coverImageInputRef = useRef<HTMLInputElement | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]); // Specify the type of genres here
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [isSeries, setIsSeries] = useState(false);
  console.log(":", isSeries);
  const [removedImages, setRemovedImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<EditComicFormData>({
    title: "",
    author: "",
    genres: [] as Genre[],
    price: "",
    quantity: "",
    description: "",
    publishedDate: null,
    edition: "",
    condition: "",
    page: "",
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const availableGenres = genres.filter(
    (genre) => !formData.genres.some((selected) => selected.id === genre.id)
  );

  const [previousCoverImage, setPreviousCoverImage] = useState<
    string | null | undefined
  >(null);

  const [previousContentImages, setPreviousContentImages] = useState<string[]>(
    []
  );

  const editionOptions = [
    { label: "Bản thường", value: "REGULAR" },
    { label: "Bản đặc biệt", value: "SPECIAL" },
    { label: "Bản giới hạn", value: "LIMITED" },
  ];

  const conditionOptions = [
    { label: "Đã sử dụng", value: "USED" },
    { label: "Nguyên seal", value: "SEALED" },
  ];
  useEffect(() => {
    publicAxios
      .get("/genres")
      .then((response) => {
        const genreData = response.data;
        console.log("GENRE", genreData);
        // Ensure genres is an array
        const genresData: Genre[] = genreData || [];

        // Log genre names to console
        const genreNames = genresData.map((genre) => genre.name);
        console.log("Genre Names:", genreNames);

        // Update comic to include genre names
        const updatedComic = {
          ...genreData,
          genreNames: genreNames,
        };

        console.log("Updated Comic with Genres:", updatedComic);
        setGenres(genresData); // Set genres to the array of Genre
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  useEffect(() => {
    publicAxios
      .get("/genres")
      .then((response) => {
        const genreData = response.data;

        // Ensure genres is an array
        const genresData: Genre[] = genreData || [];

        // Log genre names to console
        const genreNames = genresData.map((genre) => genre.name);
        console.log("Genre Names:", genreNames);

        // Update comic to include genre names
        const updatedComic = {
          ...genreData,
          genreNames: genreNames,
        };

        console.log("Updated Comic with Genres:", updatedComic);
        setGenres(genresData); // Set genres to the array of Genre
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);
  const handleUpload = async (coverImage: string, contentImages: string[]) => {
    try {
      // Ensure previous images are correctly initialized
      if (!coverImage && !previousCoverImage) {
        throw new Error("No cover image provided.");
      }
      if (!contentImages.length && previousContentImages.length === 0) {
        throw new Error("No content images provided.");
      }

      let coverImageUrl: string | undefined; // Define coverImageUrl to store the response

      // Check if the cover image is new or different
      if (coverImage && coverImage !== previousCoverImage) {
        const coverFormData = new FormData();
        const coverBlobResponse = await fetch(coverImage);
        const coverBlob = await coverBlobResponse.blob();
        const coverFile = new File([coverBlob], "coverImage.jpg", {
          type: coverBlob.type,
        });
        coverFormData.append("images", coverFile);

        const coverResponse = await publicAxios.post(
          "/file/upload/multiple-images",
          coverFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        coverImageUrl = coverResponse.data.imageUrls[0]; // Assuming the response contains an array

        // Update the previous cover image URL
        setPreviousCoverImage(coverImageUrl);
      }

      // Check for new content images
      const newContentImages = contentImages.filter(
        (image) => !previousContentImages.includes(image)
      );

      let previewChapterUrls: string[] = [];
      if (newContentImages.length > 0) {
        const contentFormData = new FormData();
        const contentBlobs = await Promise.all(
          newContentImages.map(async (blobUrl) => {
            const response = await fetch(blobUrl);
            const blob = await response.blob();
            return new File([blob], "image.jpg", { type: blob.type }); // Consider using a unique name
          })
        );
        contentBlobs.forEach((file) => contentFormData.append("images", file));

        const contentResponse = await publicAxios.post(
          "/file/upload/multiple-images",
          contentFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        previewChapterUrls = contentResponse.data.imageUrls;

        // Update the previous content images URLs
        setPreviousContentImages([
          ...previousContentImages,
          ...newContentImages,
        ]);
      }

      alert("Images uploaded successfully!");
      return {
        coverImageUrl,
        previewChapterUrls,
      };
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]);
      setCoverImage(imageUrl);
    }
  };
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
        return combinedImages.slice(0, maxImages);
      });
    }
  };
  const handleRemoveImage = (index: number) => {
    const imageToRemove = contentImages[index];

    // Mark the image for removal
    setRemovedImages((prev) => [...prev, imageToRemove]);

    // Update the current images state
    setContentImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Ensure coverImage is a string
    const uploadCoverImage = coverImage ?? ""; // Default to empty string if null

    const response = await handleUpload(uploadCoverImage, contentImages);
    console.log("RESPONSE", response);
    try {
      await privateAxios.put(`/comics/${id}`, {
        ...formData,
        genreIds: formData.genres.map((g) => g.id),
        coverImage: response?.coverImageUrl,
        previewChapter: [
          ...previousContentImages.filter(
            (image) => !removedImages.includes(image)
          ),
          ...(Array.isArray(response?.previewChapterUrls)
            ? response.previewChapterUrls
            : []),
        ],
      });
      alert("Cập nhật truyện thành công!");
      setRemovedImages([]);
      // navigate("/sellermanagement");
    } catch (error) {
      console.error("Error updating comic:", error);
      setError("Failed to update comic. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenreChange = (event: any, newValue: Genre[]) => {
    setFormData({ ...formData, genres: newValue });
  };

  useEffect(() => {
    const fetchComicData = async () => {
      setLoading(true);
      try {
        const response = await privateAxios.get(`/comics/${id}`);
        const comic = response.data;
        console.log("123123", response.data);

        // Ensure publishedDate is converted to a Dayjs object if it exists
        setFormData({
          ...comic,
          publishedDate: comic.publishedDate
            ? dayjs(comic.publishedDate)
            : null,
        });
        setCoverImage(comic.coverImage || null);
        setPreviousCoverImage(comic.coverImage);
        setContentImages(comic.previewChapter || []);
        setPreviousContentImages(comic.previewChapter);
      } catch (error) {
        console.error("Error fetching comic:", error);
        setError("Failed to fetch comic details.");
      } finally {
        setLoading(false);
      }
    };

    fetchComicData();
  }, [id]);

  useEffect(() => {
    // Set `isSeries` based on the `formData.quantity` value
    if (formData?.quantity && parseInt(formData.quantity) > 1) {
      setIsSeries(true);
    } else {
      setIsSeries(false);
    }
  }, [formData]);

  const renderImageUploadSection = (
    title: string,
    images: string[],
    setImageState: React.Dispatch<React.SetStateAction<string[]>>,
    maxImages: number
  ) => (
    <>
      <div style={{ display: "flex", alignItems: "center", marginTop: "20px" }}>
        <Typography sx={{ fontSize: "18px", fontWeight: "bold" }}>
          {title} ({images.length}/{isSeries ? 8 : 4})
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
              onClick={() => handleRemoveImage(index)}
              sx={{
                position: "absolute",
                top: "5px",
                right: "5px",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                color: "white",
                padding: "2px",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="create-comic-form">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "5px",
            }}
          >
            <ArrowBackIcon
              sx={{ fontSize: "40px", cursor: "pointer" }}
              onClick={() => navigate("/sellermanagement/comic")}
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
              CHỈNH SỬA TRUYỆN
            </Typography>
          </div>
          <div className=" form-container">
            <div
              className="image-upload"
              onClick={() => coverImageInputRef.current?.click()}
            >
              <div
                className={`${coverImage ? "" : "image-upload-circle"} mb-4`}
              >
                {coverImage ? (
                  <div
                    style={{
                      position: "relative",
                      width: "150px",
                      height: "150px",
                    }}
                  >
                    <img
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                        borderRadius: "8px",
                        border: "1px solid #DCDCDC",
                      }}
                      src={coverImage}
                      alt="cover"
                      className="uploaded-image"
                    />
                  </div>
                ) : (
                  <CameraAltOutlinedIcon />
                )}
              </div>
              <Typography
                style={{ marginBottom: "10px" }}
                className="image-upload-text"
              >
                Ảnh Bìa
              </Typography>
            </div>
            <input
              type="file"
              id="coverImageUpload"
              style={{ display: "none" }}
              accept="image/*"
              ref={coverImageInputRef}
              onChange={handleImageChange}
            />
            <Typography sx={{ color: "grey", textAlign: "center" }}>
              (Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm. Việc sử
              dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của
              bạn)
            </Typography>
            {renderImageUploadSection(
              "Ảnh nội dung",
              contentImages,
              setContentImages,
              isSeries ? 8 : 4
            )}{" "}
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
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  variant="outlined"
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
                  onChange={(e) =>
                    setFormData({ ...formData, author: e.target.value })
                  }
                  variant="outlined"
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
                  options={availableGenres}
                  getOptionLabel={(option) => option.name}
                  value={formData.genres}
                  onChange={handleGenreChange}
                  filterSelectedOptions // Ngăn người dùng chọn lại các thể loại đã chọn
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
                          const newGenres = formData.genres.filter(
                            (_, i) => i !== index
                          );
                          setFormData({ ...formData, genres: newGenres });
                        }}
                      />
                    ))
                  }
                />
              </Grid>
              <Grid size={2}>
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
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  variant="outlined"
                />
              </Grid>

              <Grid size={2}>
                <Typography
                  sx={{
                    paddingBottom: "10px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Ngày xuất bản
                </Typography>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <Grid>
                    <DatePicker
                      label="Ngày xuất bản"
                      value={formData.publishedDate}
                      onChange={(newValue) =>
                        setFormData({ ...formData, publishedDate: newValue })
                      }
                      format="DD/MM/YYYY"
                    />
                  </Grid>
                </LocalizationProvider>
              </Grid>
              {!isSeries ? (
                <Grid size={2}>
                  <Typography
                    sx={{
                      paddingBottom: "10px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Số trang
                  </Typography>
                  <TextField
                    fullWidth
                    label="Số trang"
                    type="number"
                    name="page"
                    value={formData.page || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        page: e.target.value,
                        quantity: "", // Reset quantity if it's not a series
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
              ) : (
                <Grid size={2}>
                  <Typography
                    sx={{
                      paddingBottom: "10px",
                      color: "#000",
                      fontWeight: "bold",
                    }}
                  >
                    Số cuốn trong bộ
                  </Typography>
                  <TextField
                    fullWidth
                    label="Số Lượng"
                    type="number"
                    name="quantity"
                    value={formData.quantity || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        quantity: e.target.value,
                        page: "", // Reset page if it’s a series
                      })
                    }
                    variant="outlined"
                  />
                </Grid>
              )}
              <Grid size={6}>
                <Typography
                  sx={{
                    paddingBottom: "10px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Phiên bản
                </Typography>
                <Autocomplete
                  options={editionOptions}
                  getOptionLabel={(option) => option.label}
                  value={
                    editionOptions.find(
                      (opt) => opt.value === formData.edition
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      edition: newValue ? newValue.value : "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Phiên bản" />
                  )}
                />
              </Grid>

              {/* Condition Field using Autocomplete */}
              <Grid size={6}>
                <Typography
                  sx={{
                    paddingBottom: "10px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Tình trạng
                </Typography>
                <Autocomplete
                  options={conditionOptions}
                  getOptionLabel={(option) => option.label}
                  value={
                    conditionOptions.find(
                      (opt) => opt.value === formData.condition
                    ) || null
                  }
                  onChange={(event, newValue) => {
                    setFormData({
                      ...formData,
                      condition: newValue ? newValue.value : "",
                    });
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Tình trạng" />
                  )}
                />
              </Grid>

              {/* Page Count Field */}

              <Grid size={12}>
                <Typography
                  sx={{
                    paddingBottom: "10px",
                    color: "#000",
                    fontWeight: "bold",
                  }}
                >
                  Mô Tả
                </Typography>
                <TextField
                  fullWidth
                  label="Mô Tả"
                  multiline
                  rows={4}
                  name="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </div>
        </div>
        <div className="form-submit-section">
          <Button type="submit" variant="contained" className="submit-button">
            Cập nhật
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditComicDetail;
