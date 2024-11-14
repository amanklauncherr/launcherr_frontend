import React, { useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input, { InputPassword } from '@/components/Input/page';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const Resetpassword = () => {
    const router = useRouter();
    const { token } = router.query; // Extract uniqueCode from the URL
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true); // Set loading to true when the request starts

        try {
            // Make POST request to API
            const response = await axios.post('https://api.launcherr.co/api/Reset/Password', {
                password: password,
                token : token
            });
            toast.success(response.data.message);
            router.push('/auth/login')
            alert(response.data?.message);
        } catch (error) {
            toast.error(error?.response?.data?.error);
        } finally {
            setLoading(false); // Set loading to false when the request completes (either success or error)
        }
    };


    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    <img src="/logo.svg" alt="" />
                    <p className={styles["newpassheading"]}>Please enter a new password</p>
                    <form onSubmit={handleSubmit}>
                        <InputPassword
                            inputType="password"
                            labelFor="Password"
                            name="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                         <InputPassword
                            inputType="password"
                            labelFor="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button type="submit" className='btn-blue' disabled={loading}>
                            {loading ? 'Loading...' : 'Submit'}
                        </button>
                    </form>
                </div>
            </AuthLayout>
        </>
    );
};

export default Resetpassword
