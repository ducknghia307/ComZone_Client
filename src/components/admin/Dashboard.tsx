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
import { Typography } from '@mui/material';

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

    //   useEffect(() => {
    //     const fetchData = async () => {
    //       try {
    //         const [comicsRes, ordersRes, transactionsRes] = await Promise.all([
    //           privateAxios.get('/comics'),
    //           privateAxios.get('/orders'),
    //           privateAxios.get('/transactions/all'),
    //         ]);

    //         setComicsData(comicsRes.data);
    //         setOrdersData(ordersRes.data);
    //         setTransactionsData(transactionsRes.data);
    //       } catch (error) {
    //         console.error('Error fetching data:', error);
    //       }
    //     };

    //     fetchData();
    //   }, []);

    useEffect(() => {
        // Simulate API call with mock data
        setComicsData(mockData.comics);
        setOrdersData(mockData.orders);
        setTransactionsData(mockData.transactions);
    }, []);

    const createCombinedChartData = () => {
        // Extract unique dates from all datasets
        const allDates = [...new Set([...mockData.comics, ...mockData.orders, ...mockData.transactions].map(item => item.date))];
        allDates.sort();

        const comicsCounts = allDates.map(date => {
            const found = comicsData.find(item => item.date === date);
            return found ? found.count : 0;
        });

        const ordersCounts = allDates.map(date => {
            const found = ordersData.find(item => item.date === date);
            return found ? found.count : 0;
        });

        const transactionsCounts = allDates.map(date => {
            const found = transactionsData.find(item => item.date === date);
            return found ? found.count : 0;
        });

        return {
            labels: allDates,
            datasets: [
                {
                    label: 'Comics',
                    data: comicsCounts,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    tension: 0.4,
                },
                {
                    label: 'Orders',
                    data: ordersCounts,
                    borderColor: 'rgba(192, 75, 192, 1)',
                    backgroundColor: 'rgba(192, 75, 192, 0.2)',
                    tension: 0.4,
                },
                {
                    label: 'Transactions',
                    data: transactionsCounts,
                    borderColor: 'rgba(192, 192, 75, 1)',
                    backgroundColor: 'rgba(192, 192, 75, 0.2)',
                    tension: 0.4,
                },
            ],
        };
    };

    return (
        // <div className="p-6">            
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-4">
                <h2 className="text-xl font-semibold REM">Biểu đồ tổng quan hoạt động</h2>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 REM">
                    <div className="space-y-2">
                        <p className="font-medium">Chú thích biểu đồ:</p>
                        <ul className="list-disc pl-6 space-y-1">
                            <li><span className="text-[rgb(75,192,192)] font-medium">Đường xanh lá</span>: Số lượng truyện tranh được thêm mới theo thời gian</li>
                            <li><span className="text-[rgb(192,75,192)] font-medium">Đường tím</span>: Số lượng đơn hàng được tạo</li>
                            <li><span className="text-[rgb(192,192,75)] font-medium">Đường vàng</span>: Số lượng giao dịch thành công</li>
                        </ul>
                    </div>
                </div>

                <div className="h-[400px] w-full">
                    <Line
                        data={createCombinedChartData()}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                                legend: {
                                    position: 'top',
                                    labels: {
                                        font: {
                                            size: 12,
                                            family:'REM'
                                        }
                                    }
                                },
                                tooltip: {
                                    mode: 'index',
                                    intersect: false,
                                }
                            },
                            scales: {
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Thời Gian',
                                        font: {
                                            weight: 'bold',
                                            family:'REM'
                                        }
                                    },
                                    grid: {
                                        display: true,
                                        drawBorder: true,
                                    }
                                },
                                y: {
                                    title: {
                                        display: true,
                                        text: 'Số Lượng',
                                        font: {
                                            weight: 'bold',
                                            family:'REM' 
                                        }
                                    },
                                    beginAtZero: true,
                                    grid: {
                                        display: true,
                                        drawBorder: true,
                                    }
                                },
                            },
                        }}
                    />
                </div>
            </div>
        </div>
        // </div>
    );
};

export default Dashboard;