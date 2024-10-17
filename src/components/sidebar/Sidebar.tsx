import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import "../ui/Sidebar.css";

const Sidebar = ({ onGenreFilterChange, onAuthorFilterChange }) => {
    const [isGenreOpen, setIsGenreOpen] = useState(true);
    const [isConditionOpen, setIsConditionOpen] = useState(true);
    const [isAuthorOpen, setIsAuthorOpen] = useState(true);
    const [comics, setComics] = useState([]);
    const [genres, setGenres] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedGenres, setSelectedGenres] = useState([]);
    const [selectedAuthors, setSelectedAuthors] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3000/genres')
            .then((response) => response.json())
            .then((genreData) => {

                // Extract genres from the comic object
                const genresData = genreData.genres || []; // Ensure genres is an array

                // Log the genre names directly
                const genreNames = genresData.map((genre) => genre.name);
                console.log("Genre Names:", genreNames); // Log genre names

                // Create a map of genre IDs to genre names if needed, otherwise just use genresData
                const genresMap = genresData.reduce((map, genre) => {
                    map[genre.id] = genre.name;
                    return map;
                }, {});

                // Update the comic to include genre names
                const updatedComic = {
                    ...genreData,
                    genreNames: genreNames, // Use the mapped genre names
                };

                console.log("Updated Comic with Genres:", updatedComic);

                setGenres(genreData);

                setLoading(false);

                // Fetch authors from /comics API status available
                fetch('http://localhost:3000/comics/status/available')
                    .then((response) => response.json())
                    .then((comicsData) => {
                        console.log("Comics Data:", comicsData);
                        // Extract unique authors from the comics data
                        const authorsData = [...new Set(comicsData.map(comic => comic.author))];
                        setAuthors(authorsData);
                        setLoading(false);
                    })
                    .catch((error) => {
                        console.error("Error fetching authors:", error);
                        setLoading(false);
                    });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
                setLoading(false);
            });
    }, []);
    console.log(genres);

    const toggleGenre = () => setIsGenreOpen(!isGenreOpen);
    const toggleCondition = () => setIsConditionOpen(!isConditionOpen);
    const toggleAuthor = () => setIsAuthorOpen(!isAuthorOpen);

    const handleGenreChange = (event) => {
        const genre = event.target.name;
        const isChecked = event.target.checked;
        let updatedSelectedGenres;

        if (isChecked) {
            updatedSelectedGenres = [...selectedGenres, genre];
        } else {
            updatedSelectedGenres = selectedGenres.filter((g) => g !== genre);
        }
        setSelectedGenres(updatedSelectedGenres);
        if (typeof onGenreFilterChange === "function") {
            onGenreFilterChange(updatedSelectedGenres);
        }
    };

    const handleAuthorChange = (event) => {
        const author = event.target.name;
        const isChecked = event.target.checked;
        let updatedSelectedAuthors;

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

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <h2>Khám phá truyện</h2>
                <div className="line-header"></div>
            </div>

            {/* Thể loại truyện tranh */}
            <div className="genre-section">
                <div className="header flex justify-between items-center cursor-pointer" onClick={toggleGenre}>
                    <h3 className="text-lg font-bold">Thể loại truyện tranh</h3>
                    {isGenreOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
                <Collapse in={isGenreOpen}>
                    <div className="genre-list mt-4">
                        <FormGroup>
                            {genres.map((genre) => (
                                <FormControlLabel
                                    key={genre.id}  
                                    control={<Checkbox name={genre.name} onChange={handleGenreChange} />} 
                                    label={genre.name} 
                                />
                            ))}
                        </FormGroup>
                    </div>
                </Collapse>
            </div>

            {/* Tình trạng truyện */}
            <div className="condition-section mt-6">
                <div className="header flex justify-between items-center cursor-pointer" onClick={toggleCondition}>
                    <h3 className="text-lg font-bold">Tình trạng truyện</h3>
                    {isConditionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
                <Collapse in={isConditionOpen}>
                    <div className="condition-list mt-4">
                        <FormGroup>
                            {/* {conditions.map((condition, index) => (
                                <FormControlLabel
                                    key={index}
                                    control={<Checkbox name={condition} />}
                                    label={condition}
                                />
                            ))} */}
                        </FormGroup>
                    </div>
                </Collapse>
            </div>

            {/* Tác Giả */}
            <div className="author-section mt-6">
                <div className="header flex justify-between items-center cursor-pointer" onClick={toggleAuthor}>
                    <h3 className="text-lg font-bold">Tác Giả</h3>
                    {isAuthorOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                </div>
                <Collapse in={isAuthorOpen}>
                    <div className="author-list mt-4">
                        <FormGroup>
                            {authors.map((author, index) => (
                                <FormControlLabel
                                    key={index}  // Using index for now since authors might not have unique IDs
                                    control={<Checkbox name={author} onChange={handleAuthorChange}/>}
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
