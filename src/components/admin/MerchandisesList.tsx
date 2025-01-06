import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import { Modal, Tooltip, Input, message } from "antd";
import { Genre } from "../../common/base.interface";
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

const MerchandisesList = () => {
  const [merchandises, setMerchandises] = useState<Genre[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMerchandise, setNewMerchandise] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newCaution, setNewCaution] = useState("");

  const fetchMerchandises = async () => {
    try {
      const response = await privateAxios.get("/merchandises");
      setMerchandises(response.data);
    } catch (error) {
      console.error("Error fetching merchandises:", error);
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

  const createMerchandise = async () => {
    if (!newMerchandise.trim()) {
      message.error("Tên phụ kiện không được để trống!");
      return;
    }
    if (!newSubName.trim()) {
      message.error("Tên phụ kiện phụ không được để trống!");
      return;
    }
    if (!newDescription.trim()) {
      message.error("Mô tả phụ kiện không được để trống!");
      return;
    }
    if (!newCaution.trim()) {
      message.error("Cảnh báo không được để trống!");
      return;
    }

    try {
      await privateAxios.post("/merchandises", {
        name: newMerchandise,
        subName: newSubName,
        description: newDescription,
        caution: newCaution,
      });
      message.success("Phụ kiện đã được thêm thành công!");
      fetchMerchandises();
      setNewMerchandise("");
      setNewSubName("");
      setNewDescription("");
      setNewCaution("");
      handleOk();
    } catch (error) {
      console.error("Error creating merchandise:", error);
      message.error("Có lỗi xảy ra khi thêm phụ kiện.");
    }
  };

  const deleteMerchandises = async (id: string) => {
    try {
      await privateAxios.delete(`/merchandises/${id}`);
      message.success("Phụ kiện đã được xóa thành công!");
      fetchMerchandises();
    } catch (error) {
      console.error("Error deleting merchandise:", error);
      message.error("Có lỗi xảy ra khi xóa phụ kiện.");
    }
  };

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa phụ kiện này?",
      onOk: () => deleteMerchandises(id),
    });
  };

  useEffect(() => {
    fetchMerchandises();
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
      <div className="w-full flex flex-row justify-between items-center  pb-6">
        <h2 className="text-3xl font-bold uppercase w-full">Phụ kiện</h2>
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
            Thêm phụ kiện
          </button>
        </div>
      </div>
      <Input
        placeholder="Tìm phụ kiện"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<SearchOutlined />}
        size="large"
      />
      <Modal
        open={isModalVisible}
        onOk={createMerchandise}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-5 py-3">
          <p className="font-bold text-2xl text-center">Thêm phụ kiện</p>
          <label className="font-semibold">Tên phụ kiện:</label>
          <Input
            value={newMerchandise}
            onChange={(e) => setNewMerchandise(e.target.value)}
            placeholder="Nhập tên thể loại"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <label className="font-semibold">Tên phụ kiện phụ:</label>
          <Input
            value={newSubName}
            onChange={(e) => setNewSubName(e.target.value)}
            placeholder="Nhập tên phụ kiện phụ"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <label className="font-semibold">Mô tả phụ kiện:</label>
          <TextArea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Nhập mô tả thể loại"
            maxLength={1000}
            rows={4}
            showCount
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300 "
          />
          <label className="font-semibold">Cảnh báo:</label>
          <Input
            value={newCaution}
            onChange={(e) => setNewCaution(e.target.value)}
            placeholder="Nhập cảnh báo"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={createMerchandise}
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
              <StyledTableCell className="text-nowrap">
                Tên phụ kiện
              </StyledTableCell>
              <StyledTableCell className="text-nowrap">
                Tên gọi khác
              </StyledTableCell>
              <StyledTableCell className="text-nowrap">
                Mô tả phụ kiện
              </StyledTableCell>
              <StyledTableCell>Lưu ý</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {merchandises
              .filter((merchandise) =>
                merchandise.name
                  .toLowerCase()
                  .includes(searchTerm.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((merchandise) => (
                <StyledTableRow key={merchandise.id}>
                  <StyledTableCell>{merchandise.name}</StyledTableCell>
                  <StyledTableCell>{merchandise.subName}</StyledTableCell>
                  <StyledTableCell className="line-clamp-3">
                    {merchandise.description}
                  </StyledTableCell>
                  <StyledTableCell>{merchandise.caution}</StyledTableCell>
                  <StyledTableCell>
                    <Tooltip title="Xóa">
                      <button
                        className="opacity-50 hover:opacity-100 duration-300"
                        onClick={() => confirmDelete(merchandise.id)}
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
          count={merchandises.length}
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

export default MerchandisesList;
