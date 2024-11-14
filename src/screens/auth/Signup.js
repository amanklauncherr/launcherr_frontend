import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input, { InputPassword } from '@/components/Input/page';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';

const Signup = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [lastName, setLastname] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleSignup = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true); // Set loading to true when the request starts

        try {
            const response = await axios.post('https://api.launcherr.co/api/auth/userRegister', {
                name,
                last_name : lastName,
                email,
                password,
            });
            console.log(response.data);
            alert(response.data?.message);

            // Redirect to login or home page after successful registration
            router.push('/auth/login');
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
                    <img src="/logo.svg" alt="Logo" />
                    <form onSubmit={handleSignup}>
                        <div className={styles["d-flex-name-lastname"]}>
                        <Input
                            inputType="text"
                            labelFor="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            inputType="text"
                            labelFor="Last Name"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                        </div>
                        <Input
                            inputType="email"
                            labelFor="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <InputPassword
                            inputType="password"
                            labelFor="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <InputPassword
                            inputType="password"
                            labelFor="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className='btn-blue' type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Continue'}
                        </button>
                    </form>
                    <p>Already have an account? <span onClick={handleLogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    );
}

export default Signup;
