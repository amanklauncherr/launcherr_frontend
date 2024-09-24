import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import crypto from 'crypto';

const hashKey = (key) => {
  return crypto.createHash('sha256').update(key).digest('hex');
};

const generateRandomIV = () => {
  return crypto.randomBytes(16).toString('hex');
};

const encryptAES = (text, encryptionKey, iv) => {
  const cipher = crypto.createCipheriv(
    'aes-256-cbc',
    Buffer.from(encryptionKey, 'hex'), 
    Buffer.from(iv, 'hex')
  );
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

export const generateToken = createAsyncThunk(
  'token/generateToken',
  async (_, { rejectWithValue }) => {
    const mobileNumber = process.env.NEXT_PUBLIC_MOBILE_NUMBER;
    const password = process.env.NEXT_PUBLIC_PASSWORD;

    const formData = new FormData();
    formData.append('mobileNumber', mobileNumber);
    formData.append('password', password);

    try {
      const response = await fetch('https://api.dotmik.in/api/user/v1/generate/token', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to generate token');
      }

      const data = await response.json();
      const originalKey = 'DOTMIK160614';
      const encryptionKey = hashKey(originalKey); 

      const iv = generateRandomIV();

      const encryptedToken = encryptAES(data.payloads.data.token, encryptionKey, iv);
      const encryptedKey = encryptAES(data.payloads.data.key, encryptionKey, iv);

      return { encryptedToken, encryptedKey, iv };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const tokenSlice = createSlice({
  name: 'token',
  initialState: {
    encryptedToken: null,
    encryptedKey: null,
    iv: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(generateToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(generateToken.fulfilled, (state, action) => {
        state.loading = false;
        state.encryptedToken = action.payload.encryptedToken;
        state.encryptedKey = action.payload.encryptedKey;
        state.iv = action.payload.iv;
      })
      .addCase(generateToken.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default tokenSlice.reducer;
