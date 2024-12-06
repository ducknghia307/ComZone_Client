import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/report/Sidebar';
import ManageDeliveries from '../components/report/ManageDeliveries';

const ModDeliveries: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('deliveries');

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl);

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    return (
        <div className="w-full">
            <Grid
                container
                sx={{
                    padding: '30px 40px',
                    '& .MuiGrid2-root': { // Target Grid items
                        paddingLeft: '24px',
                    },
                    backgroundColor: '#fedddb24'
                }}
            >
                <Grid
                    size={isCollapsed ? 0.5 : 2.5}
                    className="account-menu2"
                    sx={{
                        paddingLeft: '0 !important', // Remove left padding from sidebar
                    }}
                >
                    <Sidebar
                        isCollapsed={isCollapsed}
                        onToggleCollapse={handleToggleCollapse}
                        onSelect={handleMenuItemClick}
                    />
                </Grid>
                <Grid
                    size={isCollapsed ? 11.5 : 9.5}
                    sx={{
                        height: '100vh',
                    }}
                >
                    <div className="content-section2">
                        <ManageDeliveries />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ModDeliveries;
