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

  const getEditionChipStyle = (edition) => {
    switch (edition) {
      case 'REGULAR':
        return { border: '1px solid #90caf9', color: '#1976d2', backgroundColor: 'transparent', fontSize: "14px", fontWeight: '600', fontFamily: "REM", };
      case 'SPECIAL':
        return { border: '1px solid #ffcc80', color: '#ff9800', backgroundColor: 'transparent', fontSize: "14px", fontWeight: '600', fontFamily: "REM", };
      case 'LIMITED':
        return { border: '1px solid #bdbdbd', color: '#9e9e9e', backgroundColor: 'transparent', fontSize: "14px", fontWeight: '600', fontFamily: "REM", };
      default: return {};
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

  const getConditionChipStyle = (condition) => {
    switch (condition) {
      case 'USED':
        return { border: '1px solid #ef9a9a', color: '#f44336', backgroundColor: 'transparent', fontSize: "14px", fontWeight: '600', fontFamily: "REM", };
      case 'SEALED':
        return { border: '1px solid #a5d6a7', color: '#4caf50', backgroundColor: 'transparent', fontSize: "14px", fontWeight: '600', fontFamily: "REM", };
      default:
        return {};
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
          }}
          className="text-2xl text-center text-[#71002b] font-bold pb-2"
        >
          Duyệt Yêu Cầu Đấu Giá
        </DialogTitle>
        <DialogContent className="p-8">
          <Box sx={{ mb: 4 }}>
            <div>
              <Chip
                className="w-full"
                label="Thông tin truyện"
                sx={{
                  fontSize: "15px",
                  fontWeight: "bold",
                  backgroundColor: "#fff",
                  color: "#000",
                  padding: "15px 20px",
                  fontFamily: "REM",
                  border: "2px solid black",
                  marginBottom: "20px",
                  mt: 2
                }}
              />
            </div>
            <Box
              sx={{ display: "flex", flexDirection: "column", gap: "16px", padding: "0 16px", }}
            >
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontFamily: "REM", fontSize: "16px" }}>
                  <strong>Tên truyện:</strong> {comic.title}
                </Typography>
                <Typography sx={{ fontFamily: "REM", fontSize: "16px", textAlign: "right" }}>
                  <strong>Giá:</strong> {comic.price?.toLocaleString()} đ
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <Typography sx={{ fontFamily: "REM", fontSize: "16px" }}>
                  <strong>Tác giả:</strong> {comic.author}
                </Typography>
                <Typography sx={{ fontFamily: "REM", fontSize: "16px", textAlign: "right" }}>
                  <strong>Năm xuất bản:</strong> {comic.publishedDate}
                </Typography>
              </Box>
            </Box>
            <Typography
              sx={{ fontFamily: "REM", mt: 2, fontSize: "16px", lineHeight: "1.6", padding: "0 16px", }}
            >
              <strong>Mô tả:</strong> {comic.description}
            </Typography>
            <Box
              sx={{
                mt: 3,
                display: "flex",
                alignItems: "center",
                gap: "12px",
                padding: "0 16px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "REM",
                  fontSize: "16px",
                  fontWeight: "bold",
                }}
              >
                Ảnh bìa:
              </Typography>
              <img
                src={comic.coverImage}
                alt="Cover"
                style={{
                  width: "120px",
                  maxHeight: "180px",
                  objectFit: "contain",
                  border: "1px solid #ddd",
                  borderRadius: "8px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
                className="w-[120px] h-auto max-h-[180px] object-contain border border-[#ddd] rounded-lg shadow-sm"
              />
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex", flexDirection: "row", gap: "12px", // alignItems: "flex-start",
            }}
          >
            <Chip
              label={
                <Typography
                  sx={{
                    fontFamily: "REM",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong style={{ color: "#000" }}>Tình trạng: </strong>&nbsp;
                  <span style={{ color: "#000" }}>{translateCondition(comic.condition)}</span>
                </Typography>
              }
              sx={{
                border: "1px solid #000",
                color: "#4caf50",
                backgroundColor: "transparent",
                padding: "10px 16px",
                fontSize: "14px",
                fontFamily: "REM",
                fontWeight: "600",
              }}
              className="w-1/2 border border-black text-[#4caf50] bg-transparent px-4 py-2 text-[14px] font-semibold"
            />
            <Chip
              label={
                <Typography
                  sx={{
                    fontFamily: "REM",
                    fontSize: "15px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <strong style={{ color: "#000" }}>Phiên bản: </strong>&nbsp;
                  <span style={{ color: "#000" }}>{translateEdition(comic.edition)}</span>
                </Typography>
              }
              sx={{
                border: "1px solid #000",
                color: "#1976d2",
                backgroundColor: "transparent",
                padding: "10px 16px",
                fontSize: "14px",
                fontFamily: "REM",
                fontWeight: "600",
              }}
              className="w-1/2 border border-black text-[#1976d2] bg-transparent px-4 py-2 text-[14px] font-semibold"
            />
          </Box>

        </DialogContent>
        <DialogActions
          sx={{
            padding: "16px",
            backgroundColor: "#f9f9f9",
            borderTop: "1px solid #e0e0e0",
            display: "flex",
            justifyContent: "space-between",
          }}
          className="p-4 bg-[#f9f9f9] border-t border-[#e0e0e0]"
        >
          <Box>
            <Button
              onClick={onCancel}
              sx={{
                fontFamily: "REM",
                backgroundColor: "#f0f0f0",
                color: "#555",
                padding: "8px 16px",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#e0e0e0" },
                border: "1px solid #ddd",
              }}
              className="bg-[#f0f0f0] text-[#555] py-2 px-4 rounded-lg border border-[#ddd] hover:bg-[#e0e0e0]"
            >
              Đóng
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: "8px" }}>
            <Button
              color="error"
              variant="contained"
              disabled={loading}
              sx={{
                fontFamily: "REM",
                padding: "8px 16px",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#b71c1c" },
              }}
              className="py-2 px-4 rounded-lg bg-[#d32f2f] text-white hover:bg-[#b71c1c]"
              onClick={() => setRejectReasonModalOpen(true)}
            >
              Từ chối
            </Button>
            <Button
              color="primary"
              variant="contained"
              disabled={loading}
              sx={{
                fontFamily: "REM",
                padding: "8px 16px",
                borderRadius: "8px",
                textTransform: "none",
                "&:hover": { backgroundColor: "#0d47a1" },
              }}
              className="py-2 px-4 rounded-lg bg-[#1976d2] text-white hover:bg-[#0d47a1]"
              onClick={handleApprove}
            >
              Phê duyệt
            </Button>
          </Box>
        </DialogActions>

      </Dialog>
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
