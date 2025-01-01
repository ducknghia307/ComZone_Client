// import React, { useState, useEffect } from "react";
// import {
//     Box, Button, Table, TableBody, TableContainer, TableHead, TableRow, Paper, TextField, InputAdornment, Typography, styled, TablePagination, IconButton,
// } from "@mui/material";
// import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
// import TableCell, { tableCellClasses } from '@mui/material/TableCell';
// import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
// import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
// import EditSubscriptionPlanModal from "./EditSubscriptionPlanModal";
// import AddSubscriptionPlanModal from "./AddSubscriptionPlanModal";
// import EditAuctionConfigModal from "./EditAuctionConfigModal";

// interface AuctionConfig {
//     id: string;
//     priceStepConfig: number;
//     depositAmountConfig: number;
//     maxPriceConfig: number;
// }

// const StyledTableCell = styled(TableCell)(({ theme }) => ({
//     [`&.${tableCellClasses.head}`]: {
//         backgroundColor: '#c66a7a',
//         color: '#fff',
//         fontWeight: 'bold',
//         fontSize: '1rem',
//     },
//     [`&.${tableCellClasses.body}`]: {
//         fontSize: 14,
//         color: '#000',
//     },
// }));

// const StyledTableRow = styled(TableRow)(({ theme }) => ({
//     backgroundColor: '#fff',
//     '&:nth-of-type(odd)': {
//         backgroundColor: '#ffe3d842',
//     },
// }));

// const StyledTablePagination = styled(TablePagination)(({ theme }) => ({
//     backgroundColor: '#fff',
//     color: '#000',
// }));
// const AdminAuction: React.FC = () => {
//     const [auctions, setAuctions] = useState<AuctionConfig[]>([]);
//     const [loading, setLoading] = useState(true);
//     const [page, setPage] = useState(0);
//     const [rowsPerPage, setRowsPerPage] = useState(5);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [selectedAuction, setSelectedAuction] = useState<AuctionConfig | null>(null);

//     const [config, setConfig] = useState({
//         id: "",
//         priceStepConfig: 0,
//         depositAmountConfig: 0,
//         maxPriceConfig: 0,
//     });

//     useEffect(() => {
//         publicAxios
//             .get("/auction-config")
//             .then((response) => {
//                 console.log("123", response);

//                 setConfig({
//                     id: response.data[0].id,
//                     priceStepConfig: response.data[0].priceStepConfig,
//                     depositAmountConfig: response.data[0].depositAmountConfig,
//                     maxPriceConfig: response.data[0].maxPriceConfig,
//                 });
//             })
//             .catch((error) => console.error("Error fetching config:", error));
//     }, []);

//     const handleChangePage = (event: unknown, newPage: number) => {
//         setPage(newPage);
//     };

//     const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//         setRowsPerPage(parseInt(event.target.value, 10));
//         setPage(0);
//     };

//     const handleEditClick = (config: AuctionConfig) => {
//         setSelectedAuction(config);
//         setEditModalOpen(true);
//     };

//     const handleUpdateConfig = (updatedConfig: AuctionConfig) => {
//         setConfig(updatedConfig);
//         setAuctions((prevAuctions) =>
//             prevAuctions.map((config) =>
//                 config.id === updatedConfig.id ? updatedConfig : config
//             )
//         );
//     };        

//     return (
//         <Box sx={{ paddingBottom: '40px' }}>
//             {/* <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
//                 <TextField
//                     variant="outlined"
//                     placeholder="Tìm kiếm theo ID hoặc giá..."
//                     size="small"
//                     sx={{ backgroundColor: '#c66a7a', borderRadius: '4px', color: '#fff', width: '300px' }}
//                     InputProps={{
//                         startAdornment: (
//                             <InputAdornment position="start">
//                                 <SearchOutlinedIcon sx={{ color: '#fff' }} />
//                             </InputAdornment>
//                         ),
//                         style: { color: '#fff' },
//                     }}
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//             </Box> */}

//             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                 <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#71002b', fontFamily: 'REM' }}>
//                     Quản lý đấu giá
//                 </Typography>
//             </div>

//             <Paper>
//                 <TableContainer style={{ marginTop: '20px', }}>
//                     <Table sx={{ minWidth: 700 }} aria-label="subscription plans table">
//                         <TableHead>
//                             <TableRow >
//                                 <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Bước Giá</StyledTableCell>
//                                 <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Mức Cọc</StyledTableCell>
//                                 <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>Giá Mua Ngay</StyledTableCell>
//                                 <StyledTableCell align="right" style={{ fontFamily: 'REM' }}>Chỉnh Sửa</StyledTableCell>
//                             </TableRow>
//                         </TableHead>
//                         <TableBody>
//                             <StyledTableRow>
//                                 <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>
//                                     {config.priceStepConfig} %
//                                 </StyledTableCell>
//                                 <StyledTableCell align="center" sx={{ fontFamily: 'REM' }}>{config.depositAmountConfig} %</StyledTableCell>
//                                 <StyledTableCell sx={{ fontFamily: 'REM' }}>{config.maxPriceConfig} lần</StyledTableCell>
//                                 <StyledTableCell align="right">
//                                     <IconButton color="error" onClick={() => handleEditClick(config)}>
//                                         <EditOutlinedIcon />
//                                     </IconButton>
//                                 </StyledTableCell>
//                             </StyledTableRow>
//                         </TableBody>
//                     </Table>
//                 </TableContainer>
//                 {/* <StyledTablePagination
//                     rowsPerPageOptions={[5, 10, 15]}
//                     sx={{
//                         display: 'flex',
//                         flexDirection: 'row',
//                         alignItems: 'center',
//                         justifyContent: 'flex-end',
//                     }}
//                     count={auctions.length}
//                     rowsPerPage={rowsPerPage}
//                     page={page}
//                     onPageChange={handleChangePage}
//                     onRowsPerPageChange={handleChangeRowsPerPage}
//                 /> */}

