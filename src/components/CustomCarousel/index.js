import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import styles from './CustomCarousel.module.css'; // Import your custom CSS file
import { Children } from 'react';
import LeftCarouselIcon from '../Icons/LeftCarouselIcon';
import RightCarouselIcon from '../Icons/RightCarouselIcon';

const CustomCarousel = ({ children }) => {
    const renderCustomPrevArrow = (clickHandler, hasPrev, label) => (
        <button
            type="button"
            onClick={clickHandler}
            title={label}
            className={styles.customArrow}
            style={{ left: 0 }}
        >
            <LeftCarouselIcon />
        </button>
    );

    const renderCustomNextArrow = (clickHandler, hasNext, label) => (
        <button
            type="button"
            onClick={clickHandler}
            title={label}
            className={styles.customArrow}
            style={{ right: 10 }}
        >
            <RightCarouselIcon/>
        </button>
    );

    return (
        <div>
            <Carousel
                // autoPlay
                interval={2000}
                infiniteLoop
                showArrows
                renderArrowPrev={renderCustomPrevArrow}
                renderArrowNext={renderCustomNextArrow}
                showIndicators={false}
                showStatus={false}
            >

                {children}
            </Carousel>
        </div>
    );
};

export default CustomCarousel;
