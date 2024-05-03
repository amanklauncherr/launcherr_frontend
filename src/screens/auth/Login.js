import React from 'react'
import AuthLayout from './AuthLayout'
import styles from './authlayout.module.css'
import Input, { InputPassword } from '@/components/Input/page'
import {useRouter } from 'next/router'

const Login = () => {
    const router = useRouter();
    const hanlesignup = () => {
        router.push('/auth/signup')
    }
    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    <img src="/logo.svg" alt="" />
                    <form action="">
                        <Input
                            inputType="text"
                            labelFor="Email"
                        />
                        <InputPassword
                            inputType="password"
                            labelFor="Password"
                            onChange=""
                        />
                        <button className='btn-blue'>
                            Continue
                        </button>
                    </form>
                    <p>New to Launcherr? <span onClick={hanlesignup}>Signup</span></p>
                </div>
            </AuthLayout>
        </>
    )
}

export default Login