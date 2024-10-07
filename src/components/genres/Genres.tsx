import React from "react";
import StarIcon from '@mui/icons-material/Star';
import "../ui/GenreSidebar.css";

const AllGenres = () => {
    const genres = [
        {
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },
        {
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
            soldInfo: "Đã bán 1014",
            rating: 5
        },
    ];

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
                {genres.map((genre, index) => (
                    <div className="all-genres-card" key={index}>
                        <img src={genre.imgSrc} alt={genre.title} className="object-cover mx-auto" />
                        <p className="price">{genre.price}</p>
                        <p className="title">{genre.title}</p>
                        <p className="description">{genre.description}</p>
                        <div className="rating-sold">
                            <p className="rating">
                                {[...Array(genre.rating)].map((_, index) => (
                                    <StarIcon key={index} style={{ width: "20px", color: "#ffc107" }} />
                                ))}
                            </p>
                            <div className="divider"></div>
                            <p className="sold-info">{genre.soldInfo}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AllGenres;
