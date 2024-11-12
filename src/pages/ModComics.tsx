import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/report/Sidebar';
import ManageComics from '../components/report/ManageComics';
const ModComics: React.FC = () => {

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl)

    const [selectedMenuItem, setSelectedMenuItem] = useState('comics');
    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    return (
        <div className="account-user-container w-full">
            <Grid container spacing={3}>
                <Grid size={2} className="account-menu">
                    <Sidebar onSelect={setSelectedMenuItem}/>
                </Grid>
                <Grid size={10}>
                    <div className="content-section">
                        <ManageComics />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};
export default ModComics;