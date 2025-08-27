import {View, Text, Platform, PermissionsAndroid, Alert} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import axios from 'axios';
import Geolocation from 'react-native-geolocation-service';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {showErrorToast, showSuccessToast} from '../../utils/HelperFuntions';
import {useNavigation} from '@react-navigation/native';
import {RNCamera} from 'react-native-camera';

const useAttdance = () => {
  const navigation = useNavigation();
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching location...');
  const [locLoading, setLocLoading] = useState(false);

  const employeeData = useSelector(
    state => state.employee.employee?.workLocation,
  );

  const cameraRef = useRef(null);
  const token = useSelector(state => state?.user?.token);

  // ✅ Fixed Office Lat-Long
  const officeLat = employeeData?.latitude || 22.7546;
  const officeLng = employeeData?.longitude || 75.8947;
  const radius = employeeData?.radius || 500;

  // console.log('----1111---------', employeeData);
  // console.log("-----------",officeLat,officeLng,radius)

  // 📌 Request Location Permission
  const requestLocationPermission = async () => {
    if (Platform.OS === 'android') {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
    return true;
  };

  // 📌 Reverse Geocoding
  const getAddressFromCoords = async (latitude, longitude) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: 'json',
            lat: latitude,
            lon: longitude,
          },
          headers: {
            Accept: 'application/json',
            'User-Agent': 'ReactNativeApp',
          },
        },
      );
      // console.log('-------------------------', response);

      const data = response.data;

      setAddress(data.display_name || 'Unknown location');
    } catch (error) {
      console.error('Axios error fetching address:', error.message);
      setAddress('Unable to fetch location');
    }
  };

  // 📌 Get Current Location
  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission denied', 'Location permission is required');
      return null;
    }

    return new Promise(resolve => {
      setLocLoading(true);
      Geolocation.getCurrentPosition(
        async pos => {
          const coords = {
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
          };
          setLocation(coords);
          await getAddressFromCoords(coords.lat, coords.lng);
          setLocLoading(false);
          resolve(coords);
        },
        error => {
          console.log('Location error:', error.message);
          setAddress('Unable to fetch location');
          setLocLoading(false);
          resolve(null);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    });
  };

  // 📌 Distance Calculation (Haversine Formula)
  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // 📌 Take Picture
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true, fixOrientation: true};
      const data = await cameraRef.current.takePictureAsync(options);
      setPhoto(data.uri);

      // Capture location at same time
      await getCurrentLocation();
    }
  };

  // 📌 Handle Check-In
  const handleCheckin = useCallback(async () => {
    if (!photo) {
      Alert.alert('Error', 'Please take a selfie first.');
      return;
    }

    const currentLoc = location || (await getCurrentLocation());
    if (!currentLoc) {
      Alert.alert('Error', 'Unable to fetch your location.');
      return;
    }

    const distance = getDistanceInMeters(
      officeLat,
      officeLng,
      currentLoc.lat,
      currentLoc.lng,
    );

    if (distance > radius) {
      showErrorToast(
        '❌ Error',
        `You are outside your working Location. Distance: ${Math.round(
          distance,
        )} meters`,
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('latitude', String(currentLoc.lat));
      formData.append('longitude', String(currentLoc.lng));
      formData.append('photo', {
        uri: photo,
        name: `photo_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      const response = await ApiRequest({
        BASEURL: ApiRoutes.employeeCheckIn,
        method: 'POST',
        req: formData,
        isForm: true,
        token,
      });

      if (response?.status === 200 || response?.status === 201) {
        showSuccessToast('✅ Success', 'Attendance marked successfully!');
        navigation.goBack();
        setPhoto(null);
      } else {
        showErrorToast(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        'Error',
        'Failed to mark attendance. Please try again later.',
      );
    } finally {
      setLoading(false);
    }
  }, [photo, token, location]);
  return {
    photo,
    setPhoto,
    loading,
    location,
    setLoading,
    address,
    setAddress,
    locLoading,
    setLocLoading,
    takePicture,
    handleCheckin,
    navigation,
    cameraRef,
  };
};

export default useAttdance;
