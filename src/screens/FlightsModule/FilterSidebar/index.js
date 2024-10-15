import { useEffect, useState } from 'react';
import styles from './FilterSidebar.module.css';
import ModalPopup from '@/components/ModalPopup';
import anim from './anim.json';

const FilterSidebar = ({ airlinesCode = [], filters = {}, onUpdateFilters }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [localArrivalTime, setLocalArrivalTime] = useState('');
  const [localDepartureTime, setLocalDepartureTime] = useState('');
  const [airlineNames, setAirlineNames] = useState({});
  console.log("airlinenameee", airlinesCode)

  airlinesCode.forEach(code => {
    console.log(code);
});

  useEffect(() => {
    // Fetch saved filters from local storage on mount
    const savedFilters = JSON.parse(localStorage.getItem('flightFilter'));
    if (savedFilters) {
      setLocalArrivalTime(savedFilters.arrivalTimes || '');
      setLocalDepartureTime(savedFilters.departureTimes || '');
    }

    onUpdateFilters({ airlineCode: '' });
  }, []);

  const updateLocalStorage = (updatedFilters) => {
    const savedFilters = JSON.parse(localStorage.getItem('flightFilter')) || {}; // get current saved filters

    // Merge new changes with existing filters
    const filterData = {
      ...savedFilters, // keep existing filters intact
      ...updatedFilters, // update only the changed fields
    };

    localStorage.setItem('flightFilter', JSON.stringify(filterData));
  };

  const refreshPage = () => {
    setTimeout(() => {
      window.location.reload();
    }, 200);
  };


  const fetchAirlineName = async (airlineCode) => {
    // If airline name is already fetched, return it
    if (airlineNames[airlineCode]) return;

    try {
      const response = await axios.get(`https://api.launcherr.co/api/show/Airline?code=${airlineCode}`);
      if (response.data.success === 1) {
        // Update the state with the airline name
        setAirlineNames(prevState => ({
          ...prevState,
          [airlineCode]: response.data.data.airline_name,
        }));
      }
      console.log("responseeapiiiupdatee",response)
    } catch (error) {
      console.error('Error fetching airline name:', error);
    }
  };



  useEffect(() => {
    // Fetch airline names for all airline codes on component mount
    airlinesCode.forEach(code => {
      fetchAirlineName(code);
    });
  }, [airlinesCode]);

  const handleDepartureTimeChange = (timeRange) => {
    const updatedFilters = { departureTimes: timeRange }; // only update departure
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters); // persist to local storage
    setLocalDepartureTime(timeRange); // update local state for UI
    refreshPage();
  };

  const handleArrivalTimeChange = (timeRange) => {
    const updatedFilters = { arrivalTimes: timeRange }; // only update arrival
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters); // persist to local storage
    setLocalArrivalTime(timeRange); // update local state for UI
    refreshPage();
  };

  const handleAirlinesChange = (airlineCode) => {
    const updatedAirlineCode = airlineCode === filters.airlineCode ? '' : airlineCode;
    const updatedFilters = { airlineCode: updatedAirlineCode };
    onUpdateFilters(updatedFilters);
    updateLocalStorage(updatedFilters); // persist airline filter
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
    // window.location.reload();
    setModalOpen(false);
    window.location.href= "/flights"
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

      {/* Arrival Times Section */}
      <div className={styles.section}>
        <h4 className={styles.sectionTitle}>Arrival Times</h4>
        <select
          onChange={(e) => handleArrivalTimeChange(e.target.value)}
          value={localArrivalTime} // show the stored value in the dropdown
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
          value={localDepartureTime} // show the stored value in the dropdown
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
          airlinesCode.map((code) => (
            <div className={styles.checkbox} key={code}>
              <input
                type="checkbox"
                id={code}
                checked={filters.airlineCode === code}
                onChange={() => handleAirlinesChange(code)}
              />
              {/* Replace the code with the fetched airline name or show code if name is not yet fetched */}
              <label htmlFor={code}>{airlineNames[code] || code}</label>
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
          Submessage="Please search again"
          btnName="Click here"
        />
      )}
    </div>
  );
};

export default FilterSidebar;