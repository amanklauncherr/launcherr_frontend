// import { generateToken } from '@/store/features/tokenSlice';
// import React, { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// const Demo = () => {
//   const dispatch = useDispatch();
  
//   // Accessing the state from the Redux store
//   const { encryptedToken, encryptedKey, loading, error } = useSelector((state) => state.token);

//   // Fetch the token and key when the component mounts
//   useEffect(() => {
//     dispatch(generateToken());
//   }, [dispatch]);

//   return (
//     <div>
//       <h1>Encrypted Token and Key</h1>
//       {loading && <p>Loading...</p>}
//       {error && <p style={{ color: 'red' }}>Error: {error}</p>}
      
//       {!loading && !error && (
//         <div>
//           <p><strong>Encrypted Token:</strong> {encryptedToken}</p>
//           <p><strong>Encrypted Key:</strong> {encryptedKey}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Demo;


// components/AesEncryption.js
import React from 'react';
import CryptoJS from 'crypto-js';

const AesEncryption = () => {
    const key = CryptoJS.enc.Hex.parse("54c3ac7333fd510b2512a475d4d2bef2"); // 32 bytes key for AES
    const iv = CryptoJS.enc.Hex.parse("22f632f1d31cc2de");   // 16 bytes IV for AES
    const plaintext = "015b50f2f744ecceb34a98019e2ea7f8";

    // Encryption function
    const encryptAES = (text) => {
        const encrypted = CryptoJS.AES.encrypt(text, key, {
            iv: iv,
            mode: CryptoJS.mode.CBC,
            padding: CryptoJS.pad.Pkcs7,
        });
        return encrypted.toString();
    };

    // Encrypt the plaintext
    const encrypted = encryptAES(plaintext);

    return (
        <div>
            <h1>AES Encryption Example</h1>
            <p>Encrypted: {encrypted}</p>
        </div>
    );
};

export default AesEncryption;
