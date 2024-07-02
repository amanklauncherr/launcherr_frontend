import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input from '@/components/Input/page';
import { useRouter } from 'next/router';
import axios from 'axios';

const Signup = () => {
    const router = useRouter();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleLogin = () => {
        router.push('/auth/login');
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            const response = await axios.post('https://api.launcherr.co/api/auth/userRegister', {
                name,
                email,
                password,
            });
            console.log(response.data);
            // Redirect to login or home page after successful registration
            router.push('/auth/login');
        } catch (error) {
            console.error('Error registering user', error);
            alert('Registration failed, please try again.');
        }
    };

    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    <img src="/logo.svg" alt="Logo" />
                    <form onSubmit={handleSignup}>
                        <Input
                            inputType="text"
                            labelFor="Full Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                        <Input
                            inputType="email"
                            labelFor="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            inputType="password"
                            labelFor="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <Input
                            inputType="password"
                            labelFor="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <button className='btn-blue' type="submit">
                            Continue
                        </button>
                    </form>
                    <p>Already have an account? <span onClick={handleLogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    );
}

export default Signup;
