import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import 'reactjs-popup/dist/index.css';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Home from '@/screens/Home';
import Cross from '@/components/Icons/Cross';
import toast from 'react-hot-toast';

const Popup = dynamic(() => import('reactjs-popup'), { ssr: false });

const FormStep = ({ question, options, name, handleChange, value, showPhoneInput, countryCodes, error }) => {
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
        showPhoneInput ? (
          <div className='phone-input'>
            <select
              className='text-input-code'
              id="countryCode"
              name="countryCode"
              value={value.countryCode}
              onChange={handleChange}
            >
              {countryCodes.map((code, index) => (
                <option key={index} value={code}>
                  {code}
                </option>
              ))}
            </select>
            <input
              className='text-input-full'
              type="tel"
              id="phone"
              name="phone"
              value={value.phone}
              onChange={handleChange}
              maxLength='10'
            />
          </div>
        ) : (
          <input
            className='text-input-full'
            type="text"
            id={name}
            name={name}
            value={value}
            onChange={handleChange}
          />
        )
      )}
      {error && <p className="error-message">{error}</p>}
    </form>
  );
};

const Index = () => {
  const [showPopup, setShowPopup] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(0);
  const [countryCodes, setCountryCodes] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCountryCodes = async () => {
      try {
        const response = await axios.get('https://api.launcherr.co/api/showCode');
        if (response.data.success) {
          setCountryCodes(response.data.Codes);
        }
      } catch (error) {
        console.error('Error fetching country codes:', error);
      }
    };

    fetchCountryCodes();
  }, []);

  const handleContinue = () => {
    setShowForm(true);
  };

  const handleClose = () => {
    setShowPopup(false);
  };

  const handleNotNow = () => {
    setShowPopup(false);
  };

  const [formData, setFormData] = useState({
    travelerType: '',
    hobby: '',
    howYouKnowUs: '',
    email: '',
    name: '',
    countryCode: '+91',
    phone: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    setError(''); // Clear error on change
  };

  const handleNext = async () => {
    const currentQuestion = questions[step];

    // Validation check
    if (!formData[currentQuestion.name]) {
      toast.error('This field is required.');
      return;
    }

    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.countryCode + formData.phone,
        answer1: formData.Answer1,
        answer2: formData.Answer2,
        answer3: formData.Answer3
      };

      try {
        const response = await axios.post('https://api.launcherr.co/api/AddQuiz', payload);
        console.log('API Response:', response.data);
        setShowPopup(false);

        if (response.status === 200) {
          localStorage.setItem('quizCompleted', '1');
          setShowPopup(false);
        }
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
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
      name: "phone",
      showPhoneInput: true
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
            <FormStep
              question={questions[step].question}
              options={questions[step].options}
              name={questions[step].name}
              handleChange={handleChange}
              value={formData[questions[step].name]}
              showPhoneInput={questions[step].showPhoneInput}
              countryCodes={countryCodes}
              error={error}
            />
            <div className="btn-sep-popup">
              {step > 0 && <button className='btn-border-white' onClick={handlePrevStep}>Previous</button>}
              <button className='btn-border-white' onClick={handleNext}>{step < questions.length - 1 ? "Next" : "Submit"}</button>
            </div>
            <Cross onClick={handleClose} />
          </div>
        )}
      </Popup>
    </>
  );
};

export default Index;
