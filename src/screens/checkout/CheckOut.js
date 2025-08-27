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

// import {showErrorToast} from '../../utils/HelperFuntions';
// import {HeaderCompt, PageContainer} from '../../components';
// import MaterialIcons from '@react-native-vector-icons/material-icons';

// //  import Icon from 'react-native-vector-icons/FontAwesome';

// const CheckOut = () => {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [wasteCollected, setWasteCollected] = useState(0);
//   const cameraRef = useRef(null);
//   const token = useSelector(state => state?.user?.token);

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

//       formData.append('wasteCollected', wasteCollected);
//       formData.append('photo', {
//         uri: photo,
//         name: `photo_${Date.now()}.jpg`,
//         type: 'image/jpeg',
//       });

//       console.log('------formData-----', formData);

//       // const response = await attendanceApi.markAttendance(formData, token);
//       // Alert.alert('Success', response.message);

//       const response = await ApiRequest({
//         BASEURL: ApiRoutes.employeeCheckOut,
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
//     <PageContainer>
//       <View style={styles.container}>
//         <HeaderCompt title={'CheckOut From Work'} />

//         {photo ? (
//           <View style={styles.previewContainer}>
//             <Image source={{uri: photo}} style={styles.previewImage} />
//             <TouchableOpacity
//               style={styles.actionButton}
//               onPress={() => setPhoto(null)}>
//               <Text style={styles.buttonText}>Retake Photo</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               style={[styles.actionButton, styles.submitButton]}
//               onPress={handleSubmit}
//               disabled={loading}>
//               <Text style={styles.buttonText}>
//                 {loading ? 'Submitting...' : 'Submit Attendance'}
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <View style={{height: 400, width: 100}}>
//             <RNCamera
//               ref={cameraRef}
//               style={styles.camera}
//               type={RNCamera.Constants.Type.front}
//               captureAudio={false}>
//               <View style={styles.captureContainer}>
//                 <TouchableOpacity
//                   onPress={takePicture}
//                   style={styles.captureButton}>
//                   {/* <Icon name="camera" size={30} color="#fff" /> */}
//                 </TouchableOpacity>
//               </View>
//             </RNCamera>
//           </View>
//         )}
//       </View>
//     </PageContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
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
//     alignItems: 'center',
//     backgroundColor: '#f5f5f5',
//     gap: 20,
//   },
//   previewImage: {
//     width: '90%',
//     height: '60%',
//     borderRadius: 10,
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

// export default CheckOut;

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
//   ScrollView,
//   TextInput,
//   ActivityIndicator,
// } from 'react-native';
// import {RNCamera} from 'react-native-camera';
// import Geolocation from 'react-native-geolocation-service';
// import {useSelector} from 'react-redux';
// import ApiRequest from '../../network/ApiRequest';
// import {ApiRoutes} from '../../utils/ApiRoutes';
// import axios from 'axios'; // import axios

// import {showErrorToast, showSuccessToast} from '../../utils/HelperFuntions';
// import {
//   ButtonCompt,
//   HeaderCompt,
//   InputCompt,
//   PageContainer,
// } from '../../components';
// import MaterialIcons from '@react-native-vector-icons/material-icons';
// import {Colors} from '../../theme/colors';
// import Fonts from '../../theme/Fonts';
// import {useNavigation} from '@react-navigation/native';

// const CheckOut = () => {
//   const [photo, setPhoto] = useState(null);
//   const [loading, setLoading] = useState(false);
//   const [wasteCollected, setWasteCollected] = useState('');
//   const [location, setLocation] = useState(null);
//   const [address, setAddress] = useState('Fetching address...');

//   const [cameraVisible, setCameraVisible] = useState(false);
//   const cameraRef = useRef(null);
//   const token = useSelector(state => state?.user?.token);
//   const navigation = useNavigation();

//   // Ask permission for location
//   const requestLocationPermission = async () => {
//     try {
//       if (Platform.OS === 'android') {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Permission',
//             message:
//               'This app needs access to your location to mark your attendance.',
//             buttonPositive: 'OK',
//           },
//         );
//         return granted === PermissionsAndroid.RESULTS.GRANTED;
//       }
//       // For iOS, permission request is handled in Info.plist
//       return true;
//     } catch (err) {
//       console.warn(err);
//       return false;
//     }
//   };

//   // Get current location
//   // const getCurrentLocation = async () => {
//   //   const hasPermission = await requestLocationPermission();
//   //   if (!hasPermission) {
//   //     Alert.alert('Permission Denied', 'Location permission is required.');
//   //     return;
//   //   }

