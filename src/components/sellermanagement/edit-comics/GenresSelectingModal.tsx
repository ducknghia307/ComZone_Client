import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { Comic, Genre } from "../../../common/base.interface";

export default function GenresSelectingModal({
  open,
  setOpen,
  genresList,
  genres,
  setGenres,
  currentComics,
  setCurrentComics,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  genresList: Genre[];
  genres: Genre[];
  setGenres: React.Dispatch<React.SetStateAction<Genre[]>>;
  currentComics: Comic;
  setCurrentComics: React.Dispatch<React.SetStateAction<Comic>>;
}) {
  const [currentGenresList, setCurrentGenresList] =
    useState<Genre[]>(genresList);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);

  const [genresSearchInput, setGenresSearchInput] = useState<string>("");
  const searchInputRef = useRef<string>("");

  const genreLimit = 3;

  const handleSearchGenres = () => {
    if (genresSearchInput.length === 0) setCurrentGenresList(genresList);
    else {
      searchInputRef.current = genresSearchInput;

      setCurrentGenresList(
        genresList.filter(
          (genre) =>
            genre.name
              .toLowerCase()
              .includes(genresSearchInput.toLowerCase()) ||
            genre.description
              .toLowerCase()
              .includes(genresSearchInput.toLowerCase())
        )
      );
    }
  };

  useEffect(() => {
    setCurrentGenresList(genresList);
  }, [genresList]);

  useEffect(() => {
    setSelectedGenres(genres);
  }, [genres, open]);

  const handleSelectGenres = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setGenres(selectedGenres);
    setOpen(false);
  };

  return (
    <Modal
      open={open}
      onCancel={(e) => {
        e.stopPropagation();
        setOpen(false);
      }}
      footer={null}
      width={1000}
    >
      <div className="space-y-4 pt-8">
        <p className="font-semibold text-xl uppercase">
          CHỌN THỂ LOẠI{" "}
          <span className="normal-case text-base italic font-light">
            (Tối đa {genreLimit})
          </span>
        </p>

        <div className="grow relative text-black">
          <input
            type="text"
            placeholder="Tìm kiếm thể loại..."
            className="w-full border border-gray-500 rounded-md px-2 py-2 pl-8 font-light"
            value={genresSearchInput}
            onChange={(e) => {
              setGenresSearchInput(e.target.value);
              if (e.target.value.length === 0) setCurrentGenresList(genresList);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSearchGenres();
              }
            }}
          />

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="currentColor"
            className="absolute top-1/2 -translate-y-1/2 left-2"
          >
            <path d="M18.031 16.6168L22.3137 20.8995L20.8995 22.3137L16.6168 18.031C15.0769 19.263 13.124 20 11 20C6.032 20 2 15.968 2 11C2 6.032 6.032 2 11 2C15.968 2 20 6.032 20 11C20 13.124 19.263 15.0769 18.031 16.6168ZM16.0247 15.8748C17.2475 14.6146 18 12.8956 18 11C18 7.1325 14.8675 4 11 4C7.1325 4 4 7.1325 4 11C4 14.8675 7.1325 18 11 18C12.8956 18 14.6146 17.2475 15.8748 16.0247L16.0247 15.8748Z"></path>
          </svg>
        </div>

        {currentGenresList.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 items-baseline gap-2 p-2 overflow-y-auto max-h-[50vh]">
            {currentGenresList.map((genre, index) => {
              const isSelected = selectedGenres.some(
                (g) => g.name === genre.name
              );
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (selectedGenres.length >= genreLimit && !isSelected)
                      return;

                    if (isSelected) {
                      setSelectedGenres((prev) =>
                        prev.filter((g) => g.id !== genre.id)
                      );
                      setCurrentComics({
                        ...currentComics,
                        genres: selectedGenres.filter((g) => g.id !== genre.id),
                      });
                    } else {
                      setSelectedGenres((prev) => [...prev, genre]);
                      setCurrentComics({
                        ...currentComics,
                        genres: [...selectedGenres, genre],
                      });
                    }
                  }}
                  className={`relative flex flex-col items-baseline gap-1 rounded-lg ${
                    isSelected
                      ? "ring-2 ring-gray-800"
                      : selectedGenres.length === genreLimit &&
                        "opacity-30 cursor-default"
                  } border border-gray-300 p-2 duration-200`}
                >
                  <p className="font-semibold">{genre.name}</p>
                  <p className="text-xs text-start font-light line-clamp-1">
                    {genre.description}
                  </p>

                  {isSelected && (
                    <span className="absolute top-1/2 right-4 -translate-y-1/2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        width="24"
                        height="24"
                        fill="currentColor"
                      >
                        <path d="M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z"></path>
                      </svg>
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}

        {genresSearchInput.length > 0 && currentGenresList.length === 0 && (
          <div className="w-full text-center py-8 h-[50vh] font-light text-lg">
            Không tìm thấy thể loại{" "}
            <span className="font-semibold">"{searchInputRef.current}"</span>
          </div>
        )}

        <div className="min-w-fit sm:basis-1/3 flex items-center justify-between gap-4">
          <p className="min-w-fit">
            Đã chọn:{" "}
            <span className="font-semibold">
              {selectedGenres.length} / {genreLimit}
            </span>
          </p>
          <div className="grow flex items-center gap-1">
            <button
              onClick={() => setSelectedGenres(currentComics.genres)}
              className={`hidden sm:block min-w-fit p-2 basis-1/3 border border-gray-400 rounded duration-200 hover:bg-gray-100 ${
                selectedGenres.length === 0 && "hidden"
              }`}
            >
              Chọn lại
            </button>
            <button
              disabled={selectedGenres.length === 0}
              onClick={handleSelectGenres}
              className="grow p-2 bg-green-700 text-white font-semibold rounded duration-200 hover:bg-green-900 disabled:bg-gray-300"
            >
              {selectedGenres.length === 0 ? "Chọn ít nhất một" : "Hoàn tất"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
