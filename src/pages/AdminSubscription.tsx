import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/admin/Sidebar';
import SubscriptionPlans from '../components/admin/SubscriptionPlans';

const ModUsers: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('users');

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
                        // paddingRight: '24px',
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
                    />
                </Grid>
                <Grid 
                    size={isCollapsed ? 11.5 : 9.5} 
                    sx={{
                        height: '100vh',
                    }}
                >
                    <div className="content-section2">
                        <SubscriptionPlans />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ModUsers;