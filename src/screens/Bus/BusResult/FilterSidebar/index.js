import { useEffect, useState } from 'react';
import styles from './FilterSidebar.module.css';
import ModalPopup from '@/components/ModalPopup';
import anim from './anim.json';

const FilterSidebar = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  
  // Load initial values from localStorage
  const savedFilters = JSON.parse(localStorage.getItem('BusFilter')) || {};
  const [localArrivalTime, setLocalArrivalTime] = useState(savedFilters.arrivalTimes || '');
  const [localDepartureTime, setLocalDepartureTime] = useState(savedFilters.departureTimes || '');
  const [selectedSeater, setSelectedSeater] = useState(savedFilters.seater || false);
  const [selectedSleeper, setSelectedSleeper] = useState(savedFilters.sleeper || false);
  const [selectedAC, setSelectedAC] = useState(savedFilters.ac || false); // New state for AC filter

  const updateLocalStorage = (updatedFilters) => {
    const savedFilters = JSON.parse(localStorage.getItem('BusFilter')) || {};
    const filterData = { ...savedFilters, ...updatedFilters };
    localStorage.setItem('BusFilter', JSON.stringify(filterData));
  };

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };

  const handleArrivalTimeChange = (timeRange) => {
    const updatedFilters = { arrivalTimes: timeRange };
    updateLocalStorage(updatedFilters);
    setLocalArrivalTime(timeRange);
    refreshPage();
  };

  const handleDepartureTimeChange = (timeRange) => {
    const updatedFilters = { departureTimes: timeRange };
    updateLocalStorage(updatedFilters);
    setLocalDepartureTime(timeRange);
    refreshPage();
  };

  const handleSeaterChange = () => {
    const updatedFilters = { seater: !selectedSeater };
    updateLocalStorage(updatedFilters);
    setSelectedSeater(!selectedSeater);
    refreshPage();
  };

  const handleSleeperChange = () => {
    const updatedFilters = { sleeper: !selectedSleeper };
    updateLocalStorage(updatedFilters);
    setSelectedSleeper(!selectedSleeper);
    refreshPage();
  };

  const handleACChange = () => {
    const updatedFilters = { ac: !selectedAC };
    updateLocalStorage(updatedFilters);
    setSelectedAC(!selectedAC);
    refreshPage();
  };

  const deleteFiltersFromLocalStorage = () => {
    localStorage.removeItem('BusFilter');
    refreshPage();
  };

  const handleNoDataFound = () => {
    setTimeout(() => {
      setModalOpen(true);
    }, 3000);
  };

  const handleCloseModal = () => {
    localStorage.removeItem('BusFilter');
    setModalOpen(false);
    window.location.href = "/buses";
  };

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <button className={styles["filter-btn"]} onClick={toggleSidebar}>
        {isSidebarOpen ? 'Close Filter' : 'Filter'}
      </button>
      <div className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.header}>
          <h3 className={styles.title}>Filter Results</h3>
          <button onClick={deleteFiltersFromLocalStorage} className={styles.reset}>Reset All</button>
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

        <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="seater"
              checked={selectedSeater}
              onChange={handleSeaterChange}
            />
            <label htmlFor="seater">Seater</label>
          </div>

        <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="sleeper"
              checked={selectedSleeper}
              onChange={handleSleeperChange}
            />
            <label htmlFor="sleeper">Sleeper</label>
          </div>
        <div className={styles.checkbox}>
            <input
              type="checkbox"
              id="ac"
              checked={selectedAC}
              onChange={handleACChange}
            />
            <label htmlFor="ac">AC</label>
          </div>

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
    </>
  );
};

export default FilterSidebar;
