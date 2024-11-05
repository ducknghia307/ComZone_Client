import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  CircularProgress,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAppSelector } from "../../redux/hooks";
import { useLocation } from "react-router-dom";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import "../ui/Sidebar.css";

const conditions = ["SEALED", "USED"];

const Sidebar = ({
  onGenreFilterChange,
  onAuthorFilterChange,
  onConditionFilterChange,
}) => {
  const [isGenreOpen, setIsGenreOpen] = useState(true);
  const [isConditionOpen, setIsConditionOpen] = useState(true);
  const [isAuthorOpen, setIsAuthorOpen] = useState(true);
  const [genres, setGenres] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [selectedConditions, setSelectedConditions] = useState([]);
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const shouldShowConditionSection = ["/genres", "/auctions"].includes(
    location.pathname
  );

  useEffect(() => {
    const fetchGenresAndAuthors = async () => {
      setLoading(true);
      try {
        const genreResponse = await publicAxios("/genres");
        setGenres(genreResponse.data);

        const comicsResponse = isLoggedIn
          ? await privateAxios.get("/comics/except-seller/available")
          : await publicAxios.get("/comics/status/available");

        const comicsData = comicsResponse.data;
        const authorsData = [
          ...new Set(comicsData.map((comic) => comic.author)),
        ];
        setAuthors(authorsData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGenresAndAuthors();
  }, [isLoggedIn]);

  const toggleGenre = () => setIsGenreOpen(!isGenreOpen);
  const toggleCondition = () => setIsConditionOpen(!isConditionOpen);
  const toggleAuthor = () => setIsAuthorOpen(!isAuthorOpen);

  const handleGenreChange = (event) => {
    const genre = event.target.name;
    const isChecked = event.target.checked;
    const updatedSelectedGenres = isChecked
      ? [...selectedGenres, genre]
      : selectedGenres.filter((g) => g !== genre);

    setSelectedGenres(updatedSelectedGenres);
    if (typeof onGenreFilterChange === "function") {
      onGenreFilterChange(updatedSelectedGenres);
    }
  };

  const handleAuthorChange = (event) => {
    const author = event.target.name;
    const isChecked = event.target.checked;
    const updatedSelectedAuthors = isChecked
      ? [...selectedAuthors, author]
      : selectedAuthors.filter((a) => a !== author);

    setSelectedAuthors(updatedSelectedAuthors);
    if (typeof onAuthorFilterChange === "function") {
      onAuthorFilterChange(updatedSelectedAuthors);
    }
  };

  const handleConditionChange = (event) => {
    const condition = event.target.name;
    const isChecked = event.target.checked;
    const updatedSelectedConditions = isChecked
      ? [...selectedConditions, condition]
      : selectedConditions.filter((c) => c !== condition);

    setSelectedConditions(updatedSelectedConditions);
    if (typeof onConditionFilterChange === "function") {
      onConditionFilterChange(updatedSelectedConditions);
    }
  };

  return (
    <div className="sidebar REM">
      <div className="sidebar-header">
        <h2>Khám phá truyện</h2>
        <div className="line-header"></div>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* Genre Section */}
          <div className="genre-section REM">
            <div
              className="header flex justify-between items-center cursor-pointer"
              onClick={toggleGenre}
            >
              <h3 className="text-lg font-bold">Thể loại truyện tranh</h3>
              {isGenreOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Collapse in={isGenreOpen}>
              <FormGroup className="mt-4">
                {genres.map((genre) => (
                  <FormControlLabel
                    key={genre.id}
                    control={
                      <Checkbox
                        name={genre.name}
                        onChange={handleGenreChange}
                      />
                    }
                    label={<p className="REM">{genre.name}</p>}
                  />
                ))}
              </FormGroup>
            </Collapse>
          </div>

          {/* Condition Section (conditional display) */}
          {shouldShowConditionSection && (
            <div className="condition-section mt-6">
              <div
                className="header flex justify-between items-center cursor-pointer"
                onClick={toggleCondition}
              >
                <h3 className="text-lg font-bold">Tình trạng truyện</h3>
                {isConditionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={isConditionOpen}>
                <FormGroup className="mt-4">
                  {conditions.map((condition) => (
                    <FormControlLabel
                      key={condition}
                      control={
                        <Checkbox
                          name={condition}
                          onChange={handleConditionChange}
                        />
                      }
                      label={
                        condition === "SEALED"
                          ? "Nguyên Seal"
                          : "Đã Qua Sử Dụng"
                      }
                    />
                  ))}
                </FormGroup>
              </Collapse>
            </div>
          )}

          {/* Author Section */}
          <div className="author-section mt-6">
            <div
              className="header flex justify-between items-center cursor-pointer"
              onClick={toggleAuthor}
            >
              <h3 className="text-lg font-bold">Tác Giả</h3>
              {isAuthorOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </div>
            <Collapse in={isAuthorOpen}>
              <FormGroup className="mt-4">
                {authors.map((author, index) => (
                  <FormControlLabel
                    key={index} // Using index as a key due to lack of unique ID
                    control={
                      <Checkbox name={author} onChange={handleAuthorChange} />
                    }
                    label={author}
                  />
                ))}
              </FormGroup>
            </Collapse>
          </div>
        </>
      )}
    </div>
  );
};

export default Sidebar;
