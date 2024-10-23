import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import CreateOutlinedIcon from '@mui/icons-material/CreateOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import TvOutlinedIcon from '@mui/icons-material/TvOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import MultipleStopOutlinedIcon from '@mui/icons-material/MultipleStopOutlined';
import OrderHistory from '../components/order/OrderHistory';
import Sidebar from '../components/accountmanagement/Sidebar';
import ProfileUser from './ProfileUser';

const Profile: React.FC = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState('purchase');

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };


    return (
        <div className="account-user-container w-full">
            <Grid container spacing={3}>
                <Grid size={2.5} className="account-menu">
                    <Sidebar/>
                </Grid>
                <Grid size={9.5}>
                    <div className="content-section">
                        <ProfileUser />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default Profile;
