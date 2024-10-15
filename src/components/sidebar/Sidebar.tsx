import React, { useState, useEffect } from "react";
import { Checkbox, FormControlLabel, FormGroup, Collapse } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import axios from 'axios';
import "../ui/Sidebar.css";

const Sidebar = () => {
    const [isGenreOpen, setIsGenreOpen] = useState(true);
    const [isConditionOpen, setIsConditionOpen] = useState(true);
    const [isAuthorOpen, setIsAuthorOpen] = useState(true);
    const [genres, setGenres] = useState([]);
    const [conditions, setConditions] = useState([]);
    const [authors, setAuthors] = useState([]);

    // Fetch data from API
    useEffect(() => {
        axios.get('https://666aae407013419182d06da5.mockapi.io/genres')
            .then((response) => {
                const fetchedGenres = response.data;
                setGenres(fetchedGenres);

                // Extract unique conditions and authors from the fetched genres
                const uniqueConditions = [...new Set(fetchedGenres.map((genre) => genre.condition))];
                setConditions(uniqueConditions);

                const uniqueAuthors = [...new Set(fetchedGenres.map((genre) => genre.author))];
                setAuthors(uniqueAuthors);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }, []);

    const toggleGenre = () => setIsGenreOpen(!isGenreOpen);
    const toggleCondition = () => setIsConditionOpen(!isConditionOpen);
    const toggleAuthor = () => setIsAuthorOpen(!isAuthorOpen);

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
                                    control={<Checkbox name={genre.name} />}
                                    label={`Truyện tranh ${genre.name}`}
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
                                    key={index}
                                    control={<Checkbox name={author} />}
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
