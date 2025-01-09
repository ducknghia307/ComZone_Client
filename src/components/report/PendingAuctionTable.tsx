import React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { Box, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { AuctionRequest } from "../../common/base.interface";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: "#c66a7a",
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    backgroundColor: "#fff",
    "&:nth-of-type(odd)": {
        backgroundColor: "#ffe3d842",
    },
    "&:last-child td, &:last-child th": {
        border: 0,
    },
}));

const truncateText = (text: string | undefined, maxLength: number): string => {
    if (!text) {
        return ""; // Return an empty string if text is undefined or null
    }
    return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
};

const getStatusChipStyles = (status: string) => {
    switch (status) {
        case "SUCCESSFUL":
            return { color: "#4caf50", backgroundColor: "#e8f5e9", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "UPCOMING":
            return { color: "#6226EF", backgroundColor: "#EDE7F6", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "COMPLETED":
            return { color: "#009688", backgroundColor: "#e0f2f1", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "PROCESSING":
            return { color: "#ff9800", backgroundColor: "#fff3e0", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "ONGOING":
            return { color: "#2196f3", backgroundColor: "#e3f2fd", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "FAILED":
            return { color: "#e91e63", backgroundColor: "#fce4ec", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "REJECTED":
            return { color: "#f44336", backgroundColor: "#ffebee", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "PENDING":
            return { color: "#a64dff", backgroundColor: "#f2e6ff", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "CANCELED":
            return { color: "#757575", backgroundColor: "#eeeeee", padding: "8px 20px", borderRadius: "8px", fontWeight: "bold", display: "inline-block", };
        case "APPROVED":
            return { color: "#3f51b5", backgroundColor: "#e8eaf6", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block" };
    }
};

const translateStatus = (status: string) => {
    switch (status) {
        case "SUCCESSFUL":
            return "Thành công";
        case "COMPLETED":
            return "Hoàn thành";
        case "PENDING":
            return "Chờ duyệt";
        case "UPCOMING":
            return "Sắp diễn ra";
        case "PROCESSING":
            return "Đang xử lí";
        case "ONGOING":
            return "Đang diễn ra";
        case "FAILED":
            return "Thất bại";
        case "REJECTED":
            return "Bị từ chối";
        case "CANCELED":
            return "Đã hủy";
        case "APPROVED":
            return "Đã duyệt";
        default:
            return status;
    }
};

const PendingAuctionTable: React.FC<{
    pendingAuctions: AuctionRequest[];
    loading: boolean;
    page: number;
    rowsPerPage: number;
    handleChangePage: (event: unknown, newPage: number) => void;
    handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleEditClick: (auction: AuctionRequest) => void;
    searchTerm: string;
}> = ({
    pendingAuctions,
    loading,
    page,
    rowsPerPage,
    handleChangePage,
    handleChangeRowsPerPage,
    handleEditClick,
    searchTerm,
}) => {
        const filteredAuctions = pendingAuctions.filter((auction) => {
            const sellerName = auction?.comic?.sellerId?.name?.toLowerCase() || "";
            const title = auction?.comic?.title?.toLowerCase() || "";
            return (
                sellerName.includes(searchTerm.toLowerCase()) ||
                title.includes(searchTerm.toLowerCase())
            );
        });

        return (
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 700 }} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>Người Bán</StyledTableCell>
                            <StyledTableCell align="left" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>Tên Truyện</StyledTableCell>
                            <StyledTableCell align="left" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                                Trạng Thái Đấu Giá
                            </StyledTableCell>
                            <StyledTableCell align="right" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                                Giá Khởi Điểm
                            </StyledTableCell>
                            <StyledTableCell align="right" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                                Bước Giá
                            </StyledTableCell>
                            <StyledTableCell align="right" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                                Mức Cọc
                            </StyledTableCell>
                            <StyledTableCell align="right" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>Thời Lượng Đấu Giá</StyledTableCell>
                            <StyledTableCell align="right" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>Chi Tiết</StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    Loading...
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAuctions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((auction) => (
                                    <StyledTableRow key={auction.id}>
                                        <StyledTableCell style={{ fontFamily: "REM" }}>
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    justifyContent: "center",
                                                    alignItems: "center",
                                                    gap: "8px",
                                                }}
                                            >
                                                <img
                                                    alt={auction?.comic?.sellerId?.avatar}
                                                    src={auction?.comic?.sellerId?.avatar}
                                                    style={{
                                                        width: 32,
                                                        height: 32,
                                                        borderRadius: "50%",
                                                    }}
                                                />
                                                {auction?.comic?.sellerId?.name}
                                            </Box>
                                        </StyledTableCell>
                                        <StyledTableCell align="left" sx={{ fontFamily: "REM" }}>
                                            {truncateText(auction?.comic?.title, 15)}
                                        </StyledTableCell>
                                        <StyledTableCell align="left" style={{ fontFamily: "REM" }}>
                                            <span style={getStatusChipStyles(auction.status)}>
                                                {translateStatus(auction.status)}
                                            </span>
                                        </StyledTableCell>
                                        <StyledTableCell align="left" style={{ fontFamily: "REM" }}>
                                            {auction.reservePrice?.toLocaleString()} đ
                                        </StyledTableCell>
                                        <StyledTableCell align="left" style={{ fontFamily: "REM" }}>
                                            {auction.priceStep?.toLocaleString()} đ
                                        </StyledTableCell>
                                        <StyledTableCell align="left" style={{ fontFamily: "REM" }}>
                                            {auction.depositAmount?.toLocaleString()} đ
                                        </StyledTableCell>
                                        <StyledTableCell align="right" style={{ fontFamily: "REM" }}>
                                            {auction.duration} Ngày
                                        </StyledTableCell>
                                        <StyledTableCell align="right">
                                            {auction.status === "PENDING" ? (
                                                <IconButton
                                                    color="default"
                                                    onClick={() => handleEditClick(auction)}
                                                >
                                                    <EditOutlinedIcon />
                                                </IconButton>
                                            ) : auction.status === "APPROVED" || auction.status === "REJECTED" ? (
                                                <IconButton color="default" onClick={() => handleEditClick(auction)}>
                                                    <InfoOutlinedIcon />
                                                </IconButton>
                                            ) : null}
                                        </StyledTableCell>

                                    </StyledTableRow>
                                ))
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 15]}
                    component="div"
                    count={pendingAuctions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        );
    };

export default PendingAuctionTable;
