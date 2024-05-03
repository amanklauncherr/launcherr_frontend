import React from 'react'
import AuthLayout from './AuthLayout'
import styles from './authlayout.module.css'
import Input, { InputPassword, PhoneNo } from '@/components/Input/page'
import {useRouter } from 'next/router'

const Signup = () => {
    const router = useRouter();
    const hanlelogin = () => {
        router.push('/auth/login')
    }
    return (
        <>
            <AuthLayout>
                <div className={styles["form-main-container"]}>
                    <img src="/logo.svg" alt="" />
                    <form action="">
                        <Input
                            inputType="text"
                            labelFor="Full Name"
                        />
                          <Input
                            inputType="email"
                            labelFor="Email"
                        />
                            <Input
                            inputType="number"
                            labelFor="Phone No."
                        />
                        {/* <InputPassword
                            inputType="password"
                            labelFor="Password"
                            onChange=""
                        />
                          <InputPassword
                            inputType="password"
                            labelFor="Confirm Password"
                            onChange=""
                        /> */}
                        <button className='btn-blue'>
                            Continue
                        </button>
                    </form>
                    <p>Already have a account ? <span onClick={hanlelogin}>Login</span></p>
                </div>
            </AuthLayout>
        </>
    )
}

export default Signup