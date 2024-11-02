import React, { useEffect, useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Button, TextField, Typography, Modal, Box } from '@mui/material';
import "../components/ui/ProfileUser.css";
import { privateAxios } from '../middleware/axiosInstance';
import { useAppSelector } from '../redux/hooks';
import { UserInfo, Address } from '../common/base.interface';
// import { LocalizationProvider } from '@mui/x-date-pickers';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import NewAddressForm from '../components/checkout/NewAddressForm';

interface ProfileData {
    email: string;
    name: string;
    phone: string;
    address: string;
    avatar: string;
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '60%',
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    maxHeight: '90vh',
    overflowY: 'auto',
    borderRadius: '8px'
};

const ProfileUser: React.FC = () => {
    const [editing, setEditing] = useState(false);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const { accessToken } = useAppSelector((state) => state.auth);
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
    const [userInfo, setUserInfo] = useState<UserInfo>();

    const [profileData, setProfileData] = useState<ProfileData>({
        email: '',
        name: '',
        phone: '',
        address: '',
        avatar: '',
    });

    const fetchUserAddress = async () => {
        try {
            const response = await privateAxios("/user-addresses/user");

            const data = response.data;
            console.log("address", data);


            //   const sortedAddresses = data.sort((a: Address, b: Address) => {
            //     return (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0);
            //   });
            //   console.log(sortedAddresses);

            //   setSelectedAddress(sortedAddresses[0] || null);
            //   setAddresses(sortedAddresses);
        } catch {
            console.log("...");
        }
    };

    const fetchUserInfo = async () => {
        if (accessToken) {
            try {
                const response = await privateAxios.get("users/profile");
                const { email, name, phone, address, avatar } = response.data;
                setUserInfo(response.data);
                setProfileData({
                    email,
                    name,
                    phone,
                    address,
                    avatar,
                });
            } catch (error) {
                console.error("Error fetching user info:", error);
            } finally {
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) setNewAvatar(URL.createObjectURL(file));
    };

    const handleEditClick = () => setEditing(true);

    const handleCancelClick = () => {
        setEditing(false);
        setNewAvatar(null);
    };

    const handleConfirmClick = () => {
        if (newAvatar) setProfileData({ ...profileData, avatar: newAvatar });
        setEditing(false);
    };

    const handleAddressModalClose = () => {
        setIsAddressModalOpen(false);
        fetchUserInfo(); // Refresh user info after address update
    };

    const refreshAddresses = () => {
        fetchUserInfo();
    };

    useEffect(() => {
        fetchUserInfo();
        fetchUserAddress();
    }, [accessToken]);

    return (
        // <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="profile-container w-full">
            <Typography
                sx={{ fontSize: '35px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '20px' }}
                className="profile-title"
            >
                HỒ SƠ CỦA TÔI
            </Typography>

            <Grid container spacing={0} alignItems="center">
                <Grid size={3}>
                    <div className="profile-image">
                        <img
                            src={newAvatar || profileData.avatar}
                            alt="avatar"
                            className="avatar-image1"
                            style={{ width: '150px', height: 'auto', borderRadius: '50%' }}
                        />
                        {editing && (
                            <>
                                <label htmlFor="avatar-upload" className="change-photo-label">
                                    <Typography color="primary" className="change-photo-text">
                                        Đổi ảnh đại diện
                                    </Typography>
                                </label>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    style={{ display: 'none' }}
                                />
                            </>
                        )}
                    </div>
                </Grid>

                <Grid size={9}>
                    <form noValidate autoComplete="off" className="profile-form">
                        {[
                            { label: 'Email', name: 'email', disabled: true },
                            { label: 'Username', name: 'name' },
                            { label: 'Số Điện Thoại', name: 'phone' },
                        ].map(({ label, name, disabled }) => (
                            <div key={name} className="form-row">
                                <Typography>{label}:</Typography>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={profileData.address}
                                    disabled
                                    className="profile-field"
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => setIsAddressModalOpen(true)}
                                    sx={{
                                        fontSize: '14px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        height: '40px',
                                        marginTop: '8px'
                                    }}
                                >
                                    Cập nhật
                                </Button>
                            </div>

                        ))}
                        {/* <div className="form-row">
                            <Typography>Địa Chỉ:</Typography>
                            <div className="flex items-center gap-2">
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    value={profileData.address}
                                    disabled
                                    className="profile-field"
                                    size="small"
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => setIsAddressModalOpen(true)}
                                    sx={{
                                        fontSize: '14px',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        height: '40px',
                                        marginTop: '8px'
                                    }}
                                >
                                    Cập nhật
                                </Button>
                            </div>
                        </div> */}
                    </form>
                </Grid>
            </Grid>

            <div className="button-container">
                {!editing ? (
                    <Button
                        variant="contained"
                        onClick={handleEditClick}
                        sx={{ fontSize: '20px', backgroundColor: '#000', color: '#fff' }}
                    >
                        Cập Nhật Hồ Sơ
                    </Button>
                ) : (
                    <>
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleCancelClick}
                            sx={{ fontSize: '20px', marginRight: '10px' }}
                        >
                            Hủy
                        </Button>
                        <Button
                            variant="contained"
                            color="success"
                            onClick={handleConfirmClick}
                            sx={{ fontSize: '20px' }}
                        >
                            Xác Nhận
                        </Button>
                    </>
                )}
            </div>

            <Modal
                open={isAddressModalOpen}
                onClose={handleAddressModalClose}
                aria-labelledby="address-modal-title"
            >
                <Box sx={modalStyle}>
                    {userInfo && (
                        <NewAddressForm
                            userInfo={userInfo}
                            onClose={handleAddressModalClose}
                            refreshAddresses={refreshAddresses}
                        />
                    )}
                </Box>
            </Modal>
        </div>
        // </LocalizationProvider>
    );
};

export default ProfileUser;