//   //   Geolocation.getCurrentPosition(
//   //     position => {
//   //       setLocation({
//   //         lat: position.coords.latitude,
//   //         lng: position.coords.longitude,
//   //       });
//   //     },
//   //     error => {
//   //       console.log('Location error:', error.message);
//   //       Alert.alert(
//   //         'Location Error',
//   //         'Could not fetch location. Please ensure your GPS is enabled.',
//   //       );
//   //     },
//   //     {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//   //   );
//   // };

//   const getCurrentLocation = async () => {
//     const hasPermission = await requestLocationPermission();
//     if (!hasPermission) {
//       Alert.alert('Permission Denied', 'Location permission is required.');
//       return;
//     }

//     Geolocation.getCurrentPosition(
//       async position => {
//         const coords = {
//           lat: position.coords.latitude,
//           lng: position.coords.longitude,
//         };
//         setLocation(coords);

//         try {
//           // Fetch address from OpenStreetMap (Reverse Geocoding)
//           // const response = await axios.get(
//           //   `https://nominatim.openstreetmap.org/reverse`,
//           //   {
//           //     params: {
//           //       format: 'json',
//           //       lat: coords.lat,
//           //       lon: coords.lng,
//           //     },
//           //   },
//           // );

//           const response = await axios.get(
//             'https://nominatim.openstreetmap.org/reverse',
//             {
//               params: {
//                 format: 'json',
//                 lat: coords.lat,
//                 lon: coords.lng,
//               },
//               headers: {
//                 'User-Agent': 'MyReactNativeApp/1.0 (your-email@example.com)',
//                 'Accept-Language': 'en', // optional
//               },
//             },
//           );

//           if (response.data && response.data.display_name) {
//             setAddress(response.data.display_name);
//           } else {
//             setAddress('Address not found');
//           }
//         } catch (error) {
//           console.error('Geocoding error:', error.message);
//           setAddress('Unable to fetch address');
//         }
//       },
//       error => {
//         console.log('Location error:', error.message);
//         Alert.alert(
//           'Location Error',
//           'Could not fetch location. Please ensure your GPS is enabled.',
//         );
//       },
//       {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
//     );
//   };

//   useEffect(() => {
//     getCurrentLocation();
//   }, []);

//   const takePicture = async () => {
//     if (cameraRef.current) {
//       const options = {quality: 0.5, base64: true, fixOrientation: true};
//       try {
//         const data = await cameraRef.current.takePictureAsync(options);
//         setPhoto(data.uri);
//         setCameraVisible(false); // Return to form view after taking picture
//       } catch (error) {
//         console.error('Failed to take picture', error);
//         Alert.alert('Error', 'Failed to capture photo. Please try again.');
//       }
//     }
//   };

//   const handleSubmit = async () => {
//     // Validation checks
//     if (!photo) {
//       Alert.alert('Missing Information', 'Please take a selfie.');
//       return;
//     }
//     if (!location) {
//       Alert.alert(
//         'Missing Information',
//         'Location not available. Please wait or check GPS.',
//       );
//       return;
//     }
//     if (!wasteCollected.trim() || isNaN(wasteCollected)) {
//       Alert.alert(
//         'Invalid Input',
//         'Please enter a valid amount for waste collected.',
//       );
//       return;
//     }

//     setLoading(true);
//     try {
//       const formData = new FormData();
//       formData.append('latitude', location.lat);
//       formData.append('longitude', location.lng);
//       formData.append('wasteCollected', wasteCollected);
//       formData.append('photo', {
//         uri: photo,
//         name: `checkout_${Date.now()}.jpg`,
//         type: 'image/jpeg',
//       });

//       const response = await ApiRequest({
//         BASEURL: ApiRoutes.employeeCheckOut,
//         method: 'POST',
//         req: formData,
//         isForm: true,
//         token: token,
//       });

//       if (response?.status === 200 || response?.status === 201) {
//         showSuccessToast('Checkout successful!');
//         navigation.goBack('');
//         // Reset state after successful submission
//         setPhoto(null);
//         setWasteCollected('');
//       } else {
//         showErrorToast(
//           'Checkout Failed',
//           response?.data?.message || 'An unknown error occurred.',
//         );
//       }
//     } catch (error) {
//       let errorMessage = 'Failed to submit checkout. Please try again.';
//       if (error.code === 'E_LOCATION_UNAVAILABLE') {
//         errorMessage = 'Location is not available. Please check your GPS.';
//       }
//       showErrorToast('Error', errorMessage);
//       console.error(error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (cameraVisible) {
//     return (
//       <View style={styles.container}>
//         <RNCamera
//           ref={cameraRef}
//           style={styles.camera}
//           type={RNCamera.Constants.Type.front}
//           captureAudio={false}
//           androidCameraPermissionOptions={{
//             title: 'Permission to use camera',
//             message: 'We need your permission to use your camera',
//             buttonPositive: 'Ok',
//             buttonNegative: 'Cancel',
//           }}>
//           <View style={styles.cameraOverlay}>
//             <TouchableOpacity
//               style={styles.backButton}
//               onPress={() => setCameraVisible(false)}>
//               <MaterialIcons name="arrow-back" size={25} color="#fff" />
//             </TouchableOpacity>
//             <TouchableOpacity
//               onPress={takePicture}
//               style={styles.captureButton}>
//               <MaterialIcons name="camera" size={35} color="#fff" />
//             </TouchableOpacity>
//             <View style={{width: 45}} />
//             {/* Spacer for alignment */}
//           </View>
//         </RNCamera>
//       </View>
//     );
//   }

