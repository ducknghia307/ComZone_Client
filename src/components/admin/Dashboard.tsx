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

const Dashboard = () => {
    const [comicsData, setComicsData] = useState([]);
    const [ordersData, setOrdersData] = useState([]);
    const [transactionsData, setTransactionsData] = useState([]);
    const [totalComics, setTotalComics] = useState(0);
    const [totalUsers, setTotalUsers] = useState(0);
    const [totalAuctions, setTotalAuctions] = useState(0);
    const [totalTransactions, setTotalTransactions] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [visibleDatasets, setVisibleDatasets] = useState({
        comics: true,
        orders: true,
        transactions: true,
    });
    const [timeRange, setTimeRange] = useState('Week');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const comicsResponse = await privateAxios.get('/comics');
                const usersResponse = await privateAxios.get('/users');
                const auctionsResponse = await privateAxios.get('/auction');
                const transactionsResponse = await privateAxios.get('/transactions/all');
                const ordersResponse = await privateAxios.get('/orders');

                // Calculate totals
                setTotalComics(comicsResponse.data.length);
                setTotalUsers(usersResponse.data.length);
                setTotalAuctions(auctionsResponse.data.length);

                // Filter and calculate pending transactions
                const successfulTransactions = transactionsResponse.data.filter(
                    (transaction) => transaction.status === "PENDING"
                );
                const totalRevenue = successfulTransactions.reduce(
                    (sum, transaction) => sum + (transaction.amount || 0),
                    0
                );

                // Filter and calculate pending orders
                const successfulOrders = ordersResponse.data.filter(
                    (order) => order.status === "PENDING"
                );

                // Process data for the chart
                const processedComicsData = processTimelineData(comicsResponse.data);
                const processedTransactionsData = processTimelineData(successfulTransactions);
                const processedOrdersData = processTimelineData(successfulOrders);

                // Set data to state
                setComicsData(processedComicsData);
                setTransactionsData(processedTransactionsData);
                setOrdersData(processedOrdersData);
                setTotalTransactions(totalRevenue);
                setTotalOrders(successfulOrders.length);

            } catch (err) {
                setError(err.message);
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const processTimelineData = (data) => {
        if (!data || data.length === 0) return [];

        const sortedData = [...data].sort((a, b) =>
            new Date(a.createdAt) - new Date(b.createdAt)
        );

        const cumulativeTotals = new Map();
        let runningTotal = 0;

        sortedData.forEach(item => {
            const date = new Date(item.createdAt).toISOString().split('T')[0];
            runningTotal += 1;
            cumulativeTotals.set(date, runningTotal);
        });

        const result = [];
        const startDate = new Date(sortedData[0]?.createdAt);
        const endDate = new Date(sortedData[sortedData.length - 1]?.createdAt);

        let currentDate = new Date(startDate);
        let lastKnownTotal = 0;

        while (currentDate <= endDate) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const total = cumulativeTotals.get(dateStr) || lastKnownTotal;
            lastKnownTotal = total;

            result.push({
                date: dateStr,
                count: total,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    };

    const aggregateByMonth = (data) => {
        if (!data || data.length === 0) return [];
    
        const monthlyTotals = {};
        data.forEach(({ date, count }) => {
            const month = date.slice(0, 7); // Extract "YYYY-MM"
            monthlyTotals[month] = (monthlyTotals[month] || 0) + count;
        });
    
        return Object.entries(monthlyTotals).map(([month, total]) => ({
            date: month, // Use "YYYY-MM" as the label
            count: total, // Aggregated total for the month
        }));
    };
    

    const filterDataByTimeRange = (data) => {
        if (!data || data.length === 0) return [];

        const now = new Date();
        let startDate;

        if (timeRange === 'Week') {
            startDate = new Date(now);
            startDate.setDate(now.getDate() - 6);
        } else if (timeRange === 'Month') {
            startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        } else if (timeRange === 'Year') {
            return aggregateByMonth(data);
        }

        const filteredData = data.filter(item => new Date(item.date) >= startDate);
        const result = [];
        let currentDate = new Date(startDate);
        let lastKnownTotal = 0;

        while (currentDate <= now) {
            const dateStr = currentDate.toISOString().split('T')[0];
            const foundItem = filteredData.find(item => item.date === dateStr);
            const total = foundItem ? foundItem.count : lastKnownTotal;
            lastKnownTotal = total;

            result.push({
                date: dateStr,
                count: total,
            });

            currentDate.setDate(currentDate.getDate() + 1);
        }

        return result;
    };

    const createCombinedChartData = () => {
        const filteredComics = filterDataByTimeRange(comicsData);
        const filteredOrders = filterDataByTimeRange(ordersData);
        const filteredTransactions = filterDataByTimeRange(transactionsData);

        const allDates = [...new Set([
            ...filteredComics.map(item => item.date),
            ...filteredOrders.map(item => item.date),
            ...filteredTransactions.map(item => item.date)
        ])].sort();

        return {
            labels: allDates,
            datasets: [
                visibleDatasets.comics && {
                    label: 'Truyện',
                    data: allDates.map(date => {
                        const found = filteredComics.find(item => item.date === date);
                        return found ? found.count : 0;
                    }),
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0,
                },
                visibleDatasets.orders && {
                    label: 'Đơn hàng',
                    data: allDates.map(date => {
                        const found = filteredOrders.find(item => item.date === date);
                        return found ? found.count : 0;
                    }),
                    borderColor: 'rgba(192, 75, 192, 1)',
                    backgroundColor: 'rgba(192, 75, 192, 0.2)',
                    tension: 0,
                },
                visibleDatasets.transactions && {
                    label: 'Giao dịch',
                    data: allDates.map(date => {
                        const found = filteredTransactions.find(item => item.date === date);
                        return found ? found.count : 0;
                    }),
                    borderColor: 'rgba(192, 192, 75, 1)',
                    backgroundColor: 'rgba(192, 192, 75, 0.2)',
                    tension: 0,
                },
            ].filter(Boolean),
        };
    };

    const toggleDatasetVisibility = (key) => {
        setVisibleDatasets(prev => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center">Error: {error}</div>;
    }

    return (
        <div className="pb-6">
            {/* Summary Cards Section */}
            <div className="mb-6 mt-6">
                <div className="flex justify-between space-x-4">
                    <div className="bg-blue-100 p-4 rounded-lg shadow-md w-full flex items-center space-x-4">
                        <AttachMoneyOutlined className="text-blue-600 text-3xl" />
                        <div>
                            <h3 className="font-semibold">Doanh thu</h3>
                            <p className="text-lg font-bold">{totalTransactions.toLocaleString()} VND</p>
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
                                className="w-36"
                            >
                                <MenuItem value="Week">Tuần</MenuItem>
                                <MenuItem value="Month">Tháng</MenuItem>
                                <MenuItem value="Year">Năm</MenuItem>
                            </Select>
                        </FormControl>
                    </div>

                    <div className="h-96 w-full">
                        <Line
                            data={createCombinedChartData()}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: {
                                        display: false,
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
