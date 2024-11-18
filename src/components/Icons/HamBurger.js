import React from 'react'

const HamBurger = ({onClick}) => {
    return (
        <>
         <div className='web-hide' onClick={onClick} style={{ cursor: 'pointer' }}>
            <svg width="28" height="21" viewBox="0 0 28 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 19H26M2 10.5H26M2 2H26" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
         </div>
        </>
    )
}

export default HamBurger