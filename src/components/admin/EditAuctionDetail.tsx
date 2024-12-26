import React, { useState, useEffect } from "react";
import {
    Box, Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Typography, styled, TablePagination, IconButton,
} from "@mui/material";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EditSubscriptionPlanModal from "./EditSubscriptionPlanModal";
import AddSubscriptionPlanModal from "./AddSubscriptionPlanModal";
import EditAuctionConfigModal from "./EditAuctionConfigModal";

interface AuctionConfig {
    id: string;
    priceStepConfig: number;
    depositAmountConfig: number;
    maxPriceConfig: number;
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
const AdminAuction: React.FC = () => {
    const [auctions, setAuctions] = useState<AuctionConfig[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [selectedAuction, setSelectedAuction] = useState<AuctionConfig | null>(null);

    const [config, setConfig] = useState({
        id: "",
        priceStepConfig: 0,
        depositAmountConfig: 0,
        maxPriceConfig: 0,
    });

    useEffect(() => {
        publicAxios
            .get("/auction-config")
            .then((response) => {
                console.log("123", response);

                setConfig({
                    id: response.data[0].id,
                    priceStepConfig: response.data[0].priceStepConfig,
                    depositAmountConfig: response.data[0].depositAmountConfig,
                    maxPriceConfig: response.data[0].maxPriceConfig,
                });
            })
            .catch((error) => console.error("Error fetching config:", error));
    }, []);

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleEditClick = (config: AuctionConfig) => {
        setSelectedAuction(config);
        setEditModalOpen(true);
    };

    const handleUpdateConfig = (updatedConfig: AuctionConfig) => {
        setConfig(updatedConfig);
        setAuctions((prevAuctions) =>
            prevAuctions.map((config) =>
                config.id === updatedConfig.id ? updatedConfig : config
            )
        );
    };        

    return (
        <Box sx={{ paddingBottom: '40px' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <TextField
                    variant="outlined"
                    placeholder="Tìm kiếm theo ID hoặc giá..."
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
                    Quản lý đấu giá
                </Typography>
            </div>

            <Paper>
                <TableContainer style={{ marginTop: '20px', }}>
                    <Table sx={{ minWidth: 700 }} aria-label="subscription plans table">
                        <TableHead>
                            <TableRow >
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Bước Giá</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Mức Cọc</StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Giá Mua Ngay</StyledTableCell>
                                <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Chỉnh Sửa</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            <StyledTableRow>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>
                                    {config.maxPriceConfig} %
                                </StyledTableCell>
                                <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>{config.depositAmountConfig} %</StyledTableCell>
                                <StyledTableCell sx={{ fontFamily: 'REM' }}>{config.priceStepConfig} %</StyledTableCell>
                                <StyledTableCell align="right">
                                    <IconButton color="error" onClick={() => handleEditClick(config)}>
                                        <EditOutlinedIcon />
                                    </IconButton>
                                </StyledTableCell>
                            </StyledTableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
                {/* <StyledTablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                    }}
                    count={auctions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                /> */}

                {editModalOpen && selectedAuction && (
                    <EditAuctionConfigModal
                        open={editModalOpen}
                        onClose={() => setEditModalOpen(false)}
                        config={selectedAuction}
                        onUpdateConfig={handleUpdateConfig}
                    />
                )}
            </Paper>
        </Box>
    );
};

export default AdminAuction;
