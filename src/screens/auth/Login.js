import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';  // Import Cookies from js-cookie
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input, { InputPassword } from '@/components/Input/page';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Login = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const hanlesignup = () => {
        router.push('/auth/signup');
    };

    const hanleEmpLogin = () => {
        router.push('/auth/employer-login');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make POST request to API
            const response = await axios.post('https://api.launcherr.co/api/auth/userLogin', {
                email: email,
                password: password
            });

            // Handle success
            toast.success("Login Successful");

            // Store token in cookies
            Cookies.set('auth_token', response?.data?.access_token, { expires: 7 });  // Token expires in 7 days

            console.log('Login Success:', response?.data?.access_token);

            // Example: Redirect on successful login
            router.push('/');  // Replace with your desired redirect path
        } catch (error) {
            // Handle error
            toast.error("Login Failed. Please try again.");
            console.error('Login Error:', error);
        }
    };

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
                        <button type="submit" className='btn-blue'>
                            Login
                        </button>
                    </form>
                    <p>New to Launcherr? <span onClick={hanlesignup}>Signup</span></p>
                    <p className='employlogin-text'>Are you an employee? <span onClick={hanleEmpLogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    );
};

export default Login;
