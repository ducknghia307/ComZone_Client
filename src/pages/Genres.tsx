import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "../components/ui/HomePage.css"
import Grid from '@mui/material/Grid2';
import Genres from "../components/genres/Genres"

const AllGenres = () => {
    return (
        <div className="homepage w-full overflow-x-hidden px-4">
            <Grid container spacing={0}>
                <Grid size={2}>
                    <Sidebar />
                </Grid>
                <Grid size={10}>
                    <Genres />
                </Grid>

            </Grid>
            {/* <Footer /> */}
        </div>
    );
};

export default AllGenres;
