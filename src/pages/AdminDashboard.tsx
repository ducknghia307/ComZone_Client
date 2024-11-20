import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/admin/Sidebar';
import Dashboard from '../components/admin/Dashboard';
const ModUsers: React.FC = () => {

    const currentUrl = window.location.pathname;
    console.log('URL', currentUrl)
    const [isCollapsed, setIsCollapsed] = useState(false);

    const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');
    const handleMenuItemClick = (item: string) => {
        setSelectedMenuItem(item);
    };

    const handleToggleCollapse = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        // <div className="account-user-container w-full">
        //     <Grid container spacing={3}>
        //         <Grid size={2} className="account-menu">
        //             <Sidebar onSelect={setSelectedMenuItem}/>
        //         </Grid>
        //         <Grid size={10}>
        //             <div className="content-section">
        //                 <Dashboard />
        //             </div>
        //         </Grid>
        //     </Grid>
        // </div>
        <div className="w-full">
            <Grid  
                container 
                sx={{
                    // padding: '30px 40px',
                    '& .MuiGrid2-root': {
                        paddingLeft: '12px',
                        paddingRight: '24px',
                        // margin:'auto'
                        paddingTop:'20px',
                    },
                    backgroundColor: '#fedddb24'
                }}
            >
                <Grid 
                    size={isCollapsed ? 0.5 : 2.5} 
                    className="account-menu2"
                    sx={{
                        paddingLeft: '0 !important',
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
                        <Dashboard />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};
export default ModUsers;