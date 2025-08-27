import React, {useCallback, useState} from 'react';
import {Text, FlatList, ActivityIndicator} from 'react-native';
import {HeaderCompt, PageContainer} from '../../components';
import {Colors} from '../../theme/colors';
import AttendanceCard from '../../components/AttendanceCard';
import AttendanceHistoryController from './AttendanceHistoryController';
import {useFocusEffect} from '@react-navigation/native';
import styles from './style';

const AttendanceHistoryScreen = () => {
  const {attendance, loading, getAllAttendanceRecord} =
    AttendanceHistoryController();

  useFocusEffect(
    useCallback(() => {
      getAllAttendanceRecord();
      return () => {
        console.log('Screen unfocused');
      };
    }, []),
  );

  return (
    <PageContainer>
      <HeaderCompt title={'Attendence History'} />
      {loading ? (
        <ActivityIndicator
          size="large"
          style={{flex: 1}}
          color={Colors.APPCOLOR}
        />
      ) : (
        <FlatList
          data={attendance}
          keyExtractor={item => item._id}
          renderItem={({item}) => <AttendanceCard item={item} />}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No attendance records found.</Text>
          }
        />
      )}
    </PageContainer>
  );
};

export default AttendanceHistoryScreen;
