import React, { useState } from 'react';
import dynamic from 'next/dynamic'; // Import dynamic from next/dynamic
import 'reactjs-popup/dist/index.css';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Home from '@/screens/Home';
import Cross from '@/components/Icons/Cross';

// Use dynamic import for reactjs-popup
const Popup = dynamic(() => import('reactjs-popup'), { ssr: false });

// Form component
const FormStep = ({ question, options, name, handleChange, value }) => {
  return (
    <form className='radio'>
      <p>{question}</p>
      {options ? (
        options.map((option, index) => (
          <div key={index}>
            <input
              type="radio"
              id={option}
              name={name}
              value={option}
              checked={value === option}
              onChange={handleChange}
            />
            <label htmlFor={option}>{option}</label>
          </div>
        ))
      ) : (
        <input
          type="text"
          id={name}
          name={name}
          value={value}
          onChange={handleChange}
        />
      )}
    </form>
  );
};

const Index = () => {
  const [showPopup, setShowPopup] = useState(true); // Initially set to true to show the popup
  const [showForm, setShowForm] = useState(false); // Initially set to false to hide the form
  const [step, setStep] = useState(0); // Current step of the stepper

  const handleContinue = () => {
    setShowForm(true); // Show the form when user clicks "Continue"
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleNotNow = () => {
    setShowPopup(false); // Close the popup without showing the form
  };

  const [formData, setFormData] = useState({
    travelerType: '',
    hobby: '',
    howYouKnowUs: '',
    email: '',
    name: '',
    phone: ''
    // Add more fields as needed
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      console.log(formData); // Console log the form data when the last step is reached
      setShowPopup(false);
    }
  };

  const handlePrevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const questions = [
    {
      question: "What kind of vacation lights up your soul?",
      options: [
        "Chillin' on sunny beaches",
        "Diving deep into culture and history",
        "Getting wild with outdoor adventures",
        "Livin' it up in luxury and relaxation",
        "I vibe with something else."
      ],
      name: "Answer1"
    },
    {
      question: "Who is your ride-or-die travel buddy?",
      options: [
        "Fam for those priceless moments",
        "Friends Squad for non-stop laughs",
        "Rollin' solo to find your groove",
        "Boo/Bae for that special connection"
      ],
      name: "Answer2"
    },
    {
      question: "How do you prefer to unwind while travelling?",
      options: [
        "Diving into a beach read",
        "Checking out cool museums and landmarks",
        "Exploring hiking trails and nature",
        "Relaxing with a spa day",
        "I vibe with something else."
      ],
      name: "Answer3"
    },
    {
      question: "What is your email?",
      name: "email"
    },
    {
      question: "What is your name?",
      name: "name"
    },
    {
      question: "What is your phone number?",
      name: "phone"
    }
  ];

  return (
    <>
      <Navbar />
      <Home />
      <Footer />
      <Popup open={showPopup}>
        {!showForm && (
          <div className='pop-up-inner'>
            <img src="/logo.svg" alt="" />
            <h1>Welcome to Launcherr!</h1>
            <p>
              Please take a moment to complete the survey form so we can better assist you with deals.
            </p>
            <Cross onClick={handleClose} />
            <div className='btn-sep-popup'>
              <button className='btn-border-white' onClick={handleNotNow}>Not Now</button>
              <button className='btn-border-white' onClick={handleContinue}>Continue</button>
            </div>
          </div>
        )}
        {showForm && (
          <div className='stepper'>
            {/* Your form components go here */}
            <FormStep
              question={questions[step].question}
              options={questions[step].options}
              name={questions[step].name}
              handleChange={handleChange}
              value={formData[questions[step].name]}
            />
            <div className="btn-sep-popup">
              {step > 0 && <button className='btn-border-white' onClick={handlePrevStep}>Previous</button>}
              <button className='btn-border-white' onClick={handleNext}>{step < questions.length - 1 ? "Next" : "Submit"}</button>
            </div>
            {/* Add your form components here */}
            <Cross onClick={handleClose} />
          </div>
        )}
      </Popup>
    </>
  );
};

export default Index;
