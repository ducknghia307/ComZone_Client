// import React, { useState } from 'react';
// import "../components/ui/AccountUser.css";
// import Grid from '@mui/material/Grid2';
// import Sidebar from '../components/report/Sidebar';
// import ManageUsers from '../components/report/ManageUsers';
// const ModUsers: React.FC = () => {

//     const currentUrl = window.location.pathname;
//     console.log('URL', currentUrl)

//     const [selectedMenuItem, setSelectedMenuItem] = useState('users');
//     const handleMenuItemClick = (item: string) => {
//         setSelectedMenuItem(item);
//     };

//     return (
//         <div className="account-user-container w-full">
//             <Grid container spacing={3}>
//                 <Grid size={2} className="account-menu">
//                     <Sidebar onSelect={setSelectedMenuItem}/>
//                 </Grid>
//                 <Grid size={10}>
//                     <div className="content-section">
//                         <ManageUsers />
//                     </div>
//                 </Grid>
//             </Grid>
//         </div>
//     );
// };
// export default ModUsers;

import React, { useState } from 'react';
import "../components/ui/AccountUser.css";
import Grid from '@mui/material/Grid2';
import Sidebar from '../components/report/Sidebar';
import ManageUsers from '../components/report/ManageUsers';

const ModUsers: React.FC = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [selectedMenuItem, setSelectedMenuItem] = useState('users');

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
                        <ManageUsers />
                    </div>
                </Grid>
            </Grid>
        </div>
    );
};

export default ModUsers;
