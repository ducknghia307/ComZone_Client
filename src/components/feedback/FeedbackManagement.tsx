import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import ModalFeedback from "../modal/ModalFeedback";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EmptyImage from "../../assets/notFound/emptybox.png";
import { Avatar } from "antd";
import {
  SellerFeedback,
  SellerFeedbackResponse,
} from "../../common/interfaces/seller-feedback.interface";

const FeedbackManagement = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [feedbacks, setFeedbacks] = useState<SellerFeedback[]>([]);
  const [totalFeedback, setTotalFeedback] = useState<number>(0);
  const [averageRating, setAverageRating] = useState<number>(0);

  const [loading, setLoading] = useState<boolean>(true);
  const [selectedFeedback, setSelectedFeedback] =
    useState<SellerFeedback | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchSellerFeedback = async () => {
    await privateAxios
      .get("/seller-feedback/seller/self")
      .then((res) => {
        const feedbackResponse: SellerFeedbackResponse = res.data;
        console.log("FBR: ", feedbackResponse);
        setFeedbacks(feedbackResponse.feedback);
        setTotalFeedback(feedbackResponse.totalFeedback);
        setAverageRating(feedbackResponse.averageRating);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchSellerFeedback();
  }, []);

  const openModal = (feedback: SellerFeedback) => {
    setSelectedFeedback(feedback);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFeedback(null);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const paginatedData =
    feedbacks &&
    feedbacks.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <div className="REM w-full bg-white p-4 rounded-lg drop-shadow-lg flex flex-col gap-8">
      <div className="flex items-start justify-between pt-4">
        <p className="text-2xl font-bold uppercase">Quản lý đánh giá</p>

        <div className="w-1/3 min-w-fit flex flex-col items-stretch px-16">
          <div className="flex items-center justify-between">
            <p className="font-light text-sm">Tổng số đánh giá: </p>
            <p className="font-semibold">{totalFeedback}</p>
          </div>

          <div className="flex items-center justify-between">
            <p className="font-light text-sm">Đánh giá trung bình: </p>
            <p className="flex items-center gap-1 font-semibold">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="#fcdb03"
              >
                <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
              </svg>
              {averageRating}
            </p>
          </div>
        </div>
      </div>

      {!loading && feedbacks && feedbacks.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 py-16 opacity-40">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4658/4658825.png"
            alt=""
            className="w-32 bg-white"
          />
          <p>Chưa nhận đánh giá nào!</p>
        </div>
      ) : (
        <TableContainer
          component={Paper}
          className="auction-table-container"
          sx={{ border: "1px solid black" }}
        >
          <Table>
            <TableHead>
              <TableRow style={{ backgroundColor: "black" }}>
                <TableCell
                  style={{
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Thời Gian
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Nội Dung
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Đánh giá
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Ảnh Đánh Giá
                </TableCell>
                <TableCell
                  style={{
                    color: "white",
                    textAlign: "center",
                    whiteSpace: "nowrap",
                  }}
                >
                  Chi Tiết
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {feedbacks &&
                paginatedData.map((feedback, index) => (
                  <TableRow key={index}>
                    <TableCell style={{ whiteSpace: "nowrap" }} align="center">
                      {new Date(feedback.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell align="center">{feedback.comment}</TableCell>
                    <TableCell align="center">
                      <div className="flex items-center justify-center gap-2">
                        {feedback.rating}{" "}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          width="16"
                          height="16"
                          fill="#fcdb03"
                        >
                          <path d="M12.0006 18.26L4.94715 22.2082L6.52248 14.2799L0.587891 8.7918L8.61493 7.84006L12.0006 0.5L15.3862 7.84006L23.4132 8.7918L17.4787 14.2799L19.054 22.2082L12.0006 18.26Z"></path>
                        </svg>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      <Avatar.Group shape="square" size={40} max={{ count: 5 }}>
                        {feedback.attachedImages &&
                          feedback.attachedImages.map((img) => (
                            <Avatar src={img} alt="" />
                          ))}
                      </Avatar.Group>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => openModal(feedback)}
                      >
                        <VisibilityOutlinedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 15]}
            component="div"
            count={totalFeedback || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </TableContainer>
      )}

      <ModalFeedback
        isOpen={isModalOpen}
        feedback={selectedFeedback}
        onClose={closeModal}
      />
    </div>
  );
};

export default FeedbackManagement;
