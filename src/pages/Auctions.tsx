import React from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "../components/ui/HomePage.css"
import Grid from '@mui/material/Grid';
import Auctions from "../components/auctions/Auctions"

const AllAuctions = () => {
    return (
        <div className="homepage w-full overflow-x-hidden px-4">
            <Grid container spacing={0}>
                <Grid item xs={2}>
                    <Sidebar />
                </Grid>
                <Grid item xs={10}>
                    <Auctions />
                </Grid>

            </Grid>
            {/* <Footer /> */}
        </div>
    );
};

export default AllAuctions;
