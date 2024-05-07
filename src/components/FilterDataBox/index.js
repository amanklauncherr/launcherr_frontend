
import styles from './filterbox.module.css'

const FilterDataBox = ({ children, onclickbtn, btn_name }) => {
    return (
        <>
            <div className={styles["FilterBox-main-container"]}>
                <div className={styles["FilterBox-inner"]}>
                    {children}
                    <button onClick={onclickbtn} className='btn-primary'>
                        {btn_name}
                    </button>
                </div>
            </div>
        </>
    )
}
export default FilterDataBox