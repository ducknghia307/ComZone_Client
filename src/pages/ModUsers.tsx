import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/report/Sidebar';
import ManageUsers from '../components/report/ManageUsers';
const ModUsers: React.FC = () => {

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl)

    const [selectedMenuItem, setSelectedMenuItem] = useState('users');
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
                        <ManageUsers />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};
export default ModUsers;