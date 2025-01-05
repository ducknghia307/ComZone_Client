import React, { useState, useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePagination from "@mui/material/TablePagination";
import { privateAxios } from "../../middleware/axiosInstance";
import { Box, FormControl, IconButton, InputAdornment, MenuItem, Select, TextField, Typography } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AuctionDetailMod from "../modal/AuctionDetailMod";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import { Auction, UserInfo } from "../../common/base.interface";
import { SelectChangeEvent } from "@mui/material/Select";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import EditAuctionMod from "./EditAuctionMod";
import { Tabs } from "antd";
import { conditionGradingScales } from "../../common/constances/comicsConditions";
import PendingApprovalModal from "../modal/PendingApprovalModal";
const { TabPane } = Tabs;
interface SelectedAuction extends Auction {
  sellerInfo: UserInfo;
}

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

const AuctionTable: React.FC<{
  auctions: Auction[];
  loading: boolean;
  page: number;
  rowsPerPage: number;
  handleChangePage: (event: unknown, newPage: number) => void;
  handleChangeRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleEditClick: (auction: SelectedAuction) => void;
  searchTerm: string;
  selectedStatus: string;
}> = ({
  auctions,
  loading,
  page,
  rowsPerPage,
  handleChangePage,
  handleChangeRowsPerPage,
  handleEditClick,
  searchTerm,
  selectedStatus,
}) => {
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
        case "PENDING_APPROVAL":
          return { color: "#a64dff", backgroundColor: "#f2e6ff", borderRadius: "8px", padding: "8px 20px", fontWeight: "bold", display: "inline-block", };
        case "CANCELED":
          return { color: "#757575", backgroundColor: "#eeeeee", padding: "8px 20px", borderRadius: "8px", fontWeight: "bold", display: "inline-block", };
      }
    };

    const translateStatus = (status: string) => {
      switch (status) {
        case "SUCCESSFUL":
          return "Thành công";
        case "COMPLETED":
          return "Hoàn thành";
        case "PENDING_APPROVAL":
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
        default:
          return status;
      }
    };

    const truncateText = (text: string, maxLength: number): string => {
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const filteredAuctions = auctions.filter((auction) => {
      const statusMatch = selectedStatus ? auction.status === selectedStatus : true;
      const searchMatch =
        auction.comics.sellerId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        auction.comics.title.toLowerCase().includes(searchTerm.toLowerCase());
      return statusMatch && searchMatch;
    });

    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell style={{ fontFamily: "REM", whiteSpace: "nowrap" }}>
                Người Bán
              </StyledTableCell>
              <StyledTableCell align="left" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                Tên Truyện
              </StyledTableCell>
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
                Giá Hiện Tại
              </StyledTableCell>
              <StyledTableCell align="right" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                Chi Tiết
              </StyledTableCell>
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
              filteredAuctions
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((auction) => (
                  <StyledTableRow key={auction.id}>
                    {/* ... (keep existing row content) */}
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
                          alt={auction.comics.sellerId.avatar}
                          src={auction.comics.sellerId.avatar || ""}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                          }}
                        />
                        {auction.comics.sellerId.name}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="left" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                      {truncateText(auction.comics.title, 20)}
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
                      {auction.currentPrice?.toLocaleString()} đ
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      <IconButton
                        color="default"
                        onClick={() => handleEditClick(auction as SelectedAuction)}
                      >
                        {auction.status === "PENDING_APPROVAL" ? (
                          <EditOutlinedIcon />
                        ) : (
                          <InfoOutlinedIcon />
                        )}
                      </IconButton>
                    </StyledTableCell>
                  </StyledTableRow>
                ))
            )}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[5, 10, 15]}
          component="div"
          count={filteredAuctions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    );
  };

