import React from 'react'
import styles from './gigscard.module.css'

const GigsCard = ({gigs_type, gigs_about, gigs_description}) => {
  return (
    <>
      <div className={styles["gigs-card-main-container"]}>
          <p className={styles["gigs_type"]}>{gigs_type}</p>
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