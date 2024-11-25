import React, { useEffect, useState } from 'react';
import Dashboard from '..';
import styles from './profile.module.css';
import Cookies from 'js-cookie';
import axios from 'axios';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';

const ProfileDashboard = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileData, setProfileData] = useState({
    user_Name: '', user_Number: '', user_Address: '', user_City: '',
    user_State: '', user_Country: '', user_PinCode: '', user_AboutMe: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state for data fetching

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    setIsLoggedIn(!!authToken);

    if (authToken) {
      setLoading(true); // Set loading to true when starting data fetch
      axios.get('https://api.launcherr.co/api/showUserProfile', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then(response => {
          if (response.data.success) {
            setUserData({
              name: response.data.user.name,
              email: response.data.user.email
            });
            setProfileData({
              user_Name: response.data.user.name,  // Ensure user_Name is set
              user_Number: response.data.userprofile.user_Number,
              user_Address: response.data.userprofile.user_Address,
              user_City: response.data.userprofile.user_City,
              user_State: response.data.userprofile.user_State,
              user_Country: response.data.userprofile.user_Country,
              user_PinCode: response.data.userprofile.user_PinCode,
              user_AboutMe: response.data.userprofile.user_AboutMe,
            });
          }
        })
        .catch(error => {
          console.error('Profile error:', error?.response?.data?.success);
          if (error?.response?.data?.success === 0) {
            alert('Your session has expired. Please log in again.');
            Cookies.remove('auth_token');
          }
        })
        .finally(() => {
          setLoading(false); // Set loading to false after data is fetched
        });
    }
  }, []);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setLoading(true); // Set loading to true when submitting
  
    const authToken = Cookies.get('auth_token');
    if (authToken) {
      // Filter out fields with empty values
      const filteredProfileData = Object.entries(profileData).reduce((acc, [key, value]) => {
        if (value) {
          acc[key] = value;
        }
        return acc;
      }, {});
  
      axios.post('https://api.launcherr.co/api/addUserProfile', filteredProfileData, {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then(response => {
          if (response.data.success) {
            alert('Profile updated successfully!');
            setIsEditing(false);
          } else {
            alert('Failed to update profile.');
          }
        })
        .catch(error => {
          console.error('Update profile error:', error.response.data.errors);
          toast.error(error.response.data.errors)
        })
        .finally(() => {
          setLoading(false); // Reset loading state after completion
        });
    }
  };
  

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Dashboard>
        <div className={styles["profile-main-container"]}>
          <h1>User Profile</h1>
          {loading ? (
           <>
           <Loader/>
           </>
          ) : (
            <>
              <div className={styles["profile-inner"]}>
                <div className={styles["profile-inner-top"]}>
                  <h3>{userData.name}</h3>
                  <p>{userData.email}</p>
                </div>
                <button className={styles["penpost"]} onClick={handleEditClick}>✏️ Edit</button>
                <div className={styles["profile-info"]}>
                  <p><span>Name</span>: &nbsp; {profileData.user_Name}</p>
                  <p><span>Number</span>: &nbsp; {profileData.user_Number}</p>
                  <p><span>Address</span>: &nbsp; {profileData.user_Address}</p>
                  <p><span>City</span>: &nbsp; {profileData.user_City}</p>
                  <p><span>State</span>: &nbsp; {profileData.user_State}</p>
                  <p><span>Country</span>: &nbsp; {profileData.user_Country}</p>
                  <p><span>PinCode</span>: &nbsp; {profileData.user_PinCode}</p>
                  <p><span>About Me</span>: &nbsp; {profileData.user_AboutMe}</p>
                </div>
              </div>
              {isEditing && (
                <>
                  <div className={styles["modal-overlay"]} onClick={() => setIsEditing(false)}></div>
                  <div className={styles["modal"]}>
                    <form onSubmit={handleFormSubmit}>
                      <div className={styles["wrap"]}>
                        <div>
                          <label>Number:</label>
                          <input
                            type="text"
                            name="user_Number"
                            value={profileData.user_Number}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <label>Address:</label>
                      <input
                        type="text"
                        name="user_Address"
                        value={profileData.user_Address}
                        onChange={handleChange}
                      />
                      <div className={styles["wrap"]}>
                        <div>
                          <label>State:</label>
                          <input
                            type="text"
                            name="user_State"
                            value={profileData.user_State}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label>City:</label>
                          <input
                            type="text"
                            name="user_City"
                            value={profileData.user_City}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                      <div className={styles["wrap"]}>
                        <div>
                          <label>Country:</label>
                          <input
                            type="text"
                            name="user_Country"
                            value={profileData.user_Country}
                            onChange={handleChange}
                          />
                        </div>
                        <div>
                          <label>PinCode:</label>
                          <input
                            type="text"
                            name="user_PinCode"
                            value={profileData.user_PinCode}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <label>About Me:</label>
                      <textarea
                        name="user_AboutMe"
                        value={profileData.user_AboutMe}
                        onChange={handleChange}
                      />
                      <button type="submit" disabled={loading}>
                        {loading ? 'Loading...' : 'Save'}
                      </button>
                    </form>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </Dashboard>
    </>
  );
}

export default ProfileDashboard;
