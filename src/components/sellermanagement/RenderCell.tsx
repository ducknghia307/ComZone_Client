import React, { useState } from "react";
import { IconButton, Menu, MenuItem, Button } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useNavigate } from "react-router-dom";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import {
  EditOutlined,
  EyeOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";

export const RenderCell = ({ params, handleStopSelling }) => {
  console.log(params);

  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ padding: "30px" }}
      >
        <MenuItem
          onClick={() => {
            navigate(`/sellermanagement/edit/${params.row.id}`);
          }}
          sx={{ borderBottom: "1px solid #D5D5D5", color: "green" }}
        >
          <EditOutlinedIcon sx={{ fontSize: "20px", marginRight: "6px" }} />{" "}
          Chỉnh sửa truyện
        </MenuItem>
        {params.row.type === "SELL" && (
          <MenuItem
            onClick={() => {
              handleStopSelling(params.row); // Call handleStopSelling with the comic
              handleClose();
            }}
            sx={{ borderBottom: "1px solid #D5D5D5", color: "red" }}
          >
            <DoDisturbIcon
              sx={{ fontSize: "20px", marginRight: "6px" }}
              color="error"
            />
            Dừng bán truyện
          </MenuItem>
        )}
        {params.row.type !== "AUCTION" && (
          <MenuItem
            onClick={() => {
              navigate(`/detail/${params.row.id}`);
            }}
            sx={{ borderBottom: "1px solid #D5D5D5", color: "#349bff" }}
          >
            <EyeOutlined style={{ fontSize: "20px", marginRight: "6px" }} />
            Xem trước
          </MenuItem>
        )}
        {/* <MenuItem
          onClick={() => {
          handleClose();
          }}
          sx={{ borderBottom: "1px solid #D5D5D5" }} // Add borderBottom here
        >
          Xóa truyện
        </MenuItem> */}
      </Menu>

      <Button
        variant="outlined"
        onClick={handleClick}
        sx={{ marginLeft: "10px" }}
      >
        Xem thêm
      </Button>
    </>
  );
};
