import React from 'react'
import styles from './Modal.module.css'
import Lottie from 'react-lottie-player'

const ModalPopup = ({ Mainmessage, onClick, mylottiJson, Submessage, btnName }) => {
    return (
        <>
            <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                    <h2>{Mainmessage}</h2>
                    <Lottie
                        loop
                        animationData={mylottiJson}
                        play
                        className={styles.innerlotti}
                    />
                    <div className={styles.innersubmesageclose}>
                        <p>{Submessage}</p>
                        <button onClick={onClick} className={styles.closeButton}>
                            {btnName}
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ModalPopup