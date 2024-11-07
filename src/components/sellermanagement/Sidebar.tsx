import React from "react";
import { useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid2";
import ImportContactsRoundedIcon from "@mui/icons-material/ImportContactsRounded";
import TvOutlinedIcon from "@mui/icons-material/TvOutlined";
import DeliveryDiningOutlinedIcon from "@mui/icons-material/DeliveryDiningOutlined";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import "../ui/SellerCreateComic.css";

interface SidebarProps {
    currentUrl: string;
    handleMenuItemClick: (item: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentUrl, handleMenuItemClick }) => {
    const navigate = useNavigate();

    return (
        <Grid sx={{ backgroundColor: '#fff' }}>
            <div>
                <ul>
                    <li
                        className={`menu-item ${currentUrl === '/sellermanagement/comic' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('comic'); navigate('/sellermanagement/comic') }}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        <ImportContactsRoundedIcon /> Quản Lý Truyện
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/sellermanagement/order' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('order'); navigate('/sellermanagement/order') }}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        <InventoryOutlinedIcon /> Quản Lý Đơn Hàng
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/sellermanagement/auction' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('auction'); navigate('/sellermanagement/auction') }}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        <TvOutlinedIcon /> Quản Lý Đấu Giá
                    </li>
                    <li
                        className={`menu-item ${currentUrl === '/sellermanagement/delivery' ? 'active' : ''}`}
                        onClick={() => { handleMenuItemClick('delivery'); navigate('/sellermanagement/delivery') }}
                        style={{ whiteSpace: "nowrap" }}
                    >
                        <DeliveryDiningOutlinedIcon /> Thông Tin Giao Hàng
                    </li>
                </ul>
            </div>
        </Grid>
    );
};

export default Sidebar;
