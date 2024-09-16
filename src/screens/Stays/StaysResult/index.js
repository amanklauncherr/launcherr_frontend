import React from 'react'
import MainLayout from '@/components/MainLayout';
import FilterDataBox from '@/components/FilterDataBox';
import ImageLayout from '@/components/ImageLayout';
import styles from './stays.module.css'
import HotelCard from '../HotelCard/index'

const StaysResult = () => {
    return (
        <>
            <MainLayout>
                <ImageLayout Img_url='/images/f3.png'>
                    <FilterDataBox onclickbtn={'handleModify'} btn_name="Modify">
                        <div className={styles["modify-filter-inner"]}>
                            <p>Goa, India </p>
                            <p>
                                Check-In
                                <span>03 Sep 24</span>
                            </p>
                            <p>
                                Check-Out
                                <span>04 Sep 24</span>
                            </p>
                            <p>
                                Nights
                                <span>1</span>
                            </p>
                            <p>
                                Rooms & Guests
                                <span>2 Guest, 1 Rooms</span>
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
                            <h4>Hotel Name</h4>
                            <input type="text" placeholder="Hotel Name" className={styles.textInput} />
                        </div>
                        <div className={styles.starFilter}>
                            <h4>Star Rating</h4>
                            <div className={styles.stars}>
                                <select class="form-select" name="rating">
                                    <option value="0">Show All</option>
                                    <option value="1">1 Star or less</option>
                                    <option value="2">2 Star or less</option>
                                    <option value="3">3 Star or less</option>
                                    <option value="4">4 Star or less</option>
                                    <option value="5">5 Star or less</option>
                                    <option value="6">1 Star or More</option>
                                    <option value="7" selected="">2 Star or More</option>
                                    <option value="8">3 Star or More</option>
                                    <option value="9">4 Star or More</option>
                                    <option value="10">5 Star or More</option>
                                </select>
                            </div>
                        </div>
                        <div className={styles.locationFilter}>
                            <h4>Locations</h4>
                            <ul className={styles.locationList}>
                                {/* Add location items here */}
                            </ul>
                        </div>
                    </aside>
                    <main className={styles.hotelList}>
                        <header className={styles.resultsHeader}>
                            <h2>Showing Result 1094 of 1094 Hotels</h2>
                            <div className={styles.sortOptions}>
                                <label htmlFor="sort">Sort&nbsp;By</label>
                                <select id="sort" name="sort">
                                    <option value="name">Hotel Name</option>
                                    <option value="rating">Rating</option>
                                    <option value="price">Price</option>
                                </select>
                            </div>
                        </header>
                        <HotelCard />
                        <HotelCard />
                        <HotelCard />
                        <HotelCard />
                    </main>
                </div>
            </MainLayout>
        </>
    )
}

export default StaysResult