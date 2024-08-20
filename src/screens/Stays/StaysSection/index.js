import React, { useState, useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import axios from 'axios';
import ImageLayout from '@/components/ImageLayout';
import MainLayout from '@/components/MainLayout';
import styles from './stays.module.css';
import { useRouter } from 'next/router';
import Loader from '@/components/Loader';
import toast from 'react-hot-toast';
import EmptyHotel from '@/components/EmptyHotel';

const StaysSection = () => {
  const [cityCode, setCityCode] = useState('');
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [Map, setMap] = useState(null);
  const [Marker, setMarker] = useState(null);
  const [Popup, setPopup] = useState(null);
  const [TileLayer, setTileLayer] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const mapRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const loadLeaflet = async () => {
      const { MapContainer, TileLayer, Marker, Popup } = await import('react-leaflet');
      const L = await import('leaflet');
      await import('leaflet/dist/leaflet.css');

      delete L.Icon.Default.prototype._getIconUrl;

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
      });

      setMap(() => MapContainer);
      setMarker(() => Marker);
      setPopup(() => Popup);
      setTileLayer(() => TileLayer);
    };

    loadLeaflet();
  }, []);

  const fetchToken = async () => {
    try {
      const response = await axios.post(
        'https://api.amadeus.com/v1/security/oauth2/token',
        new URLSearchParams({
          grant_type: 'client_credentials',
          client_id: 'zYssACjlbXv0PDbxMpVN58WRU7kqgGtA',
          client_secret: 'IqAniSZnJlFVMtL0',
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          }
        }
      );
      return response.data.access_token;
    } catch (error) {
      console.error('Error fetching token:', error);
      setError('Error fetching token');
    }
  };

  const fetchHotels = async (token, cityCode) => {
    try {
      const response = await axios.get(
        'https://api.amadeus.com/v1/reference-data/locations/hotels/by-city',
        {
          params: {
            cityCode,
            radius: 20,
            radiusUnit: 'KM',
            hotelSource: 'ALL',
          },
          headers: {
            Authorization: `Bearer ${token}`,
          }
        }
      );
      const hotelData = response.data.data.map(hotel => ({
        id: hotel.hotelId,
        name: hotel.name,
        city: hotel.iataCode,
        latitude: hotel.geoCode.latitude,
        longitude: hotel.geoCode.longitude,
      }));
      setHotels(hotelData);
      setLoading(false);

      if (hotelData.length > 0 && mapRef.current) {
        const bounds = hotelData.map(hotel => [hotel.latitude, hotel.longitude]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    } catch (error) {
      console.error('Error fetching hotels:', error?.response?.data?.errors[0]?.detail);
      setError('Error fetching hotels');
      setLoading(false);
      toast.error(error?.response?.data?.errors[0]?.detail)
    }
  };

  const fetchAirportData = async (query) => {
    try {
      const response = await axios.get(`https://api.launcherr.co/api/showIata/airport?query=${query}`);
      setSearchResults(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching airport data:', error?.response?.data?.message);
      setSearchResults([]);
      // toast.error(error?.response?.data?.message)
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError('');
    setSearchResults([]); // Close the search results dropdown
    const token = await fetchToken();
    if (token) {
      await fetchHotels(token, cityCode);
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cityCode.length > 2) {
      fetchAirportData(cityCode);
    } else {
      setSearchResults([]);
    }
  }, [cityCode]);

  const handleHotelClick = (hotelId) => {
    router.push(`/hotelbook?hotelId=${hotelId}`);
  };

  const handleSelectChange = (e) => {
    setCityCode(e.target.value);
  };

  return (
    <>
      <MainLayout>
        <ImageLayout Img_url='/images/product.png' heading='Stays'>
          <div className={styles["search-bar-main"]}>
            <input
              type="text"
              placeholder="Enter city name"
              value={cityCode}
              onChange={(e) => setCityCode(e.target.value)}
              className={styles["search-input"]}
            />
                  {searchResults.length > 0 && (
              <div className={styles["list-cities"]}>
                <select onChange={handleSelectChange} value={cityCode} className={styles["select-dropdown"]}>
                  <option value="">Click here to select a city</option>
                  {searchResults.map(result => (
                    <option key={result.id} value={result.iata_code}>
                      {result.city}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <button onClick={handleSearch} className={styles["search-button"]}>
              Search
            </button>
      
          </div>
        </ImageLayout>
        <div className={styles["hotels-list-main-container"]}>
          {loading ? (
            <Loader />
          ) : error ? (
            <>
            <EmptyHotel/>
            </>
          ) : (
            <div className={styles["hotels-map-container"]}>
              {Map && Marker && Popup && TileLayer && (
                <div className={styles["map-container"]}>
                  <Map center={[20, 77]} zoom={5} style={{ height: '500px', width: '100%' }} ref={mapRef}>
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {hotels.map(hotel => (
                      <Marker key={hotel.id} position={[hotel.latitude, hotel.longitude]}>
                        <Popup>
                          <strong>{hotel.name}</strong><br />
                          {hotel.city}
                        </Popup>
                      </Marker>
                    ))}
                  </Map>
                </div>
              )}
              <div className={styles["hotels-list"]}>
                {hotels.map(hotel => (
                  <div
                    key={hotel.id}
                    className={styles["hotel-card"]}
                    onClick={() => handleHotelClick(hotel.id)}
                  >
                    <img src="https://images.pexels.com/photos/1669799/pexels-photo-1669799.jpeg?cs=srgb&dl=pexels-fotoaibe-1669799.jpg&fm=jpg" alt="" />
                    <div>
                      <h2>{hotel.name}</h2>
                      <p>{hotel.city}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </MainLayout>
    </>
  );
};

export default StaysSection;
