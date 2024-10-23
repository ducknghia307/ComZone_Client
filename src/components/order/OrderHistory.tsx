import React, { useEffect, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import "../ui/OrderHistory.css"
import ModalOrder from '../modal/ModalOrder';
import { privateAxios } from '../../middleware/axiosInstance';

interface Order {
    id: number;
    status: string;
    shopName: string;
    productName: string;
    price: string;
    imgUrl: string;
    total_price: string;
}

interface OrderHistoryProps {
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = () => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [openModal, setOpenModal] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchOrdersWithItems = async () => {
            try {
                const response = await privateAxios.get('/orders/user');
                const ordersData = response.data;

                // Lọc đơn hàng có order_type là NON_AUCTION
                const nonAuctionOrders = ordersData.filter(
                    (order: any) => order.order_type === 'NON_AUCTION'
                );

                // Fetch items for each order
                const ordersWithItems = await Promise.all(
                    nonAuctionOrders.map(async (order: any) => {
                        const itemsResponse = await privateAxios.get(
                            `/order-items/order/${order.id}`
                        );
                        const itemsData = itemsResponse.data;

                        return { ...order, items: itemsData }; // order với order items
                    })
                );

                setOrders(ordersWithItems);
                console.log('Orders with items:', ordersWithItems);
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };

        fetchOrdersWithItems();
    }, []);

    // const orders = [
    //     { id: 1, status: 'pending', shopName: 'Tạp Hóa Truyện', productName: 'Thám Tử Lừng Danh Conan - Tập 102', price: '29.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/c/o/conan_bia_tap_102.jpg' },
    //     { id: 2, status: 'packing', shopName: 'Abc Shop', productName: 'One Piece - Tập 101', price: '39.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/o/n/one_piece_-_tap_101_-_ban_bia_ao_bia_gap_bia_1__1.jpg?_gl=1*t4s1ch*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk3ODcuMzEuMC4xNTg5MzI2OQ..' },
    //     { id: 3, status: 'delivering', shopName: 'Abc Shop', productName: 'Naruto - Tập 50', price: '49.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/naruto_tap_50_thuy_lao_tu_chien_tai_ban_2022/2024_04_05_09_50_39_1-390x510.jpg?_gl=1*m22ao5*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk4MTIuNi4wLjE1ODkzMjY5' },
    //     { id: 4, status: 'delivered', shopName: 'Abc Shop', productName: 'Attack on Titan - Tập 24', price: '59.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/_24___attack_on_titan_24/2023_04_14_15_19_24_1-390x510.jpg' },
    //     { id: 5, status: 'completed', shopName: 'Abc Shop', productName: 'Doraemon - Tập 15', price: '19.000đ', imgUrl: 'https://cdn0.fahasa.com/media/flashmagazine/images/page_images/doraemon___chu_meo_may_den_tu_tuong_lai___tap_15_tai_ban_2023/2024_06_08_10_37_33_1-390x510.jpg?_gl=1*9asfdx*_gcl_aw*R0NMLjE3Mjc0MDg5MjAuQ2owS0NRandqTlMzQmhDaEFSSXNBT3hCTTZwTjY4WmNMSXBUQnczMVhwdjFZQTk4NWJKdTB5aE53T1QxbGZsUW1XM2hOMlBHcmZkMldzVWFBb2RBRUFMd193Y0I.*_gcl_au*MTkzMjkyODY0Mi4xNzI3NDA4NzU2*_ga*MTQ0NDAwMTIyMS4xNzI3NDA4NzU2*_ga_460L9JMC2G*MTcyODQ4OTc1OC4zNi4xLjE3Mjg0ODk4OTkuMi4wLjE1ODkzMjY5' },
    //     { id: 6, status: 'cancelled', shopName: 'Abc Shop', productName: 'Dragon Ball - Tập 24', price: '99.000đ', imgUrl: 'https://cdn0.fahasa.com/media/catalog/product/2/4/24_3b445abed5484fbca9eb0cf899682_1.jpg' },
    // ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return '#f28144';
            case 'PACKING':
                return '#fc65fc';
            case 'DELIVERING':
                return '#28bacf';
            case 'DELIVERED':
                return '#32CD32';
            case 'COMPLETED':
                return '#228B22';
            case 'CANCELLED':
                return '#FF4500';
            default:
                return '#000';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'Chờ xử lí';
            case 'PACKING':
                return 'Đang đóng gói';
            case 'DELIVERING':
                return 'Đang giao hàng';
            case 'DELIVERED':
                return 'Đã giao thành công';
            case 'COMPLETED':
                return 'Hoàn tất';
            case 'CANCELLED':
                return 'Bị hủy';
            default:
                return 'Tất cả';
        }
    };

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

    const filteredOrders = selectedStatus === 'all'
        ? orders
        : orders.filter(order => order.status === selectedStatus);

    return (
        <div>
            <div className="status-tabs">
                {['all', 'PENDING', 'PACKING', 'DELIVERING', 'DELIVERED', 'COMPLETED', 'CANCELLED'].map(status => (
                    <span
                        key={status}
                        className={`status-tab ${selectedStatus === status ? 'active' : ''}`}
                        onClick={() => setSelectedStatus(status)}
                    >
                        {getStatusText(status)}
                    </span>
                ))}
            </div>

            <div className='searchbar'>
                <SearchOutlinedIcon sx={{ color: '#8d8d8d', fontSize: '24px' }} />
                <TextField
                    variant="outlined"
                    fullWidth
                    size="small"
                    placeholder="Tìm kiếm theo tên Shop, ID đơn hàng hoặc Tên Sản phẩm"
                    InputProps={{
                        disableUnderline: true,
                        sx: { '& fieldset': { border: 'none' } },
                    }}
                />
            </div>

            <div className="purchase-history-content">
                {filteredOrders.map(order => (
                    <div key={order.id} className='status-detail' style={{ marginBottom: '20px', backgroundColor: '#fff', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)' }}>
                        <div className='status-content' style={{ padding: '10px 30px' }}>
                            <div className='status-content-detail'>
                                <StoreOutlinedIcon style={{ fontSize: 35 }} />
                                <Typography sx={{ fontSize: '20px' }}>{order.seller?.name || 'N/A'}</Typography>
                                <div style={{ marginLeft: '20px' }} className='chat-button'>
                                    <ChatOutlinedIcon />
                                    <Typography>Chat</Typography>
                                </div>
                                <div style={{ marginLeft: '10px' }} className='shop-button'>
                                    <StoreOutlinedIcon />
                                    <Typography>Xem Shop</Typography>
                                </div>
                            </div>
                            <Typography sx={{ margin: 'auto 0', paddingRight: '20px', color: getStatusColor(order.status), fontSize: '20px' }}>
                                {getStatusText(order.status)}
                            </Typography>
                        </div>

                        <div className='status-content1' style={{ padding: '20px 50px', display: 'flex', gap: '20px', flexDirection: 'column' }}>
                            {order.items.map((item: any) => (
                                <div
                                    key={item.id}
                                    style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '10px' }}
                                >
                                    {/* Hình ảnh sản phẩm */}
                                    <img
                                        src={item.comics.coverImage || 'https://via.placeholder.com/150'}
                                        alt={item.name}
                                        style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
                                    />

                                    {/* Tên và giá sản phẩm */}
                                    <div>
                                        <Typography sx={{ fontSize: '20px', fontWeight: 'bold' }}>{item.comics.title}</Typography>
                                        <Typography sx={{ fontSize: '18px' }}>x{item.quantity}</Typography>
                                    </div>

                                    <Typography sx={{ fontSize: '20px', color: '#000', marginLeft: 'auto' }}>
                                        <Typography sx={{ fontSize: '18px' }}>{Number(item.comics.price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</Typography>                                    </Typography>
                                </div>
                            ))}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '10px', backgroundColor: '#fff' }}>
                            <Typography sx={{ fontSize: '20px' }}>Thành tiền: </Typography>
                            <Typography sx={{ fontSize: '28px', color: '#000', }}>
                                {Number(order.total_price).toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                            </Typography>
                        </div>


                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0px 20px 20px 20px' }}>
                            {order.status === 'delivered' ? (
                                <>
                                    <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-start', gap: '10px' }}>
                                        <Button
                                            sx={{
                                                color: '#000',
                                                backgroundColor: '#fff',
                                                border: '1px solid black',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}
                                        >
                                            Xem Chi Tiết
                                        </Button>
                                    </div>

                                    <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                        <Button
                                            sx={{
                                                color: '#fff',
                                                backgroundColor: '#00BFA6',
                                                fontWeight: 'bold',
                                                fontSize: '16px'
                                            }}
                                            onClick={handleOpenModal}
                                        >
                                            Đã Nhận Được Hàng
                                        </Button>
                                        <Button
                                            sx={{
                                                color: '#fff',
                                                backgroundColor: '#FFB74D',
                                                fontWeight: 'bold',
                                                fontSize: '16px',
                                            }}
                                        >
                                            Chưa Nhận Được Hàng
                                        </Button>
                                    </div>
                                </>
                            ) : (
                                <div style={{ flex: '1 1 auto', display: 'flex', justifyContent: 'flex-end' }}>
                                    <Button
                                        sx={{
                                            color: '#000',
                                            backgroundColor: '#fff',
                                            border: '1px solid black',
                                            fontWeight: 'bold',
                                            fontSize: '16px',
                                            padding: '5px 20px'
                                        }}
                                    >
                                        Xem Chi Tiết
                                    </Button>
                                </div>
                            )}
                        </div>

                        {/* Modal */}
                        <ModalOrder open={openModal} onClose={handleCloseModal} />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderHistory;
