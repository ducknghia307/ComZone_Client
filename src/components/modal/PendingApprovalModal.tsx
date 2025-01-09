import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Chip,
} from "@mui/material";
import { Comic, UserInfo } from "../../common/base.interface";
import TimeSelectionModal from "./TimeSelectionModal";
import RejectReasonAuction from "./RejectReasonAuction";
import CloseIcon from "@mui/icons-material/Close";
import { Card, Checkbox, Image, Typography } from "antd";
import { privateAxios } from "../../middleware/axiosInstance";

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
  onStatusUpdate,
}) => {
  const [loading, setLoading] = useState(false);
  const [timeSelectionModalOpen, setTimeSelectionModalOpen] = useState(false);
  const [rejectReasonModalOpen, setRejectReasonModalOpen] = useState(false);
  const [auctionCriteria, setAuctionCriteria] = useState<any>(null);

  const [criteriaChecked, setCriteriaChecked] = useState({
    criteria1: false,
    criteria2: false,
    criteria3: false,
  });

  const { Text, Title } = Typography;

  useEffect(() => {
    const fetchAuctionCriteria = async () => {
      try {
        const response = await privateAxios.get("http://localhost:3000/auction-criteria");
        const data = response.data;
        setAuctionCriteria(data);
        console.log("Auction criteria:", data);

      } catch (error) {
        console.error("Error fetching auction criteria:", error);
      }
    };

    fetchAuctionCriteria();
  }, []);


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

  const handleCheckboxChange = (name: string, checked: boolean) => {
    setCriteriaChecked((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const translateCover = (cover: string) => {
    switch (cover) {
      case "SOFT":
        return "Bìa mềm";
      case "HARD":
        return "Bìa cứng";
      case "DETACHED":
        return "Bìa rời";
      default:
        return "Không xác định";
    }
  };

  const translateColor = (color: string) => {
    switch (color) {
      case "GRAYSCALE":
        return "Trắng đen";
      case "COLORED":
        return "Có màu";
      default:
        return "Không xác định";
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onCancel}
        maxWidth="lg"
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
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
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
          <div className="w-full flex flex-row gap-3">
            <div className="w-2/3">
              <Box
                sx={{
                  backgroundColor: "#fff",
                  borderRadius: "12px",
                  padding: "24px",
                  boxShadow: "0 2px 8px rgba(177, 177, 177, 0.5)",
                  mt: 2,
                }}
              >
                <Typography
                  style={{
                    fontFamily: "REM",
                    fontSize: "18px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    color: "#000",
                    textAlign: "center",
                  }}
                >
                  Thông tin truyện
                </Typography>

                <Box
                  sx={{ display: "flex", flexDirection: "column", gap: "20px" }}
                >
                  <Box
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#555",
                        marginBottom: "8px",
                      }}
                    >
                      Ảnh bìa:
                    </Typography>
                    <Image.PreviewGroup
                      preview={{
                        getContainer: document.body,
                        zIndex: 2000,
                      }}
                    >
                      <Image
                        src={comic.coverImage}
                        alt="Ảnh bìa"
                        style={{
                          width: "100px",
                          height: "150px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                        }}
                        preview={{ visible: true }}
                      />
                    </Image.PreviewGroup>
                  </Box>
                  <Box
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        fontWeight: "bold",
                        color: "#555",
                        marginBottom: "8px",
                      }}
                    >
                      Ảnh đính kèm:
                    </Typography>
                    {comic.previewChapter && comic.previewChapter.length > 0 ? (
                      <Box
                        sx={{ display: "flex", flexWrap: "wrap", gap: "16px" }}
                      >
                        {comic.previewChapter.map((image, index) => (
                          <Image.PreviewGroup
                            preview={{
                              getContainer: document.body,
                              zIndex: 2000,
                            }}
                          >
                            <Image
                              key={index}
                              src={image}
                              alt={`Preview ${index + 1}`}
                              style={{
                                width: "100px",
                                height: "150px",
                                objectFit: "cover",
                                borderRadius: "8px",
                                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)",
                              }}
                            />
                          </Image.PreviewGroup>
                        ))}
                      </Box>
                    ) : (
                      <Typography
                        style={{
                          fontFamily: "REM",
                          fontSize: "14px",
                          color: "#777",
                        }}
                      >
                        Không có hình ảnh xem trước.
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Tên truyện:</strong> {comic.title}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Tác giả:</strong> {comic.author}
                    </Typography>
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Giá:</strong> {comic.price?.toLocaleString()} đ
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Tình trạng:</strong> {comic.condition?.name}
                    </Typography>

                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Phiên bản:</strong> {comic.edition?.name}
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
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                        fontWeight: "bold",
                      }}
                    >
                      Thể loại:
                    </Typography>
                    <Typography
                      style={{
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

                  <Box
                    sx={{
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Mô tả:</strong> {comic.description}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      padding: "16px",
                      backgroundColor: "#f8f9fa",
                      borderRadius: "8px",
                    }}
                  >
                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Loại bìa:</strong> {translateCover(comic.cover)}
                    </Typography>

                    <Typography
                      style={{
                        fontFamily: "REM",
                        fontSize: "16px",
                        color: "#555",
                      }}
                    >
                      <strong>Màu sắc truyện:</strong>{" "}
                      {translateColor(comic.color)}
                    </Typography>
                  </Box>

                  {(comic.length && comic.width && comic.thickness) ||
                    comic.page ? (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      {comic.length && comic.width && comic.thickness && (
                        <Typography
                          style={{
                            fontFamily: "REM",
                            fontSize: "16px",
                            color: "#555",
                          }}
                        >
                          <strong>Kích thước truyện:</strong> {comic.length} x{" "}
                          {comic.width} x {comic.thickness} (cm)
                        </Typography>
                      )}
                      {comic.page && (
                        <Typography
                          style={{
                            fontFamily: "REM",
                            fontSize: "16px",
                            color: "#555",
                          }}
                        >
                          <strong>Số trang:</strong> {comic.page}
                        </Typography>
                      )}
                    </Box>
                  ) : null}

                  {comic.publisher && comic.originCountry && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          color: "#555",
                        }}
                      >
                        <strong>Nhà xuất bản:</strong> {comic.publisher}
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          color: "#555",
                        }}
                      >
                        <strong>Xuất xứ:</strong> {comic.originCountry}
                      </Typography>
                    </Box>
                  )}

                  {comic.publicationYear && comic.releaseYear && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          color: "#555",
                        }}
                      >
                        <strong>Năm xuất bản:</strong> {comic.publicationYear}
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          color: "#555",
                        }}
                      >
                        <strong>Năm phát hành:</strong> {comic.releaseYear}
                      </Typography>
                    </Box>
                  )}

                  {comic.editionEvidence && comic.editionEvidence.length > 0 && (
                    <Box
                      sx={{
                        padding: "16px",
                        backgroundColor: "#f8f9fa",
                        borderRadius: "8px",
                      }}
                    >
                      <Typography
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#555",
                          marginBottom: "8px",
                        }}
                      >
                        Yếu tố thể hiện phiên bản truyện:
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                        {comic.editionEvidence.map((evidence, index) => (
                          <Chip
                            key={index}
                            label={evidence}
                            sx={{
                              fontFamily: "REM",
                              fontSize: "14px",
                              backgroundColor: "#e3f2fd",
                              color: "#1e88e5",
                            }}
                          />
                        ))}
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </div>

            <div className="w-1/3 sticky top-0 h-fit">
              {/* <div className="w-1/3"> */}
              <Card
                bordered={true}
                style={{
                  borderRadius: "12px",
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  marginTop: "16px",
                }}
              >
                <Title
                  level={4}
                  style={{
                    fontFamily: "REM",
                    fontSize: "20px",
                    fontWeight: "bold",
                    marginBottom: "20px",
                    color: "#71002b",
                    textAlign: "center",
                  }}
                >
                  Tiêu chí duyệt đấu giá
                </Title>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      backgroundColor: "#fef7f9",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #fbc4d7",
                    }}
                  >
                    <Checkbox
                      id="criteria1"
                      checked={true}
                      disabled={true}
                      style={{ pointerEvents: "none" }}
                    />
                    <div>
                      <label
                        htmlFor="criteria1"
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#71002b",
                        }}
                      >
                        Thông tin đầy đủ
                      </label>
                      <Text
                        style={{
                          fontFamily: "REM",
                          fontSize: "13px",
                          color: "#555",
                          display: "block",
                        }}
                      >
                        Người bán phải cung cấp đầy đủ thông tin chi tiết về truyện, bao gồm: tên truyện, tác giả, thể loại, mô tả nội dung truyện, loại bìa, và màu sắc của truyện.
                      </Text>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      backgroundColor: "#fef7f9",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #fbc4d7",
                    }}
                  >
                    <Checkbox
                      id="criteria2"
                      checked={true}
                      disabled={true}
                      style={{ pointerEvents: "none" }}
                    />
                    <div>
                      <label
                        htmlFor="criteria2"
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#71002b",
                        }}
                      >
                        Tình trạng truyện
                      </label>
                      <Text
                        style={{
                          fontFamily: "REM",
                          fontSize: "13px",
                          color: "#555",
                          display: "block",
                        }}
                      >
                        Tình trạng của truyện phải đạt mức{" "}
                        <span style={{ color: "red" }}>
                          {auctionCriteria?.conditionLevel?.name?.toLowerCase()}
                        </span>{" "}
                        trở lên, tương đương{" "}
                        <span style={{ color: "red" }}>
                          {auctionCriteria?.conditionLevel?.value}
                        </span>
                        /10 theo thang điểm đánh giá chất lượng.
                      </Text>
                    </div>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "12px",
                      backgroundColor: "#fef7f9",
                      padding: "12px",
                      borderRadius: "8px",
                      border: "1px solid #fbc4d7",
                    }}
                  >
                    <Checkbox
                      id="criteria3"
                      onChange={(e) =>
                        handleCheckboxChange("criteria3", e.target.checked)
                      }
                    />
                    <div>
                      <label
                        htmlFor="criteria3"
                        style={{
                          fontFamily: "REM",
                          fontSize: "16px",
                          fontWeight: "bold",
                          color: "#71002b",
                        }}
                      >
                        Phiên bản truyện
                      </label>
                      <Text
                        style={{
                          fontFamily: "REM",
                          fontSize: "13px",
                          color: "#555",
                          display: "block",
                        }}
                      >
                        Kiểm tra xem yếu tố thể hiện phiên bản truyện và các ảnh đính kèm có khớp với phiên bản truyện mà người bán đã chọn hay không. Đồng thời, từng ảnh sẽ được xem xét để đảm bảo yếu tố thể hiện phiên bản truyện là chính xác.
                      </Text>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
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
              "&:hover": {
                backgroundColor: "#e0e0e0",
                border: "1px solid grey",
              },
              border: "1px solid #e0e0e0",
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
              disabled={
                !Object.values(criteriaChecked).some((value) => value) ||
                loading
              }
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
