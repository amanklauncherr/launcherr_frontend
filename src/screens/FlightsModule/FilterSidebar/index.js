import { useEffect, useState } from 'react';
import styles from './FilterSidebar.module.css';
import ModalPopup from '@/components/ModalPopup';
import anim from './anim.json';

const FilterSidebar = ({ priceFilter, airlinesCode = [], filters = {}, onUpdateFilters }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [localArrivalTime, setLocalArrivalTime] = useState('');
  const [localDepartureTime, setLocalDepartureTime] = useState('');
  const [selectedAirlineCode, setSelectedAirlineCode] = useState('');
  const [selectedStops, setSelectedStops] = useState('');
  const [maxPrice, setMaxPrice] = useState(priceFilter.maxPrice || 1000);

  console.log("priceFilter", priceFilter);
  const maxPriceData = priceFilter.maxPrice;
  const minPrice = priceFilter.minPrice;

  useEffect(() => {
    const savedFilters = JSON.parse(localStorage.getItem('flightFilter'));
    if (savedFilters) {
      setLocalArrivalTime(savedFilters.arrivalTimes || '');
      setLocalDepartureTime(savedFilters.departureTimes || '');
      setSelectedAirlineCode(savedFilters.airlineCode || '');
      setSelectedStops(savedFilters.stops || '');
      setMaxPrice(savedFilters.maxPrice || maxPriceData);
    }

    onUpdateFilters({ airlineCode: '' });
  }, [maxPriceData]);

  const updateLocalStorage = (updatedFilters) => {
    const savedFilters = JSON.parse(localStorage.getItem('flightFilter')) || {};
    const filterData = { ...savedFilters, ...updatedFilters };
    localStorage.setItem('flightFilter', JSON.stringify(filterData));
  };

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const handleDepartureTimeChange = (timeRange) => {
    const updatedFilters = { departureTimes: timeRange };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    setLocalDepartureTime(timeRange);
    refreshPage();
  };

  const handleArrivalTimeChange = (timeRange) => {
    const updatedFilters = { arrivalTimes: timeRange };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    setLocalArrivalTime(timeRange);
    refreshPage();
  };

  const handleAirlinesChange = (airlineCode) => {
    const updatedAirlineCode = airlineCode === selectedAirlineCode ? '' : airlineCode;
    const updatedFilters = { airlineCode: updatedAirlineCode };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    setSelectedAirlineCode(updatedAirlineCode);
    refreshPage();
  };

  const handleStopsChange = (stops) => {
    const updatedFilters = { stops };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    setSelectedStops(stops);
    refreshPage();
  };

  const handlePriceChange = (price) => {
    setMaxPrice(price);
  };

  const handleSliderRelease = () => {
    const updatedFilters = { maxPrice };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters);
    refreshPage();
  };

  const deleteFiltersFromLocalStorage = () => {
    localStorage.removeItem('flightFilter');
    refreshPage();
  };

  const handleNoAirlinesFound = () => {
    setTimeout(() => {
      setModalOpen(true);
    }, 3000);
  };

  const handleCloseModal = () => {
    localStorage.removeItem('flightFilter');
    setModalOpen(false);
    window.location.href = "/flights";
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

      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Price </h4>
        <div className={styles.sectionpriceslider}>
          <div className={styles.priceLabel}>{maxPrice}</div>
          <input
            type="range"
            min={minPrice || 100}
            max={maxPriceData || 5000}
            step="50"
            value={maxPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            onMouseUp={handleSliderRelease}
            onTouchEnd={handleSliderRelease}
            className={styles.priceSlider}
          />
          <div className={styles["filter-bottm-min-max"]}>
            <p>
              {minPrice}
            </p>
            <p>{maxPriceData}</p>
          </div>
        </div>

      </div>

      {/* Arrival Times Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Arrival Times</h4>
        <select
          onChange={(e) => handleArrivalTimeChange(e.target.value)}
          value={localArrivalTime}
        >
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
        <select
          onChange={(e) => handleDepartureTimeChange(e.target.value)}
          value={localDepartureTime}
        >
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
          airlinesCode.map(({ AirlineCode, AirlineName }) => (
            <div className={styles.checkbox} key={AirlineCode}>
              <input
                type="checkbox"
                id={AirlineCode}
                checked={selectedAirlineCode === AirlineCode}
                onChange={() => handleAirlinesChange(AirlineCode)}
              />
              <label htmlFor={AirlineCode}>{AirlineName}</label>
            </div>
          ))
        ) : (
          <p>No airlines found.</p>
        )}
      </div>

      {/* Stops Filter */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Stops</h4>
        <div className={styles.radioGroup}>
          <div className={styles.radioGroupInner}>
            <input
              type="radio"
              name="stops"
              value="0"
              checked={selectedStops === '0'}
              onChange={() => handleStopsChange('0')}
            />
            <label>
              Non-Stop Flights Only
            </label>
          </div>
          {/* <div className={styles.radioGroupInner}>
            <input
              type="radio"
              name="stops"
              value="1"
              checked={selectedStops === '1'}
              onChange={() => handleStopsChange('1')}
            />
            <label>
              1 Stop Connecting Flights
            </label>
          </div> */}
          <div className={styles.radioGroupInner}>
            <input
              type="radio"
              name="stops"
              value=""
              checked={selectedStops === ''}
              onChange={() => handleStopsChange('')}
            />
            <label>
              All Flights
            </label>
          </div>
        </div>
      </div>

      {/* Price Filter Slider */}


      {isModalOpen && (
        <ModalPopup
          Mainmessage="No Data Found"
          onClick={handleCloseModal}
          mylottiJson={anim}
          Submessage="Please search again"
          btnName="Click here"
        />
      )}
    </div>
  );
};

export default FilterSidebar;
