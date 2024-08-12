import axios from 'axios';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react';
import styles from './dashboard.module.css'
import toast from 'react-hot-toast';
import Dashboard from '.';
import GigsCard from '@/components/GigsCard';
import Loader from '@/components/Loader';

const GigsDasboard = () => {
    const [jobsData, setJobsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const bearerToken = getCookie('auth_token');

    const fetchJobsData = async (payload) => {
        try {
            setLoading(true); // Set loading state to true
            setError(null); // Reset error state

            const headers = {
                Authorization: `Bearer ${bearerToken}`,
            };

            const response = await axios.get('https://api.launcherr.co/api/searchJob', {
                headers: headers
            });

            const jobs = response.data?.job;

            if (!jobs || jobs.length === 0) {
                setError('No data found');
            } else {
                setJobsData(jobs);
            }
        } catch (error) {
            console.log('Error fetching jobs data:', error);
            setError('Error fetching data'); // Set error state
            toast.error(error?.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false); // Set loading state to false
        }
    };

    useEffect(() => {

        fetchJobsData();
    }, []);

    return (
        <>
              {loading && <>
            <Loader/>
            </>}
            <Dashboard>
            <h1 className={styles["youb"]}>Your applied gigs:</h1>
                <div className='grid'>
                
                    {error && <p>{error}</p>}
                    {!loading && !error && Array.isArray(jobsData) && jobsData.length > 0 ? (
                        jobsData
                            .filter(job => job.isApplied) // Only include jobs where "isApplied" is true
                            .map((gigsDataItem, index) => (
                                <GigsCard key={index} {...gigsDataItem} />
                            ))
                    ) : (
                        !loading && !error && <p>No jobs found</p>
                    )}
                </div>
            </Dashboard>
        </>
  

    );
}

export default GigsDasboard;
