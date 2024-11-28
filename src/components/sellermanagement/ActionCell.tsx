import React, { useState } from "react";
import { Modal, Button, Typography } from "antd";
import { IconButton } from "@mui/material";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const ActionCell = ({
  params,
  handleAuction,
  handleSell,
  handleStopSelling,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Replace the icons with "Xem thêm" button */}
      <Button
        type="text"
        onClick={showModal}
        style={{
          color: "#1890ff",
          padding: "0",
          display: "flex",
          alignItems: "center",
          gap: "5px",
        }}
      >
        Xem thêm <MoreHorizIcon />
      </Button>

      {/* Modal content */}
      <Modal
        title="Chọn hành động"
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
      >
        <Typography.Text>
          Vui lòng chọn một hành động cho sản phẩm này:
        </Typography.Text>
        <div style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
          <Button
            type="primary"
            onClick={() => {
              handleSell(params.row);
              closeModal();
            }}
            style={{ width: "100%" }}
          >
            Đăng bán
          </Button>
          <Button
            type="primary"
            onClick={() => {
              handleAuction(params.row);
              closeModal();
            }}
            style={{ width: "100%" }}
          >
            Đấu giá
          </Button>
          <Button
            danger
            onClick={() => {
              handleStopSelling(params.row);
              closeModal();
            }}
            style={{ width: "100%" }}
          >
            Dừng bán
          </Button>
        </div>
      </Modal>
    </>
  );
};

export default ActionCell;
