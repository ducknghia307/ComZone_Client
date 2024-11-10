import React from "react";
import { Comic } from "../../../common/base.interface";

interface ComicListProps {
  comicExchangeOffer: Comic[];
}

const ComicExchangeOfferList: React.FC<ComicListProps> = ({
  comicExchangeOffer,
}) => {
  return (
    <div className="mt-4 w-full">
      {comicExchangeOffer.length > 0 ? (
        <div className="flex flex-col">
          {comicExchangeOffer.map((comic) => (
            <div key={comic.id} className="border p-4 rounded-lg shadow-sm">
              <img
                src={comic.coverImage}
                alt={comic.title}
                className="w-full h-48 object-cover rounded-md mb-2"
              />
              <h3 className="font-bold text-lg">{comic.title}</h3>
              <p className="text-gray-600">Author: {comic.author}</p>
              <p className="text-gray-500 mt-1">Condition: {comic.condition}</p>
              <p className="text-gray-700 mt-1">
                {comic.description || "No description available"}
              </p>
              <div className="mt-2">
                <button className="text-blue-500 hover:underline">
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No comics available for exchange.
        </p>
      )}
    </div>
  );
};

export default ComicExchangeOfferList;