const ManageAuctions: React.FC = () => {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<SelectedAuction | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");

  const fetchOrdersWithItems = async () => {
    try {
      const response = await privateAxios.get("/auction");
      setAuctions(response.data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdersWithItems();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAuction(null);
  };

  const handleEditClick = (auction: SelectedAuction) => {
    setSelectedAuction({
      ...auction,
      sellerInfo: auction.comics.sellerId,
      comics: auction.comics,
    });
    setIsModalOpen(true);
  };

  const handleModalSuccess = () => {
    handleModalClose();
    fetchOrdersWithItems();
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const regularAuctions = auctions.filter(auction => auction.status !== "PENDING_APPROVAL");
  const pendingAuctions = auctions.filter(auction => auction.status === "PENDING_APPROVAL");
  console.log("auctions", regularAuctions);
  console.log("auctions pending", pendingAuctions);

  return (
    <div style={{ paddingBottom: "40px" }}>
      <Box sx={{ marginBottom: "30px" }}>
        <Typography
          variant="h5"
          sx={{
            marginBottom: "20px",
            fontWeight: "bold",
            fontFamily: "REM",
            color: "#71002b",
          }}
        >
          Quản lý đấu giá
        </Typography>

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <TextField
            variant="outlined"
            placeholder="Tìm kiếm theo tên người bán hoặc tên truyện..."
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{
              backgroundColor: "#c66a7a",
              borderRadius: "4px",
              color: "#fff",
              width: "420px",
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchOutlinedIcon sx={{ color: "#fff" }} />
                </InputAdornment>
              ),
              style: { color: "#fff", fontFamily: "REM" },
            }}
          />

          {activeTab === "1" && (
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "bold",
                  color: "#71002b",
                  fontFamily: "REM",
                  paddingRight: "10px",
                }}
              >
                Trạng Thái:
              </Typography>
              <FormControl size="small" sx={{ minWidth: 150, marginLeft: 1 }}>
                <Select
                  value={selectedStatus}
                  onChange={handleStatusFilterChange}
                  displayEmpty
                  sx={{ fontFamily: "REM" }}
                >
                  <MenuItem sx={{ fontFamily: "REM" }} value="">Tất Cả</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="UPCOMING">Sắp diễn ra</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="ONGOING">Đang diễn ra</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="SUCCESSFUL">Thành công</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="FAILED">Thất bại</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="CANCELED">Đã hủy</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="COMPLETED">Hoàn thành</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Các Cuộc Đấu Giá" key="1">
            <AuctionTable
              auctions={regularAuctions}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleEditClick={handleEditClick}
              searchTerm={searchTerm}
              selectedStatus={selectedStatus}
            />
          </TabPane>
          <TabPane tab="Danh Sách Chờ Duyệt" key="2">
            <AuctionTable
              auctions={pendingAuctions}
              loading={loading}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleEditClick={handleEditClick}
              searchTerm={searchTerm}
              selectedStatus=""
            />
          </TabPane>
          <TabPane tab="Tiêu chí duyệt đấu giá" key="3">

          </TabPane>
        </Tabs>
      </Box>

      {selectedAuction && (
  <>
    {selectedAuction.status === 'PENDING_APPROVAL' ? (
      <PendingApprovalModal
        open={isModalOpen}
        onCancel={handleModalClose}
        comic={selectedAuction.comics}
        auctionData={{
          id: selectedAuction.id,
          reservePrice: selectedAuction.reservePrice,
          maxPrice: selectedAuction.maxPrice,
          priceStep: selectedAuction.priceStep,
          startTime: selectedAuction.startTime,
          endTime: selectedAuction.endTime,
          currentPrice: selectedAuction.currentPrice,
          sellerInfo: selectedAuction.sellerInfo,
          status: selectedAuction.status,
          duration: selectedAuction.duration,
        }}
        onSuccess={handleModalSuccess}
      />
    ) : (
      <AuctionDetailMod
        open={isModalOpen}
        onCancel={handleModalClose}
        comic={selectedAuction.comics}
        auctionData={{
          id: selectedAuction.id,
          reservePrice: selectedAuction.reservePrice,
          maxPrice: selectedAuction.maxPrice,
          priceStep: selectedAuction.priceStep,
          startTime: selectedAuction.startTime,
          endTime: selectedAuction.endTime,
          currentPrice: selectedAuction.currentPrice,
          sellerInfo: selectedAuction.sellerInfo,
          status: selectedAuction.status,
        }}
        onSuccess={handleModalSuccess}
      />
    )}
  </>
)}
    </div>
  );
};

export default ManageAuctions;
