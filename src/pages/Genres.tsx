import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "../components/ui/HomePage.css"
import Grid from '@mui/material/Grid2';
import Genres from "../components/genres/Genres"

const AllGenres = () => {
    const [filteredGenres, setFilteredGenres] = useState([]);
    const [filteredAuthors, setFilteredAuthors] = useState([]);

    const handleGenreFilterChange = (selectedGenres) => {
        setFilteredGenres(selectedGenres);
    };

    const handleAuthorFilterChange = (selectedAuthors) => {
        setFilteredAuthors(selectedAuthors);
    };

    return (
        <div className="homepage w-full overflow-x-hidden px-4">
            <Grid container spacing={0}>
                <Grid size={2}>
                    <Sidebar onGenreFilterChange={handleGenreFilterChange} onAuthorFilterChange={handleAuthorFilterChange} />
                </Grid>
                <Grid size={10}>
                    <Genres filteredGenres={filteredGenres} filteredAuthors={filteredAuthors}/>
                </Grid>

            </Grid>
            {/* <Footer /> */}
        </div>
    );
};

export default AllGenres;
