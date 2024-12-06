import React, { useState, useEffect } from "react";
import {
    Box, Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Typography, styled, TablePagination, IconButton,
} from "@mui/material";
import { privateAxios } from "../../middleware/axiosInstance";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditSubscriptionPlanModal from "./EditSubscriptionPlanModal";
import AddSubscriptionPlanModal from "./AddSubscriptionPlanModal";

interface SubscriptionPlan {
    id: string;
    price: number;
    duration: number;
    offeredResource: number;
    auctionTime: number;
    sellTime: number;
}

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: '#c66a7a',
        color: '#fff',
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
        color: '#000',
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: '#fff',
    '&:nth-of-type(odd)': {
        backgroundColor: '#ffe3d842',
    },
}));

const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
    backgroundColor: '#fff',
    color: '#000',
}));
const SubscriptionPlans: React.FC = () => {
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
    // const [addModalOpen, setAddModalOpen] = useState(false);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await privateAxios.get('/seller-subs-plans');
                setPlans(response.data);
                console.log("plans", response.data);

            } catch (error) {
                console.error('Error fetching subscription plans:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPlans();
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClick = (plan: SubscriptionPlan) => {
        setSelectedPlan(plan);
        setEditModalOpen(true);
    };

    const handleUpdatePlan = (updatedPlan: SubscriptionPlan) => {
        setPlans(prevPlans =>
            prevPlans.map(plan =>
                plan.id === updatedPlan.id ? updatedPlan : plan
            )
        );
    };

    const filteredPlans = plans.filter((plan) =>
        String(plan.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        String(plan.price).toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedPlans = filteredPlans.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    return (
        <Box sx={{ paddingBottom: '40px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm..."
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
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Box>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM' }}>
                    Quản lý gói đăng ký
                </Typography>

                {/* <Button
                    variant="contained"
                    sx={{
                        backgroundColor: '#c66a7a',
                        color: '#fff',
                        textTransform: 'none',
                        fontWeight: 'bold',
                        borderRadius: 2,
                        '&:hover': {
                            backgroundColor: '#a3566a',
                        },
                    }}
                    onClick={() => setAddModalOpen(true)}
                >
                    Thêm Gói Đăng Ký
                </Button> */}
            </div>

            <Paper>
                <TableContainer style={{ marginTop: '20px', }}>
                    <Table sx={{ minWidth: 700 }} aria-label="subscription plans table">
                        <TableHead>
                            <TableRow >
                                <StyledTableCell sx={{ fontFamily: 'REM' }}>ID</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Giá (VND)</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Giới Hạn Lượt Bán</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Thời Hạn (Tháng)</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Bán đấu giá (Lần)</StyledTableCell>
                                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Chỉnh Sửa</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        Loading...
                                    </TableCell>
                                </TableRow>
                            ) : (
                                paginatedPlans.map((plan) => (
                                    <StyledTableRow key={plan.id}>
                                        <StyledTableCell sx={{ fontFamily: 'REM' }}>{plan.id}</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>{plan.price.toLocaleString()}</StyledTableCell>
                                        <StyledTableCell sx={{ fontFamily: 'REM' }}>{plan.sellTime}</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>{plan.duration}</StyledTableCell>
                                        <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>{plan.auctionTime}</StyledTableCell>
                                        <StyledTableCell align="right" >
                                            <IconButton color="error" onClick={() => handleEditClick(plan)}>
                                                <EditOutlinedIcon />
                                            </IconButton>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <StyledTablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                    count={filteredPlans.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {selectedPlan && (
                <EditSubscriptionPlanModal
                    open={editModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    plan={selectedPlan}
                    onUpdatePlan={handleUpdatePlan}
                />
            )}
            {/* {addModalOpen && (
                <AddSubscriptionPlanModal
                    open={addModalOpen}
                    onClose={() => setAddModalOpen(false)}
                    onAddPlan={(newPlan) => setPlans((prevPlans) => [...prevPlans, newPlan])}
                />
            )} */}

        </Box>
    );
};

export default SubscriptionPlans;
