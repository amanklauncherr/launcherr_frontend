import React from 'react'
import styles from './gigscard.module.css'
import VerifyBadge from '../Icons/VerifyBadge'
import toast from 'react-hot-toast';

const GigsCard = ({isActive, gigs_duration, gigs_about, gigs_description, company_name, isVerified}) => {
  if (isActive === 0) {
    return null;
  }

  const handkleclkick = ()=> {
    toast.success("Enquire Success")
  }
  return (
    <>
      <div className={styles["gigs-card-main-container"]} id="gigs-card">
          <p className={styles["gigs_type"]}>Duration <span>{gigs_duration} hrs</span> </p>
          <p className={styles["company_name"]}>
            {company_name} {isVerified ? <VerifyBadge /> : null}
          </p>
          <p className={styles["gigs_about"]}>{gigs_about}</p>
          <p className={styles["gigs_description"]}>
            {gigs_description}
          </p>
          <button onClick={handkleclkick} className='book-btn-primary'>
            Enquire Now
          </button>
      </div>
    </>
  )
}

export default GigsCard
