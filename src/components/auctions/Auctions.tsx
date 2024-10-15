import React from "react";
import "../ui/AuctionSidebar.css";
import Countdown from "react-countdown";
import { Button } from "@mui/material";

const renderer = ({ days, hours, minutes, seconds }) => {
    return (
        <div className="countdown">
            <div className="time-box">
                <span className="time">{days.toString().padStart(2, '0')}</span>
                <span className="label">D</span>
            </div>
            <div className="time-box">
                <span className="time">{hours.toString().padStart(2, '0')}</span>
                <span className="label">H</span>
            </div>
            <div className="time-box">
                <span className="time">{minutes.toString().padStart(2, '0')}</span>
                <span className="label">M</span>
            </div>
            <div className="time-box">
                <span className="time">{seconds.toString().padStart(2, '0')}</span>
                <span className="label">S</span>
            </div>
        </div>
    );
};

const AllAuctions = () => {
    const genres = [
        {
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },{
            imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
            price: "64,350đ",
            title: "MÈO MỐC",
            description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
        },
    ];

    return (
        <div className="mb-10">
            <div className="auction-section flex justify-between items-center">
                <h2 className="text-2xl font-bold">Các Cuộc Đấu Giá Ở ComZone</h2>
            </div>

            <div className="auction-section-detail1 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Đang diễn ra</h2>
            </div>

            <div className="auction-cards mt-4">
                {genres.map((genre, index) => (
                    <div className="auction-card" key={index}>
                        <img
                            src="https://cdn0.fahasa.com/media/catalog/product/m/a/marvel_spider_man_tattle_tales_1_2022_08_22_15_39_32.jpg?_gl=1*1psv686*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODIzMzYzMi4yOC4xLjE3MjgyMzM2NzguMTQuMC4xMjg4NzY4MTk4"
                            alt=""
                            className=" object-cover mx-auto"
                        />
                        <p className="title">Spider Man Comic</p>
                        <p className="condition">VF: 8.0</p>
                        <p className="endtime">KẾT THÚC TRONG</p>
                        <Countdown
                            date={Date.now() + 100000000}  // Example: 100000000 ms from now
                            renderer={renderer}
                        />
                        <Button className="detail-button" variant="contained">Xem Chi Tiết</Button>
                    </div>
                ))}
            </div>
            <div className="auction-section-detail2 flex justify-between items-center">
                <h2 className="text-2xl font-bold">Sắp diễn ra</h2>
            </div>
            <div className="auction-cards mt-4">
                {genres.map((genre, index) => (
                    <div className="auction-card" key={index}>
                        <img
                            src="https://cdn0.fahasa.com/media/catalog/product/m/a/marvel_spider_man_tattle_tales_1_2022_08_22_15_39_32.jpg?_gl=1*1psv686*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODIzMzYzMi4yOC4xLjE3MjgyMzM2NzguMTQuMC4xMjg4NzY4MTk4"
                            alt=""
                            className=" object-cover mx-auto"
                        />
                        <p className="title">Spider Man Comic</p>
                        <p className="condition">VF: 8.0</p>
                        <p className="endtime">BẮT ĐẦU TRONG</p>
                        <Countdown
                            date={Date.now() + 100000000}  // Example: 100000000 ms from now
                            renderer={renderer}
                        />
                        <Button className="detail-button" variant="contained">Xem Chi Tiết</Button>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default AllAuctions;
