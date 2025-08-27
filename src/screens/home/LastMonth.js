import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import styles from './common.styles';
import AttendanceHistoryController from '../attendencehistory/AttendanceHistoryController';
import HomeController from './HomeController';

const LastMonth = () => {
  const {attendance, loading, getAllAttendanceRecord} =
    AttendanceHistoryController();

  const {taskLoading, myTasks, getAllMyTaskts} = HomeController();

  console.log('------------attendance', attendance);
  console.log('------------myTasks', myTasks);

  useEffect(() => {
    getAllAttendanceRecord();
    getAllMyTaskts();
  }, []);
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Attendance</Text>
        <Text style={styles.cardValue}>{attendance?.length || '00'} </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Event</Text>
        <Text style={styles.cardValue}>{myTasks.length || '00'} </Text>
      </View>
    </View>
  );
};

export default LastMonth;
