import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/report/Sidebar';
import ManageExchanges from '../components/report/ManageExchanges';
import ManageDeposits from '../components/report/ManageDeposits';
import ManageFeedbacks from '../components/report/ManageFeedbacks';
const ModFeedbacks: React.FC = () => {

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl)

    const [selectedMenuItem, setSelectedMenuItem] = useState('feedbacks');
    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    return (
        <div className="account-user-container w-full">
            <Grid container spacing={3}>
                <Grid size={2.5} className="account-menu">
                    <Sidebar onSelect={setSelectedMenuItem}/>
                </Grid>
                <Grid size={9.5}>
                    <div className="content-section">
                        <ManageFeedbacks />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};
export default ModFeedbacks;