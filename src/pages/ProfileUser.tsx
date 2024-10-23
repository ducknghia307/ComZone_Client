import React, { useState } from 'react';
import Grid from '@mui/material/Grid2';
import { Button, MenuItem, TextField, Typography } from '@mui/material';
import "../components/ui/ProfileUser.css";

interface ProfileData {
    email: string;
    username: string;
    phoneNumber: string;
    gender: string;
    address: string;
    dateOfBirth: string;
    avatar: string;
}

const ProfileUser: React.FC = () => {
    const [editing, setEditing] = useState(false);
    const [newAvatar, setNewAvatar] = useState<string | null>(null);

    const [profileData, setProfileData] = useState<ProfileData>({
        email: 'maicttsel73328@fpt.edu.vn',
        username: 'thanhmai27092003',
        phoneNumber: '0947758903',
        gender: 'Female',
        address: 'LA',
        dateOfBirth: '09/27/2003',
        avatar: 'https://cdn-icons-png.flaticon.com/512/147/147144.png',
    });

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

    return (
        <div className="profile-container w-full">
            <Typography 
                sx={{ fontSize: '35px', fontWeight: 'bolder', textAlign: 'center', marginBottom: '20px' }} 
                className="profile-title"
            >
                HỒ SƠ CỦA TÔI
            </Typography>

            <Grid container spacing={0} alignItems="center">
                {/* Avatar Section */}
                <Grid size={3}>
                    <div className="profile-image">
                        <img
                            src={newAvatar || profileData.avatar}
                            alt="avatar"
                            className="avatar-image1"
                            style={{ width: '100%', height: 'auto', borderRadius: '50%' }}
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

                {/* Form Section */}
                <Grid size={9}>
                    <form noValidate autoComplete="off" className="profile-form">
                        {[
                            { label: 'Email', name: 'email', disabled: true },
                            { label: 'Username', name: 'username' },
                            { label: 'Số Điện Thoại', name: 'phoneNumber' },
                            { label: 'Địa Chỉ', name: 'address' },
                            { label: 'Ngày Sinh', name: 'dateOfBirth' },
                        ].map(({ label, name, disabled }) => (
                            <div key={name} className="form-row">
                                <Typography>{label}:</Typography>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    variant="outlined"
                                    name={name}
                                    value={(profileData as any)[name]}
                                    disabled={disabled}
                                    className="profile-field"
                                    size="small"
                                />
                            </div>
                        ))}
                        <div className="form-row">
                            <Typography>Giới Tính:</Typography>
                            <TextField
                                fullWidth
                                margin="normal"
                                select
                                name="gender"
                                variant="outlined"
                                value={profileData.gender}
                                className="profile-field"
                                size="small"
                            >
                                <MenuItem value="Female">Female</MenuItem>
                                <MenuItem value="Male">Male</MenuItem>
                            </TextField>
                        </div>
                    </form>
                </Grid>
            </Grid>

            {/* Button Section */}
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
        </div>
    );
};

export default ProfileUser;
