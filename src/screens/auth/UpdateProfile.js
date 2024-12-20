import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import Cookies from 'js-cookie';
import axios from 'axios';
import styles from './authlayout.module.css';
import Loader from '@/components/Loader';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const UpdateProfile = () => {
    const router = useRouter();
    const [profileData, setProfileData] = useState({
        user_Number: '', user_Address: '', user_City: '',
        user_State: '', user_Country: '', user_PinCode: '', user_AboutMe: ''
    });
    const [loading, setLoading] = useState(false);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const authToken = Cookies.get('userCredtoken');
        if (!authToken) {
            alert('Authorization token is missing.');
            setLoading(false);
            return;
        }

        try {
            // Send profile update request
            const response = await axios.post('https://api.launcherr.co/api/addUserProfile', profileData, {
                headers: { Authorization: `Bearer ${authToken}` },
            });

            if (response.data.success) {
                console.log('Profile updated successfully:', response.data);

                // Fetch updated user profile
                try {
                    const userProfileResponse = await axios.get('https://api.launcherr.co/api/showUserProfile', {
                        headers: {
                            Authorization: `Bearer ${response?.data?.access_token || authToken}`,
                        },
                    });
                    console.log('User Profile Response:', userProfileResponse?.data);

                    // Update localStorage
                    localStorage.setItem('launcherr_UserProfileData', JSON.stringify(userProfileResponse?.data));
                    // Optional: handle navigation or token updates here
                     Cookies.set('auth_token', authToken, { expires: 7 });
                      router.push('/');
                } catch (profileError) {
                    console.error('Error fetching user profile:', profileError?.response?.data?.error);
                    alert('Failed to fetch updated profile.');
                }
            } else {
                alert('Failed to update profile.');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            alert('An error occurred while updating the profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value });
    };

    return (
        <AuthLayout>
            <div className={styles["form-main-container"]}>
                <h2>Update Profile</h2>
                {loading ? (
                    <Loader /> // Show loader if loading
                ) : (
                    <form onSubmit={handleFormSubmit}>
                        <div className={styles["wrap"]}>
                            <div>
                                <label className={styles["label"]}>Number:</label>
                                <input
                                    type="text"
                                    name="user_Number"
                                    value={profileData.user_Number}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles["gpa"]}>
                            <label className={styles["label"]}>Address:</label>
                            <input
                                type="text"
                                name="user_Address"
                                value={profileData.user_Address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className={styles["wrap"]}>
                            <div>
                                <label className={styles["label"]}>State:</label>
                                <input
                                    type="text"
                                    name="user_State"
                                    value={profileData.user_State}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className={styles["label"]}>City:</label>
                                <input
                                    type="text"
                                    name="user_City"
                                    value={profileData.user_City}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>
                        <div className={styles["wrap"]}>
                            <div>
                                <label className={styles["label"]}>Country:</label>
                                <input
                                    type="text"
                                    name="user_Country"
                                    value={profileData.user_Country}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div>
                                <label className={styles["label"]}>PinCode:</label>
                                <input
                                    type="text"
                                    name="user_PinCode"
                                    value={profileData.user_PinCode}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        </div>

                        <label>About Me:</label>
                        <textarea
                            className={styles["textarea"]}
                            name="user_AboutMe"
                            value={profileData.user_AboutMe}
                            onChange={handleChange}
                        />
                        <button type="submit" className='btn-blue' disabled={loading}>
                            {loading ? 'Loading...' : 'Update'}
                        </button>
                    </form>
                )}
            </div>
        </AuthLayout>
    );
};

export default UpdateProfile;
