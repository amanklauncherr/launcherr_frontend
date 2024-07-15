import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import styles from './gigscard.module.css';
import VerifyBadge from '../Icons/VerifyBadge';
import toast from 'react-hot-toast';
import Clock from '../Icons/Clock';
import { getCookie } from 'cookies-next';
import LocationIconBlack from '../Icons/LocationIconBlack';
import Router, { useRouter } from 'next/router';
import GigBadge from '../Icons/GigBadge';

const GigsCard = ({
  gigs_Shortdescription,
  gigs_badge,
  company_image,
  gig_id,
  gigs_location,
  gigs_title,
  isActive,
  gigs_duration,
  gigs_about,
  gigs_description,
  company_name,
  isVerified,
}) => {
  const [note, setNote] = useState('');
  const reduxToken = useSelector((state) => state?.token?.publicToken);

  let bearerToken = '';
  const cookiesToken = getCookie('auth_token');

  if (cookiesToken) {
    bearerToken = cookiesToken;
  } else {
    bearerToken = reduxToken;
  }

  if (isActive === 0) {
    return null;
  }

  const router = useRouter();

  const handleClick = async () => {
    // Your handleClick logic here
  };

  const handleViewDetails = () => {
    Router.push(`/gigdetails?gig_id=${gig_id}`);
  };

  return (
    <div className={styles['gigs-card-main-container']} id="gigs-card">
      <div className={styles['gigs-cardinner']}>
        <div className={styles['gigs-Badge']}>
          {gigs_badge ? <GigBadge /> : null}
        </div>

        <div className={styles['gig-image']}>
          <img src={company_image || '/icons/defaultimage.svg'} />
        </div>
        <p className={styles['company_name']}>
          {company_name} {isVerified ? <VerifyBadge /> : null}
        </p>

        <div className={styles['gigs-card-gigs_title']}>
          <p>{gigs_title}</p>
        </div>
        <div className={styles['gig-info-section']}>
          <p className={styles['gigs_type']}>
            <Clock />
            {gigs_duration} hrs
          </p>
          <div className={styles['Gigslocation']}>
            <LocationIconBlack />
            <p>{gigs_location}</p>
          </div>
        </div>
        <p className={styles['gigs_about']}>{gigs_about}</p>
        <p className={styles['gigs_description']}>{gigs_Shortdescription}</p>
      </div>
      <div className={styles['gigs-card-btn-sep']}>
        <button onClick={handleViewDetails} className="book-btn-primary">
          View Details
        </button>
      </div>
    </div>
  );
};

export default GigsCard;
