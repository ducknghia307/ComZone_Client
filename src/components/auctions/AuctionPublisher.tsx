import React from "react";
import { Chip } from "@mui/material";
import { Comic } from "../../common/base.interface";

const AuctionPublisher: React.FC<{ comic: Comic }> = ({ comic }) => {
  return (
    <div
      style={{
        padding: "30px",
        backgroundColor: "#f9f9f9",
        borderRadius: "10px",
        boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <p style={{ fontSize: "18px", fontFamily: "REM", color: "#000" }}>
          Thể loại:
        </p>
        <span
          style={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "18px",
            fontFamily: "REM",
          }}
        >
          {comic.genres.map((genre) => genre.name).join(", ")}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontFamily: "REM",
            // fontWeight: "500",
            color: "#000",
          }}
        >
          Tác Giả:
        </p>
        <span
          style={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "18px",
            fontFamily: "REM",
          }}
        >
          {comic.author}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontFamily: "REM",
            // fontWeight: "500",
            color: "#000",
          }}
        >
          Phân loại:
        </p>
        <span
          style={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "18px",
            fontFamily: "REM",
          }}
        >
          {comic.quantity > 1 ? "Bộ truyện" : "Tập truyện"}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "15px",
          borderBottom: "1px solid #ddd",
          marginBottom: "15px",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontFamily: "REM",
            // fontWeight: "500",
            color: "#000",
          }}
        >
          {comic.quantity > 1 ? "Số Quyển:" : "Số Trang:"}
        </p>
        <span
          style={{
            fontWeight: "bold",
            color: "#000",
            fontSize: "18px",
            fontFamily: "REM",
          }}
        >
          {comic.quantity > 1 ? `${comic.quantity}` : `${comic.page}`}
        </span>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingBottom: "10px",
        }}
      >
        <p
          style={{
            fontSize: "18px",
            fontFamily: "REM",
            // fontWeight: "500",
            color: "#000",
          }}
        >
          Phiên Bản:
        </p>
        <Chip
          label={comic.edition.name}
          style={{
            fontFamily: "REM",
            fontSize: "16px",
            fontWeight: "bold",
            padding: "10px 15px",
            backgroundColor: "#f8f9fa",
            color: "#000",
            border: "1px solid #000",
            borderRadius: "20px",
            boxShadow: "0px 2px 4px rgba(0,0,0,0.1)",
          }}
        />
      </div>
    </div>
  );
};

export default AuctionPublisher;
