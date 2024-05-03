import React from 'react'
import styles from './authlayout.module.css'

const AuthLayout = ({children}) => {
  return (
    <>
       <div className={styles["auth-module-main-container"]}>
          {children}
       </div>
    </>
  )
}

export default AuthLayout