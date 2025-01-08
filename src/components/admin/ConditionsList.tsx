import React, { useEffect, useState } from "react";
import { privateAxios, publicAxios } from "../../middleware/axiosInstance";
import { Modal, Tooltip, Input, message, Dropdown } from "antd";
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
import { Condition } from "../../common/interfaces/condition.interface";

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

const ConditionsList = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newCondition, setNewCondition] = useState<Condition>({
    name: "",
    description: "",
    usageLevel: "",
    value: 0,
    isRemarkable: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editingConditionValue, setEditingConditionValue] = useState<
    number | null
  >(null);
  const getMenuItems = (conditionValue: number): MenuProps["items"] => [
    {
      key: "1",
      label: "Chỉnh sửa",
      icon: <EditOutlined style={{ fontSize: 18 }} />,
      onClick: () => handleEdit(conditionValue),
    },
    {
      key: "2",
      label: "Xóa",
      icon: <DeleteOutline style={{ fontSize: 18 }} />,
      onClick: () => confirmDelete(conditionValue),
      danger: true,
    },
  ];

  const fetchConditions = async () => {
    try {
      const response = await publicAxios.get("/conditions");
      setConditions(response.data);
    } catch (error) {
      console.error("Error fetching conditions:", error);
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setEditingConditionValue(null);
    setIsModalVisible(false);
    setNewCondition({
      name: "",
      description: "",
      usageLevel: "",
      value: 0,
      isRemarkable: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  };

  const handleCancel = () => {
    handleOk();
  };
  const handleEdit = (value: number) => {
    const conditionToEdit = conditions.find(
      (condition) => condition.value === value
    );
    if (conditionToEdit) {
      setNewCondition(conditionToEdit);
      setEditingConditionValue(value);
      showModal();
    }
  };

  const createCondition = async () => {
    if (!newCondition.name.trim()) {
      message.error("Tên tình trạng không được để trống!");
      return;
    }
    if (!newCondition.description.trim()) {
      message.error("Mô tả tình trạng không được để trống!");
      return;
    }
    if (!newCondition.usageLevel.trim()) {
      message.error("Mức độ sử dụng không được để trống!");
      return;
    }
    if (newCondition.value >= 11 || newCondition.value < 0) {
      message.error("Giá trị phải từ 0 đến 10!");
      return;
    }
    const existingValue = conditions.find(
      (c) => c.value === newCondition.value
    );

    try {
      if (editingConditionValue) {
        await privateAxios.patch(
          `/conditions/${editingConditionValue}`,
          newCondition
        );
        message.success("Tình trạng đã được cập nhật thành công!");
      } else {
        if (existingValue) {
          message.error("Giá trị này đã tồn tại!");
          return;
        }
        await privateAxios.post("/conditions", newCondition);
        message.success("Tình trạng đã được thêm thành công!");
      }
      fetchConditions();
      handleOk();
    } catch (error) {
      console.error("Error creating/updating condition:", error);
      message.error("Có lỗi xảy ra khi thêm/cập nhật tình trạng.");
    }
  };

  const deleteCondition = async (value: number) => {
    try {
      await privateAxios.delete(`/conditions/${value}`);
      message.success("Tình trạng đã được xóa thành công!");
      fetchConditions();
    } catch (error) {
      console.error("Error deleting condition:", error);
      message.error("Có lỗi xảy ra khi xóa tình trạng.");
    }
  };

  const confirmDelete = (value: number) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: "Bạn có chắc chắn muốn xóa tình trạng này?",
      onOk: () => deleteCondition(value),
    });
  };

  useEffect(() => {
    fetchConditions();
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
        <h2 className="text-3xl font-bold uppercase w-full">
          Tình trạng truyện
        </h2>
        <div className="w-full flex justify-end">
          {conditions.length < 11 && (
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
              Thêm tình trạng truyện
            </button>
          )}
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
        onOk={createCondition}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex flex-col gap-5 py-3">
          <p className="font-bold text-2xl text-center">
            {editingConditionValue
              ? "Sửa tình trạng truyện"
              : "Thêm tình trạng truyện"}
          </p>
          <label className="font-semibold">Giá trị:</label>
          <Input
            type="number"
            value={newCondition.value}
            onChange={(e) =>
              setNewCondition({
                ...newCondition,
                value: Number(e.target.value),
              })
            }
            placeholder="Nhập giá trị"
            className="p-3 rounded-lg"
          />
          <label className="font-semibold">Tên tình trạng:</label>
          <Input
            value={newCondition.name}
            onChange={(e) =>
              setNewCondition({ ...newCondition, name: e.target.value })
            }
            placeholder="Nhập tên tình trạng"
            className="p-3 rounded-lg"
          />
          <label className="font-semibold">Mức độ sử dụng:</label>
          <Input
            value={newCondition.usageLevel}
            onChange={(e) =>
              setNewCondition({ ...newCondition, usageLevel: e.target.value })
            }
            placeholder="Nhập mức độ sử dụng"
            className="p-3 rounded-lg"
          />
          <label className="font-semibold">Mô tả:</label>
          <TextArea
            value={newCondition.description}
            onChange={(e) =>
              setNewCondition({ ...newCondition, description: e.target.value })
            }
            placeholder="Nhập mô tả tình trạng"
            maxLength={1000}
            rows={4}
            showCount
            className="p-3 rounded-lg"
          />
          <button
            className="px-5 mt-3 py-3 bg-[#c66a7a] rounded-lg hover:opacity-70 duration-300 text-white font-bold"
            onClick={createCondition}
          >
            {editingConditionValue ? "Cập nhật" : "Thêm"}
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
              <StyledTableCell>Giá trị</StyledTableCell>
              <StyledTableCell>Tên tình trạng</StyledTableCell>
              <StyledTableCell>Mức độ sử dụng</StyledTableCell>
              <StyledTableCell>Mô tả</StyledTableCell>
              <StyledTableCell></StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {conditions
              .filter((condition) =>
                condition.name.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((condition) => (
                <StyledTableRow key={condition.value}>
                  <StyledTableCell>{condition.value}</StyledTableCell>
                  <StyledTableCell>{condition.name}</StyledTableCell>
                  <StyledTableCell>{condition.usageLevel}</StyledTableCell>
                  <StyledTableCell className="line-clamp-3">
                    {condition.description || "Không có mô tả"}
                  </StyledTableCell>
                  <StyledTableCell>
                    <Dropdown
                      menu={{ items: getMenuItems(condition.value) }}
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
      </TableContainer>
    </>
  );
};

export default ConditionsList;
