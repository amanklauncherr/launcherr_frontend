import { useEffect, useState } from 'react';
import styles from './FilterSidebar.module.css';
import ModalPopup from '@/components/ModalPopup';
import anim from './anim.json';

const FilterSidebar = ({ airlinesCode = [], filters = {}, onUpdateFilters }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  
  const defaultFilters = {
    priceRange: [3806, 18661],
    refundable: null, 
    departureTimes: '',
    arrivalTimes: '',
    airlineCode: '',
  };

  useEffect(() => {
    onUpdateFilters({ airlineCode: '' });
  }, []);

  const finalFilters = { ...defaultFilters, ...filters };

  const updateLocalStorage = (updatedFilters) => {
    const filterData = {
      airlineCode: updatedFilters.airlineCode || '',
      Arrival: updatedFilters.arrivalTimes || 'Not Set',
      Departure: updatedFilters.departureTimes || 'Not Set',
      Refundable: updatedFilters.refundable,
    };
    localStorage.setItem('flightFilter', JSON.stringify(filterData));
  };

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200); // Short delay to simulate the debounce effect
  };

  const handleRefundableChange = (isRefundable) => {
    const updatedFilters = { ...finalFilters, refundable: isRefundable };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    refreshPage();
  };

  const handlePriceRangeChange = (event) => {
    const value = parseInt(event.target.value);
    const updatedPriceRange = [value, finalFilters.priceRange[1]];
    const updatedFilters = { ...finalFilters, priceRange: updatedPriceRange };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    refreshPage();
  };

  const handleDepartureTimeChange = (timeRange) => {
    const updatedFilters = { ...finalFilters, departureTimes: timeRange };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    refreshPage();
  };

  const handleArrivalTimeChange = (timeRange) => {
    const updatedFilters = { ...finalFilters, arrivalTimes: timeRange };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    refreshPage();
  };

  const handleAirlinesChange = (airlineCode) => {
    const updatedAirlineCode = airlineCode === finalFilters.airlineCode ? '' : airlineCode;
    const updatedFilters = { ...finalFilters, airlineCode: updatedAirlineCode };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    refreshPage();
  };

  const deleteFiltersFromLocalStorage = () => {
    localStorage.removeItem('flightFilter');
    window.location.reload();
  };

  const handleNoAirlinesFound = () => {
    setTimeout(() => {
      setModalOpen(true);
    }, 3000);
  };

  const handleCloseModal = () => {
    localStorage.removeItem('flightFilter');
    window.location.reload();
    setModalOpen(false);
  };

  useEffect(() => {
    if (airlinesCode.length === 0) {
      handleNoAirlinesFound();
    }
  }, [airlinesCode]);

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <h3 className={styles.title}>Filter Results</h3>
        <button onClick={deleteFiltersFromLocalStorage} className={styles.reset}>Reset All</button>
      </div>

      {/* Fare Type Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Fare Type</h4>
        <div className={styles.Refundableradio}>
          <input
            type="radio"
            id="refundable"
            name="fareType"
            value="true"
            checked={finalFilters.refundable === true}
            onChange={() => handleRefundableChange(true)}
          />
          <label htmlFor="refundable">Refundable</label>
        </div>
        <div className={styles.Refundableradio}>
          <input
            type="radio"
            id="nonRefundable"
            name="fareType"
            value="false"
            checked={finalFilters.refundable === false}
            onChange={() => handleRefundableChange(false)}
          />
          <label htmlFor="nonRefundable">Non Refundable</label>
        </div>
      </div>

      {/* Arrival Times Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Arrival Times</h4>
        <select onChange={(e) => handleArrivalTimeChange(e.target.value)} defaultValue={finalFilters.arrivalTimes}>
          <option value="">Select Time</option>
          <option value="12AM6AM">12AM-6AM</option>
          <option value="6AM12PM">6AM-12PM</option>
          <option value="12PM6PM">12PM-6PM</option>
          <option value="6PM12AM">6PM-12AM</option>
        </select>
      </div>

      {/* Departure Times Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Departure Times</h4>
        <select onChange={(e) => handleDepartureTimeChange(e.target.value)} defaultValue={finalFilters.departureTimes}>
          <option value="">Select Time</option>
          <option value="12AM6AM">12AM-6AM</option>
          <option value="6AM12PM">6AM-12PM</option>
          <option value="12PM6PM">12PM-6PM</option>
          <option value="6PM12AM">6PM-12AM</option>
        </select>
      </div>

      {/* Airline Selection */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Airlines</h4>
        {Array.isArray(airlinesCode) && airlinesCode.length > 0 ? (
          airlinesCode.map((code) => (
            <div className={styles.checkbox} key={code}>
              <input
                type="checkbox"
                id={code}
                checked={finalFilters.airlineCode === code}
                onChange={() => handleAirlinesChange(code)}
              />
              <label htmlFor={code}>{code}</label>
            </div>
          ))
        ) : (
          <p>No airlines found.</p>
        )}
      </div>

      {isModalOpen && (
        <ModalPopup
          Mainmessage="No Data Found"
          onClick={handleCloseModal}
          mylottiJson={anim}
          Submessage="Please reset the filter"
          btnName="Reset"
        />
      )}
    </div>
  );
};

export default FilterSidebar;
