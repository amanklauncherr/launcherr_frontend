import React from 'react'
import styles from './blankfilter.module.css'

const BlankFilter = ({ items }) => {
    return (
        <div className={styles["blank-filter-main-container"]}>
            <ul >
                {items.map((item, index) => (
                    <li key={index} onClick={item.onClick}>
                        {item.icon}
                        <span>{item.label}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BlankFilter;