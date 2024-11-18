import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import TablePagination from '@mui/material/TablePagination';
import { privateAxios } from '../../middleware/axiosInstance';
import { Box, IconButton, InputAdornment, TextField, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OrderDetailMod from './OrderDetailMod';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

interface Order {
  id: number;
  customerName: string;
  product: string;
  quantity: number;
  totalAmount: number;
  status: string;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#c66a7a',
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#fff', // Background color for rows
  '&:nth-of-type(odd)': {
    backgroundColor: '#ffe3d842', // Alternate rows with light pink shade
  },
}));

const ManageOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);


  const openOrderDetail = (orderId: string) => {
    setSelectedOrderId(orderId);
  };

  const closeOrderDetail = () => {
    setSelectedOrderId(null);
  };

  useEffect(() => {
    const fetchOrdersWithItems = async () => {
      try {
        const response = await privateAxios.get("/orders");
        const ordersData = response.data;

        // Check if ordersData is an array and has expected data
        if (!Array.isArray(ordersData) || ordersData.length === 0) {
          console.error("No orders data or unexpected format:", ordersData);
          setLoading(false);
          return;
        }

        const ordersWithItems = await Promise.all(
          ordersData.map(async (order: any) => {
            try {
              const itemsResponse = await privateAxios.get(
                `/order-items/order/${order.id}`
              );
              const itemsData = itemsResponse.data;
              return { ...order, items: itemsData };
            } catch (error) {
              console.error(`Error fetching items for order ${order.id}:`, error);
              return { ...order, items: [] };
            }
          })
        );

        setOrders(ordersWithItems);
        console.log("Orders with items:", ordersWithItems);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        // Ensure loading is set to false after fetch completes or if an error occurs
        setLoading(false);
      }
    };

    fetchOrdersWithItems();
  }, []);


  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusUpdate = (orderId: string, newStatus: string, deliveryStatus?: string) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId
          ? {
            ...order,
            status: newStatus,
            deliveryStatus: deliveryStatus || order.deliveryStatus
          }
          : order
      )
    );
  };

  const getStatusColor = (status: string, deliveryStatus?: string) => {
    if (status === 'PACKAGING' && deliveryStatus === 'ready_to_pick') {
      return {
        color: '#7c4af2',
        backgroundColor: '#e0d4fc',
        borderRadius: '8px',
        padding: '8px 20px',
        fontWeight: 'bold',
        display: 'inline-block',
      };
    }
    switch (status) {
      case "PENDING":
        return {
          color: '#f89b28',
          backgroundColor: '#fff2c9',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "PACKAGING":
        return {
          color: '#ff6b1c',
          backgroundColor: '#ffe8db',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "DELIVERING":
        return {
          color: '#52a7bf',
          backgroundColor: '#daf4ff',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "DELIVERED":
        return {
          color: '#ffffff',
          backgroundColor: '#4CAF50',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "COMPLETED":
        return {
          color: '#fef6c7',
          backgroundColor: '#395f18',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      case "CANCELED":
        return {
          color: '#e91e63',
          backgroundColor: '#fce4ec',
          borderRadius: '8px',
          padding: '8px 20px',
          fontWeight: 'bold',
          display: 'inline-block',
          fontFamily: "REM"
        };
      default:
        return "#000";
    }
  };

  const getStatusText = (status: string, deliveryStatus?: string) => {
    if (status === 'PACKAGING' && deliveryStatus === 'ready_to_pick') {
      return 'Hoàn tất đóng gói';
    }
    switch (status) {
      case "PENDING":
        return "Chờ xử lí";
      case "PACKAGING":
        return "Đang đóng gói";
      case "DELIVERING":
        return "Đang giao hàng";
      case "DELIVERED":
        return "Đã giao thành công";
      case "COMPLETED":
        return "Hoàn tất";
      case "CANCELED":
        return "Bị hủy";
      default:
        return "Tất cả";
    }
  };

  return (
    <div style={{paddingBottom:'40px'}}>
    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
      {/* Search Box */}
      <TextField
        variant="outlined"
        placeholder="Tìm kiếm..."
        // value={searchTerm}
        // onChange={handleSearch}
        size="small"
        sx={{ backgroundColor: '#c66a7a', borderRadius: '4px', color: '#fff', width: '300px' }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon sx={{ color: '#fff' }} />
            </InputAdornment>
          ),
          style: { color: '#fff' },
        }}
      />
    </Box>
    <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold', fontFamily: 'REM', color:'#71002b' }}>
        Quản lý đơn hàng
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell style={{ fontFamily: 'REM' }}>Mã Vận Đơn (nếu có)</StyledTableCell>
                <StyledTableCell align="left" style={{ fontFamily: 'REM' }}>Người Đặt</StyledTableCell>
                <StyledTableCell align="left" style={{ fontFamily: 'REM' }}>Người Bán</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Tổng Tiền</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Phương Thức Thanh Toán</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Trạng Thái</StyledTableCell>
                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Chi Tiết</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Loading...
                  </TableCell>
                </TableRow>
              ) : (
                orders.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((order) => (
                  <React.Fragment key={order.id}>
                    <StyledTableRow>
                      <StyledTableCell style={{ fontFamily: 'REM' }} rowSpan={order.items.length + 1} component="th" scope="row">
                        {order.delivery.deliveryTrackingCode}
                      </StyledTableCell>
                      <StyledTableCell style={{ fontFamily: 'REM' }} rowSpan={order.items.length + 1} align="left">
                        {order.delivery.to.name}
                      </StyledTableCell>
                    </StyledTableRow>
                    {order.items.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left" style={{ fontFamily: 'REM' }}>
                          {order.delivery.from.name}
                        </StyledTableCell>
                        <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                          {/* <span>{Number(order.totalPrice).toLocaleString("vi-VN")} đ</span> */}
                          <span>{order.totalPrice} đ</span>
                        </StyledTableCell>
                        <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                          {order.paymentMethod}
                        </StyledTableCell>
                        <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>
                          <span style={getStatusColor(order.status, order.deliveryStatus)}>
                            {getStatusText(order.status, order.deliveryStatus)}
                          </span>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <IconButton color="default" onClick={() => openOrderDetail(order.id)}>
                            <InfoOutlinedIcon />
                          </IconButton>
                        </StyledTableCell>

                      </StyledTableRow>
                    ))}
                  </React.Fragment>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={orders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {selectedOrderId && (
        <OrderDetailMod
          open={Boolean(selectedOrderId)}
          onClose={closeOrderDetail}
          orderId={selectedOrderId}
          onStatusUpdate={handleStatusUpdate}
          order={orders.find(order => order.id === selectedOrderId)}
        />
      )}
    </div>
  );
};

export default ManageOrders;