//   return (
//     <PageContainer>
//       <HeaderCompt title={'CheckOut From Work'} />
//       <ScrollView contentContainerStyle={styles.formContainer}>
//         {/* Location Section */}
//         {/* <View style={styles.card}>
//           <Text style={styles.cardTitle}>Your Location</Text>
//           {location ? (
//             <View>
//               <Text style={styles.locationText}>
//                 Latitude: {location.lat.toFixed(5)}
//               </Text>
//               <Text style={styles.locationText}>
//                 Longitude: {location.lng.toFixed(5)}
//               </Text>
//             </View>
//           ) : (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#007AFF" />
//               <Text style={styles.locationText}> Fetching location...</Text>
//             </View>
//           )}
//         </View> */}

//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>Your Location</Text>
//           {location ? (
//             <View>
//               <Text style={styles.locationText}>
//                 Latitude: {location.lat.toFixed(5)}
//               </Text>
//               <Text style={styles.locationText}>
//                 Longitude: {location.lng.toFixed(5)}
//               </Text>
//               <Text style={styles.locationText}>📍 {address}</Text>
//             </View>
//           ) : (
//             <View style={styles.loadingContainer}>
//               <ActivityIndicator size="small" color="#007AFF" />
//               <Text style={styles.locationText}> Fetching location...</Text>
//             </View>
//           )}
//         </View>

//         <InputCompt
//           label={'Waste Collected'}
//           placeholder="e.g., 50"
//           keyboardType="numeric"
//           value={wasteCollected}
//           onChangeText={setWasteCollected}
//         />

//         {/* Selfie Section */}
//         <View style={styles.card}>
//           <Text style={styles.cardTitle}>
//             {photo ? 'Your Selfie' : 'Take a Selfie'}
//           </Text>
//           <TouchableOpacity
//             onPress={() => setCameraVisible(true)}
//             style={styles.cameraLauncher}>
//             {photo ? (
//               <Image source={{uri: photo}} style={styles.previewImage} />
//             ) : (
//               <View style={styles.placeholder}>
//                 <MaterialIcons
//                   name="camera-alt"
//                   size={50}
//                   color={Colors.GRAY}
//                 />
//                 <Text style={styles.placeholderText}>Tap to open camera</Text>
//               </View>
//             )}
//           </TouchableOpacity>
//         </View>

//         {/* Submit Button */}
//         {/* <TouchableOpacity
//           style={[
//             styles.submitButton,
//             (!photo || !location || !wasteCollected || loading) &&
//               styles.disabledButton,
//           ]}
//           onPress={handleSubmit}
//           disabled={!photo || !location || !wasteCollected || loading}>
//           {loading ? (
//             <ActivityIndicator color="#fff" />
//           ) : (
//             <Text style={styles.submitButtonText}>Submit Checkout</Text>
//           )}
//         </TouchableOpacity> */}

//         <ButtonCompt
//           title={'Submit Checkout'}
//           onPress={handleSubmit}
//           isLoading={loading}
//         />
//       </ScrollView>
//     </PageContainer>
//   );
// };

