import React from 'react'
import styles from './gigscard.module.css'
import VerifyBadge from '../Icons/VerifyBadge'

const GigsCard = ({gigs_duration, gigs_about, gigs_description, company_name, isVerified}) => {
  return (
    <>
      <div className={styles["gigs-card-main-container"]}>
          <p className={styles["gigs_type"]}>Duration <span>{gigs_duration} hrs</span> </p>
          <p className={styles["company_name"]}>
          {company_name} {isVerified && <VerifyBadge />}
        </p>
          <p className={styles["gigs_about"]}>{gigs_about}</p>
          <p className={styles["gigs_description"]}>
            {gigs_description}
          </p>
          <button className='book-btn-primary'>
            APPLY NOW
          </button>
      </div>
    </>
  )
}

export default GigsCard