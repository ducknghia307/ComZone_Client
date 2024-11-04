import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, Collapse } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import "../ui/Sidebar.css";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { useAppSelector } from "../../redux/hooks";
import { useLocation } from "react-router-dom";

const Sidebar = ({ onGenreFilterChange, onAuthorFilterChange,onConditionFilterChange }) => {
    const [isGenreOpen, setIsGenreOpen] = useState(true);
    const [isConditionOpen, setIsConditionOpen] = useState(true);
    const [isAuthorOpen, setIsAuthorOpen] = useState(true);
    const [comics, setComics] = useState([]);
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);
    const [selectedConditions, setSelectedConditions] = useState([]);
    const { isLoggedIn } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const fetchGenresAndAuthors = async () => {
      setLoading(true);
      try {
        // Fetch genres
        const genreResponse = await publicAxios("/genres");
        console.log(genreResponse.data);

        setGenres(genreResponse.data); // Set genres state

        // Fetch authors based on login status
        const comicsResponse = isLoggedIn
          ? await privateAxios.get("/comics/except-seller/available")
          : await publicAxios.get("/comics/status/available");

        const comicsData = comicsResponse.data; // Adjust this based on your API response structure
        console.log("Comics Data:", comicsData);

        // Extract unique authors from the comics data
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
  }, [isLoggedIn]); // Run effect when isLoggedIn changes

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

        if (isChecked) {
            updatedSelectedAuthors = [...selectedAuthors, author];
        } else {
            updatedSelectedAuthors = selectedAuthors.filter((a) => a !== author);
        }
        setSelectedAuthors(updatedSelectedAuthors);
        if (typeof onAuthorFilterChange === "function") {
            onAuthorFilterChange(updatedSelectedAuthors);
        }
    };

    const shouldShowConditionSection = ["/genres", "/auctions"].includes(location.pathname);

    const handleConditionChange = (event) => {
        const condition = event.target.name;
        const isChecked = event.target.checked;
        const updatedSelectedConditions = isChecked
            ? [...selectedConditions, condition]
            : selectedConditions.filter((c) => c !== condition);

        setSelectedConditions(updatedSelectedConditions);
        onConditionFilterChange(updatedSelectedConditions);
    };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Khám phá truyện</h2>
        <div className="line-header"></div>
      </div>

      {/* Thể loại truyện tranh */}
      <div className="genre-section">
        <div
          className="header flex justify-between items-center cursor-pointer"
          onClick={toggleGenre}
        >
          <h3 className="text-lg font-bold">Thể loại truyện tranh</h3>
          {isGenreOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
        <Collapse in={isGenreOpen}>
          <div className="genre-list mt-4">
            <FormGroup>
              {genres.map((genre) => (
                <FormControlLabel
                  key={genre.id}
                  control={
                    <Checkbox name={genre.name} onChange={handleGenreChange} />
                  }
                  label={genre.name}
                />
              ))}
            </FormGroup>
          </div>
        </Collapse>
      </div>

            {/* Tình trạng truyện */}
            {/* <div className="condition-section mt-6">
                <div className="header flex justify-between items-center cursor-pointer" onClick={toggleCondition}>
                    <h3 className="text-lg font-bold">Tình trạng truyện</h3>
                    {isConditionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
                <Collapse in={isConditionOpen}>
                    <div className="condition-list mt-4">
                        <FormGroup>
                            {conditions.map((condition, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox name={condition} />}
                                    label={condition}
                                />
                            ))}
                        </FormGroup>
                    </div>
                </Collapse>
            </div> */}

            {/* Hiển thị "Tình trạng truyện" khi ở các route /genres hoặc /auctions */}
            {shouldShowConditionSection && (
                <div className="condition-section mt-6">
                    <div className="header flex justify-between items-center cursor-pointer" onClick={toggleCondition}>
                        <h3 className="text-lg font-bold">Tình trạng truyện</h3>
                        {isConditionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </div>
                    <Collapse in={isConditionOpen}>
                        <div className="condition-list mt-4">
                            <FormGroup>
                                <FormControlLabel
                                    control={<Checkbox name="SEALED" onChange={handleConditionChange} />}
                                    label="Nguyên Seal"
                                />
                                <FormControlLabel
                                    control={<Checkbox name="USED" onChange={handleConditionChange} />}
                                    label="Đã Qua Sử Dụng"
                                />
                            </FormGroup>
                        </div>
                    </Collapse>
                </div>
            )}

      {/* Tác Giả */}
      <div className="author-section mt-6">
        <div
          className="header flex justify-between items-center cursor-pointer"
          onClick={toggleAuthor}
        >
          <h3 className="text-lg font-bold">Tác Giả</h3>
          {isAuthorOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
        </div>
        <Collapse in={isAuthorOpen}>
          <div className="author-list mt-4">
            <FormGroup>
              {authors.map((author, index) => (
                <FormControlLabel
                  key={index} // Using index for now since authors might not have unique IDs
                  control={
                    <Checkbox name={author} onChange={handleAuthorChange} />
                  }
                  label={author}
                />
              ))}
            </FormGroup>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default Sidebar;
