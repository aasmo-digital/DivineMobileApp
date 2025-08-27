import {StyleSheet, Text, View} from 'react-native';
import styles from './common.styles';
import AttendanceHistoryController from '../attendencehistory/AttendanceHistoryController';
import {useFocusEffect} from '@react-navigation/native';
import {useCallback, useState} from 'react';
import HomeController from './HomeController';

const Yesterday = () => {
  const {getAllAttendanceRecord, attendance, loading} =
    AttendanceHistoryController();

  const {taskLoading, myTasks, getAllMyTaskts} = HomeController();

  useFocusEffect(
    useCallback(() => {
      getAllAttendanceRecord();
      getAllMyTaskts();
      return () => {
        console.log('Yesterday unfocused');
      };
    }, []),
  );

  // console.log('--=---Yesterday---attendance---', attendance);
  // console.log('--=---Yesterday---task---', myTasks);

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const yesterdayStr = yesterday.toISOString().split('T')[0]; // "2025-08-27"

  // Step 2: Filter records
  const yesterdayAttendance = attendance.filter(
    item => item.date === yesterdayStr,
  );

  // console.log('Yesterday Attendance:', yesterdayAttendance.length);

  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Attendance</Text>
        <Text style={styles.cardValue}>
          {yesterdayAttendance.length || '00'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Event</Text>
        <Text style={styles.cardValue}>01</Text>
      </View>
    </View>
  );
};

export default Yesterday;
