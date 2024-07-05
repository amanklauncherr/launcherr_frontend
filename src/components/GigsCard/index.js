import React from 'react'
import styles from './gigscard.module.css'
import VerifyBadge from '../Icons/VerifyBadge'
import toast from 'react-hot-toast';
import Clock from '../Icons/Clock';

const GigsCard = ({ gigs_title, isActive, gigs_duration, gigs_about, gigs_description, company_name, isVerified }) => {
  if (isActive === 0) {
    return null;
  }

  const handkleclkick = () => {
    toast.success("Enquire Success")
  }
  return (
    <>
      <div className={styles["gigs-card-main-container"]} id="gigs-card">
        <div className={styles["gigs-card-wrap"]}>
          <p className={styles["company_name"]}>
            {company_name} {isVerified ? <VerifyBadge /> : null}
          </p>
          <p className={styles["gigs_type"]}>
          <Clock/>
             {gigs_duration} hrs </p>
        </div>
        <div className={styles["gigs-card-gigs_title"]}>
          <p>{gigs_title}</p>
        </div>
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
