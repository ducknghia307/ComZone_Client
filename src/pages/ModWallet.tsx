import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/report/Sidebar';
import ManageWallet from '../components/report/ManageWallet';

const ModWallet: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('comics');

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
                        <ManageWallet />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ModWallet;
