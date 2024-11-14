import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input, { InputPassword } from '@/components/Input/page';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const ForgotPassEmailSend = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const hanlesignup = () => {
        router.push('/auth/signup');
    };

    const hanleEmpLogin = () => {
        window.location.href = "https://gigs.launcherr.co";
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); // Set loading to true when the request starts
        try {
            // Make POST request to API
            const response = await axios.post('https://api.launcherr.co/api/Reset/Password/Email', {
                email: email,
            });
            console.log('response', response?.data?.message)
            alert(response?.data?.message)
        } catch (error) {
              console.log(error)
        } finally {
            setLoading(false); // Set loading to false when the request completes (either success or error)
        }
    };


    const handleForgot = () => {
        router.push('/auth/forgotPasswordSend')
    }


    const handleLogin = () => {
        router.push('/auth/login')
    }

    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    <img src="/logo.svg" alt="" />
                    <form onSubmit={handleSubmit}>
                        <Input
                            inputType="text"
                            labelFor="Email"
                            name="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />                      
                        <button type="submit" className='btn-blue' disabled={loading}>
                            {loading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                    <p><span onClick={hanlesignup}>Signup?</span> / <span onClick={handleLogin}>Login?</span></p>
                    <p className='employlogin-text'>Are you an employer? <span onClick={hanleEmpLogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    );
};

export default ForgotPassEmailSend;