// const styles = StyleSheet.create({
//   container: {flex: 1},
//   // Form Styles
//   formContainer: {
//     // padding: 20,
//     gap: 20,
//   },
//   card: {
//     backgroundColor: '#fff',
//     borderRadius: 8,
//     padding: 15,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 1},
//     shadowOpacity: 0.2,
//     shadowRadius: 1.41,
//     elevation: 2,
//   },
//   cardTitle: {
//     fontSize: 16,
//     marginBottom: 10,
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsMedium,
//   },
//   locationText: {
//     fontSize: 16,
//     color: '#555',
//   },
//   loadingContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 8,
//     padding: 12,
//     fontSize: 16,
//   },
//   cameraLauncher: {
//     height: 200,
//     width: '100%',
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   placeholder: {
//     alignItems: 'center',
//   },
//   placeholderText: {
//     marginTop: 10,
//     color: Colors.BLACK,
//     opacity: 0.9,
//     fontFamily: Fonts.PoppinsRegular,
//   },
//   previewImage: {
//     height: '100%',
//     width: '100%',
//   },
//   submitButton: {
//     backgroundColor: Colors.APPCOLOR,
//     paddingVertical: 15,
//     borderRadius: 10,
//     alignItems: 'center',
//     marginTop: 10,
//   },
//   disabledButton: {
//     backgroundColor: '#a5d6a7',
//   },
//   submitButtonText: {
//     color: 'white',
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
//   // Camera Styles
//   camera: {
//     flex: 1,
//   },
//   cameraOverlay: {
//     flex: 1,
//     backgroundColor: 'transparent',
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'flex-end',
//     padding: 30,
//   },
//   backButton: {
//     alignSelf: 'flex-start',
//     marginTop: Platform.OS === 'ios' ? 40 : 20,
//     marginLeft: -10,
//     position: 'absolute',
//     top: 0,
//     left: 20,
//     backgroundColor: 'rgba(0,0,0,0.4)',
//     borderRadius: 25,
//     padding: 10,
//   },
//   captureButton: {
//     borderWidth: 2,
//     borderColor: 'white',
//     borderRadius: 50,
//     height: 70,
//     width: 70,
//     justifyContent: 'center',
//     alignItems: 'center',
//     alignSelf: 'center',
//   },
// });

// export default CheckOut;

import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';

import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {showErrorToast, showSuccessToast} from '../../utils/HelperFuntions';
import {
  ButtonCompt,
  HeaderCompt,
  InputCompt,
  PageContainer,
} from '../../components';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';

const CheckOut = () => {
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wasteCollected, setWasteCollected] = useState('');
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('Fetching address...');
  const [cameraVisible, setCameraVisible] = useState(false);

  // Office Location (fixed point)
  const officeLat = 22.7546;
  const officeLng = 75.8947;
  const allowedRadius = 500; // meters

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
            },
          );

          if (response.data?.display_name) {
            setAddress(response.data.display_name);
          } else {
            setAddress('Address not found');
          }
        } catch (error) {
          console.error('Geocoding error:', error.message);
          setAddress('Unable to fetch address');
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
        showErrorToast(response?.data?.message, 'Checkout Failed');
      }
    } catch (error) {
      console.error(error);
      showErrorToast('Error', 'Failed to submit checkout. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Camera UI
  if (cameraVisible) {
    return (
      <View style={styles.container}>
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}>
          <View style={styles.cameraOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCameraVisible(false)}>
              <MaterialIcons name="arrow-back" size={25} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}>
              <MaterialIcons name="camera" size={35} color="#fff" />
            </TouchableOpacity>
          </View>
        </RNCamera>
      </View>
    );
  }

  // Form UI
  return (
    <PageContainer>
      <HeaderCompt title="CheckOut From Work" />

      <ScrollView contentContainerStyle={styles.formContainer}>
        {/* Location Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📍 Your Location</Text>
          {location ? (
            <>
              <Text style={styles.locationText}>
                Latitude: {location.lat.toFixed(5)}
              </Text>
              <Text style={styles.locationText}>
                Longitude: {location.lng.toFixed(5)}
              </Text>
              <Text style={styles.addressText}>{address}</Text>
            </>
          ) : (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color={Colors.APPCOLOR} />
              <Text style={styles.locationText}> Fetching location...</Text>
            </View>
          )}
        </View>

        {/* Waste Input */}
        <InputCompt
          label="Waste Collected (kg)"
          placeholder="e.g., 50"
          keyboardType="numeric"
          value={wasteCollected}
          onChangeText={setWasteCollected}
        />

        {/* Selfie Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>
            {photo ? '✅ Your Selfie' : '📸 Take a Selfie'}
          </Text>
          <TouchableOpacity
            onPress={() => setCameraVisible(true)}
            style={styles.cameraLauncher}>
            {photo ? (
              <Image source={{uri: photo}} style={styles.previewImage} />
            ) : (
              <View style={styles.placeholder}>
                <MaterialIcons
                  name="camera-alt"
                  size={50}
                  color={Colors.GRAY}
                />
                <Text style={styles.placeholderText}>Tap to open camera</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Submit Button */}
        <ButtonCompt
          title="Submit Checkout"
          onPress={handleSubmit}
          isLoading={loading}
          disabled={!photo || !location || !wasteCollected}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  formContainer: {gap: 20, paddingBottom: 30},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
  locationText: {fontSize: 14, color: '#555'},
  addressText: {marginTop: 5, fontSize: 14, color: Colors.APPCOLOR},
  loadingContainer: {flexDirection: 'row', alignItems: 'center'},
  cameraLauncher: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {alignItems: 'center'},
  placeholderText: {
    marginTop: 8,
    color: Colors.GRAY,
    fontFamily: Fonts.PoppinsRegular,
  },
  previewImage: {height: '100%', width: '100%'},
  camera: {flex: 1},
  cameraOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 40,
    gap: 30,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  captureButton: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CheckOut;
