// import React, {useState, useRef, useEffect} from 'react';
// import {
//   View,
//   Text,
//   StyleSheet,
//   Alert,
//   Image,
//   TouchableOpacity,
//   Platform,
//   PermissionsAndroid,
// } from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import Geolocation from 'react-native-geolocation-service';
// import {useSelector} from 'react-redux';
// import ApiRequest from '../../network/ApiRequest';
// import {ApiRoutes} from '../../utils/ApiRoutes';
// import LocalStorage from '../../utils/LocalStorage';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {showErrorToast} from '../../utils/HelperFuntions';
// import {ButtonCompt, HeaderCompt} from '../../components';
// import {Colors} from '../../theme/colors';

// //  import Icon from 'react-native-vector-icons/FontAwesome';

// const AttendanceScreen = () => {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const cameraRef = useRef(null);
//   const token = useSelector(state => state?.user?.token); // Correct reducer key

//   console.log('------token from redux-----', token);
//   const [location, setLocation] = useState(null);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const options = {quality: 0.5, base64: true, fixOrientation: true};
//       const data = await cameraRef.current.takePictureAsync(options);
//       setPhoto(data.uri);
//     }
//   };

//   // const requestLocationPermission = async () => {
//   //   // (Android के लिए अनुमतियाँ Manifest में हैं)
//   //   return new Promise((resolve, reject) => {
//   //     Geolocation.getCurrentPosition(
//   //       position => resolve(position),
//   //       error => reject(error),
//   //       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//   //     );
//   //   });
//   // };

//   const handleSubmit = async () => {
//     if (!photo) {
//       Alert.alert('Error', 'Please take a selfie first.');
//       return;
//     }
//     setLoading(true);
//     try {
//       const position = await requestLocationPermission();

//       const formData = new FormData();
//       formData.append('latitude', location?.lat);
//       formData.append('longitude', location?.lng);
//       formData.append('photo', {
//         uri: photo,
//         name: `photo_${Date.now()}.jpg`,
//         type: 'image/jpeg',
//       });

//       console.log('------formData-----', formData);

//       // const response = await attendanceApi.markAttendance(formData, token);
//       // Alert.alert('Success', response.message);

//       const response = await ApiRequest({
//         BASEURL: ApiRoutes.employeeCheckIn,
//         method: 'POST',
//         req: formData,
//         isForm: true,
//         token: token,
//       });

//       console.log('====>>>==', response);

//       if (response?.status == 200 || response?.status == 201) {
//         Alert.alert('--if---', '');
//       } else {
//         showErrorToast('Check In Failed', response?.data?.message);

//         // Alert.alert('--else---', '');
//       }
//       setPhoto(null);
//     } catch (error) {
//       let errorMessage = 'Failed to mark attendance. Please try again.';
//       if (error.code === 'E_LOCATION_UNAVAILABLE') {
//         errorMessage = 'Location is not available. Please check your GPS.';
//       }
//       Alert.alert('Error', errorMessage);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Ask permission for location (Android + iOS)
//   const requestLocationPermission = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message:
//               'This app needs access to your location to show your current position.',
//             buttonNeutral: 'Ask Me Later',
//             buttonNegative: 'Cancel',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       } else {
//         return true; // iOS handled by pod config
//       }
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };

//   // Get current location
//   const getCurrentLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       console.log('Location permission denied');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       position => {
//         setLocation({
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         });
//       },
//       error => {
//         console.log('Location error:', error.message);
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   return (
//     <View style={styles.container}>
//       <HeaderCompt title={'Check In'} />
//       {photo ? (
//         <View style={styles.previewContainer}>
//           <Image source={{uri: photo}} style={styles.previewImage} />
//           {/* <TouchableOpacity
//             style={styles.actionButton}
//             onPress={() => setPhoto(null)}>
//             <Text style={styles.buttonText}>Retake Photo</Text>
//           </TouchableOpacity> */}

//           <ButtonCompt
//             isLoading={loading}
//             title={'Retake Photo'}
//             onPress={() => setPhoto(null)}
//             isOutline={true}
//           />

//           {/* <TouchableOpacity
//             style={[styles.actionButton, styles.submitButton]}
//             onPress={handleSubmit}
//             disabled={loading}>
//             <Text style={styles.buttonText}>
//               {loading ? 'Submitting...' : 'Submit Attendance'}
//             </Text>
//           </TouchableOpacity> */}

//           <ButtonCompt
//             isLoading={loading}
//             title={'Submit Attendance'}
//             onPress={handleSubmit}
//           />
//         </View>
//       ) : (
//         <RNCamera
//           ref={cameraRef}
//           style={styles.camera}
//           type={RNCamera.Constants.Type.front}
//           captureAudio={false}>
//           <View style={styles.captureContainer}>
//             <TouchableOpacity
//               onPress={takePicture}
//               style={styles.captureButton}>
//               {/* <Icon name="camera" size={30} color="#fff" /> */}
//             </TouchableOpacity>
//           </View>
//         </RNCamera>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1, backgroundColor: Colors.WHITE},
//   camera: {flex: 1},
//   captureContainer: {
//     flex: 1,
//     justifyContent: 'flex-end',
//     alignItems: 'center',
//     paddingBottom: 30,
//   },
//   captureButton: {
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 50,
//     height: 70,
//     width: 70,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   previewContainer: {
//     flex: 1,
//     justifyContent: 'center',
//     // alignItems: 'center',
//     gap: 20,
//     paddingHorizontal: 16,
//   },
//   previewImage: {
//     width: '90%',
//     height: '60%',
//     borderRadius: 10,
//     alignSelf: 'center',
//   },
//   actionButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 15,
//     paddingHorizontal: 30,
//     borderRadius: 10,
//   },
//   submitButton: {
//     backgroundColor: '#34C759',
//   },
//   buttonText: {
//     color: 'white',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
// });

// export default AttendanceScreen;
import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import axios from 'axios';
import {useSelector} from 'react-redux';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {showErrorToast} from '../../utils/HelperFuntions';
import {ButtonCompt, HeaderCompt} from '../../components';
import {Colors} from '../../theme/colors';

const AttendanceScreen = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching location...');
  const [locLoading, setLocLoading] = useState(false);

  const cameraRef = useRef(null);
  const token = useSelector(state => state?.user?.token);

  // ✅ Fixed Office Lat-Long
  const officeLat = 22.7546;
  const officeLng = 75.8947;

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

    if (distance > 500) {
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
        Alert.alert('✅ Success', 'Attendance marked successfully!');
        setPhoto(null);
      } else {
        showErrorToast('Check In Failed', response?.data?.message);
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

  return (
    <View style={styles.container}>
      <HeaderCompt title={'Check In'} />

      {/* 📍 Location Info */}
      <View style={styles.locationBox}>
        {locLoading ? (
          <ActivityIndicator color={Colors.PRIMARY} size="small" />
        ) : (
          <>
            <Text style={styles.addressText} numberOfLines={2}>
              {address}
            </Text>
            {location && (
              <Text style={styles.latlngText}>
                Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
              </Text>
            )}
          </>
        )}
      </View>

      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{uri: photo}} style={styles.previewImage} />

          <ButtonCompt
            title={'Retake Photo'}
            onPress={() => setPhoto(null)}
            isOutline={true}
          />

          <ButtonCompt
            isLoading={loading}
            title={'Check In'}
            onPress={handleCheckin}
          />
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            />
          </View>
        </RNCamera>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE},
  locationBox: {
    padding: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    margin: 10,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  latlngText: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
  },
  camera: {flex: 1},
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  captureButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    height: 70,
    width: 70,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  previewImage: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default AttendanceScreen;
