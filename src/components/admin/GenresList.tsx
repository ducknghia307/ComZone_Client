import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import { Modal, Tooltip, Input, message, Dropdown } from "antd";
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
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { MenuProps } from "antd/lib";
import { DeleteOutline } from "@mui/icons-material";

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

const GenresList = () => {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGenre, setNewGenre] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingGenreId, setEditingGenreId] = useState<string | null>(null);
  const getMenuItems = (editionId: string): MenuProps["items"] => [
    {
      key: "1",
      label: "Chỉnh sửa",
      icon: <EditOutlined style={{ fontSize: 18 }} />,
      onClick: () => handleEdit(editionId),
    },
    {
      key: "2",
      label: "Xóa",
      icon: <DeleteOutline style={{ fontSize: 18 }} />,
      onClick: () => confirmDelete(editionId),
      danger: true,
    },
  ];
  const fetchGenres = async () => {
    try {
      const response = await privateAxios.get("/genres");
      setGenres(response.data);
    } catch (error) {
      console.error("Error fetching genres:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setEditingGenreId(null);
    setIsModalVisible(false);
    setNewGenre("");
    setNewDescription("");
  };

  const handleCancel = () => {
    setEditingGenreId(null);
    setIsModalVisible(false);
    setNewGenre("");
    setNewDescription("");
  };

  const handleEdit = (id: string) => {
    const genreToEdit = genres.find((genre) => genre.id === id);
    if (genreToEdit) {
      setNewGenre(genreToEdit.name);
      setNewDescription(genreToEdit.description);
      setEditingGenreId(id);
      showModal();
    }
  };

  const createGenre = async () => {
    if (!newGenre.trim()) {
      message.error("Tên thể loại không được để trống!");
      return;
    }
    if (!newDescription.trim()) {
      message.error("Mô tả thể loại không được để trống!");
      return;
    }

    try {
      if (editingGenreId) {
        await privateAxios.put(`/genres/${editingGenreId}`, {
          name: newGenre,
          description: newDescription,
        });
        message.success("Thể loại đã được cập nhật thành công!");
      } else {
        await privateAxios.post("/genres", {
          name: newGenre,
          description: newDescription,
        });
        message.success("Thể loại đã được thêm thành công!");
      }
      fetchGenres();
      setNewGenre("");
      setNewDescription("");
      setEditingGenreId(null);
      handleOk();
    } catch (error) {
      console.error("Error creating/updating genre:", error);
      message.error("Có lỗi xảy ra khi thêm/cập nhật thể loại.");
    }
  };

  const deleteGenre = async (id: string) => {
    try {
      await privateAxios.delete(`/genres/${id}`);
      message.success("Thể loại đã được xóa thành công!");
      fetchGenres();
    } catch (error) {
      console.error("Error deleting genre:", error);
      message.error("Có lỗi xảy ra khi xóa thể loại.");
    }
  };

  const confirmDelete = (id: string) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa thể loại này?",
      onOk: () => deleteGenre(id),
    });
  };

  useEffect(() => {
    fetchGenres();
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
        <h2 className="text-3xl font-bold uppercase w-full">Thể loại truyện</h2>
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
            Thêm thể loại truyện
          </button>
        </div>
      </div>
      <Input
        placeholder="Tìm thể loại"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        prefix={<SearchOutlined />}
        size="large"
      />
      <Modal
        open={isModalVisible}
        onOk={createGenre}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-5 py-3">
          <p className="font-bold text-2xl text-center">Thêm thể loại truyện</p>
          <label className="font-semibold">Tên thể loại:</label>
          <Input
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            placeholder="Nhập tên thể loại"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <label className="font-semibold">Mô tả thể loại:</label>
          <TextArea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            placeholder="Nhập mô tả thể loại"
            maxLength={1000}
            rows={4}
            showCount
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300 "
          />
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={createGenre}
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
              <StyledTableCell>Thể loại truyện</StyledTableCell>
              <StyledTableCell>Mô tả thể loại</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {genres
              .filter((genre) =>
                genre.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((genre) => (
                <StyledTableRow key={genre.id}>
                  <StyledTableCell>{genre.name}</StyledTableCell>
                  <StyledTableCell className="line-clamp-3">
                    {genre.description || "Không có mô tả"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Dropdown
                      menu={{ items: getMenuItems(genre.id) }}
                      trigger={["click"]}
                      placement="bottomRight"
                    >
                      <button className="opacity-50 hover:opacity-100 duration-300">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="black"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <circle cx="12" cy="12" r="1" />
                          <circle cx="12" cy="5" r="1" />
                          <circle cx="12" cy="19" r="1" />
                        </svg>
                      </button>
                    </Dropdown>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[20, 30, 50]}
          count={genres.length}
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

export default GenresList;
