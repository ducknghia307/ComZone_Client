import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
} from 'chart.js';
import { privateAxios } from '../../middleware/axiosInstance';
import { AttachMoneyOutlined, PeopleOutline, BookOutlined, GavelOutlined, SwapHorizOutlined } from '@mui/icons-material';
import { MenuItem, Select, FormControl, InputLabel } from '@mui/material';

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const mockData = {
    comics: [
        { date: "2024-10-01", count: 10 },
        { date: "2024-10-05", count: 15 },
        { date: "2024-10-12", count: 28 }
    ],
    orders: [
        { date: "2024-09-03", count: 5 },
        { date: "2024-09-10", count: 8 },
        { date: "2024-09-17", count: 12 }
    ],
    transactions: [
        { date: "2024-11-01", count: 2 },
        { date: "2024-11-05", count: 4 },
        { date: "2024-11-10", count: 6 }
    ]
};

const Dashboard = () => {
    const [comicsData, setComicsData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [visibleDatasets, setVisibleDatasets] = useState({
        comics: true,
        orders: true,
        transactions: true,
    });
    const [timeRange, setTimeRange] = useState('Year');

    useEffect(() => {
        // Simulate API call with mock data
        setComicsData(mockData.comics);
        setOrdersData(mockData.orders);
        setTransactionsData(mockData.transactions);
    }, []);

    const totalRevenue = 4379000; // Mock total revenue
    const totalUsers = 23 + 101 + 5; // Mock total users
    const totalComics = comicsData.length;
    const totalAuctions = ordersData.length;
    const totalExchanges = transactionsData.length;

    const filterDataByTimeRange = (data) => {
        // Logic to filter data based on selected time range
        const now = new Date();
        if (timeRange === 'Week') {
            const oneWeekAgo = new Date(now);
            oneWeekAgo.setDate(now.getDate() - 7);
            return data.filter(item => new Date(item.date) >= oneWeekAgo);
        } else if (timeRange === 'Month') {
            const oneMonthAgo = new Date(now);
            oneMonthAgo.setMonth(now.getMonth() - 1);
            return data.filter(item => new Date(item.date) >= oneMonthAgo);
        } else {
            return data; // Default is Year
        }
    };

    const createCombinedChartData = () => {
        // Filter data based on time range
        const filteredComics = filterDataByTimeRange(comicsData);
        const filteredOrders = filterDataByTimeRange(ordersData);
        const filteredTransactions = filterDataByTimeRange(transactionsData);

        // Extract unique dates from all datasets
        const allDates = [...new Set([...filteredComics, ...filteredOrders, ...filteredTransactions].map(item => item.date))];
        allDates.sort();

        const comicsCounts = allDates.map(date => {
            const found = filteredComics.find(item => item.date === date);
            return found ? found.count : 0;
        });

        const ordersCounts = allDates.map(date => {
            const found = filteredOrders.find(item => item.date === date);
            return found ? found.count : 0;
        });

        const transactionsCounts = allDates.map(date => {
            const found = filteredTransactions.find(item => item.date === date);
            return found ? found.count : 0;
        });

        return {
            labels: allDates,
            datasets: [
                visibleDatasets.comics && {
                    label: 'Comics',
                    data: comicsCounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                },
                visibleDatasets.orders && {
                    label: 'Orders',
                    data: ordersCounts,
                    borderColor: 'rgba(192, 75, 192, 1)',
                    backgroundColor: 'rgba(192, 75, 192, 0.2)',
                    tension: 0.4,
                },
                visibleDatasets.transactions && {
                    label: 'Transactions',
                    data: transactionsCounts,
                    borderColor: 'rgba(192, 192, 75, 1)',
                    backgroundColor: 'rgba(192, 192, 75, 0.2)',
                    tension: 0.4,
                },
            ].filter(Boolean),
        };
    };

    const toggleDatasetVisibility = (key) => {
        setVisibleDatasets((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div>
            {/* Summary Cards Section */}
            <div className="mb-6 mt-6">
                <div className="flex justify-between space-x-4">
                    <div className="bg-blue-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <AttachMoneyOutlined className="text-blue-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Doanh thu</h3>
                            <p className="text-lg font-bold">{totalRevenue.toLocaleString()} VND</p>
                        </div>
                    </div>
                    <div className="bg-green-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <PeopleOutline className="text-green-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Người dùng</h3>
                            <p className="text-lg font-bold">{totalUsers}</p>
                        </div>
                    </div>
                    <div className="bg-yellow-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <BookOutlined className="text-yellow-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Số truyện</h3>
                            <p className="text-lg font-bold">{totalComics}</p>
                        </div>
                    </div>
                    <div className="bg-purple-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <GavelOutlined className="text-purple-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Số cuộc đấu giá</h3>
                            <p className="text-lg font-bold">{totalAuctions}</p>
                        </div>
                    </div>
                    <div className="bg-red-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <SwapHorizOutlined className="text-red-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Số lượt trao đổi</h3>
                            <p className="text-lg font-bold">{totalExchanges}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Biểu đồ tổng quan hoạt động</h2>
                        <FormControl size="small">
                            <InputLabel id="time-range-select-label">Thời gian</InputLabel>
                            <Select
                                labelId="time-range-select-label"
                                value={timeRange}
                                onChange={(e) => setTimeRange(e.target.value)}
                                label="Time Range"
                                sx={{width:'150px'}}
                            >
                                <MenuItem value="Week">Tuần</MenuItem>
                                <MenuItem value="Month">Tháng</MenuItem>
                                <MenuItem value="Year">Năm</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="h-[400px] w-full">
                        <Line
                            data={createCombinedChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false, // Disable default legend
                                    },
                                },
                                scales: {
                                    x: {
                                        title: {
                                            display: true,
                                            text: 'Thời Gian',
                                        },
                                    },
                                    y: {
                                        title: {
                                            display: true,
                                            text: 'Số Lượng',
                                        },
                                        beginAtZero: true,
                                    },
                                },
                            }}
                        />
                    </div>

                    {/* Custom legend */}
                    <div className="flex justify-center mt-4">
                        <div className="flex space-x-4">
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${visibleDatasets.comics ? '' : 'opacity-50'}`}
                                onClick={() => toggleDatasetVisibility('comics')}
                            >
                                <div className="w-4 h-4 bg-[rgba(75,192,192,1)] border"></div>
                                <span>Truyện</span>
                            </div>
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${visibleDatasets.orders ? '' : 'opacity-50'}`}
                                onClick={() => toggleDatasetVisibility('orders')}
                            >
                                <div className="w-4 h-4 bg-[rgba(192,75,192,1)] border"></div>
                                <span>Đơn hàng</span>
                            </div>
                            <div
                                className={`flex items-center space-x-2 cursor-pointer ${visibleDatasets.transactions ? '' : 'opacity-50'}`}
                                onClick={() => toggleDatasetVisibility('transactions')}
                            >
                                <div className="w-4 h-4 bg-[rgba(192,192,75,1)] border"></div>
                                <span>Giao dịch</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
