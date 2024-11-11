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
import { IconButton, Typography } from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import OrderDetailMod from './OrderDetailMod';

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
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  // '&:nth-of-type(odd)': {
  //   backgroundColor: theme.palette.action.hover,
  // },
  '&:last-child td, &:last-child th': {
    border: 0,
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
    <div>
      <Typography variant="h5" sx={{ marginBottom: '20px', fontWeight: 'bold' }}>
        Quản lý đơn hàng
      </Typography>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Mã Vận Đơn (nếu có)</StyledTableCell>
                <StyledTableCell align="left">Người Đặt</StyledTableCell>
                <StyledTableCell align="left">Người Bán</StyledTableCell>
                <StyledTableCell align="right">Tổng Tiền</StyledTableCell>
                <StyledTableCell align="right">Phương Thức Thanh Toán</StyledTableCell>
                <StyledTableCell align="right">Trạng Thái</StyledTableCell>
                <StyledTableCell align="right">Chi Tiết</StyledTableCell>
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
                      <StyledTableCell rowSpan={order.items.length + 1} component="th" scope="row">
                        {order.deliveryTrackingCode}
                      </StyledTableCell>
                      <StyledTableCell rowSpan={order.items.length + 1} align="left">
                        {order.toName}
                      </StyledTableCell>
                    </StyledTableRow>
                    {order.items.map((item, index) => (
                      <StyledTableRow key={index}>
                        <StyledTableCell align="left">
                          {order.fromName}
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          <span>{Number(order.totalPrice).toLocaleString("vi-VN")} đ</span>
                        </StyledTableCell>
                        <StyledTableCell align="right">
                          {order.paymentMethod}
                        </StyledTableCell>
                        <StyledTableCell align="right">
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