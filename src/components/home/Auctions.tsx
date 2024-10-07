// import React from "react";
// import Carousel from "react-multi-carousel";
// import "react-multi-carousel/lib/styles.css";
// import "../ui/Auctions.css";
// import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
// import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// import { Button } from "@mui/material";
// import Countdown from "react-countdown";

// const responsive = {
//     superLargeDesktop: {
//         breakpoint: { max: 4000, min: 1024 },
//         items: 5.5,
//         slidesToSlide: 2,
//     },
//     desktop: {
//         breakpoint: { max: 1024, min: 800 },
//         items: 4,
//     },
//     tablet: {
//         breakpoint: { max: 800, min: 464 },
//         items: 2,
//     },
//     mobile: {
//         breakpoint: { max: 464, min: 0 },
//         items: 1,
//     },
// };

// const renderer = ({ days, hours, minutes, seconds }) => {
//     return (
//         <div className="countdown">
//             <div className="time-box">
//                 <span className="time">{days.toString().padStart(2, '0')}</span>
//                 <span className="label">D</span>
//             </div>
//             <div className="time-box">
//                 <span className="time">{hours.toString().padStart(2, '0')}</span>
//                 <span className="label">H</span>
//             </div>
//             <div className="time-box">
//                 <span className="time">{minutes.toString().padStart(2, '0')}</span>
//                 <span className="label">M</span>
//             </div>
//             <div className="time-box">
//                 <span className="time">{seconds.toString().padStart(2, '0')}</span>
//                 <span className="label">S</span>
//             </div>
//         </div>
//     );
// };

// const genres = [
//     {
//         imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
//         price: "64,350đ",
//         title: "MÈO MỐC",
//         description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
//     },{
//         imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
//         price: "64,350đ",
//         title: "MÈO MỐC",
//         description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
//     },{
//         imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
//         price: "64,350đ",
//         title: "MÈO MỐC",
//         description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
//     },{
//         imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
//         price: "64,350đ",
//         title: "MÈO MỐC",
//         description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
//     },{
//         imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
//         price: "64,350đ",
//         title: "MÈO MỐC",
//         description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
//     },{
//         imgSrc: "https://cdn0.fahasa.com/media/catalog/product/b/_/b_a-t_y-du-h_-5_1.jpg",
//         price: "64,350đ",
//         title: "MÈO MỐC",
//         description: "Tây Du Hí 5 - Ngôi Làng Nơi Thần Tiên Trở Thành Yêu Quái",
//     },

// ];

// const CustomButtonGroup = ({ next, previous, goToSlide, carouselState }) => {
//     const { currentSlide, totalItems, slidesToShow } = carouselState;
//     const isFirstSlide = currentSlide === 0;
//     const isLastSlide = currentSlide + slidesToShow >= totalItems;


//     return (
//         <div className="custom-button-group">
//             {!isFirstSlide && (
//                 <button className="custom-button custom-button-left" onClick={previous}>
//                     <ChevronLeftIcon />
//                 </button>
//             )}
//             {!isLastSlide && (
//                 <button className="custom-button custom-button-right" onClick={next}>
//                     <ChevronRightIcon />
//                 </button>
//             )}
//         </div>
//     );
// };

// const Auction = () => {
//     return (
//         <div className="w-full py-8">
//                 <div className="section-title text-2xl font-bold">
//                     <div className="line"></div>
//                     <h2 className="title">20 sản phẩm đang được đấu giá</h2>
//                     <div className="line"></div>
//                 </div>

//                 <Carousel
//                     responsive={responsive}
//                     customButtonGroup={<CustomButtonGroup />}
//                     renderButtonGroupOutside={true}
//                 >
//                     {/* Cards Auction */}
//                     <div className="auction-cards">
//                         {genres.map((genre, index) => (
//                             <div className="auction-card">
//                                 <img
//                                     src="https://cdn0.fahasa.com/media/catalog/product/m/a/marvel_spider_man_tattle_tales_1_2022_08_22_15_39_32.jpg?_gl=1*1psv686*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODIzMzYzMi4yOC4xLjE3MjgyMzM2NzguMTQuMC4xMjg4NzY4MTk4"
//                                     alt=""
//                                     className=" object-cover mx-auto"
//                                 />
//                                 <p className="title">Spider Man Comic</p>
//                                 <p className="condition">VF: 8.0</p>
//                                 <p className="endtime">KẾT THÚC TRONG</p>
//                                 <Countdown
//                                     date={Date.now() + 100000000}  
//                                     renderer={renderer}
//                                 />
//                                 <Button className="detail-button" variant="contained">Xem Chi Tiết</Button>
//                             </div>
//                         ))}
//                     </div>

//                 </Carousel>
//             </div>

//     );
// };

// export default Auction;
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import "../ui/Auctions.css";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import StarIcon from '@mui/icons-material/Star';
import Countdown from "react-countdown";
import { Button } from "@mui/material";

const responsive = {
    superLargeDesktop: {
        breakpoint: { max: 4000, min: 1024 },
        items: 5.5,
        slidesToSlide: 2,
    },
    desktop: {
        breakpoint: { max: 1024, min: 800 },
        items: 4,
    },
    tablet: {
        breakpoint: { max: 800, min: 464 },
        items: 2,
    },
    mobile: {
        breakpoint: { max: 464, min: 0 },
        items: 1,
    },
};

const CustomButtonGroup = ({ next, previous, goToSlide, carouselState }) => {
    const { currentSlide, totalItems, slidesToShow } = carouselState;
    const isFirstSlide = currentSlide === 0;
    const isLastSlide = currentSlide + slidesToShow >= totalItems;

    return (
        <div className="custom-button-group">
            {!isFirstSlide && (
                <button className="custom-button custom-button-left" onClick={previous}>
                    <ChevronLeftIcon />
                </button>
            )}
            {!isLastSlide && (
                <button className="custom-button custom-button-right" onClick={next}>
                    <ChevronRightIcon />
                </button>
            )}
        </div>
    );
};

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

const Auctions = () => {
    return (
        <div className="w-full py-8">
            <div className="section-title text-2xl font-bold">
                <div className="line"></div>
                <h2 className="title">20 sản phẩm đang được đấu giá</h2>
                <div className="line"></div>
            </div>

            <div className="hot-comic-cards mt-4">
                <Carousel
                    responsive={responsive}
                    customButtonGroup={<CustomButtonGroup />}
                    renderButtonGroupOutside={true}
                >
                    
                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                    <div className="auction-card">
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

                </Carousel>
            </div>

        </div>
    );
};

export default Auctions;
