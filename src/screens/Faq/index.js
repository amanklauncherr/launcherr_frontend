import HomeCrumbs from '@/components/HomeCrumbs'
import ImageLayout from '@/components/ImageLayout'
import MainLayout from '@/components/MainLayout'
import styles from './faq.module.css'
import React, { useState } from 'react'

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/faq.png' heading='Frequently Asked Questions '>
        </ImageLayout>
          <div className={styles.container}>
            <div className={styles.faqSection}>
              <div className={styles["anyques"]}>
                <div></div>
                <p>ANY QUESTIONS</p>
              </div>
                <h2 className={styles["main-heading-faq"]}>FREQUENTLY ASKED QUESTIONS</h2>
              <div className={styles["accordian-image-sep"]}>
                <div className={styles.accordion}>
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
                </div>
                <div className={styles["faq-image-container"]}>
                  <img src="/images/faq2.png" alt="" />
                </div>
              </div>
            </div>

          </div>
      </MainLayout>
    </>
  )
}

export default Faq