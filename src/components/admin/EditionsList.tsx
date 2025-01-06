import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import { Modal, Tooltip, Input, message } from "antd";
import {
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import TablePagination from "@mui/material/TablePagination";
import { Edition } from "../../common/interfaces/edition.interface";
import { SearchOutlined } from "@ant-design/icons";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${theme.palette.mode === "light" ? "body" : "background.default"}`]: {
    backgroundColor: theme.palette.background.default,
  },
  [`&.${theme.palette.mode === "light" ? "body" : "background.paper"}`]: {
    backgroundColor: theme.palette.background.paper,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const { TextArea } = Input;

const EditionsList = () => {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEdition, setNewEdition] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchEditions = async () => {
    try {
      const response = await privateAxios.get("/editions");
      setEditions(response.data);
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const createEdition = async () => {
    if (!newEdition.trim()) {
      message.error("Tên phiên bản không được để trống!");
      return;
    }
    if (!newDescription.trim()) {
      message.error("Mô tả phiên bản không được để trống!");
      return;
    }

    try {
      await privateAxios.post("/editions", {
        name: newEdition,
        description: newDescription,
      });
      message.success("Phiên bản đã được thêm thành công!");
      fetchEditions();
      setNewEdition("");
      setNewDescription("");
      handleOk();
    } catch (error) {
      console.error("Error creating edition:", error);
      message.error("Có lỗi xảy ra khi thêm phiên bản.");
    }
  };

  const deleteEdition = async (id: string) => {
    try {
      await privateAxios.delete(`/editions/${id}`);
      message.success("Phiên bản đã được xóa thành công!");
      fetchEditions();
    } catch (error) {
      console.error("Error deleting edition:", error);
      message.error("Có lỗi xảy ra khi xóa phiên bản.");
    }
  };

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa phiên bản này?",
      onOk: () => deleteEdition(id),
    });
  };

  useEffect(() => {
    fetchEditions();
  }, []);

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <div className="w-full flex flex-row justify-between items-center pb-6">
        <h2 className="text-3xl font-bold uppercase w-full text-nowrap">
          Danh sách phiên bản
        </h2>
        <div className="w-full flex justify-end">
          <button
            className="px-5 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold flex flex-row gap-3 items-center justify-center"
            onClick={showModal}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#FFFFFF"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14" />
              <path d="M12 5v14" />
            </svg>
            Thêm phiên bản
          </button>
        </div>
      </div>
      <Input
        placeholder="Tìm phiên bản"
        value={searchTerm}
        prefix={<SearchOutlined />}
        onChange={(e) => setSearchTerm(e.target.value)}
        size="large"
      />
      <Modal
        open={isModalVisible}
        onOk={createEdition}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-5 py-3">
          <p className="font-bold text-2xl text-center">Thêm phiên bản</p>
          <label className="font-semibold">Tên phiên bản:</label>
          <Input
            value={newEdition}
            onChange={(e) => setNewEdition(e.target.value)}
            placeholder="Nhập tên phiên bản"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <label className="font-semibold">Mô tả phiên bản:</label>
          <TextArea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Nhập mô tả phiên bản"
            maxLength={1000}
            rows={4}
            showCount
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={createEdition}
          >
            Thêm
          </button>
        </div>
      </Modal>
      <TableContainer>
        <Table
          sx={{
            minWidth: 700,
            "& .MuiTableCell-root": {
              fontFamily: "REM",
            },
          }}
        >
          <TableHead>
            <TableRow>
              <StyledTableCell>Tên phiên bản</StyledTableCell>
              <StyledTableCell>Mô tả phiên bản</StyledTableCell>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {editions
              .filter((edition) =>
                edition.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((edition) => (
                <StyledTableRow key={edition.id}>
                  <StyledTableCell className="text-nowrap">
                    {edition.name}
                  </StyledTableCell>
                  <StyledTableCell className="line-clamp-3">
                    {edition.description || "Không có mô tả"}
                  </StyledTableCell>
                  <StyledTableCell className="line-clamp-3 text-nowrap">
                    {edition.auctionDisabled
                      ? "Được đấu giá"
                      : "Không được đấu giá"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="Xóa">
                      <button
                        className="opacity-50 hover:opacity-100 duration-300"
                        onClick={() => confirmDelete(edition.id)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="red"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M3 6h18" />
                          <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                          <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                          <line x1="10" x2="10" y1="11" y2="17" />
                          <line x1="14" x2="14" y1="11" y2="17" />
                        </svg>
                      </button>
                    </Tooltip>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[20, 30, 50]}
          count={editions.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            width: "100%",
          }}
        />
      </TableContainer>
    </>
  );
};

export default EditionsList;
