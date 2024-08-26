import React, { useState } from 'react';
import axios from 'axios'; // Import axios for HTTP requests
import styles from './FlightOffer.module.css';
import { FaPlaneDeparture, FaPlaneArrival, FaMoneyBill, FaCalendarDay, FaRegCalendarAlt } from 'react-icons/fa';
import { GiMoneyStack } from 'react-icons/gi';

const FlightOffer = ({ flightOffer }) => {
  const { flightOffers, bookingRequirements } = flightOffer?.data || {};
  const flightOfferData = flightOffers?.[0] || {};
  const { validatingAirlineCodes, pricingOptions, price, itineraries, travelerPricings } = flightOfferData;
  console.log('Price:', price);
  //  console.log('travelerPricings', travelerPricings.map(traveler => traveler?.fareOption[0]));
  const fareDetailsBySegment = travelerPricings.map(traveler => traveler.fareDetailsBySegment[0])
  const fareOption = travelerPricings[0]?.fareOption;


  const formatTime = (dateTime) => new Date(dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const fareDetailsMap = {};
  travelerPricings?.forEach(traveler => {
    traveler.fareDetailsBySegment.forEach(detail => {
      fareDetailsMap[detail.segmentId] = detail;
    });
  });

  const [passengers, setPassengers] = useState([{
    id: Date.now(),
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    documentType: '',
    documentNumber: '',
    documentExpiry: '',
    birthPlace: '',
    issuanceLocation: '',
    issuanceDate: '',
    issuanceCountry: '',
    validityCountry: '',
    nationality: ''
  }]);

  const handleAddPassenger = () => {
    setPassengers([...passengers, {
      id: Date.now(),
      firstName: '',
      lastName: '',
      dateOfBirth: '',
      gender: '',
      email: '',
      phone: '',
      documentType: '',
      documentNumber: '',
      documentExpiry: '',
      birthPlace: '',
      issuanceLocation: '',
      issuanceDate: '',
      issuanceCountry: '',
      validityCountry: '',
      nationality: ''
    }]);
  };

  const handleRemovePassenger = (id) => {
    setPassengers(passengers.filter(passenger => passenger.id !== id));
  };

  const handleChange = (id, field, value) => {
    setPassengers(passengers.map(passenger =>
      passenger.id === id ? { ...passenger, [field]: value } : passenger
    ));
  };

  const fetchToken = async () => {
    try {
      const response = await axios.post('https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'zYssACjlbXv0PDbxMpVN58WRU7kqgGtA',
          client_secret: 'IqAniSZnJlFVMtL0'
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching token:', error);
    }
  };



  // const handleBookNow = async () => {
  //   // Log the passenger details
  //   console.log('Passenger Details:', passengers);
  
  //   // Additional code for handling the booking process can go here.
  //   try {
  //     const token = await fetchToken();
  //     if (!token) {
  //       console.error('No token received');
  //       return;
  //     }
  
  //     // Booking logic (uncomment if needed)
  //     // ...
      
  //   } catch (error) {
  //     console.error('Error booking flight:', error.response ? error.response.data : error.message);
  //   }
  // };
  

  const handleBookNow = async () => {
    window.location.href = `https://shubhangverma.com/phonepe.php?amount=${price?.grandTotal}`;
    try {
      const token = await fetchToken();
      if (!token) {
        console.error('No token received');
        return;
      }

      // Validate your country codes and traveler IDs based on the API documentation
      const allowedCountries = ["FR", "ES", "US"]; // Example allowed country codes
      const travelers = passengers.map(passenger => ({
        id: passenger.id.toString(),
        dateOfBirth: passenger.dateOfBirth,
        name: {
          firstName: passenger.firstName,
          lastName: passenger.lastName
        },
        gender: passenger.gender,
        contact: {
          emailAddress: passenger.email,
          phones: [
            {
              deviceType: "MOBILE",
              countryCallingCode: "91", // Ensure this is correct
              number: passenger.phone
            }
          ]
        },
        documents: [
          {
            documentType: passenger.documentType,
            birthPlace: passenger.birthPlace,
            issuanceLocation: passenger.issuanceLocation,
            issuanceDate: passenger.issuanceDate,
            number: passenger.documentNumber,
            expiryDate: passenger.documentExpiry,
            issuanceCountry: allowedCountries.includes(passenger.issuanceCountry) ? passenger.issuanceCountry : "FR", // Correct if necessary
            validityCountry: allowedCountries.includes(passenger.validityCountry) ? passenger.validityCountry : "FR", // Correct if necessary
            nationality: allowedCountries.includes(passenger.nationality) ? passenger.nationality : "FR", // Correct if necessary
            holder: true
          }
        ]
      }));

      // console.log("travelerstravelers",travelers)

      const flightOffers = [{
        // Make sure these match your actual flight offer data
        type: "flight-offer",
        id: flightOfferData.id || "5",
        source: "GDS",
        itineraries: itineraries || [],
        price: price || {},
        pricingOptions: pricingOptions,
        validatingAirlineCodes: validatingAirlineCodes,
        travelerPricings: travelers.map(traveler => ({
          travelerId: traveler.id,
          fareOption: fareOption,
          fareBasis: "ExampleFareBasis",
          travelerType: "ADULT",
          class: "Economy",
          price: {
            currency: "USD",
            total: "1000"
          },
          fareDetailsBySegment: fareDetailsBySegment
        }))
        
      }];

      const payload = {
        data: {
          type: "flight-order",
          flightOffers: flightOffers,
          travelers: travelers,
          remarks: {
            general: [
              {
                subType: "GENERAL_MISCELLANEOUS",
                text: "ONLINE BOOKING FROM INCREIBLE VIAJES"
              }
            ]
          },
          ticketingAgreement: {
            option: "DELAY_TO_CANCEL",
            delay: "6D"
          },
          contacts: [
            {
              addresseeName: {
                firstName: "PABLO",
                lastName: "RODRIGUEZ"
              },
              companyName: "INCREIBLE VIAJES",
              purpose: "STANDARD",
              phones: [
                {
                  deviceType: "LANDLINE",
                  countryCallingCode: "34",
                  number: "480080071"
                },
                {
                  deviceType: "MOBILE",
                  countryCallingCode: "33",
                  number: "480080072"
                }
              ],
              emailAddress: "support@increibleviajes.es",
              address: {
                lines: [
                  "Calle Prado, 16"
                ],
                postalCode: "28014",
                cityName: "Madrid",
                countryCode: "ES"
              }
            }
          ]
        }
      };

      await axios.post('https://api.amadeus.com/v1/booking/flight-orders', payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      console.log('Booking successful');
    } catch (error) {
      console.error('Error booking flight:', error.response ? error.response.data : error.message);
    }
  };



  return (
    <>
      <div className={styles["flight-offer-sep-main-container"]}>
        <div className={styles["passenger-section"]}>
          <div className={styles["passenger-details-btn-sep-1"]}>
            <h2>Total Passengers: {passengers.length}</h2>
            <button className={styles["btn-inner-blue"]} type="button" onClick={handleAddPassenger}>Add More Passenger</button>
          </div>

          <div className={styles.passengerForm}>
            <>
              {passengers.map((passenger, index) => (
                <div key={passenger.id} className={styles["form-bottom-space"]}>
                  <div className={styles["form-inner-container-for-sep"]}>
                    <div className={styles["passenger-details-btn-sep"]}>
                      <h3 className={styles.sectionTitle}>Passenger Details ( {index + 1} )</h3>
                      <button className={styles["btn-inner"]} type="button" onClick={() => handleRemovePassenger(passenger.id)}>Remove Passenger&nbsp;&nbsp;( {index + 1} )</button>
                    </div>
                    <div className={styles.passenger}>
                      <div>
                        <label>First Name:</label>
                        <input
                          type="text"
                          value={passenger.firstName}
                          onChange={(e) => handleChange(passenger.id, 'firstName', e.target.value)}
                        />
                        <label>Last Name:</label>
                        <input
                          type="text"
                          value={passenger.lastName}
                          onChange={(e) => handleChange(passenger.id, 'lastName', e.target.value)}
                        />
                        <label>Date of Birth:</label>
                        <input
                          type="date"
                          value={passenger.dateOfBirth}
                          onChange={(e) => handleChange(passenger.id, 'dateOfBirth', e.target.value)}
                        />
                        <label>Gender:</label>
                        <select
                          value={passenger.gender}
                          onChange={(e) => handleChange(passenger.id, 'gender', e.target.value)}
                        >
                          <option value="">Select</option>
                          <option value="MALE">Male</option>
                          <option value="FEMALE">Female</option>
                          <option value="OTHER">Other</option>
                        </select>
                        <label>Email:</label>
                        <input
                          type="email"
                          value={passenger.email}
                          onChange={(e) => handleChange(passenger.id, 'email', e.target.value)}
                        />
                        <label>Phone:</label>
                        <input
                          type="text"
                          value={passenger.phone}
                          onChange={(e) => handleChange(passenger.id, 'phone', e.target.value)}
                        />
                      </div>

                      <div>
                        <div className={styles["sep"]}>
                          <div>
                            <label>Document Type:</label>
                            <input
                              type="text"
                              value={passenger.documentType}
                              onChange={(e) => handleChange(passenger.id, 'documentType', e.target.value)}
                            />
                          </div>
                          <div className={styles["sep"]}>
                            <div>
                              <label>Document Number:</label>
                              <input
                                type="text"
                                value={passenger.documentNumber}
                                onChange={(e) => handleChange(passenger.id, 'documentNumber', e.target.value)}
                              />
                            </div>
                          </div>
                        </div>
                        <div className={styles["sep"]}>
                          <div>
                            <label>Document Expiry Date:</label>
                            <input
                              type="date"
                              value={passenger.documentExpiry}
                              onChange={(e) => handleChange(passenger.id, 'documentExpiry', e.target.value)}
                            />
                          </div>
                          <div>
                            <label>Issuance Date:</label>
                            <input
                              type="date"
                              value={passenger.issuanceDate}
                              onChange={(e) => handleChange(passenger.id, 'issuanceDate', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label>Issuance Location:</label>
                          <input
                            type="text"
                            value={passenger.issuanceLocation}
                            onChange={(e) => handleChange(passenger.id, 'issuanceLocation', e.target.value)}
                          />
                        </div>

                        <div>
                          <label>Birth Place:</label>
                          <input
                            type="text"
                            value={passenger.birthPlace}
                            onChange={(e) => handleChange(passenger.id, 'birthPlace', e.target.value)}
                          />
                        </div>

                        <div className={styles["sep"]}>
                          <div>
                            <label>Issuance Country:</label>
                            <input
                              type="text"
                              value={passenger.issuanceCountry}
                              onChange={(e) => handleChange(passenger.id, 'issuanceCountry', e.target.value)}
                            />
                          </div>

                          <div>
                            <label>Validity Country:</label>
                            <input
                              type="text"
                              value={passenger.validityCountry}
                              onChange={(e) => handleChange(passenger.id, 'validityCountry', e.target.value)}
                            />
                          </div>
                        </div>

                        <div>
                          <label>Nationality:</label>
                          <input
                            type="text"
                            value={passenger.nationality}
                            onChange={(e) => handleChange(passenger.id, 'nationality', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
            <button className={styles["btn-inner-blue"]} onClick={handleBookNow}>Book Now</button>
          </div>
        </div>






        <div className={styles.container}>
          <h2 className={styles.title}>Flight Offer Details</h2>

          <div className={styles.itineraries}>
            {/* <h3 className={styles.sectionTitle}><FaPlaneDeparture /> Itinerary</h3> */}
            {itineraries?.map((itinerary, index) => (
              <div key={index} className={styles.itinerary}>
                <h4 className={styles.sectionTitle}>Itinerary {index + 1}</h4>
                {itinerary.segments.map((segment, segIndex) => {
                  const fareDetail = fareDetailsMap[segment.id]; // Get fare details for the segment
                  return (
                    <div key={segIndex} className={styles.segment}>
                      <p><FaPlaneDeparture /> <strong>Departure:</strong> {segment.departure.iataCode} Terminal {segment.departure.terminal} at {formatTime(segment.departure.at)}</p>
                      <p><FaPlaneArrival /> <strong>Arrival:</strong> {segment.arrival.iataCode} Terminal {segment.arrival.terminal || 'N/A'} at {formatTime(segment.arrival.at)}</p>
                      <p><FaPlaneDeparture /> <strong>Carrier:</strong> {segment.carrierCode} {segment.number}</p>
                      <p><FaCalendarDay /> <strong>Duration:</strong> {segment.duration}</p>
                      <p><FaCalendarDay /> <strong>Number of Stops:</strong> {segment.numberOfStops}</p>
                      <p><GiMoneyStack /> <strong>CO2 Emissions:</strong> {segment.co2Emissions?.[0]?.weight} {segment.co2Emissions?.[0]?.weightUnit} ({segment.co2Emissions?.[0]?.cabin})</p>

                      {/* Display fare details */}
                      {fareDetail && (
                        <div className={styles.fareDetails}>
                          <h5 className={styles.fareTitle}>Fare Details:</h5>
                          <ul className={styles.list}>
                            <li className={styles.listItem}>Cabin: {fareDetail.cabin}</li>
                            <li className={styles.listItem}>Checked Bags: {fareDetail.includedCheckedBags.weight} {fareDetail.includedCheckedBags.weightUnit}</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          <div className={styles.price}>
            <h3 className={styles.sectionTitle}><GiMoneyStack /> Price Details</h3>
            <p><strong>Total Price:</strong> {price?.currency} {price?.total}</p>
            <p><strong>Base Price:</strong> {price?.currency} {price?.base}</p>
            <p><strong>Fees:</strong></p>
            <ul className={styles.list}>
              {price?.fees?.map((fee, index) => (
                <li key={index} className={styles.listItem}>{fee.type}: {price.currency} {fee.amount}</li>
              ))}
            </ul>
            <p><strong>Grand Total:</strong> {price?.currency} {price?.grandTotal}</p>
          </div>

          <div className={styles.travelerPricing}>
            <h3 className={styles.sectionTitle}><FaMoneyBill /> Traveler Pricing Details</h3>
            {travelerPricings?.map((traveler, index) => (
              <div key={index} className={styles.traveler}>
                <h4 className={styles.sectionTitle}>Traveler {index + 1}</h4>
                <p><strong>Traveler Type:</strong> {traveler.travelerType}</p>
                <p><strong>Fare Option:</strong> {traveler.fareOption}</p>
                <p><strong>Total Price:</strong> {price?.currency} {traveler.price.total}</p>
                <p><strong>Base Price:</strong> {price?.currency} {traveler.price.base}</p>
                <p><strong>Taxes:</strong></p>
                <ul className={styles.list}>
                  {traveler.price.taxes?.map((tax, taxIndex) => (
                    <li key={taxIndex} className={styles.listItem}>{tax.code}: {price.currency} {tax.amount}</li>
                  ))}
                </ul>
                <p><strong>Refundable Taxes:</strong> {price?.currency} {traveler.price.refundableTaxes}</p>
                <p><strong>Fare Details:</strong></p>
                <ul className={styles.list}>
                  {traveler.fareDetailsBySegment.map((segment, segIndex) => (
                    <li key={segIndex} className={styles.listItem}>Segment {segment.segmentId}: {segment.cabin} ({segment.includedCheckedBags.weight} {segment.includedCheckedBags.weightUnit})</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={styles.bookingRequirements}>
            <h3 className={styles.sectionTitle}><FaRegCalendarAlt /> Booking Requirements</h3>
            <p>Email Address Required: {bookingRequirements?.emailAddressRequired ? 'Yes' : 'No'}</p>
            <p>Mobile Phone Number Required: {bookingRequirements?.mobilePhoneNumberRequired ? 'Yes' : 'No'}</p>
          </div>

          {/* Adding the Documents Section */}
          <div className={styles.documents}>
            <h3 className={styles.sectionTitle}>Documents Required</h3>
            <ul>
              {bookingRequirements?.documents?.map((document, index) => (
                <li key={index}>
                  <p><strong>{document.type}:</strong> {document.description}</p>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>

    </>
  );
};

export default FlightOffer;
