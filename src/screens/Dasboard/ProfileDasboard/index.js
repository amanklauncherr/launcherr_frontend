import React, { useEffect, useState } from 'react'
import Dashboard from '..'
import styles from './profile.module.css'
import Cookies from 'js-cookie';
import axios from 'axios';

const ProfileDasboard = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    setIsLoggedIn(!!authToken);
    if (authToken) {
        axios.get('https://api.launcherr.co/api/showUserProfile', {
            headers: { Authorization: `Bearer ${authToken}` }
        })
            .then(response => {
                if (response.data.success) {
                    setUserData({
                        name: response.data.user.name,
                        email: response.data.user.email
                    });
                }
            })
            .catch(error => {
                console.error('mffjfjfprofile:', error?.response?.data?.success);
                if (error?.response?.data?.success == 0) {
                    alert('Your session has expired. Please log in again.');
                    Cookies.remove('auth_token');
                }
            });
    }
}, []);

  return (
    <>
      <Dashboard>
        <div className={styles["profile-main-container"]}>
          <h1>User Profile</h1>
          <div className={styles["profile-inner"]}>
            <div className={styles["profile-inner-top"]}>
            </div>
            <div className={styles["profile-info"]}>
              <h3>
              {userData.name}
              </h3>
              <p>
              {userData.email}
              </p>
            </div>
          </div>
        </div>

      </Dashboard>
    </>
  )
}

export default ProfileDasboard