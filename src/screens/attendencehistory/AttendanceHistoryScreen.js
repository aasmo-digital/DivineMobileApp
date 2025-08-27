import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Image,
  Platform,
} from 'react-native';
import {HeaderCompt, PageContainer} from '../../components';
import {Colors} from '../../theme/colors';

import AttendanceCard from '../../components/AttendanceCard';
import AttendanceHistoryController from './AttendanceHistoryController';
import {useFocusEffect} from '@react-navigation/native';

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
        <ActivityIndicator size="large" style={{flex: 1}} />
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
const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.BLACK,
  },
  photo: {
    width: 100,
    height: 80,
    borderRadius: 25,
    marginRight: 15,
  },
});

export default AttendanceHistoryScreen;
