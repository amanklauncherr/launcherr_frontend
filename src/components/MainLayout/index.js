import React, { Children } from 'react'
import styles from './mainlayout.module.css'

const MainLayout = ({children}) => {
  return (
    <>
       <div className={styles["main-contaier-layout"]}>
          {children}
       </div>
    </>
  )
}

export default MainLayout