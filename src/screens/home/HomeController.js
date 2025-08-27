// import React, {useState} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {userLogout} from '../../redux/reducer/LoginReducer';
// import {useLocationController} from '../../hooks/useLocationController';
// // 1. Import your custom hook

// const HomeController = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   // 2. Call the location hook to get all location-related data and functions
//   const {
//     location,
//     address,
//     isLoading: isLocationLoading, // Rename to avoid conflicts if needed
//     error: locationError,
//     refreshLocation,
//   } = useLocationController();

//   // State that belongs specifically to the Home screen's UI
//   const [showPopup, setShowPopup] = useState(false);

//   // Logout function remains as part of the controller's responsibility
//   const onLogout = async () => {
//     setShowPopup(false); // It's good practice to close the popup here
//     await AsyncStorage.removeItem('userToken');
//     dispatch(userLogout());
//     navigation.reset({
//       index: 0,
//       routes: [{name: 'AuthNavigator'}],
//     });
//   };

//   // 3. Return everything the UI component will need
//   return {
//     // Location data from the hook
//     location,
//     address,
//     isLocationLoading,
//     locationError,
//     refreshLocation,

//     // UI state and functions from this controller
//     showPopup,
//     setShowPopup,
//     onLogout,
//   };
// };

// export default HomeController;

// // src/controllers/HomeController.js
// import React, {useState} from 'react';
// import {useNavigation} from '@react-navigation/native';
// import {useDispatch} from 'react-redux';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import {userLogout} from '../../redux/reducer/LoginReducer';
// import {useLocationController} from '../../hooks/useLocationController'; // Assuming hook is in this path

// const HomeController = () => {
//   const navigation = useNavigation();
//   const dispatch = useDispatch();

//   // Call the location hook to get all location-related data
//   const {
//     address,
//     isLoading: isLocationLoading,
//     error: locationError,
//     refreshLocation,
//   } = useLocationController();

//   // Manage UI-specific state
//   const [showPopup, setShowPopup] = useState(false);

//   // Handle logout logic
//   const onLogout = async () => {
//     setShowPopup(false);
//     await AsyncStorage.removeItem('userToken');
//     dispatch(userLogout());
//     navigation.reset({
//       index: 0,
//       routes: [{name: 'AuthNavigator'}],
//     });
//   };

//   // Return everything the UI component needs
//   return {
//     address,
//     isLocationLoading,
//     locationError,
//     refreshLocation,
//     showPopup,
//     setShowPopup,
//     onLogout,
//   };
// };

// export default HomeController;

// src/controllers/HomeController.js
import React, {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLogout} from '../../redux/reducer/LoginReducer';
import {useLocationController} from '../../hooks/useLocationController';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {showErrorToast} from '../../utils/HelperFuntions';

const HomeController = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const token = useSelector(state => state?.user?.token); // Correct reducer key

  const [taskLoading, setTaskLoading] = useState(false);
  const [myTasks, setMyTasks] = useState([]);

  // Call the location hook to get all location-related data
  const {
    address,
    isLoading: isLocationLoading, // Renamed for clarity when consumed
    error: locationError, // Renamed for clarity
    refreshLocation,
  } = useLocationController();

  // Manage UI-specific state
  const [showLogoutPopup, setShowLogoutPopup] = useState(false); // Renamed for clarity

  // Handle logout logic
  const onLogout = async () => {
    setShowLogoutPopup(false); // Close popup before logging out
    await AsyncStorage.removeItem('userToken');
    dispatch(userLogout());
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthNavigator'}],
    });
  };

  const getAllMyTaskts = async () => {
    try {
      setTaskLoading(true);
      const response = await ApiRequest({
        BASEURL: ApiRoutes.getEmployeeTasks,
        method: 'GET',
        token: token,
      });

      if (response?.status === 200 || response?.status === 201) {
        setTaskLoading(false);
        // console.log('-------getAllMyTaskts', JSON.stringify(response?.data));
        setMyTasks(response?.data);
      } else {
        setTaskLoading(false);
        showErrorToast(response?.data?.message);
        console.error('Server error:', response?.message);
      }
    } catch (error) {
      setTaskLoading(false);
      console.error('Fetch Error:', error);
    }
  };

  // Return everything the UI component needs
  return {
    // Location data and functions
    address,
    isLocationLoading,
    locationError,
    refreshLocation, // Pass this up for HomeScreen to use

    // Logout popup state and function
    showLogoutPopup,
    setShowLogoutPopup,
    onLogout,
    getAllMyTaskts,
    taskLoading,
    myTasks,
  };
};

export default HomeController;
