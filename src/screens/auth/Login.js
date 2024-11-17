import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input, { InputPassword } from '@/components/Input/page';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const hanlesignup = () => {
        router.push('/auth/signup');
    };

    const hanleEmpLogin = () => {
        window.location.href = "https://gigs.launcherr.co/";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the request starts

        try {
            // Make POST request to API
            const response = await axios.post('https://api.launcherr.co/api/auth/userLogin', {
                email: email,
                password: password
            });
            if (response?.data?.user?.isProfile === 0) {
                toast.success("Login successful please update profile");
                Cookies.set('userCredtoken', response?.data?.access_token, { expires: 7 });
                Cookies.set('auth_token', response?.data?.access_token, { expires: 7 });

                // Call the showUserProfile API
                try {
                    const userProfileResponse = await axios.get('https://api.launcherr.co/api/showUserProfile', {
                        headers: {
                            Authorization: `Bearer ${response?.data?.access_token}`,
                        },
                    });
                    console.log('User Profile Response:', userProfileResponse?.data);
                    localStorage.removeItem('launcherr_UserProfileData');
                    localStorage.setItem('launcherr_UserProfileData', JSON.stringify(userProfileResponse?.data));
                } catch (profileError) {
                    console.error('Error fetching user profile:', profileError?.response?.data?.error);
                }

                toast.success("Please Update profile");
                router.push(`/auth/updateProfile`);
            }
            else if (response?.data?.user?.isProfile === 1) {

                Cookies.set('auth_token', response?.data?.access_token, { expires: 7 });

                // Call the showUserProfile API
                try {
                    const userProfileResponse = await axios.get('https://api.launcherr.co/api/showUserProfile', {
                        headers: {
                            Authorization: `Bearer ${response?.data?.access_token}`,
                        },
                    });
                    console.log('User Profile Response:', userProfileResponse?.data);
                    localStorage.removeItem('launcherr_UserProfileData');
                    localStorage.setItem('launcherr_UserProfileData', JSON.stringify(userProfileResponse?.data));
                } catch (profileError) {
                    console.error('Error fetching user profile:', profileError?.response?.data?.error);
                }

                toast.success("Login Successful");
                router.push('/');
            }

            else {
                toast.error('Login failed please contact to admin')
            }
        } catch (error) {
            // Handle error
            toast.error(error?.response?.data?.error);
            console.error('Login Error:', error?.response?.data?.error);
        } finally {
            setLoading(false); // Set loading to false when the request completes (either success or error)
        }
    };

    const handleForgot = () => {
        router.push('/auth/forgotPasswordSend')
    }

    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    <img src="/logo.svg" alt="" />
                    <h2>Customer Login</h2>
                    <form onSubmit={handleSubmit}>
                        <Input
                            inputType="text"
                            labelFor="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputPassword
                            inputType="password"
                            labelFor="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button type="submit" className='btn-blue' disabled={loading}>
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                        <h5 onClick={handleForgot} className={styles["forgot-password"]}>Forgot your password ?</h5>
                    </form>
                    <p >New to Launcherr? <span onClick={hanlesignup}>Signup</span></p>
                    <p className='employlogin-text'>Are you an employer? <span onClick={hanleEmpLogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    );
};

export default Login;
