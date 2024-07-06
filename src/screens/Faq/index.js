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
        <HomeCrumbs>
          <div className={styles.container}>
            <div className={styles.faqSection}>
              <div className={styles["anyques"]}>
                <div></div>
               <p>ANY QUESTIONS</p>
               </div>
              <h2 className={styles["main-heading-faq"]}>FREQUENTLY ASKED QUESTIONS</h2>
              <p>Aperiam sociosqu urna praesent, tristique, corrupti condimentum asperiores platea ipsum ad arcu. Nostrum? Esse? Aut nostrum, ornare quas provident laoreet nesciunt odio voluptates etiam, omnis.</p>
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
            </div>
            <div className={styles.contactFormSection}>
              <h2>STILL HAVE A QUESTION?</h2>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullam corper.</p>
              <form>
                <label htmlFor="name">Your Name*</label>
                <input type="text" id="name" name="name" required />

                <label htmlFor="email">Your Email*</label>
                <input type="email" id="email" name="email" required />

                <label htmlFor="number">Your Number*</label>
                <input type="tel" id="number" name="number" required />

                <label htmlFor="message">Enter your message</label>
                <textarea id="message" name="message" rows="4" required></textarea>

                <button className='book-btn-primary' type="submit">SUBMIT QUESTIONS</button>
              </form>
            </div>
          </div>
        </HomeCrumbs>
      </MainLayout>
    </>
  )
}

export default Faq