import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import { Modal, Tooltip, Input, message, MenuProps, Dropdown } from "antd";
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
import { DeleteOutline } from "@mui/icons-material";
import { Merchandise } from "../../common/interfaces/merchandise.interface";

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
  const [merchandises, setMerchandises] = useState<Merchandise[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newMerchandise, setNewMerchandise] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [newSubName, setNewSubName] = useState("");
  const [newCaution, setNewCaution] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [merchandiseId, setMerchandiseId] = useState<string | null>(null);

  const getMenuItems = (merchandiseId: string): MenuProps["items"] => [
    {
      key: "1",
      label: "Chỉnh sửa",
      icon: <EditOutlined style={{ fontSize: 18 }} />,
      onClick: () => handleEdit(merchandiseId),
    },
    {
      key: "2",
      label: "Xóa",
      icon: <DeleteOutline style={{ fontSize: 18 }} />,
      onClick: () => confirmDelete(merchandiseId),
      danger: true,
    },
  ];

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
    setMerchandiseId(null);
    setNewMerchandise("");
    setNewDescription("");
    setNewSubName("");
    setNewCaution("");
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setMerchandiseId(null);
    setNewMerchandise("");
    setNewDescription("");
    setNewSubName("");
    setNewCaution("");
  };

  const handleEdit = (id: string) => {
    const merchandiseToEdit = merchandises.find((m) => m.id === id);
    if (merchandiseToEdit) {
      setNewMerchandise(merchandiseToEdit.name);
      setNewSubName(merchandiseToEdit.subName);
      setNewDescription(merchandiseToEdit.description);
      setNewCaution(merchandiseToEdit.caution);
      setMerchandiseId(id);
      setIsEditing(true);
      showModal();
    }
  };

  const createOrUpdateMerchandise = async () => {
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
      if (isEditing && merchandiseId) {
        await privateAxios.put(`/merchandises/${merchandiseId}`, {
          name: newMerchandise,
          subName: newSubName,
          description: newDescription,
          caution: newCaution,
        });
        message.success("Phụ kiện đã được cập nhật thành công!");
      } else {
        await privateAxios.post("/merchandises", {
          name: newMerchandise,
          subName: newSubName,
          description: newDescription,
          caution: newCaution,
        });
        message.success("Phụ kiện đã được thêm thành công!");
      }
      fetchMerchandises();
      resetForm();
      handleOk();
    } catch (error) {
      console.error("Error creating/updating merchandise:", error);
      message.error("Có lỗi xảy ra khi thêm hoặc cập nhật phụ kiện.");
    }
  };

  const resetForm = () => {
    setNewMerchandise("");
    setNewSubName("");
    setNewDescription("");
    setNewCaution("");
    setIsEditing(false);
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
        onOk={createOrUpdateMerchandise}
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
          <label className="font-semibold">Lưu ý:</label>
          <Input
            value={newCaution}
            onChange={(e) => setNewCaution(e.target.value)}
            placeholder="Nhập cảnh báo"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={createOrUpdateMerchandise}
          >
            {isEditing ? "Cập nhật" : "Thêm"}
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
                    {merchandise.description || "Không có mô tả"}
                  </StyledTableCell>
                  <StyledTableCell>{merchandise.caution}</StyledTableCell>
                  <StyledTableCell>
                    <Dropdown
                      menu={{ items: getMenuItems(merchandise.id) }}
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
