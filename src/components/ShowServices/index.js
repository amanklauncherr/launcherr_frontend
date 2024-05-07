import React from 'react';
import styles from './showservices.module.css';
import TravelIcon from '../Icons/TravelIcon';
import GigsIcon from '../Icons/GigsIcon';
import EcoomerceIcon from '../Icons/EcoomerceIcon';

const ShowServices = () => {
    const handleScrollTo = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className={styles["blank-filter-main-container"]}>
            <ul>
                <li onClick={() => handleScrollTo('explore-deals')}><TravelIcon/> Travel</li>
                <li onClick={() => handleScrollTo('recommended-gigs')}><GigsIcon/> Gigs</li>
                <li onClick={() => handleScrollTo('explore-packages')}><EcoomerceIcon/> E-commerce</li>
            </ul>
        </div>
    );
};

export default ShowServices;
