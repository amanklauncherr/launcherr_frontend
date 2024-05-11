import React, { useState } from 'react';
import AuthLayout from './AuthLayout';
import styles from './authlayout.module.css';
import Input, { InputPassword } from '@/components/Input/page';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

const EmployerLogin = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const hanlesignup = () => {
        router.push('/auth/signup');
    };

    const handleSubmit = (e) => {
        toast.success("Success")
        router.push('/')
        e.preventDefault();
        console.log({ email, password }); // Log form data
        // Do whatever you want with the form data, like sending it to an API
    };

    const hanleLogin = () => {
        router.push('/auth/login')
    }
    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    {/* <img src="/logo.svg" alt="" /> */}
                    <h2>Employer login</h2>
                    
                    <form onSubmit={handleSubmit}>
                        <Input
                            inputType="text"
                            labelFor="Emp. Id"
                            name="username"
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
                    <p className='employlogin-text'>Customer Login? <span onClick={hanleLogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    );
};

export default EmployerLogin;
