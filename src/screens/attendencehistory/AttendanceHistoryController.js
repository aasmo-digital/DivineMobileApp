import {useState} from 'react';
import {useSelector} from 'react-redux';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';

const AttendanceHistoryController = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
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
        setAttendance(response?.data);
      } else {
        setLoading(false);
        setAttendance([]);
        console.error('Server error:', response?.message);
      }
    } catch (error) {
      setLoading(false);
      setAttendance([]);
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };
  return {
    attendance,
    loading,
    getAllAttendanceRecord,
  };
};

export default AttendanceHistoryController;
