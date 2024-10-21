import React, { useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import StoreOutlinedIcon from '@mui/icons-material/StoreOutlined';
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import "../ui/OrderHistory.css"
import ModalOrder from '../modal/ModalOrder';

interface Order {
    id: number;
    status: string;
    shopName: string;
    productName: string;
    price: string;
    imgUrl: string;
}

interface OrderHistoryProps {
    orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [openModal, setOpenModal] = useState(false);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return '#f28144';
            case 'packing':
                return '#fc65fc';
            case 'delivering':
                return '#28bacf';
            case 'delivered':
                return '#32CD32';
            case 'completed':
                return '#228B22';
            case 'cancelled':
                return '#FF4500';
            default:
                return '#000';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Chờ xử lí';
            case 'packing':
                return 'Đang đóng gói';
            case 'delivering':
                return 'Đang giao hàng';
            case 'delivered':
                return 'Đã giao thành công';
            case 'completed':
                return 'Hoàn tất';
            case 'cancelled':
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
                {['all', 'pending', 'packing', 'delivering', 'delivered', 'completed', 'cancelled'].map(status => (
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
                                <Typography sx={{ fontSize: '20px' }}>{order.shopName}</Typography>
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

                        <div className='status-content1' style={{ padding: '20px 50px', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ display: 'flex', gap: '20px' }}>
                                <img style={{ width: '180px' }} src={order.imgUrl} alt={order.productName} />
                                <div>
                                    <Typography sx={{ fontSize: '24px' }}>{order.productName}</Typography>
                                    <Typography sx={{ fontSize: '20px' }}>x1</Typography>
                                </div>
                            </div>
                            <Typography sx={{ alignSelf: 'center', fontSize: '28px', color: '#000' }}>{order.price}</Typography>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '20px', gap: '10px', backgroundColor: '#fff' }}>
                            <Typography sx={{ fontSize: '20px' }}>Thành tiền: </Typography>
                            <Typography sx={{ fontSize: '28px', color: '#000' }}>{order.price}</Typography>


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
