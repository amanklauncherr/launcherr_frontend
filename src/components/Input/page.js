'use client'
import React, { useState } from 'react';
import HiddenEye from '../Icons/HiddenEye';
import ShowEye from '../Icons/ShowEye';
import styles from './input.module.css'

const Input = ({pattern, labelFor, inputType, value, onChange, maxLength, alert, placeholder }) => {
  const [isTyped, setIsTyped] = useState(false);

  const handleInput = (e) => {
    setIsTyped(true);
    onChange(e);
  };

  return (
    <div className='form-input-container'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <input
        type={inputType}
        value={value}
        maxLength={maxLength}
        onChange={handleInput}
        pattern={pattern}
        placeholder={placeholder}
      />
      {isTyped && <p className='alert-prompt'>{alert}</p>}
    </div>
  );
};

export default Input;


export const PhoneNo = ({pattern, labelFor, inputType, value, onChange, maxLength }) => {
  const handleInput = (e) => {
    onChange(e);
  };
  return (
    <div className='form-input-container'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <div className='RupeeInput'>
        +91
        <input
          type={inputType}
          value={value}
          maxLength={maxLength}
          onChange={handleInput}
          pattern={pattern}
        />
      </div>
    </div>
  );
};


export const RupeeInput = ({pattern, labelFor, inputType, value, onChange, maxLength }) => {
  const handleInput = (e) => {
    onChange(e);
  };
  return (
    <div className='form-input-container'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <div className='RupeeInput'>
        ₹
        <input
          type={inputType}
          value={value}
          maxLength={maxLength}
          onChange={handleInput}
          pattern={pattern}
        />
      </div>
    </div>
  );
};


export const Inputborder = ({inputMode, pattern, labelFor, inputType, value, onChange, maxLength, alert }) => {
  const [isTyped, setIsTyped] = useState(false);

  const handleInput = (e) => {
    setIsTyped(true);
    onChange(e);
  };

  return (
    <div className='form-input-container-border'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <input
        type={inputType}
        value={value}
        maxLength={maxLength}
        onChange={onChange}
        pattern={pattern}
        inputMode={inputMode}
      />
      {isTyped && <p className='alert-prompt'>{alert}</p>}
    </div>
  );
};


export const DateInput = ({ onChange, labelFor, value }) => {
  const validateDate = (e) => {
    const inputDate = e.target.value;
    const currentDate = new Date();
    const selectedDate = new Date(inputDate);

    if (selectedDate > currentDate) {
      e.target.value = '';
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className='form-input-container-border'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <input
        value={value}
        type="date" onChange={validateDate} />
    </div>
  );
};


export const DateInputborder = ({ onChange, labelFor, value }) => {
  const validateDate = (e) => {
    const inputDate = e.target.value;
    const currentDate = new Date();
    const selectedDate = new Date(inputDate);

    if (selectedDate > currentDate) {
      e.target.value = '';
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div className='form-input-container-border'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <input
        value={value}
        type="date" onChange={validateDate} />
    </div>
  );
};


export const InputPassword = ({errorMessage, labelFor, value, onChange, maxLength, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInput = (e) => {
    onChange(e);
  };

  return (
    <div className='form-input-container'>
      <label htmlFor={labelFor}>{labelFor}</label>
      <div className="password-input-box">
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          maxLength={maxLength}
          onChange={handleInput}
          placeholder={placeholder}
          className={errorMessage ? 'input-error' : ''}
        />
        {errorMessage && <p className='error-message'>{errorMessage}</p>}
        <span onClick={handleTogglePassword}>
          {showPassword ?
            <ShowEye />
            :
            <HiddenEye />
          }
        </span>
      </div>
    </div>
  );
};




export const FilterInput = ({pattern, labelFor, inputType, value, onChange, maxLength, placeholder }) => {

  const handleInput = (e) => {
    onChange(e);
  };

  return (
    <div className={styles['FilterInput-container']}>
      <label htmlFor={labelFor}>{labelFor}</label>
      <input
        type={inputType}
        value={value}
        maxLength={maxLength}
        onChange={handleInput}
        pattern={pattern}
        placeholder={placeholder}
      />
    </div>
  );
};



export const Dropdown = ({ labelFor, options, onChange }) => {
  return (
    <div className={styles['FilterInput-container']}>
      <label htmlFor={labelFor}>{labelFor}</label>
      <select onChange={onChange}>
        <option value="" disabled selected>
          Select an option
        </option>
        {options && options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};






