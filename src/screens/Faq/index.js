import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import styles from './faq.module.css'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const fetchFaqData = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/Show-QueAndAns');
        setFaqData(response.data);
      } catch (error) {
        console.error('Error fetching FAQ data:', error);
      }
    };

    fetchFaqData();
  }, []);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/faq.png' heading='Frequently Asked Questions '>
        </ImageLayout>
        <HomeCrumbs>
          <div className={styles.container}>
            <div className={styles.faqSection}>
              <div className={styles["anyques"]}>
                <div></div>
                <p>ANY QUESTIONS</p>
                <h2 className={styles["main-heading-faq"]}>FREQUENTLY ASKED QUESTIONS</h2>
              </div>
              <div className={styles["accordian-image-sep"]}>

                {/* <div className={styles.accordion}>
                {['HOW WE BECAME BEST AMONG OTHERS?', 'WHAT WE OFFER TO YOU?', 'HOW WE PROVIDE SERVICES FOR YOU?', 'ARE WE AFFORDABLE TO HIRE?'].map((question, index) => (
                  <div key={index} className={styles.accordionItem}>
                    <button
                      className={`${styles.accordionHeader} ${activeIndex === index ? styles.active : ''}`}
                      onClick={() => toggleAccordion(index)}
                    >
                      {question}
                    </button>
                    <div className={`${styles.accordionContent} ${activeIndex === index ? styles.show : ''}`}>
                      <p>Content for this question...</p>
                    </div>
                  </div>
                ))}
              </div> */}

                <div className={styles.accordion}>
                  {faqData.map((item, index) => (
                    <div key={index} className={styles.accordionItem}>
                      <button
                        className={`${styles.accordionHeader} ${activeIndex === index ? styles.active : ''}`}
                        onClick={() => toggleAccordion(index)}
                      >
                        {item.Question}
                      </button>
                      <div className={`${styles.accordionContent} ${activeIndex === index ? styles.show : ''}`}>
                        <p>{item.Answer}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles["faq-image-container"]}>
                  <img src="/images/faq2.png" alt="" />
                </div>
              </div>
            </div>

          </div>
        </HomeCrumbs>
      </MainLayout>
    </>
  )
}

export default Faq