import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Loader from '@/components/Loader';
import EmailVerify from '../../screens/auth/EmailVerify';
import toast from 'react-hot-toast';

const EmailVerifyPage = () => {
  const router = useRouter();
  const { uniqueCode } = router.query; // Extract uniqueCode from the URL
  const [isLoading, setIsLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState(null);

  useEffect(() => {
    const verifyEmail = async () => {
      if (!uniqueCode) return; // Wait until uniqueCode is available

      try {
        const response = await axios.get(`https://api.launcherr.co/api/verified/${uniqueCode}`);
        setVerificationStatus(response.data); // Update with API response data
        console.log('response', response.data.success)
        if (response.data.success === 1){
            toast.success('Email verify successfully')
            router.push('/auth/login')
        }
        else {
            toast.error('Verification failed. Please try again')
            router.push('/auth/signup')
        }

      } catch (error) {
        console.error('Verification failed:', error);
        toast.error('Verification failed. Please try again')
        router.push('/auth/signup')
      } finally {
        setIsLoading(false); // Stop loading after the API call completes
      }
    };

    verifyEmail();
  }, [uniqueCode]);

  if (isLoading) {
    return <Loader />; // Display loader while waiting for API response
  }

  return (
    <>
      <EmailVerify  />
    </>
  );
};

export default EmailVerifyPage;
