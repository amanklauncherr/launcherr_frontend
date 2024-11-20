import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styles from './bookingform.module.css'
import Cross from '@/components/Icons/Cross';
import axios from 'axios';
import Cookies from 'js-cookie';

const BookingForm = ({encryptedKey, encryptedToken, baseFare, serviceTaxAbsolute, operatorServiceChargeAbsolute, selectedFares, PayableAmount, selectedSeats, tripId, boardingPoint, dropingPoint, tripDetails }) => {
  const router = useRouter();
  const [userData, setUserData] = useState({ phone: '', email: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Define the state for seat data and passenger data separately
  const [seatData, setSeatData] = useState([]);
  const [passengerData, setPassengerData] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [payload, setPayload] = useState();
  const [referenceKey ,setRefrenceKey] = useState();

  const { sourceId , destinationId,  } = JSON.parse(localStorage.getItem('Bus_Search_data')) || {};

  console.log('sourceId', sourceId)
  
  const totalFare = selectedFares.reduce((acc, fare) => acc + parseFloat(fare), 0);
  
    useEffect(() => {
    console.log("Updated Seat Data:", seatData);
  }, [seatData]);

  // Log changes to passengerData immediately
  useEffect(() => {
    console.log("Updated Passenger Data:", passengerData);
  }, [passengerData]);

  
  console.log('totalFare', totalFare)
  // Update seatData and passengerData whenever selectedSeats or tripDetails change
  useEffect(() => {
    if (tripDetails?.seats && selectedSeats.length > 0) {
      const updatedSeatData = selectedSeats.map((seat, index) => {
        const seatDetails = tripDetails.seats.find(s => s.name === seat);
        if (!seatDetails) return null;  // If no matching seat, return null

        return {
          seatName: seatDetails.name,  // Ensure this is correctly populated
          fare: selectedFares || 0,
          serviceTax: operatorServiceChargeAbsolute || 0,
          operatorServiceCharge: seatDetails.operatorServiceChargeAbsolute || 0,
          ladiesSeat: '',
          passenger: {
            name: '',
            mobile: '',
            title: '',
            email: '',
            age: '',
            gender: '',
            address: '',
            idType: 'Pancard',
            idNumber: '',
            primary: (index + 1).toString()
          }
        };
      }).filter(item => item !== null);

      setSeatData(updatedSeatData);

      // Log the seatData to confirm it's being populated correctly
      console.log("Updated Seat Data:", updatedSeatData);
    }
  }, [selectedSeats, tripDetails]);



  const handleSeatChange = (e, seatIndex, field) => {
    const updatedSeatData = [...seatData];
    if (!updatedSeatData[seatIndex]) {
      updatedSeatData[seatIndex] = {};
    }
    updatedSeatData[seatIndex][field] = e.target.value;
    setSeatData(updatedSeatData);
  };

  const handlePassengerChange = (e, seatIndex, field) => {
    const updatedPassengerData = [...passengerData];
    if (!updatedPassengerData[seatIndex]) {
      updatedPassengerData[seatIndex] = { passenger: {} };
    }

    updatedPassengerData[seatIndex].passenger[field] = e.target.value;

    // Log the seat name and field being updated
    const seatName = seatData[seatIndex]?.seatName || 'Unknown Seat';  // Check seatName here
    console.log(`Updating passenger info for seat: ${seatName}, Field: ${field}, New Value: ${e.target.value}`);

    setPassengerData(updatedPassengerData);
  };




  const logFormData = () => {
    console.log("seatdatatat", seatData);  // Log the seatData to inspect
  
    // Map seatData to the final inventoryItems format
    const inventoryItems = seatData.map((seat, index) => ({
      seatName: seat.seatName,  // Access seatName from the seat object directly
      fare: parseFloat(selectedFares[index]), // Convert string to a number with decimals
      serviceTax: parseFloat(serviceTaxAbsolute[index]), // Convert string to a number with decimals
      operatorServiceCharge: parseFloat(operatorServiceChargeAbsolute[index]), 
      ladiesSeat: seat.ladiesSeat,  // Access from seat object
      passenger: {
        ...seat.passenger,
        name: passengerData[index]?.passenger?.name || '',
        mobile: passengerData[index]?.passenger?.mobile || '',
        title: passengerData[index]?.passenger?.title || 'Mr',
        email: passengerData[index]?.passenger?.email || '',
        age: passengerData[index]?.passenger?.age || '',
        gender: passengerData[index]?.passenger?.gender || 'MALE',
        address: passengerData[index]?.passenger?.address || '',
        idType: passengerData[index]?.passenger?.idType || 'Pancard',
        idNumber: passengerData[index]?.passenger?.idNumber || '',
        primary: (index + 1).toString()
      }
    }));
  
    const formData = {
      headersToken : encryptedToken,
      headersKey : encryptedKey,
      boardingPoint,
      dropingPoint,
      source: sourceId,
      destination: destinationId,
      tripId,
      serviceCharge: "0",
      inventoryItems
    };
  
    setPayload(formData);
    console.log('Form Data:', formData);  // Log the complete form data
  };


  useEffect(() => {
    const authToken = Cookies.get('auth_token');
    setIsLoggedIn(!!authToken);
    if (authToken) {
      axios.get('https://api.launcherr.co/api/showUserProfile', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
        .then(response => {
          console.log('responseuser', response)
          if (response.data.success) {
            setUserData({
              phone: response.data.userprofile.user_Number,
              email: response.data.user.email
            });
          }
        })
        .catch(error => {
          console.error('profile:', error?.response?.data?.success);
          if (error?.response?.data?.success == 0) {
            alert('Your session has expired. Please log in again.');
            Cookies.remove('auth_token');
          }
        });
    }
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    logFormData();
    const authToken = Cookies.get('auth_token');
    if (authToken) {
      try {
        const response = await axios.post('https://api.launcherr.co/api/Partial/Booking', payload , {
          headers: { 
            Authorization: `Bearer ${authToken}` 
          }
        });
        console.log("Response:", response);
        setRefrenceKey(response?.data?.data?.payloads?.data?.referenceKey)
        window.location.href = `https://shubhangverma.com/bus/phonepe.php?amount=${totalFare}&referenceKey=${referenceKey}&baseFare=${baseFare}&passengerPhone=${userData.phone}&passengerEmail=${userData.email}`;
      } catch (error) {
        console.error("API Error:", error);
      }
    }
  };
  

  const handleProceedClick = () => {
    const authToken = Cookies.get('auth_token');
  
    if (authToken) {
      setIsFormVisible(true);
    } else {
      router.push('/auth/login')
    }
  };

  const handlecross = () => {
    setIsFormVisible(false);
  }
  return (
    <div>
      {selectedSeats.length > 0 && (
        <button className={styles["proceed-btn"]} onClick={handleProceedClick}>Proceed to book</button>
      )}

      {isFormVisible && (
        <div className={styles['form-main-booking']}>

          <form onSubmit={handleSubmit}>
            <div className={styles["crossArea"]}>

              <div onClick={handlecross}>
                <svg width="20" height="20" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3.72753 0.613592L12.5 9.38569L21.227 0.659043C21.4198 0.453871 21.652 0.28974 21.9098 0.176492C22.1675 0.0632451 22.4455 0.00321419 22.727 0C23.3297 0 23.9078 0.23943 24.334 0.665618C24.7602 1.09181 24.9996 1.66984 24.9996 2.27256C25.0049 2.55118 24.9532 2.82795 24.8477 3.08587C24.7422 3.3438 24.5851 3.57744 24.386 3.77246L15.5454 12.4991L24.386 21.3394C24.7606 21.7058 24.9802 22.202 24.9996 22.7256C24.9996 23.3284 24.7602 23.9064 24.334 24.3326C23.9078 24.7588 23.3297 24.9982 22.727 24.9982C22.4373 25.0102 22.1484 24.9619 21.8784 24.8562C21.6084 24.7506 21.3634 24.59 21.1588 24.3846L12.5 15.6125L3.75026 24.3619C3.55823 24.5602 3.32883 24.7186 3.07528 24.8278C2.82174 24.937 2.54908 24.9949 2.27303 24.9982C1.67028 24.9982 1.09222 24.7588 0.666016 24.3326C0.23981 23.9064 0.000369777 23.3284 0.000369777 22.7256C-0.00492892 22.447 0.0467671 22.1703 0.152286 21.9123C0.257804 21.6544 0.414919 21.4208 0.613988 21.2257L9.45463 12.4991L0.613988 3.65883C0.239419 3.2924 0.0197774 2.79619 0.000369777 2.27256C0.000369777 1.66984 0.23981 1.09181 0.666016 0.665618C1.09222 0.23943 1.67028 0 2.27303 0C2.81847 0.00681769 3.34118 0.227256 3.72753 0.613592Z" fill="#3E494E" />
                </svg>
              </div>
            </div>
            {selectedSeats.length > 0 ? (
              selectedSeats.map((seatName, index) => {
                const seatDetails = tripDetails?.seats.find(s => s.name === seatName);
                return (
                  <div key={index} className={styles["form-main-container"]}>
                    <div className={styles["checkbox-input-seat"]}>
                      <h4>Seat&nbsp;{seatName}</h4>
                      <input
                        type="checkbox"
                        required
                        value={seatName || ''}  // Dynamically set seatName as the value
                        onClick={(e) => handleSeatChange(e, index, 'seatName')}
                      />
                    </div>
                    <label>
                      Ladies Seat:
                    </label>
                    <select
                      value={seatData[index]?.ladiesSeat || "Select option"}
                      required
                      onChange={(e) => handleSeatChange(e, index, 'ladiesSeat')}
                    >
                      <option value="false">No</option>
                      <option disabled >Select option</option>
                      <option value="true">Yes</option>
                    </select>

                    {/* Passenger-related data */}
                    <h5>Passenger Details</h5>

                    <label>
                      Title:
                    </label>
                    <select
                      required
                      value={passengerData[index]?.passenger?.title || 'Select title'}
                      onChange={(e) => handlePassengerChange(e, index, 'title')}
                    >
                      <option disabled value="">Select title</option>
                      <option value="Mr">Mr</option>
                      <option value="Mrs">Mrs</option>
                      <option value="Miss">Miss</option>
                    </select>

                    <label>
                      Name:
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerData[index]?.passenger?.name || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'name')}
                    />
                    <label>
                      Mobile:
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerData[index]?.passenger?.mobile || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'mobile')}
                    />


                    <label>
                      Email Id:
                    </label>
                    <input
                      type="email"
                      required
                      value={passengerData[index]?.passenger?.email || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'email')}
                    />
                    <label>
                      Age:
                    </label>
                    <input
                      type="number"
                      required
                      value={passengerData[index]?.passenger?.age || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'age')}
                    />
                    <label>
                      Gender:
                    </label>
                    <select
                      value={passengerData[index]?.passenger?.gender|| ''}
                      required
                      onChange={(e) => handlePassengerChange(e, index, 'gender')}
                    >
                      <option disabled value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="non-binary">Non-Binary</option>
                      <option value="transgender-male">Transgender Male</option>
                      <option value="transgender-female">Transgender Female</option>
                      <option value="genderqueer">Genderqueer</option>
                      <option value="genderfluid">Genderfluid</option>
                      <option value="agender">Agender</option>
                      <option value="bigender">Bigender</option>
                      <option value="two-spirit">Two-Spirit</option>
                      <option value="gender-non-conforming">Gender Non-Conforming</option>
                      <option value="prefer-not-to-say">Prefer Not to Say</option>
                      <option value="other">Other</option>
                    </select>

                    <label>
                      Address:
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerData[index]?.passenger?.address || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'address')}
                    />
                    <label>
                      Id Type:
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerData[index]?.passenger?.idType || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'idType')}
                    />
                    <label>
                      Id Number:
                    </label>
                    <input
                      type="text"
                      required
                      value={passengerData[index]?.passenger?.idNumber || ''}
                      onChange={(e) => handlePassengerChange(e, index, 'idNumber')}
                    />
                  </div>
                );
              })
            ) : (
              <p>No seats selected</p>
            )}
            <div className={styles["submit-area"]}>
              <div>
                <p>Total Amount: <span>{totalFare}</span></p>
              </div>
              <button
                type="submit"
                className={styles.payButton}
              >
                <img src="/icons/phonepe-icon.webp" alt="" />
                <p>Pay with PhonePe</p>
              </button>
            </div>
          </form>
        </div>

      )}
    </div>
  );
};

export default BookingForm;
