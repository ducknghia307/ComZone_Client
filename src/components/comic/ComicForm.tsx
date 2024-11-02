// src/components/ComicForm.tsx

import React, { useEffect } from "react";
import {
  TextField,
  Button,
  Typography,
  Autocomplete,
  IconButton,
  Chip,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import CloseIcon from "@mui/icons-material/Close";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import { Grid } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"; // Use this for version 5
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";
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
  publishedDate: Dayjs | null;
  edition?: string;
  condition?: string;
  page?: string;
}

interface ComicFormProps {
  isSeries:boolean | null
  formData: ComicFormData;
  setFormData: React.Dispatch<React.SetStateAction<ComicFormData>>;
  genres: Genre[];
  coverImage: string | null;
  setCoverImage: React.Dispatch<React.SetStateAction<string | null>>;
  contentImages: string[];
  setContentImages: React.Dispatch<React.SetStateAction<string[]>>;
  handleGenreChange: (event: any, newValue: Genre[]) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
}
const ComicForm: React.FC<ComicFormProps> = ({
  isSeries,
  formData,
  setFormData,
  genres,
  coverImage,
  setCoverImage,
  contentImages,
  setContentImages,
  handleGenreChange,
  handleSubmit,
}) => {
  const coverImageInputRef = React.useRef<HTMLInputElement | null>(null);
  useEffect(() => {
    console.log("Genres available in ComicForm:", genres);
  }, [genres]);
  const editionOptions = [
    { label: "Bản thường", value: "REGULAR" },
    { label: "Bản đặc biệt", value: "SPECIAL" },
    { label: "Bản giới hạn", value: "LIMITED" },
  ];

  const conditionOptions = [
    { label: "Đã sử dụng", value: "USED" },
    { label: "Nguyên seal", value: "SEALED" },
  ];

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const imageUrl = URL.createObjectURL(files[0]); // Only take the first file
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

  const handleRemoveImage = (
    index: number,
    setImageState: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    setImageState((prevImages) => prevImages.filter((_, i) => i !== index));
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

    return (
      <div className="form-container">
        <div className="create-comic-form">
          <form onSubmit={handleSubmit}>
            <div className="">
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
          </div>
          <Typography
            sx={{
              color: "grey",
              textAlign: "center",
            }}
          >
            (Ảnh bìa sẽ được hiển thị tại các trang Kết quả tìm kiếm. Việc sử
            dụng ảnh bìa đẹp sẽ thu hút thêm lượt truy cập vào sản phẩm của bạn)
          </Typography>

          {renderImageUploadSection(
            "Ảnh Nội Dung",
            contentImages,
            setContentImages,
            isSeries ? 8 : 4
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
                options={genres}
                getOptionLabel={(option) => option.name}
                value={formData.genre}
                filterSelectedOptions
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

          <div className="form-submit-section">
            <Button type="submit" variant="contained" className="submit-button">
              Tạo Truyện
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ComicForm;
