import React from 'react';
import styles from './FilterSidebar.module.css';

const FilterSidebar = ({ filters = {}, onUpdateFilters }) => {
  // Default values to avoid undefined errors
  const defaultFilters = {
    priceRange: [3806, 18661],
    refundable: false,
    nonRefundable: false,
    stopOptions: {
      nonStop: false,
      oneStop: false,
    },
    departureTimes: [],
    arrivalTimes: [],
    airlines: {
      airIndia: false,
      airIndiaExpress: false,
      akasaAir: false,
      indigo: false,
      spicejet: false,
      vistara: false,
    },
  };

  // Merge default filters with provided filters
  const finalFilters = { ...defaultFilters, ...filters };

  const priceRange = finalFilters.priceRange;
  const airlines = finalFilters.airlines;

  const handlePriceRangeChange = (event) => {
    const value = parseInt(event.target.value);
    const updatedPriceRange = [value, priceRange[1]];
    onUpdateFilters({ priceRange: updatedPriceRange });
  };

  const handleRefundableChange = (event) => {
    const isChecked = event.target.checked;
    onUpdateFilters({ refundable: isChecked });
  };

  const handleNonRefundableChange = (event) => {
    const isChecked = event.target.checked;
    onUpdateFilters({ nonRefundable: isChecked });
  };

  const handleStopOptionChange = (option) => {
    onUpdateFilters({
      stopOptions: {
        ...finalFilters.stopOptions,
        [option]: !finalFilters.stopOptions[option],
      },
    });
  };

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter Results</h3>
        <button className={styles.reset}>Reset All</button>
      </div>
      
      {/* <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Price</h4>
        <div className={styles.priceRange}>
          <input
            type="range"
            min="3806"
            max="18661"
            value={priceRange[0]} // Using final value
            onChange={handlePriceRangeChange}
            className={styles.slider}
          />
          <div className={styles.priceValues}>
            <span>{priceRange[0]}</span>
            <span>{priceRange[1]}</span>
          </div>
        </div>
      </div> */}
      
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Fare Type</h4>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="refundable"
            checked={finalFilters.refundable} // Using final value
            onChange={handleRefundableChange}
          />
          <label htmlFor="refundable">Refundable</label>
        </div>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="nonRefundable"
            checked={finalFilters.nonRefundable} // Using final value
            onChange={handleNonRefundableChange}
          />
          <label htmlFor="nonRefundable">Non Refundable</label>
        </div>
      </div>

      {/* <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Stop</h4>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="nonStop"
            checked={finalFilters.stopOptions.nonStop} // Using final value
            onChange={() => handleStopOptionChange('nonStop')}
          />
          <label htmlFor="nonStop">Non Stop</label>
        </div>
        <div className={styles.checkbox}>
          <input
            type="checkbox"
            id="oneStop"
            checked={finalFilters.stopOptions.oneStop} // Using final value
            onChange={() => handleStopOptionChange('oneStop')}
          />
          <label htmlFor="oneStop">1 Stop</label>
        </div>
      </div> */}

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
        {Object.keys(airlines).length > 0 ? (
          Object.keys(airlines).map((airline) => (
            <div className={styles.checkbox} key={airline}>
              <input
                type="checkbox"
                id={airline}
                checked={airlines[airline]} // Using final value
                onChange={() => onUpdateFilters({
                  airlines: {
                    ...airlines,
                    [airline]: !airlines[airline],
                  },
                })}
              />
              <label htmlFor={airline}>{airline.replace(/([A-Z])/g, ' $1')}</label>
            </div>
          ))
        ) : (
          <div>No Airlines Available</div>
        )}
      </div>
    </div>
  );
};

export default FilterSidebar;
