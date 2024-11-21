import React, { useEffect, useState } from 'react';
import { AttachMoneyOutlined, PeopleOutline, BookOutlined, GavelOutlined, SwapHorizOutlined } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { privateAxios } from '../../middleware/axiosInstance';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
    const [totalComics, setTotalComics] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAuctions, setTotalAuctions] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [chartData, setChartData] = useState({});
    const [filter, setFilter] = useState('week');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const comicsResponse = await privateAxios.get('/comics');
                const usersResponse = await privateAxios.get('/users');
                const auctionsResponse = await privateAxios.get('/auction');
                const transactionsResponse = await privateAxios.get('/transactions/all');
                const ordersResponse = await privateAxios.get('/orders');

                setTotalComics(comicsResponse.data.length);
                setTotalUsers(usersResponse.data.length);
                setTotalAuctions(auctionsResponse.data.length);

                const successfulTransactions = transactionsResponse.data.filter(
                    (transaction) => transaction.status === "SUCCESSFUL"
                );
                const totalRevenue = successfulTransactions.reduce(
                    (sum, transaction) => sum + (transaction.amount || 0),
                    0
                );

                const successfulOrders = ordersResponse.data.filter(
                    (order) => order.status === "PENDING"
                );

                setTotalTransactions(totalRevenue);
                setTotalOrders(successfulOrders.length);

                // Process data for chart based on filter
                let dateRange;
                if (filter === 'week') {
                    dateRange = Array.from({ length: 7 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        return date.toLocaleDateString('vi-VN');
                    }).reverse();
                } else if (filter === 'month') {
                    dateRange = Array.from({ length: 30 }, (_, i) => {
                        const date = new Date();
                        date.setDate(date.getDate() - i);
                        return date.toLocaleDateString('vi-VN');
                    }).reverse();
                } else if (filter === 'year') {
                    dateRange = Array.from({ length: 12 }, (_, i) => {
                        const date = new Date();
                        date.setMonth(date.getMonth() - i);
                        return date.toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' });
                    }).reverse();
                }

                const comicsData = processDataForChart(comicsResponse.data, dateRange);
                const transactionsData = processDataForChart(transactionsResponse.data, dateRange);
                const ordersData = processDataForChart(ordersResponse.data, dateRange);

                setChartData({
                    labels: dateRange,
                    datasets: [
                        {
                            label: 'Comics',
                            data: comicsData,
                            borderColor: 'rgba(75, 192, 192, 1)',
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        },
                        {
                            label: 'Transactions',
                            data: transactionsData,
                            borderColor: 'rgba(153, 102, 255, 1)',
                            backgroundColor: 'rgba(153, 102, 255, 0.2)',
                        },
                        {
                            label: 'Orders',
                            data: ordersData,
                            borderColor: 'rgba(255, 159, 64, 1)',
                            backgroundColor: 'rgba(255, 159, 64, 0.2)',
                        },
                    ],
                });

            } catch (err) {
                setError(err.message);
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [filter]);

    const processDataForChart = (data, dateRange) => {
        const counts = dateRange.map(() => 0);
        data.forEach(item => {
            const createdAt = new Date(item.createdAt).toLocaleDateString('vi-VN');
            const dateStr = filter === 'year' ? new Date(item.createdAt).toLocaleDateString('vi-VN', { month: 'long', year: 'numeric' }) : createdAt;
            const dayIndex = dateRange.indexOf(dateStr);
            if (dayIndex !== -1) {
                counts[dayIndex]++;
            }
        });
        return counts;
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="pb-6">
            <div className="mb-6 mt-6">
                <div className="flex justify-between space-x-4">
                    {/* Các card tóm tắt thông tin */}
                    <div className="bg-blue-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <AttachMoneyOutlined className="text-blue-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Doanh thu</h3>
                            <p className="text-lg font-bold">{totalTransactions.toLocaleString()} đ</p>
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
                            <h3 className="font-semibold">Đơn hàng chờ xử lí</h3>
                            <p className="text-lg font-bold">{totalOrders}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Chart Section */}
            <div className="bg-white p-4 rounded-lg shadow-md">
                {/* Dòng chứa Data Overview và Filter */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold ml-2">Data Overview</h3>
                    <FormControl size="small">
                        <InputLabel id="filter-label">Filter</InputLabel>
                        <Select
                            labelId="filter-label"
                            id="filter"
                            value={filter}
                            label="Filter"
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <MenuItem value="week">Tuần</MenuItem>
                            <MenuItem value="month">Tháng</MenuItem>
                            <MenuItem value="year">Năm</MenuItem>
                        </Select>
                    </FormControl>
                </div>

                {/* Biểu đồ */}
                <Line data={chartData} options={{ plugins: { legend: { position: 'bottom' } } }} />
            </div>
        </div>

    );
};

export default Dashboard;