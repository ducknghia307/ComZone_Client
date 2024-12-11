import React, { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "../components/ui/HomePage.css";
import Grid from "@mui/material/Grid2";
import Auctions from "../components/auctions/Auctions";

const AllAuctions = () => {
  const [filteredGenres, setFilteredGenres] = useState([]);
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [filteredConditions, setFilteredConditions] = useState([]);

  const handleGenreFilterChange = (selectedGenres: any) => {
    setFilteredGenres(selectedGenres);
  };

  const handleAuthorFilterChange = (selectedAuthors: any) => {
    setFilteredAuthors(selectedAuthors);
  };

  const handleConditionFilterChange = (selectedCondition: any) => {
    setFilteredConditions(selectedCondition);
  };

  return (
    // <div className="homepage w-full overflow-x-hidden px-4">
    //   <Grid container spacing={0}>
    //     <Grid size={2}>
    //       <Sidebar
    //         onGenreFilterChange={handleGenreFilterChange}
    //         onAuthorFilterChange={handleAuthorFilterChange}
    //         onConditionFilterChange={handleConditionFilterChange}
    //       />
    //     </Grid>
    //     <Grid size={10}>
    //       <Auctions
    //         filteredGenres={filteredGenres}
    //         filteredAuthors={filteredAuthors}
    //         filteredConditions={filteredConditions}
    //       />
    //     </Grid>
    //   </Grid>
    // </div>
    <div className="homepage w-full overflow-x-hidden flex px-4">
      <div className="min-w-fit">
        <Sidebar
          onGenreFilterChange={handleGenreFilterChange}
          onAuthorFilterChange={handleAuthorFilterChange}
          onConditionFilterChange={handleConditionFilterChange}
        />
      </div>

      <div className="grow min-w-[30em]">
        <Auctions
          filteredGenres={filteredGenres}
          filteredAuthors={filteredAuthors}
          filteredConditions={filteredConditions}
        />
      </div>
    </div>
  );
};

export default AllAuctions;
