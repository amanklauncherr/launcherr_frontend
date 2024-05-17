import React, { Children } from 'react'
import styles from './blankfilter.module.css'

const BlankFilter = ({ items, children }) => {
    return (
        <div className={styles["blank-filter-main-container"]}>
            <ul >
                {items.map((item, index) => (
                    <li key={index} onClick={item.onClick}>
                        {item.icon}
                        <span>{item.label}</span>
                    </li>
                ))}
                {children}
            </ul>
        </div>
    );
};

export default BlankFilter;