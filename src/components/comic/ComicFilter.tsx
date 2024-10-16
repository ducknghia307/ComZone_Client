import React, { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar"
import Genres from "../genres/Genres";

const ComicFilter = () => {
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [comics, setComics] = useState([]);

  useEffect(() => {
    // Fetch all comics once on component mount
    fetch("http://localhost:3000/comics")
      .then((response) => response.json())
      .then((data) => {
        setComics(data);
      })
      .catch((error) => console.error("Error fetching comics:", error));
  }, []);

  const handleGenreSelection = (selectedGenres) => {
    setSelectedGenres(selectedGenres);
  };

  const handleAuthorSelection = (selectedAuthors) => {
    setSelectedAuthors(selectedAuthors);
  };

  // Filter comics based on selected genres and authors
  const filteredComics = comics.filter((comic) => {
    const matchGenre = selectedGenres.length
      ? selectedGenres.includes(comic.genre)
      : true;
    const matchAuthor = selectedAuthors.length
      ? selectedAuthors.includes(comic.author)
      : true;
    return matchGenre && matchAuthor;
  });

  return (
    <div className="flex">
      <Sidebar
        onGenreChange={handleGenreSelection}
        onAuthorChange={handleAuthorSelection}
      />
      <Genres comics={filteredComics} />
    </div>
  );
};

export default ComicFilter;
