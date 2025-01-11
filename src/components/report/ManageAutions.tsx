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
import { Auction, AuctionRequest, Comic, UserInfo } from "../../common/base.interface";
import { SelectChangeEvent } from "@mui/material/Select";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Tabs } from "antd";
import PendingApprovalModal from "../modal/PendingApprovalModal";
import PendingAuctionTable from "./PendingAuctionTable";
import CriteriaTable from "./CriteriaTable";
const { TabPane } = Tabs;
interface SelectedAuction extends Omit<Auction, 'comics'> {
  sellerInfo: UserInfo;
  comics: Comic;
  duration?: number;
  rejectionReason?: string;
  approvalDate?: Date;
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

    const truncateText = (text: string | undefined, maxLength: number): string => {
      if (!text) {
        return ""; // Return an empty string if text is undefined or null
      }
      return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
    };

    const filteredAuctions = auctions.filter((auction) => {
      const statusMatch = selectedStatus ? auction.status === selectedStatus : true;
      const sellerName = auction?.comics?.sellerId?.name?.toLowerCase() || '';
      const title = auction?.comics?.title?.toLowerCase() || '';
      const searchMatch =
        sellerName.includes(searchTerm.toLowerCase()) || title.includes(searchTerm.toLowerCase());
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
            ) : filteredAuctions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" style={{ fontFamily: "REM", color: "#555" }}>
                  Không có đấu giá nào.
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
                          alt={auction?.comics?.sellerId?.avatar}
                          src={auction?.comics?.sellerId?.avatar}
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                          }}
                        />
                        {auction?.comics?.sellerId?.name}
                      </Box>
                    </StyledTableCell>
                    <StyledTableCell align="left" style={{ whiteSpace: "nowrap", fontFamily: "REM" }}>
                      {truncateText(auction?.comics?.title, 20)}
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
                        {auction.status === "PENDING" ? (
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
  const [pendingAuctions, setPendingAuctions] = useState<AuctionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingPending, setLoadingPending] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAuction, setSelectedAuction] = useState<SelectedAuction | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [activeTab, setActiveTab] = useState("1");
  const [selectedPendingStatus, setSelectedPendingStatus] = useState<string>("");

  const fetchAuctions = async () => {
    try {
      const response = await privateAxios.get("/auction");
      setAuctions(response.data);
    } catch (error) {
      console.error("Error fetching auctions:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchPendingAuctions = async () => {
    try {
      const response = await privateAxios.get("/auction-request");
      setPendingAuctions(response.data);
      console.log("Pending auctions:", response.data);

    } catch (error) {
      console.error("Error fetching pending auctions:", error);
    } finally {
      setLoadingPending(false);
    }
  };

  useEffect(() => {
    if (activeTab === "1") {
      fetchAuctions();
    } else if (activeTab === "2") {
      fetchPendingAuctions();
    }
  }, [activeTab]);

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

  const handleEditClick = (auction: Auction | AuctionRequest) => {
    console.log("Clicked Auction: ", auction);

    if ('comic' in auction) {
      const selectedAuction: SelectedAuction = {
        id: auction.id,
        sellerInfo: auction.comic.sellerId,
        comics: auction.comic,
        status: auction.status,
        reservePrice: auction.reservePrice,
        priceStep: auction.priceStep,
        maxPrice: auction.maxPrice,
        duration: auction.duration,
        depositAmount: auction.depositAmount,
        rejectionReason: auction.rejectionReason,
        approvalDate: auction.approvalDate,
        shopName: auction.comic.sellerId.name || '',
        productName: auction.comic.title || '',
        imgUrl: auction.comic.coverImage || '',
        startTime: new Date().toISOString(),
        endTime: new Date().toISOString(),
        createdAt: new Date(),
      };
      setSelectedAuction(selectedAuction);
    } else {
      const selectedAuction: SelectedAuction = {
        ...auction,
        sellerInfo: auction.comics.sellerId,
        comics: auction.comics,
      };
      setSelectedAuction(selectedAuction);
    }
    setIsModalOpen(true);
  };


  const handleModalSuccess = () => {
    handleModalClose();
    if (activeTab === "1") {
      fetchAuctions();
    } else if (activeTab === "2") {
      fetchPendingAuctions();
    }
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedStatus(event.target.value as string);
  };

  const filteredPendingAuctions = pendingAuctions.filter((auction) => {
    const statusMatch = selectedPendingStatus ? auction.status === selectedPendingStatus : true;
    const sellerName = auction?.comic?.sellerId?.name?.toLowerCase() || '';
    const title = auction?.comic?.title?.toLowerCase() || '';
    const searchMatch =
      sellerName.includes(searchTerm.toLowerCase()) || title.includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  const handlePendingStatusFilterChange = (event: SelectChangeEvent<string>) => {
    setSelectedPendingStatus(event.target.value as string);
  };

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

          {activeTab === "2" && (
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
                  value={selectedPendingStatus}
                  onChange={handlePendingStatusFilterChange}
                  displayEmpty
                  sx={{ fontFamily: "REM" }}
                >
                  <MenuItem sx={{ fontFamily: "REM" }} value="">Tất Cả</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="PENDING">Chờ duyệt</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="APPROVED">Đã duyệt</MenuItem>
                  <MenuItem sx={{ fontFamily: "REM" }} value="REJECTED">Bị từ chối</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="Các Cuộc Đấu Giá" key="1">
            <AuctionTable
              auctions={auctions}
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
          <TabPane tab="Quản Lý Duyệt Đấu Giá" key="2">
            <PendingAuctionTable
              pendingAuctions={filteredPendingAuctions}
              loading={loadingPending}
              page={page}
              rowsPerPage={rowsPerPage}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
              handleEditClick={handleEditClick}
              searchTerm={searchTerm}
            />
          </TabPane>

          <TabPane tab="Tiêu Chí Duyệt Đấu Giá" key="3">
            <CriteriaTable />
          </TabPane>
        </Tabs>
      </Box>

      {selectedAuction && (
        <>
          {selectedAuction.status === 'PENDING' ? (
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
              onStatusUpdate={(newStatus: string) => {
                setSelectedAuction(prev => prev ? { ...prev, status: newStatus } : null);
                setPendingAuctions(prev =>
                  prev.map(auction =>
                    auction.id === selectedAuction.id
                      ? { ...auction, status: newStatus }
                      : auction
                  )
                );
              }}
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
