import React, { useState, useEffect } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Collapse,
  CircularProgress,
  Radio,
  RadioGroup,
  FormControl,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { useAppSelector } from "../../redux/hooks";
import { useLocation } from "react-router-dom";
import { publicAxios } from "../../middleware/axiosInstance";
import "../ui/Sidebar.css";
import { Comic, Genre } from "../../common/base.interface";

interface SidebarProps {
  onGenreFilterChange?: (updatedGenres: string[]) => void;
  onAuthorFilterChange?: (updatedAuthors: string[]) => void;
  onConditionFilterChange?: (updatedConditions: string[]) => void;
}

const conditions = ["ALL", "SEALED", "USED"];

const Sidebar: React.FC<SidebarProps> = ({
  onGenreFilterChange,
  onAuthorFilterChange,
  onConditionFilterChange,
}) => {
  const [isGenreOpen, setIsGenreOpen] = useState(true);
  const [isConditionOpen, setIsConditionOpen] = useState(true);
  const [isAuthorOpen, setIsAuthorOpen] = useState(true);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [selectedAuthors, setSelectedAuthors] = useState<string[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string[]>([]);

  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const location = useLocation();
  const shouldShowConditionSection = [
    "/genres",
    "/auctions",
    "/search",
  ].includes(location.pathname);

  useEffect(() => {
    const fetchGenresAndAuthors = async () => {
      setLoading(true);
      try {
        const genreResponse = await publicAxios("/genres");
        setGenres(genreResponse.data);

        // Fetch comics and extract authors from them
        const comicsResponse = await publicAxios.get<Comic[]>(
          "/comics/status/available"
        );
        const comicsData = comicsResponse.data;

        // Extract authors from comics data
        const authorsData: string[] = [
          ...new Set(comicsData.map((comic: any) => comic.author)),
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

  const handleGenreChange = (event: any) => {
    const genre = event.target.name;
    const isChecked = event.target.checked;

    const updatedSelectedGenres = isChecked
      ? [...selectedGenres, genre]
      : selectedGenres.filter((g) => g !== genre);

    setSelectedGenres(updatedSelectedGenres);

    // Notify parent component of the updated selected genres
    if (typeof onGenreFilterChange === "function") {
      onGenreFilterChange(updatedSelectedGenres);
    }
  };

  const handleAuthorChange = (event: any) => {
    const author = event.target.name;
    const isChecked = event.target.checked;

    const updatedSelectedAuthors = isChecked
      ? [...selectedAuthors, author]
      : selectedAuthors.filter((a) => a !== author);

    setSelectedAuthors(updatedSelectedAuthors);

    // Notify parent component of the updated selected authors
    if (typeof onAuthorFilterChange === "function") {
      onAuthorFilterChange(updatedSelectedAuthors);
    }
  };

  const handleConditionChange = (event: any) => {
    if (event.target.value === "ALL") {
      onConditionFilterChange([]);
    } else {
      setSelectedCondition(event.target.value);
      if (typeof onConditionFilterChange === "function") {
        onConditionFilterChange(event.target.value);
      }
    }
  };

  return (
    <div className="sidebar REM">
      <div className="sidebar-header border-b border-gray-200 p-5">
        <h2 className="uppercase">Khám phá truyện</h2>
      </div>

      {loading ? (
        <div className="loading-spinner">
          <CircularProgress />
        </div>
      ) : (
        <div className="p-5">
          {/* Genre Section */}
          <div className="genre-section REM">
            <div
              className="header flex justify-between items-center cursor-pointer"
              onClick={toggleGenre}
            >
              <h3 className="text-base font-bold text-nowrap">
                Thể loại truyện tranh
              </h3>
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
                <h3 className="text-base font-bold">Tình trạng truyện</h3>
                {isConditionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </div>
              <Collapse in={isConditionOpen}>
                <RadioGroup defaultValue="ALL" className="mt-4">
                  {conditions.map((condition) => (
                    <FormControlLabel
                      key={condition}
                      control={<Radio />}
                      name={condition}
                      value={condition}
                      onChange={handleConditionChange}
                      label={
                        <p className="REM">
                          {condition === "ALL"
                            ? "Tất cả tình trạng"
                            : condition === "SEALED"
                            ? "Nguyên Seal"
                            : "Đã Qua Sử Dụng"}
                        </p>
                      }
                    />
                  ))}
                </RadioGroup>
              </Collapse>
            </div>
          )}

          {/* Author Section */}
          <div className="author-section mt-6">
            <div
              className="header flex justify-between items-center cursor-pointer"
              onClick={toggleAuthor}
            >
              <h3 className="text-base font-bold">Tác Giả</h3>
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
                    label={<p className="REM text-sm">{author}</p>}
                  />
                ))}
              </FormGroup>
            </Collapse>
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
