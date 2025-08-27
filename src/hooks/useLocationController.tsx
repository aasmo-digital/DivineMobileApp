import {useState, useEffect, useCallback} from 'react';
import {PermissionsAndroid, Platform, Linking} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {useFocusEffect} from '@react-navigation/native';
import axios from 'axios';

export const useLocationController = () => {
  const [location, setLocation] = useState<{lat: number; lng: number} | null>(
    null,
  );
  const [address, setAddress] = useState<string>('Fetching location...');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 🔹 Ask permission for location (Android + iOS)
  const requestLocationPermission = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show your current position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else if (Platform.OS === 'ios') {
        const authorization = await Geolocation.requestAuthorization(
          'whenInUse',
        );
        return authorization === 'granted';
      }
      return false;
    } catch (err) {
      console.warn('Location permission error:', err);
      setError('Failed to request location permission.');
      return false;
    }
  };

  // 🔹 Get current location and reverse geocode
  const fetchLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setAddress('Fetching location...');

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      console.log('Location permission denied');
      setError('Location permission denied.');
      setAddress('Location access denied. Please enable it in settings.');
      setIsLoading(false);
      // Optional: auto-open settings
      // Linking.openSettings();
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const {latitude, longitude} = position.coords;
        setLocation({lat: latitude, lng: longitude});

        try {
          // OpenStreetMap reverse geocoding with axios
          const res = await axios.get(
            'https://nominatim.openstreetmap.org/reverse',
            {
              params: {
                format: 'json',
                lat: latitude,
                lon: longitude,
              },
              headers: {
                'User-Agent': 'MyReactNativeApp/1.0 (myemail@example.com)', // required by OSM
              },
              timeout: 10000, // prevent hanging requests
            },
          );

          setAddress(res.data?.display_name || 'Unknown location');
        } catch (geoError: any) {
          console.log('Geocoding error:', geoError.message);
          setError('Unable to get address from coordinates.');
          setAddress('Address unavailable');
        } finally {
          setIsLoading(false);
        }
      },
      geoPositionError => {
        console.log('Geolocation error:', geoPositionError.message);
        setError(`Geolocation error: ${geoPositionError.message}`);
        setAddress('Unable to fetch location');
        setIsLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  }, []);

  // 🔹 Fetch location on mount
  useEffect(() => {
    fetchLocation();
  }, [fetchLocation]);

  // 🔹 Fetch again when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchLocation();
    }, [fetchLocation]),
  );

  // 🔹 Manual refresh for parent components
  const refreshLocation = useCallback(() => {
    fetchLocation();
  }, [fetchLocation]);

  return {
    location,
    address,
    isLoading,
    error,
    refreshLocation,
  };
};
