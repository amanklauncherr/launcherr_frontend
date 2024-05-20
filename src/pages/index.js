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
      {options.map((option, index) => (
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
      ))}
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
      question: "Q.1 What kind of a traveler are you?",
      options: ["Planner", "Go with the flow", "Solo Backpacker", "I like to go halfsies (Book stays/transport)"],
      name: "travelerType"
    },
    {
      question: "Q.2 What do you look for when you travel?",
      options: ["Leisiure", "Thrills (I live for Adventure)", "Nightlife (where the crowd is)", "History buff"],
      name: "looktravel"
    },
    {
      question: "Q.3 Your Happy place?",
      options: ["Mountains", "Beach", "Historical places", "Wildlife"],
      name: "happyplace"
    },
    {
      question: "Q.4 How often would you like to travel?",
      options: ["Once a month (Imma Nomad)", "Every other month", "2-3 times a year", "4-5 times a year"],
      name: "durartiontravel"
    },
    {
      question: "Q.5 Do you like to shop before your trip? If so, what interests you the most?",
      options: ["Clothing", "Shoes", "Cosmetics/Toiletries", "Travel gear and accessories"],
      name: "shopbefore"
    },
    {
      question: "Q.6 What coupons interest you while travelling?",
      options: ["Restaurants", "Experiences", "Events", "Transport"],
      name: "interest"
    },
    {
      question: "Q.7 Lastly, would you like to view gigs that could help with your expenses?",
      options: ["Sure! Show me something that interests me.", "Nope, I’m good!"],
      name: "viewgigs"
    },
    // Add more questions as needed
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
