import React, { useState } from 'react'
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import styles from './stays.module.css'
import BusTicketCard from '../BusTicketCard';

const BusResult = () => {
    const [busTypes, setBusTypes] = useState([
        { key: 0, label: 'Non A/c Seater/ Sleeper (2+1)', isChecked: false },
        { key: 1, label: 'A/c Sleeper (2+1)', isChecked: false },
        { key: 2, label: 'Scania Ac Multi Axle Sleeper (2+1)', isChecked: false },
        { key: 3, label: 'Volvo Multi-axle A/c Sleeper (2+1)', isChecked: false },
        { key: 4, label: 'Ve A/c Sleeper (2+1)', isChecked: false },
        { key: 5, label: 'Non A/c Sleeper (2+1)', isChecked: false },
        { key: 6, label: 'Volvo Multi-axle I-shift  A/c Sleeper (2+1)', isChecked: false },
        { key: 7, label: 'Non A/c Seater / Sleeper (2+1)', isChecked: false },
        { key: 8, label: 'A/c Seater / Sleeper (2+1)', isChecked: false },
        { key: 9, label: 'Ac Sleeper (2+1)', isChecked: false },
        { key: 10, label: 'Volvo 9600 Multi-axle A/c Sleeper (2+1)', isChecked: false },
        { key: 11, label: 'Volvo Multi-axle Sleeper A/c (2+1)', isChecked: false },
        { key: 12, label: 'Bharat Benz A/c Sleeper (2+1)', isChecked: false },
        { key: 13, label: 'Volvo Multi Axle B9r A/c Sleeper (2+1)', isChecked: false },
        { key: 14, label: 'Volvo Multi-axle A/c Semi Sleeper (2+2)', isChecked: false },
        { key: 15, label: 'A/c Semi Sleeper (2+1)', isChecked: false },
        { key: 16, label: 'Volvo Multi Axle A/c Sleeper I-shift B11r (2+1)', isChecked: false },
    ]);
    const handleCheckboxChange = (index) => {
        const newBusTypes = [...busTypes];
        newBusTypes[index].isChecked = !newBusTypes[index].isChecked;
        setBusTypes(newBusTypes);

        // Do your filtering logic here
        doFilter('BusType', newBusTypes[index].key, newBusTypes[index].isChecked);
    };

    const doFilter = (filterType, key, isChecked) => {
        // Filtering logic based on filterType, key, and isChecked
        console.log(`Filtering ${filterType} with key ${key} and isChecked ${isChecked}`);
    };
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'>
                    <FilterDataBox onclickbtn={'handleModify'} btn_name="Modify">
                        <div className={styles["modify-filter-inner"]}>
                            <p>From
                                <span>Delhi</span>
                            </p>

                            <p>
                                To
                                <span>Lucknow</span>
                            </p>
                            <p>
                                Nights
                                <span>1</span>
                            </p>
                            <p>
                                Date
                                <span>20 Oct 24</span>
                            </p>
                        </div>
                    </FilterDataBox>
                </ImageLayout>
                <div className={styles.hotelSearchContainer}>
                    <aside className={styles.filterSidebar}>
                        <div className={styles.filterSection}>
                            <h3>Filter Results</h3>
                            <button className={styles.resetButton}>Reset All</button>
                        </div>
                        <div className={styles.priceFilter}>
                            <h4>Price</h4>
                            <div className={styles.sliderContainer}>
                                <input type="range" min="1219.82" max="72099.89" className={styles.slider} />
                            </div>
                        </div>
                        <div className={styles.textFilter}>
                            <h4>Travel Operators</h4>
                            <input type="text" placeholder="Search Travel Operators" className={styles.textInput} />
                        </div>
                        <div className={styles.starFilter}>
                            <h4>Bus Type</h4>
                            <div id="bus_filter" className="bus0filter mt-2" style={{ height: '300px', overflow: 'auto' }}>
                                {busTypes.map((item, index) => (
                                    <div className="promoOffersContent" key={index}>
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`BusType${item.key}`}
                                                onChange={() => handleCheckboxChange(index)}
                                                checked={item.isChecked}
                                            />
                                            <label className="form-check-label" htmlFor={`BusType${item.key}`}>
                                                {item.label}
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.locationFilter}>
                            <h4>Departure Times</h4>
                            <ul className={styles.locationList}>
                                <div className={styles["Departure-check"]}>
                                    <input type="checkbox" id="" name="" value=""/>
                                        <label for=""> Morning</label>
                                </div>
                                <div className={styles["Departure-check"]}>
                                    <input type="checkbox" id="" name="" value=""/>
                                        <label for=""> Afternoon
                                        </label>
                                </div>
                                <div className={styles["Departure-check"]}>
                                    <input type="checkbox" id="" name="" value=""/>
                                        <label for=""> Evening</label>
                                </div>
                                <div className={styles["Departure-check"]}>
                                    <input type="checkbox" id="" name="" value=""/>
                                        <label for=""> Night</label>
                                </div>
                            </ul>
                        </div>
                        <div className={styles.locationFilter}>
                            <h4>Arrival Times</h4>
                            <ul className={styles.locationList}>
                                <div className={styles["Departure-check"]}>
                                    <input type="checkbox" id="" name="" value=""/>
                                        <label for=""> Morning</label>
                                </div>
                                <div className={styles["Departure-check"]}>
                                    <input type="checkbox" id="" name="" value=""/>
                                        <label for=""> Night</label>
                                </div>
                            </ul>
                        </div>
                    </aside>
                    <main className={styles.hotelList}>
                        <header className={styles.resultsHeader}>
                            <h2>Showing Result 1 of 174 Buses</h2>
                            <div className={styles.sortOptions}>
                                <label htmlFor="sort">Sort&nbsp;By</label>
                                <select id="sort" name="sort">
                                    <option value="Depart">Depart</option>
                                    <option value="Duration">Duration</option>
                                    <option value="Arrive">Arrive</option>
                                    <option value="price">Price</option>
                                </select>
                            </div>
                        </header>
                       <BusTicketCard/>
                       <BusTicketCard/>
                       <BusTicketCard/>
                       <BusTicketCard/>
                       <BusTicketCard/>
                       <BusTicketCard/>
                       <BusTicketCard/>
                       <BusTicketCard/>
                    </main>
                </div>
            </MainLayout>
        </>
    )
}

export default BusResult