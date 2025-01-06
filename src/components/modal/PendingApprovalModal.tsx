import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Chip,
} from "@mui/material";
import { Comic, UserInfo } from "../../common/base.interface";
import TimeSelectionModal from "./TimeSelectionModal";
import RejectReasonAuction from "./RejectReasonAuction";
import CloseIcon from "@mui/icons-material/Close"

interface PendingApprovalModalProps {
  open: boolean;
  onCancel: () => void;
  onSuccess: () => void;
  comic: Comic;
  auctionData: {
    id: string;
    reservePrice: number;
    maxPrice: number;
    priceStep: number;
    startTime: string;
    endTime: string;
    currentPrice: number;
    sellerInfo: UserInfo;
    status: string;
    duration: number;
  };
  onStatusUpdate: (newStatus: string) => void;
}

const PendingApprovalModal: React.FC<PendingApprovalModalProps> = ({
  open,
  onCancel,
  onSuccess,
  comic,
  auctionData,
  onStatusUpdate
}) => {
  const [loading, setLoading] = useState(false);
  const [timeSelectionModalOpen, setTimeSelectionModalOpen] = useState(false);
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);

  const handleApprove = () => {
    setTimeSelectionModalOpen(true);
  };

  const handleReject = (reasons: string[]) => {
    console.log("Rejected reasons:", reasons);
    onStatusUpdate("REJECTED");
    setRejectReasonModalOpen(false);
    onCancel();
  };

  const handleTimeSelectionConfirm = (startTime: string, endTime: string) => {
    console.log("Auction start time:", startTime);
    console.log("Auction end time:", endTime);
    setTimeSelectionModalOpen(false);
    onSuccess();
  };

  const getConditionStyle = (condition) => {
    switch (condition) {
      case 'USED':
        return { color: '#f44336' };
      case 'SEALED':
        return { color: '#4caf50' };
      default:
        return {};
    }
  };

  const getEditionStyle = (edition) => {
    switch (edition) {
      case 'REGULAR':
        return { color: '#1976d2' };
      case 'SPECIAL':
        return { color: '#ff9800' };
      case 'LIMITED':
        return { color: '#9e9e9e' };
      default:
        return {};
    }
  };

  const translateEdition = (edition) => {
    switch (edition) {
      case "REGULAR": return "Bản Thường";
      case "SPECIAL": return "Bản Đặc Biệt";
      case "LIMITED": return "Bản Giới Hạn";
      default: return edition;
    }
  };

  const translateCondition = (condition) => {
    switch (condition) {
      case "SEALED": return "Nguyên Seal";
      case "USED": return "Đã Qua Sử Dụng";
      default: return condition;
    }
  };

  return (
    <>
      <div className="flex justify-between items-start">
        <div className="w-1/2">
          <Dialog
            open={open}
            onClose={onCancel}
            maxWidth="md"
            fullWidth
            PaperProps={{
              style: {
                borderRadius: "16px",
                overflow: "hidden",
              },
            }}
          >
            <DialogTitle
              sx={{
                fontFamily: "REM",
                color: "#71002b",
                textAlign: "center",
                fontSize: "24px",
                fontWeight: "bold",
                paddingBottom: "8px",
                borderBottom: "1px solid #e0e0e0",
                backgroundColor: "#fff",
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                position: "relative",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                Duyệt Yêu Cầu Đấu Giá
              </Box>
              <Button
                onClick={onCancel}
                sx={{
                  position: "absolute",
                  top: "50%",
                  right: "16px",
                  transform: "translateY(-50%)",
                  minWidth: "unset",
                  padding: 0,
                  color: "#555",
                  "&:hover": { color: "#000" },
                }}
              >
                <CloseIcon />
              </Button>
            </DialogTitle>
            <DialogContent>
              <Box sx={{ backgroundColor: "#fff", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 8px rgba(177, 177, 177, 0.5)", mt: 2 }}>
                <Typography variant="h6" sx={{
                  fontFamily: "REM",
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "20px",
                  color: "#333"
                }}>
                  Thông tin truyện
                </Typography>

                <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px"
                  }}>
                    <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                      <strong>Tên truyện:</strong> {comic.title}
                    </Typography>
                    <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                      <strong>Giá:</strong> {comic.price?.toLocaleString()} đ
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px"
                  }}>
                    <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                      <strong>Tác giả:</strong> {comic.author}
                    </Typography>
                    <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                      <strong>Năm xuất bản:</strong> {comic.publishedDate}
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px"
                  }}>
                    {/* <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                  <strong>Tình trạng:</strong> {translateCondition(comic.condition)}
                </Typography>
                <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                  <strong>Phiên bản:</strong> {translateEdition(comic.edition)}
                </Typography> */}
                    <Box sx={{
                      display: 'inline-block',
                      // padding: "6px 12px",
                      borderRadius: "16px",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "REM",
                      ...getConditionStyle(comic.condition)
                    }}>
                      <strong style={{ color: '#555' }}>Tình trạng:</strong>{' '}
                      {translateCondition(comic.condition)}
                    </Box>
                    <Box sx={{
                      display: 'inline-block',
                      borderRadius: "16px",
                      backgroundColor: "transparent",
                      fontSize: "14px",
                      fontWeight: "600",
                      fontFamily: "REM",
                      ...getEditionStyle(comic.edition)
                    }}>
                      <strong style={{ color: '#555' }}>Phiên bản:</strong>{' '}
                      {translateEdition(comic.edition)}
                    </Box>
                  </Box>

                  <Box sx={{
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px"
                  }}>
                    <Typography sx={{ fontFamily: "REM", fontSize: "16px", color: "#555" }}>
                      <strong>Mô tả:</strong> {comic.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                      display: "flex",
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                        fontWeight: "bold",
                        marginBottom: "8px",
                      }}
                    >
                      Thể loại:
                    </Typography>
                    <Typography
                      sx={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                        marginLeft: "5px",
                      }}
                    >
                      {comic.genres && comic.genres.length > 0
                        ? comic.genres.map((genre) => genre.name).join(", ")
                        : "Không có thể loại"}
                    </Typography>
                  </Box>

                  <Box sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    padding: "16px",
                    backgroundColor: "#f8f9fa",
                    borderRadius: "8px"
                  }}>
                    <Typography sx={{ fontFamily: "REM", fontSize: "16px", fontWeight: "bold", color: "#555" }}>
                      Ảnh bìa:
                    </Typography>
                    <img
                      src={comic.coverImage}
                      alt="Cover"
                      style={{
                        width: "120px",
                        maxHeight: "180px",
                        objectFit: "contain",
                        borderRadius: "8px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                padding: "16px 24px",
                backgroundColor: "#fff",
                borderTop: "1px solid #e0e0e0",
                display: "flex",
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={onCancel}
                sx={{
                  fontFamily: "REM",
                  backgroundColor: "#f5f5f5",
                  color: "#666",
                  padding: "8px 24px",
                  borderRadius: "8px",
                  textTransform: "none",
                  "&:hover": { backgroundColor: "#e0e0e0" },
                }}
              >
                Đóng
              </Button>
              <Box sx={{ display: "flex", gap: "12px" }}>
                <Button
                  color="error"
                  variant="contained"
                  disabled={loading}
                  onClick={() => setRejectReasonModalOpen(true)}
                  sx={{
                    fontFamily: "REM",
                    padding: "8px 24px",
                    borderRadius: "8px",
                    textTransform: "none",
                    backgroundColor: "#ff4444",
                    "&:hover": { backgroundColor: "#cc0000" },
                  }}
                >
                  Từ chối
                </Button>
                <Button
                  color="primary"
                  variant="contained"
                  disabled={loading}
                  onClick={handleApprove}
                  sx={{
                    fontFamily: "REM",
                    padding: "8px 24px",
                    borderRadius: "8px",
                    textTransform: "none",
                    backgroundColor: "#2196f3",
                    "&:hover": { backgroundColor: "#1976d2" },
                  }}
                >
                  Phê duyệt
                </Button>
              </Box>
            </DialogActions>
          </Dialog>
        </div>
        <div className="w-1/2 pl-80">
          <Typography>aaaaaaaaaaaaaaaa</Typography>
        </div>
      </div>

      <TimeSelectionModal
        open={timeSelectionModalOpen}
        onCancel={() => setTimeSelectionModalOpen(false)}
        onConfirm={handleTimeSelectionConfirm}
        duration={auctionData.duration}
        auctionId={auctionData.id}
      />

      <RejectReasonAuction
        open={rejectReasonModalOpen}
        onCancel={() => setRejectReasonModalOpen(false)}
        onReject={handleReject}
        auctionId={auctionData.id}
      />
    </>
  );
};

export default PendingApprovalModal;