import React, { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import "../ui/GenreSidebar.css";
import { Link } from "react-router-dom";

const Genres = () => {
  const [comics, setComics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Call API để lấy danh sách comics
    fetch("http://localhost:3000/comics")
      .then((response) => response.json())
      .then((data) => {
        console.log("Comics:", comics);
        setComics(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching comics:", error);
        setLoading(false);
      });
  }, []);

  const formatPrice = (price) => {
    // Thêm dấu chấm ngăn cách hàng nghìn và thêm 'đ' ở cuối
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + "đ";
  };

  return (
    <div className="mb-10">
      {/* Tất Cả Thể Loại */}
      <div className="all-genres-section flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tất Cả Thể Loại</h2>
        <div className="flex items-center">
          <span className="mr-2">Sắp xếp: </span>
          <select className="border rounded p-1">
            <option>Giá cao đến thấp</option>
            <option>Giá thấp đến cao</option>
          </select>
        </div>
      </div>

      <div className="all-genres-cards mt-4">
        {comics.map((comic) => (
          <div className="hot-comic-card" key={comic.id}>
            <Link to={`/detail/${comic.id}`}>
              <img
                src={comic.coverImage}
                alt={comic.title}
                className="object-cover mx-auto"
              />
              <p className="price">{formatPrice(comic.price)}</p>
              <p className="author">{comic.author.toUpperCase()}</p>
              <p className="title">{comic.title}</p>
              <div className="rating-sold">
                <p className="rating">
                  {[...Array(5)].map((_, index) => (
                    <StarIcon
                      key={index}
                      style={{ width: "20px", color: "#ffc107" }}
                    />
                  ))}
                </p>
                <div className="divider"></div>
                <p className="sold-info">Đã bán {comic.sold}</p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Genres;
