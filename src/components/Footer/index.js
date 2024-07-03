import React from 'react'
import styles from './footer.module.css'

const Footer = () => {
    const handlehome = () => {
        router.push('/')
    }
    return (
        <>
            <footer className={styles["footer"]}>
                <div className={styles["footer-inner"]}>
                    <img onClick={handlehome} src="/logo.svg" alt="" />
                    <div className={styles["footer-bottom"]}>
                        <div className={styles["footer-info"]}>
                            <ul>
                                <li>Company</li>
                                <li>About Us</li>
                                <li>FAQ</li>
                                <li>Pricing</li>
                                <li>Employer login </li>
                                <li>Term & Condition</li>
                            </ul>
                            <ul>
                               
                            </ul>
                            <ul>
                                
                            </ul>
                        </div>
                        <form action="">
                            <h1>Launcherr</h1>
                            <p>Subscribe to our Newsletter</p>
                            <input type="text" placeholder='Enter your Email'/>
                            <button>Subscribe</button>
                        </form>
                    </div>
                <div>
                    
                </div>
                </div>
            </footer>
        </>
    )
}

export default Footer