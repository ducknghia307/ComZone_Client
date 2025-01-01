import { useState } from "react";
import Sidebar from "../components/sidebar/Sidebar";
import "../components/ui/HomePage.css";
import Grid from "@mui/material/Grid2";
import Genres from "../components/genres/Genres";

const AllGenres = () => {
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
    <div className="homepage w-full flex justify-center">
      <div className="w-full overflow-x-hidden flex px-8 py-5 gap-5 max-w-screen-2xl">
        <div className="min-w-fit max-lg:hidden">
          <Sidebar
            onGenreFilterChange={handleGenreFilterChange}
            onAuthorFilterChange={handleAuthorFilterChange}
            onConditionFilterChange={handleConditionFilterChange}
          />
        </div>

        <div className="grow min-w-[20em]">
          <Genres
            filteredGenres={filteredGenres}
            filteredAuthors={filteredAuthors}
            filteredConditions={filteredConditions}
          />
        </div>
      </div>
    </div>
  );
};

export default AllGenres;
