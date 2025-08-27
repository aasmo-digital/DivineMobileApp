import {View, Text, Platform, PermissionsAndroid} from 'react-native';
import React, {useState} from 'react';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {showErrorToast, showSuccessToast} from '../../utils/HelperFuntions';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import Geolocation from 'react-native-geolocation-service';
import {RNCamera} from 'react-native-camera';

const useCheckOut = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wasteCollected, setWasteCollected] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching address...');
  const [cameraVisible, setCameraVisible] = useState(false);

  const employeeData = useSelector(
    state => state.employee.employee?.workLocation,
  );

  // ✅ Fixed Office Lat-Long
  const officeLat = employeeData?.latitude || 22.7546;
  const officeLng = employeeData?.longitude || 75.8947;
  const allowedRadius = employeeData?.radius || 500;

  // 📌 Distance calculation function
  const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
    const R = 6371000; // radius of Earth in meters
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

  const cameraRef = useRef(null);
  const token = useSelector(state => state?.user?.token);
  const navigation = useNavigation();

  // Request Location Permission
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to mark your checkout.',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
      return true; // iOS handled by plist
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Get Current Location + Address
  // const getCurrentLocation = async () => {
  //   const hasPermission = await requestLocationPermission();
  //   if (!hasPermission) {
  //     Alert.alert('Permission Denied', 'Location permission is required.');
  //     return;
  //   }

  //   Geolocation.getCurrentPosition(
  //     async position => {
  //       const coords = {
  //         lat: position.coords.latitude,
  //         lng: position.coords.longitude,
  //       };
  //       setLocation(coords);

  //       try {
  //         const response = await axios.get(
  //           'https://nominatim.openstreetmap.org/reverse',
  //           {
  //             params: {
  //               format: 'json',
  //               lat: coords.lat,
  //               lon: coords.lng,
  //             },
  //             headers: {
  //               'User-Agent': 'MyReactNativeApp/1.0',
  //               Accept: 'application/json',
  //             },
  //           },
  //         );

  //         if (response.data?.display_name) {
  //           setAddress(response.data.display_name);
  //         } else {
  //           setAddress('Address not found');
  //         }
  //       } catch (error) {
  //         console.error('Geocoding error:', error.message);
  //         setAddress('Unable to fetch address');
  //       }
  //     },
  //     error => {
  //       console.log('Location error:', error.message);
  //       Alert.alert(
  //         'Location Error',
  //         'Could not fetch location. Please enable GPS.',
  //       );
  //     },
  //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
  //   );
  // };

  const getCurrentLocation = async () => {
    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      Alert.alert('Permission Denied', 'Location permission is required.');
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(coords);

        try {
          const response = await axios.get(
            'https://nominatim.openstreetmap.org/reverse',
            {
              params: {
                format: 'json',
                lat: coords.lat,
                lon: coords.lng,
              },
              headers: {
                'User-Agent': 'MyReactNativeApp/1.0',
                Accept: 'application/json',
              },
              timeout: 10000, // ⏳ avoid hanging requests
            },
          );

          if (response.data?.display_name) {
            setAddress(response.data.display_name);
          } else {
            setAddress('Address not found');
          }
        } catch (error) {
          if (error.message === 'Network Error') {
            console.log('🌐 No internet connection');
            setAddress('No internet connection. Please check your network.');
          } else if (error.code === 'ECONNABORTED') {
            console.log('⏳ Request timeout');
            setAddress('Request timed out. Try again.');
          } else {
            console.error('Geocoding error:', error.message);
            setAddress('Unable to fetch address');
          }
        }
      },
      error => {
        console.log('Location error:', error.message);
        Alert.alert(
          'Location Error',
          'Could not fetch location. Please enable GPS.',
        );
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  // Capture Photo
  const takePicture = async () => {
    if (cameraRef.current) {
      const options = {quality: 0.5, base64: true, fixOrientation: true};
      try {
        const data = await cameraRef.current.takePictureAsync(options);
        setPhoto(data.uri);
        setCameraVisible(false);
      } catch (error) {
        console.error('Failed to take picture', error);
        Alert.alert('Error', 'Failed to capture photo. Please try again.');
      }
    }
  };

  // Submit Checkout
  // const handleSubmit = async () => {
  //   if (!photo) {
  //     Alert.alert('Missing Info', 'Please take a selfie.');
  //     return;
  //   }
  //   if (!location) {
  //     Alert.alert('Missing Info', 'Location not available. Please wait.');
  //     return;
  //   }
  //   if (!wasteCollected.trim() || isNaN(wasteCollected)) {
  //     Alert.alert('Invalid Input', 'Enter a valid amount for waste collected.');
  //     return;
  //   }

  //   setLoading(true);
  //   try {
  //     const formData = new FormData();
  //     formData.append('latitude', location.lat);
  //     formData.append('longitude', location.lng);
  //     formData.append('wasteCollected', wasteCollected);
  //     formData.append('photo', {
  //       uri: photo,
  //       name: `checkout_${Date.now()}.jpg`,
  //       type: 'image/jpeg',
  //     });

  //     const response = await ApiRequest({
  //       BASEURL: ApiRoutes.employeeCheckOut,
  //       method: 'POST',
  //       req: formData,
  //       isForm: true,
  //       token,
  //     });

  //     if (response?.status === 200 || response?.status === 201) {
  //       showSuccessToast('Checkout successful!');
  //       navigation.goBack();
  //       setPhoto(null);
  //       setWasteCollected('');
  //     } else {
  //       showErrorToast('Checkout Failed', response?.data?.message);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     showErrorToast('Error', 'Failed to submit checkout. Try again.');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  // ✅ Handle Checkout Submit
  const handleSubmit = async () => {
    if (!photo) {
      showErrorToast('Missing Info', 'Please take a selfie.');
      return;
    }
    if (!location) {
      showErrorToast('Missing Info', 'Location not available. Please wait.');
      return;
    }
    if (!wasteCollected.trim() || isNaN(wasteCollected)) {
      showErrorToast(
        'Invalid Input',
        'Enter a valid amount for waste collected.',
      );
      return;
    }

    // 📌 Location validation
    const distance = getDistanceInMeters(
      officeLat,
      officeLng,
      location.lat,
      location.lng,
    );

    if (distance > allowedRadius) {
      showErrorToast(
        // '❌ Error',
        // `You are outside the allowed checkout radius. Distance:
        //  ${Math.round(
        //   distance,
        // )} meters`,
        `You are outside the allowed checkout location.`,
      );
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('latitude', location.lat);
      formData.append('longitude', location.lng);
      formData.append('wasteCollected', wasteCollected);
      formData.append('photo', {
        uri: photo,
        name: `checkout_${Date.now()}.jpg`,
        type: 'image/jpeg',
      });

      const response = await ApiRequest({
        BASEURL: ApiRoutes.employeeCheckOut,
        method: 'POST',
        req: formData,
        isForm: true,
        token,
      });

      if (response?.status === 200 || response?.status === 201) {
        showSuccessToast('Checkout successful!');
        navigation.goBack();
        setPhoto(null);
        setWasteCollected('');
      } else {
        showErrorToast(response?.data?.message);
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Error', 'Failed to submit checkout. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return {
    photo,
    setPhoto,
    loading,
    setLoading,
    wasteCollected,
    setWasteCollected,
    location,
     setLocation,
    address,
    setAddress,
    cameraVisible,
    setCameraVisible,
    cameraRef,
    takePicture,
    handleSubmit,
  };
};

export default useCheckOut;
