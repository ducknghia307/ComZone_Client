import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/accountmanagement/Sidebar';
import AuctionHistory from '../components/auction/AuctionHistory';
import ExchangeHistory from '../components/exchange/ExchangeHistory';

const ExchangeUser: React.FC = () => {
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
                        <ExchangeHistory />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ExchangeUser;
