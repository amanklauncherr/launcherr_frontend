import React, { useEffect, useState } from 'react'
import styles from './flightsuccess.module.css'
import FlightPaymentSuccess from './FlightPaymentSuccess'
import { useRouter } from 'next/router'
import axios from 'axios'
import toast from 'react-hot-toast'
import Loader from '@/components/Loader'
import CopyIcon from '@/components/Icons/CopyIcon'
import Cookies from 'js-cookie'


const FlightSuccess = () => {
    const router = useRouter()
    const [encryptedToken, setEncryptedToken] = useState('')
    const [encryptedKey, setEncryptedKey] = useState('')
    const [ticketingType, setTicketingType] = useState('1') // default to Book_Ticket
    const [loading, setLoading] = useState(true) // Loading state
    const [called, setCalled] = useState(false) // State to track if API has been called
    const { BookingRef } = router.query // extract BookingRef from the URL
    const [bookingSuccessRef, setBookingSuccessRef] = useState('')

    console.log("BookingRef", BookingRef)

    // Function to fetch encrypted credentials
    useEffect(() => {
        const getEncryptedCredentials = async () => {
            try {
                const response = await axios.get('https://api.launcherr.co/api/AES/Encryption')
                setEncryptedToken(response.data.encrypted_token)
                setEncryptedKey(response.data.encrypted_key)
            } catch (error) {
                console.error('Error encrypting credentials:', error)
                toast.error('Error fetching encrypted credentials.')
            }
        }

        if (BookingRef) {
            getEncryptedCredentials()
        }
    }, [BookingRef])

    useEffect(() => {
        const callTicketingAPI = async () => {
            if (!BookingRef || !encryptedToken || !encryptedKey || called) {
                return
            }

            const UserRef = "USERMMR"
            const authToken = Cookies.get('auth_token');
            if (authToken) {
            try {
                setLoading(true)
                const payload = {
                    UserRef,
                    BookingRef,
                    TicketingType: ticketingType, // This can be changed based on user selection or logic
                    headersToken: encryptedToken,
                    headersKey: encryptedKey,
                }

                const response = await axios.post('https://api.launcherr.co/api/Ticketing', payload , {
                    headers: { 
                        Authorization: `Bearer ${authToken}` 
                      }
                })

                console.log("responseticketing", response?.data?.data?.payloads?.data?.bookingRef)
                setBookingSuccessRef(response?.data?.data?.payloads?.data?.bookingRef)
                if (response.data.success) {
                    toast.success('Ticketing successful!')
                    // Handle successful ticketing response (e.g., show ticket details)
                } else {
                    toast.error('Ticketing failed.')
                }

                // Mark API as called to prevent further calls
                setCalled(true)

            } catch (error) {
                console.error('Error with ticketing:', error)
                toast.error('Error while processing the ticketing.')
            } finally {
                setLoading(false) // End loading
            }
        }
        }

        // Call ticketing API only if all necessary values are present
        if (BookingRef && encryptedToken && encryptedKey && !called) {
            callTicketingAPI()
        }
    }, [BookingRef, encryptedToken, encryptedKey, called]) // Trigger effect when all dependencies are available

    const handleViewTicket = () => {
       router.push(`/flightTicket?bookingRef=${bookingSuccessRef}`)
    }

    const handleCopyToClipboard = () => {
        if (bookingSuccessRef) {
            navigator.clipboard.writeText(bookingSuccessRef)
                .then(() => {
                    toast.success('Booking reference copied to clipboard!')
                })
                .catch((err) => {
                    console.error('Failed to copy text: ', err)
                    toast.error('Failed to copy. Please try again.')
                })
        }
    }

    return (
        <>
            <div className={styles["flightsucces-main-container"]}>
                {loading ? (
                    <>
                        <Loader />
                    </>
                ) : (
                    <>
                        <FlightPaymentSuccess
                            heading="Congratulations"
                            paragraph="Your flight reservation has succeeded!"
                            btn_name="View Ticket"
                            onclick={handleViewTicket}
                        >

                            <div style={{cursor:"pointer"}} onClick={handleCopyToClipboard} className={styles["copyref"]}>
                                <p>{bookingSuccessRef}</p>
                                <span style={{ cursor: 'pointer' }}>
                                    <CopyIcon/>
                                </span>
                            </div>

                        </FlightPaymentSuccess>
                    </>
                )}
            </div>
        </>
    )
}

export default FlightSuccess
