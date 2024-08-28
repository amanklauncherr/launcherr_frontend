// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const index = () => {
//     const [data, setData] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);

//     const fetchData = async () => {
//         setLoading(true);
//         setError(null);
//         try {
//             const response = await axios.get(
//                 'https://trip4book.com/holiday/holiday-result?title=Leh+Ladakh+Tour+Packages&slug=leh-ladakh-tour-packages&tag=Destinations&id=36'
//             );
//             setData(response.data);  // Update the state with the response data
//         } catch (err) {
//             setError('Error fetching data');
//         }
//         setLoading(false);
//     };

//     useEffect(() => {
//         const interval = setInterval(() => {
//             fetchData();
//         }, 5);  // Fetch the data every 5 seconds

//         // Clean up the interval on component unmount
//         return () => clearInterval(interval);
//     }, []);

//     if (loading) return <p>Loading...</p>;
//     if (error) return <p>{error}</p>;

//     return (
//         <div>
//             <h1>Leh Ladakh Tour Packages</h1>
//             <pre>{JSON.stringify(data, null, 2)}</pre> {/* Display the fetched data */}
//         </div>
//     );
// };

// export default index;
