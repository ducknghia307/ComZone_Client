import React, { useEffect, useState } from "react";
import { privateAxios } from "../../middleware/axiosInstance";
import {
  Modal,
  Tooltip,
  Input,
  message,
  Dropdown,
  Menu,
  MenuProps,
  Switch,
} from "antd";
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
import { EditOutlined, SearchOutlined, SmileOutlined } from "@ant-design/icons";
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

const EditionsList = () => {
  const [editions, setEditions] = useState<Edition[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newEdition, setNewEdition] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingEdition, setEditingEdition] = useState<Edition | null>(null);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isSpecial, setIsSpecial] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const getMenuItems = (editionId: string): MenuProps["items"] => [
    {
      key: "1",
      label: "Chỉnh sửa",
      icon: <EditOutlined style={{ fontSize: 18 }} />,
      onClick: () => showModal(editions.find((e) => e.id === editionId)),
    },
    {
      key: "2",
      label: "Xóa",
      icon: <DeleteOutline style={{ fontSize: 18 }} />,
      onClick: () => confirmDelete(editionId),
      danger: true,
    },
  ];

  const fetchEditions = async () => {
    try {
      const response = await privateAxios.get("/editions");
      setEditions(response.data);
    } catch (error) {
      console.error("Error fetching editions:", error);
    }
  };

  const showModal = (editionToEdit: Edition | null = null) => {
    if (editionToEdit) {
      setEditingEdition(editionToEdit);
      setIsSpecial(editionToEdit.isSpecial);
      setIsEditing(true);
    } else {
      setNewEdition("");
      setNewDescription("");
      setIsSpecial(false);
      setIsEditing(false);
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
    setEditingEdition(null);
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
        isSpecial,
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

  const handleEditSubmit = async () => {
    if (!editingEdition) return;

    if (!editingEdition.name.trim()) {
      message.error("Tên phiên bản không được để trống!");
      return;
    }
    if (!editingEdition.description.trim()) {
      message.error("Mô tả phiên bản không được để trống!");
      return;
    }

    try {
      await privateAxios.patch(`/editions/${editingEdition.id}`, {
        name: editingEdition.name,
        description: editingEdition.description,
        isSpecial: editingEdition.isSpecial,
      });
      message.success("Cập nhật phiên bản thành công!");
      setIsEditModalVisible(false);
      fetchEditions();
    } catch (error) {
      console.error("Error updating edition:", error);
      message.error("Có lỗi xảy ra khi cập nhật phiên bản.");
    }
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

  const handleSubmit = async () => {
    if (isEditing) {
      await handleEditSubmit();
    } else {
      await createEdition();
    }
    setIsModalVisible(false);
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
            onClick={() => showModal()}
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
        onOk={handleSubmit}
        onCancel={handleOk}
        footer={null}
      >
        <div className="flex flex-col gap-5 py-3">
          <p className="font-bold text-2xl text-center">
            {isEditing ? "Chỉnh sửa phiên bản" : "Thêm phiên bản"}
          </p>
          <label className="font-semibold">Tên phiên bản:</label>
          <Input
            value={isEditing ? editingEdition?.name : newEdition}
            onChange={(e) => {
              if (isEditing) {
                setEditingEdition((prev) =>
                  prev ? { ...prev, name: e.target.value } : null
                );
              } else {
                setNewEdition(e.target.value);
              }
            }}
            placeholder="Nhập tên phiên bản"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <label className="font-semibold">Mô tả phiên bản:</label>
          <TextArea
            value={isEditing ? editingEdition?.description : newDescription}
            onChange={(e) => {
              if (isEditing) {
                setEditingEdition((prev) =>
                  prev ? { ...prev, description: e.target.value } : null
                );
              } else {
                setNewDescription(e.target.value);
              }
            }}
            placeholder="Nhập mô tả phiên bản"
            maxLength={1000}
            rows={4}
            showCount
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <div className="flex flex-row gap-3 items-center justify-start">
            <div className="flex flex-row gap-1 items-center">
              <label className="font-semibold">Highlight phiên bản</label>
              <Tooltip title="Khi bấm chọn thì phiên bản sẽ được hiện thị trên giao diện của người dùng">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#CCC"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 16v-4" />
                  <path d="M12 8h.01" />
                </svg>
              </Tooltip>
              :
            </div>
            <Switch
              checked={isEditing ? editingEdition?.isSpecial : isSpecial}
              onChange={(checked) => {
                if (isEditing) {
                  setEditingEdition((prev) =>
                    prev ? { ...prev, isSpecial: checked } : null
                  );
                } else {
                  setIsSpecial(checked);
                }
              }}
            />
          </div>
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={handleSubmit}
          >
            {isEditing ? "Cập nhật" : "Thêm"}
          </button>
        </div>
      </Modal>
      <Modal
        open={isEditModalVisible}
        onCancel={() => setIsEditModalVisible(false)}
        footer={null}
      >
        <div className="flex flex-col gap-5 py-3">
          <p className="font-bold text-2xl text-center">Chỉnh sửa phiên bản</p>
          <label className="font-semibold">Tên phiên bản:</label>
          <Input
            value={editingEdition?.name}
            onChange={(e) =>
              setEditingEdition((prev) =>
                prev ? { ...prev, name: e.target.value } : null
              )
            }
            placeholder="Nhập tên phiên bản"
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <label className="font-semibold">Mô tả phiên bản:</label>
          <TextArea
            value={editingEdition?.description}
            onChange={(e) =>
              setEditingEdition((prev) =>
                prev ? { ...prev, description: e.target.value } : null
              )
            }
            placeholder="Nhập mô tả phiên bản"
            maxLength={1000}
            rows={4}
            showCount
            className="p-3 rounded-lg placeholder:text-gray-300 border border-gray-300"
          />
          <div className="w-full flex flex-row gap-3">
            <label className="font-semibold">Highlight phiên bản:</label>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ccc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
          </div>
          <Switch
            checked={editingEdition?.isSpecial || false}
            onChange={(checked) =>
              setEditingEdition((prev) =>
                prev ? { ...prev, isSpecial: checked } : null
              )
            }
          />
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={handleEditSubmit}
          >
            Cập nhật
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
              <StyledTableCell className="text-nowrap">
                Được đấu giá
              </StyledTableCell>

              <StyledTableCell className="text-nowrap">
                Highlight phiên bản
              </StyledTableCell>
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

                  <StyledTableCell className="line-clamp-3">
                    <div className="flex items-center justify-center">
                      {edition.auctionDisabled ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="green"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="red"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      )}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell className="line-clamp-3">
                    <div className="flex items-center justify-center">
                      {edition.isSpecial ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="green"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="red"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M18 6 6 18" />
                          <path d="m6 6 12 12" />
                        </svg>
                      )}
                    </div>
                  </StyledTableCell>
                  <StyledTableCell>
                    <Dropdown
                      menu={{ items: getMenuItems(edition.id) }}
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
