import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {showErrorToast} from '../../utils/HelperFuntions';
import {userLogin} from '../../redux/reducer/LoginReducer';
import {setEmployee} from '../../redux/redux_slice/employeeSlice';

const useProfile = () => {
  const token = useSelector(state => state?.user?.token);

  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(false);

  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();

  const getEmployeeInfo = async () => {
    try {
      setLoading(true);
      const response = await ApiRequest({
        BASEURL: ApiRoutes.getEmployeeInfo,
        method: 'GET',
        token: token,
      });
      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        setProfileData(response?.data);
        dispatch(setEmployee(response.data));
        console.log('-------propfileDatra', response.data);
      } else {
        setProfileData(null);
        setLoading(false);
        // showErrorToast('Failed to fetch profile', response?.message);
        console.error('Server error:', response?.message);
      }
    } catch (error) {
      setLoading(false);
      setProfileData(null);
      showErrorToast('An error occurred', 'Please check your connection.');
      console.error('Fetch Error:', error);
    }
  };
  return {
    profileData,
    loading,
    getEmployeeInfo,
    error,
    setError,
  };
};

export default useProfile;
