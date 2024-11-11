import React, { useState } from 'react';
import Sidebar from './Sidebar';
import ManageComics from './ManageComics';
import ManageUsers from './ManageUsers';
import ManageOrders from './ManageOrders';
import Grid from '@mui/material/Grid2';
import ManageAuctions from './ManageAutions';
import ManageExchanges from './ManageExchanges';
import ManageDeposits from './ManageDeposits';
import ManageFeedbacks from './ManageFeedbacks';

const ModManagement: React.FC = () => {
    const [selectedMenuItem, setSelectedMenuItem] = useState<string>('comics');

    const renderContent = () => {
        switch (selectedMenuItem) {
            case 'comics':
                return <ManageComics />;
            case 'users':
                return <ManageUsers />;
            case 'orders':
                return <ManageOrders />;
            case 'auctions':
                return <ManageAuctions />;
            case 'exchanges':
                return <ManageExchanges />;
            case 'deposits':
                return <ManageDeposits />;
            case 'feedbacks':
                return <ManageFeedbacks />;
            default:
                return null;
        }
    };

    return (
        <div className="account-user-container">
            <Grid container spacing={3}>
                <Grid size={2.5} className="account-menu">
                    <Sidebar onSelect={setSelectedMenuItem} /></Grid>

                <Grid size={9.5}>
                    <div className="content-section">
                        {renderContent()}
                    </div>
                </Grid>
            </Grid>

        </div>
    );
};

export default ModManagement;
