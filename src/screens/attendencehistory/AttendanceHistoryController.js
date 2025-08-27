import {View, Text} from 'react-native';
import React, {useState} from 'react';
import {useSelector} from 'react-redux';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';

const AttendanceHistoryController = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state?.user?.token); // Correct reducer key

  const getAllAttendanceRecord = async () => {
    try {
      setLoading(true);
      const response = await ApiRequest({
        BASEURL: ApiRoutes.getMyAttendence,
        method: 'GET',
        token: token,
      });

      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        // console.log(
        //   '------getAllAttendanceRecord----response.data',
        //   JSON.stringify(response?.data),
        // );
        setAttendance(response?.data);
      } else {
        console.error('Server error:', response?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Fetch Error:', error);
    }
  };
  return {
    attendance,
    loading,
    getAllAttendanceRecord,
  };
};

export default AttendanceHistoryController;
