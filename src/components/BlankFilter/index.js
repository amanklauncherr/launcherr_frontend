import React from 'react'
import styles from './blankfilter.module.css'

const BlankFilter = ({ items, onItemClick }) => {
    return (
        <>
            <div className={styles["blank-filter-main-container"]}>
                <ul>
                    {items.map((item, index) => (
                        <li key={index} onClick={() => onItemClick(item)}>{item}</li>
                    ))}
                </ul>
            </div>
        </>
    )
}

export default BlankFilter