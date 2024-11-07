import React, { useEffect, useState } from "react";
import ComicForm from "./ComicForm"; // Import your new ComicForm component
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Button, Typography } from "@mui/material";

interface Genre {
  id: string;
  name: string;
}

const SellerCreateComic: React.FC = () => {
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    genre: [] as Genre[], // Specify the type of genre here
    price: "",
    quantity: "",
    description: "",
    publishedDate: null,
    edition: "", // New field
    condition: "", // New field
    page: "", // New field
  });

  const [genres, setGenres] = useState<Genre[]>([]); // Specify the type of genres here
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [contentImages, setContentImages] = useState<string[]>([]);
  const [isSeries, setIsSeries] = useState(false);

  const navigate = useNavigate();

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

  const toggleFormType = () => {
    setIsSeries((prev) => !prev);
    setFormData({
      title: "",
      author: "",
      genre: [],
      price: "",
      quantity: "",
      description: "",
      publishedDate: null,
      edition: "", // New field
      condition: "", // New field
      page: "", // New field
    }); // Reset form data if necessary
  };

  const handleGenreChange = (event: any, newValue: Genre[]) => {
    setFormData({ ...formData, genre: newValue });
  };

  const handleUpload = async (coverImage: string, contentImages: string[]) => {
    try {
      if (!coverImage) throw new Error("Cover image is missing.");
      if (!contentImages.length) throw new Error("Content images are missing.");

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
      const coverImageUrls = coverResponse.data.imageUrls;

      const contentFormData = new FormData();
      const contentBlobs = await Promise.all(
        contentImages.map(async (blobUrl) => {
          const response = await fetch(blobUrl);
          const blob = await response.blob();
          return new File([blob], "image.jpg", { type: blob.type });
        })
      );
      contentBlobs.forEach((file) => contentFormData.append("images", file));

      const contentResponse = await publicAxios.post(
        "/file/upload/multiple-images",
        contentFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      alert("Content images uploaded successfully!");
      return {
        coverImageUrls,
        previewChapterUrls: contentResponse.data.imageUrls,
      };
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!coverImage) {
      alert("Both cover and back images must be provided.");
      return; // Exit early
    }

    const response = await handleUpload(coverImage, contentImages);
    console.log("RESPONSE", response);
    // Prepare data to send
    const comicData = {
      genreIds: formData.genre.map((g) => g.id),
      title: formData.title,
      author: formData.author,
      description: formData.description,
      coverImage: response?.coverImageUrls,
      previewChapter: response?.previewChapterUrls,
      price: parseFloat(formData.price) || 0,
      quantity: isSeries ? parseInt(formData.quantity) || 1 : 1,
      edition: formData.edition,
      condition: formData.condition,
      page: parseInt(formData.page) || 0,
      publishedDate: formData.publishedDate,
    };

    console.log("Comic Data to Send:", comicData);

    // Send data to API
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

  return (
    <div className="form-container">
      <div className="create-comic-form">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
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
              marginLeft:"120px"
            }}
            variant="h4"
            className="form-title"
          >
            {isSeries ? "THÊM BỘ TRUYỆN" : "THÊM TRUYỆN"}
          </Typography>
          <Button variant="outlined" onClick={toggleFormType}>
            {isSeries ? "Thêm Truyện" : "Thêm Bộ Truyện"}
          </Button>
        </div>

        <ComicForm
        isSeries={isSeries}
          formData={formData}
          setFormData={setFormData}
          genres={genres}
          coverImage={coverImage}
          setCoverImage={setCoverImage}
          contentImages={contentImages}
          setContentImages={setContentImages}
          handleGenreChange={handleGenreChange}
          handleSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default SellerCreateComic;
