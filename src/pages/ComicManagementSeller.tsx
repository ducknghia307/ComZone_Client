import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/sellermanagement/Sidebar';
import SellerManagement from '../components/sellermanagement/SellerManagement';
const ComicSeller: React.FC = () => {

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl)

    const [selectedMenuItem, setSelectedMenuItem] = useState('comic');
    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    return (
        <div className="account-user-container w-full">
            <Grid container spacing={3}>
                <Grid size={2} className="account-menu">
                    <Sidebar currentUrl={currentUrl} handleMenuItemClick={handleMenuItemClick} />
                </Grid>
                <Grid size={10}>
                    <div className="content-section">
                        <SellerManagement />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};
export default ComicSeller;