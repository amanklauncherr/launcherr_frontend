import React, { useEffect, useState } from 'react'
import Dashboard from '..'
import styles from './profile.module.css'
import Cookies from 'js-cookie';
import axios from 'axios';

const ProfileDasboard = () => {
  const [userData, setUserData] = useState({ name: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profiledata, setprofiledata] = useState({user_Number:'', user_Address:'',user_City:'', user_State:'', user_Country:'',user_PinCode:'',user_AboutMe:''})

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
                    setprofiledata({
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
            <h3>
              {userData.name}
              </h3>
              <p>
              {userData.email}
              </p>
            </div>
            <div className={styles["profile-info"]}>
           
              <p>
                <span>User Number</span> : &nbsp;
                {profiledata?.user_Number}
              </p>
              <p>
              <span>User Address</span> : &nbsp;
                {profiledata?.user_Address}
              </p>
              <p>
              <span>User City</span> : &nbsp;
                {profiledata?.user_City}
              </p>
              <p>
              <span>User State</span> : &nbsp;
                {profiledata?.user_State}
              </p>
              <p>
              <span>User Country</span> : &nbsp;
                {profiledata?.user_Country}
              </p>
              <p>
              <span>User PinCode</span> : &nbsp;
                {profiledata?.user_PinCode}
              </p>
              <p>
              <span>User AboutMe</span> : &nbsp;
                {profiledata?.user_AboutMe}
              </p>
            </div>
          </div>
        </div>

      </Dashboard>
    </>
  )
}

export default ProfileDasboard