//                 {editModalOpen && selectedAuction && (
//                     <EditAuctionConfigModal
//                         open={editModalOpen}
//                         onClose={() => setEditModalOpen(false)}
//                         config={selectedAuction}
//                         onUpdateConfig={handleUpdateConfig}
//                     />
//                 )}
//             </Paper>
//         </Box>
//     );
// };

// export default AdminAuction;
import React, { useState, useEffect } from "react";
import { Button, Input, Typography, Form, notification, Card } from "antd";
import { publicAxios } from "../../middleware/axiosInstance";

const AdminAuction: React.FC = () => {
    const [config, setConfig] = useState({
        id: "",
        priceStepConfig: 0,
        depositAmountConfig: 0,
        maxPriceConfig: 0,
    });
    const [originalConfig, setOriginalConfig] = useState({
        id: "",
        priceStepConfig: 0,
        depositAmountConfig: 0,
        maxPriceConfig: 0,
    });
    const [isEdited, setIsEdited] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        publicAxios
            .get("/auction-config")
            .then((response) => {
                const fetchedConfig = response.data[0];
                setConfig({
                    id: fetchedConfig.id,
                    priceStepConfig: fetchedConfig.priceStepConfig,
                    depositAmountConfig: fetchedConfig.depositAmountConfig,
                    maxPriceConfig: fetchedConfig.maxPriceConfig,
                });
                setOriginalConfig({
                    id: fetchedConfig.id,
                    priceStepConfig: fetchedConfig.priceStepConfig,
                    depositAmountConfig: fetchedConfig.depositAmountConfig,
                    maxPriceConfig: fetchedConfig.maxPriceConfig,
                });
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching config:", error);
                notification.error({
                    message: "Lỗi",
                    description: "Không thể tải cấu hình đấu giá. Vui lòng thử lại sau!",
                });
                setLoading(false);
            });
    }, []);

    const handleInputChange = (field: string, value: string | number) => {
        const updatedConfig = { ...config, [field]: value };
        setConfig(updatedConfig);

        const isConfigEdited = JSON.stringify(updatedConfig) !== JSON.stringify(originalConfig);
        setIsEdited(isConfigEdited);
    };

    const handleSave = () => {
        publicAxios
            .put(`/auction-config/${config.id}`, config)
            .then((response) => {
                notification.success({
                    message: "Thành công",
                    description: "Cấu hình đã được cập nhật thành công!",
                });
                setOriginalConfig(config);
                setIsEdited(false);
            })
            .catch((error) => {
                console.error("Error updating config:", error);
                notification.error({
                    message: "Lỗi",
                    description: "Cập nhật thất bại. Vui lòng thử lại!",
                });
            });
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <Card className="max-w-lg mx-auto shadow-md rounded-lg border border-gray-200">
                <Typography.Title level={4} style={{ color: "#71002b" }} className="text-center mb-11 text-[#71002b]">
                    Cài đặt thông số đấu giá
                </Typography.Title>
                <Form layout="vertical">
                    <Form.Item label="Bước Giá (%)">
                        <Input
                            type="number"
                            value={config.priceStepConfig}
                            onChange={(e) =>
                                handleInputChange("priceStepConfig", Number(e.target.value))
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Mức Cọc (%)">
                        <Input
                            type="number"
                            value={config.depositAmountConfig}
                            onChange={(e) =>
                                handleInputChange("depositAmountConfig", Number(e.target.value))
                            }
                        />
                    </Form.Item>
                    <Form.Item label="Giá Mua Ngay (Lần)">
                        <Input
                            type="number"
                            value={config.maxPriceConfig}
                            onChange={(e) =>
                                handleInputChange("maxPriceConfig", Number(e.target.value))
                            }
                        />
                    </Form.Item>
                    <div className="flex justify-center">
                        <Button
                            type="primary"
                            onClick={handleSave}
                            disabled={!isEdited} // Disable button if no field is edited
                            style={{
                                backgroundColor: isEdited ? "#71002b" : "#d3d3d3",
                                borderColor: isEdited ? "#71002b" : "#d3d3d3",
                                cursor: isEdited ? "pointer" : "not-allowed",
                            }}
                            className="w-full h-8"
                        >
                            Lưu Cấu Hình
                        </Button>
                    </div>
                </Form>
            </Card>
        </div>
    );
};

export default AdminAuction;