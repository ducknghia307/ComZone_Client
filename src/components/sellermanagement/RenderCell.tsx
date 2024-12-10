import { useState } from "react";
import { Menu, MenuItem } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { useNavigate } from "react-router-dom";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import { EyeOutlined } from "@ant-design/icons";
import { DeleteOutline } from "@mui/icons-material";
import { privateAxios } from "../../middleware/axiosInstance";
import { message } from "antd";

export const RenderCell = ({
  params,
  handleStopSelling,
  handleDeleteComics,
}) => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const previewAuction = async (comicsId: string) => {
    await privateAxios
      .get(`auction/comics/${comicsId}`)
      .then((res) => {
        if (res.data) navigate(`/auctiondetail/${res.data.id}`);
        else message.warning("Không tìm thấy cuộc đấu giá!", 5);
      })
      .catch((err) => {
        message.warning("Không tìm thấy cuộc đấu giá!", 5);
        console.log(err);
      });
  };

  return (
    <div className="my-auto">
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        sx={{ padding: "30px" }}
      >
        {params.row.status === "UNAVAILABLE" && (
          <MenuItem
            onClick={() => {
              navigate(`/sellermanagement/edit/${params.row.id}`);
            }}
            sx={{ borderBottom: "1px solid #D5D5D5", color: "#0284c7" }}
          >
            <EditOutlinedIcon sx={{ fontSize: "20px", marginRight: "6px" }} />{" "}
            <p className="REM">Chỉnh sửa truyện</p>
          </MenuItem>
        )}

        {params.row.type === "SELL" && (
          <MenuItem
            onClick={() => {
              handleStopSelling(params.row);
              handleClose();
            }}
            sx={{ borderBottom: "1px solid #D5D5D5", color: "#ff1111" }}
          >
            <DoDisturbIcon sx={{ fontSize: "20px", marginRight: "6px" }} />
            <p className="REM">Dừng bán truyện</p>
          </MenuItem>
        )}

        {params.row.type !== "AUCTION" && (
          <MenuItem
            onClick={() => {
              navigate(`/detail/${params.row.id}`);
            }}
            sx={{ borderBottom: "1px solid #D5D5D5" }}
          >
            <EyeOutlined style={{ fontSize: "20px", marginRight: "6px" }} />
            <p className="REM">Xem trước</p>
          </MenuItem>
        )}

        {params.row.type === "AUCTION" && (
          <MenuItem
            onClick={() => {
              previewAuction(params.row.id);
            }}
            sx={{ borderBottom: "1px solid #D5D5D5" }}
          >
            <EyeOutlined style={{ fontSize: "20px", marginRight: "6px" }} />
            <p className="REM">Xem trước</p>
          </MenuItem>
        )}

        {params.row.status === "UNAVAILABLE" && (
          <MenuItem
            onClick={() => {
              handleDeleteComics(params.row);
              handleClose();
            }}
            sx={{ borderBottom: "1px solid #D5D5D5", color: "red" }}
          >
            <DeleteOutline sx={{ fontSize: "20px", marginRight: "6px" }} />
            <p className="REM">Xóa truyện</p>
          </MenuItem>
        )}
      </Menu>

      <button onClick={handleClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          width="24"
          height="24"
          fill="currentColor"
        >
          <path d="M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z"></path>
        </svg>
      </button>
    </div>
  );
};
