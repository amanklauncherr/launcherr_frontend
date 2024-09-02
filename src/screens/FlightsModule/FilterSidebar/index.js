import React from 'react';
import styles from './FilterSidebar.module.css';

const FilterSidebar = () => {
  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter Results</h3>
        <button className={styles.reset}>Reset All</button>
      </div>
      
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Price</h4>
        <div className={styles.priceRange}>
          <input type="range" min="3806" max="18661" className={styles.slider} />
          <div className={styles.priceValues}>
            <span>3806</span>
            <span>18661</span>
          </div>
        </div>
      </div>
      
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Fare Type</h4>
        <div className={styles.checkbox}>
          <input type="checkbox" id="refundable" />
          <label htmlFor="refundable">Refundable</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="nonRefundable" />
          <label htmlFor="nonRefundable">Non Refundable</label>
        </div>
      </div>
      
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Stop</h4>
        <div className={styles.checkbox}>
          <input type="checkbox" id="nonStop" />
          <label htmlFor="nonStop">Non Stop</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="oneStop" />
          <label htmlFor="oneStop">1 Stop</label>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Departure Times</h4>
        <div className={styles.timeIcons}>
          <span>12AM-6AM</span>
          <span>6AM-12PM</span>
          <span>12PM-6PM</span>
          <span>6PM-12AM</span>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Arrival Times</h4>
        <div className={styles.timeIcons}>
          <span>12AM-6AM</span>
          <span>6AM-12PM</span>
          <span>12PM-6PM</span>
          <span>6PM-12AM</span>
        </div>
      </div>

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Airlines</h4>
        <div className={styles.checkbox}>
          <input type="checkbox" id="airIndia" />
          <label htmlFor="airIndia">Air India</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="airIndiaExpress" />
          <label htmlFor="airIndiaExpress">Air India Express</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="akasaAir" />
          <label htmlFor="akasaAir">Akasa Air</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="indigo" />
          <label htmlFor="indigo">Indigo</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="spicejet" />
          <label htmlFor="spicejet">Spicejet</label>
        </div>
        <div className={styles.checkbox}>
          <input type="checkbox" id="vistara" />
          <label htmlFor="vistara">Vistara</label>
        </div>
      </div>
    </div>
  );
};

export default FilterSidebar;
