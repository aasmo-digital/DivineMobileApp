import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  PermissionsAndroid,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {Colors} from '../../theme/colors';
import imageindex from '../../assets/images/imageindex';
import {ButtonCompt} from '../../components';
import styles from './common.styles';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {AppConstant} from '../../utils/AppConstant';
import {
  formatDate,
  formatDateTime,
  showErrorToast,
} from '../../utils/HelperFuntions';
import CompletedEvents from '../../components/CompletedEvents';
import AttendanceHistoryController from '../attendencehistory/AttendanceHistoryController';
import HomeController from './HomeController';

const TodayResult = () => {
  const navigation = useNavigation();
  const token = useSelector(state => state?.user?.token); // Correct reducer key

  const {getAllAttendanceRecord, attendance, loading} =
    AttendanceHistoryController();

  const {taskLoading, myTasks, getAllMyTaskts} = HomeController();

  useFocusEffect(
    useCallback(() => {
      getAllAttendanceRecord();
      getAllMyTaskts();
      return () => {
        console.log('Screen unfocused');
      };
    }, []),
  );

  // Get today's date in YYYY-MM-DD
  const today = new Date().toISOString().split('T')[0];

  // Filter today's item
  const todayItem = attendance.filter(item => item.date === today);

  const TodayData = todayItem[0];

  // console.log('-------TodayData-------', TodayData);

  return (
    <ScrollView style={{flexGrow: 1}} showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        {/* Attendance & Event Section */}
        <View style={styles.row}>
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Attendance</Text>
            <Text style={styles.cardValue}>{attendance?.length || '00'}</Text>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>Total Event</Text>
            <Text style={styles.cardValue}>{myTasks.length || '00'}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <Text style={styles.heading}>Mark Attendance</Text>

        {/* Profile Section */}
        <View style={styles.row}>
          {/*  Check In View ---------------------------------- */}
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => {
              if (TodayData?.checkIn?.time) {
                showErrorToast('CheckIn Failed', 'You Have Already Checked In');
                // Alert.alert('You Have Already Checked In');
              } else {
                navigation.navigate('Attendance');
              }
            }}
            style={styles.profileContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Image
                  source={
                    TodayData?.checkIn?.photoUrl
                      ? {
                          uri:
                            AppConstant.BASEURL + TodayData?.checkIn?.photoUrl,
                        }
                      : imageindex.camera
                  }
                  style={styles.profileImg}
                  resizeMode="center"
                />
              </View>
            </View>

            {TodayData?.checkIn?.time && (
              <Image
                source={imageindex.success}
                style={{
                  height: 25,
                  width: 25,
                  position: 'absolute',
                  bottom: 100,
                  right: 25,
                }}
              />
            )}

            <Text
              style={[
                styles.profileText,
                {color: TodayData?.checkIn?.time ? Colors.GREEN : Colors.BLACK},
              ]}>
              {TodayData?.checkIn?.time ? 'Checked in' : 'Check in'}
            </Text>

            {TodayData?.checkIn?.time && (
              <Text style={[styles.profileText, {textAlign: 'center'}]}>
                Time : {formatDateTime(TodayData?.checkIn?.time)}
              </Text>
            )}
          </TouchableOpacity>

          {/* Check Out View ---------------------------------- */}
          <TouchableOpacity
            activeOpacity={0.8}
            // onPress={() => navigation.navigate('CheckOut')}

            onPress={() => {
              if (TodayData?.checkOut?.time) {
                showErrorToast(
                  'CheckOut Failed',
                  'You Have Already Checked Out',
                );

                Alert.alert('You Have Already Checked Out');
              } else {
                navigation.navigate('CheckOut');
              }
            }}
            style={styles.profileContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Image
                  source={
                    TodayData?.checkOut?.photoUrl
                      ? {
                          uri:
                            AppConstant.BASEURL + TodayData?.checkIn?.photoUrl,
                        }
                      : imageindex.camera
                  }
                  style={styles.profileImg}
                  resizeMode="center"
                />
              </View>
            </View>
            {TodayData?.checkOut?.time && (
              <Image
                source={imageindex.success}
                style={{
                  height: 25,
                  width: 25,
                  position: 'absolute',
                  bottom: 100,
                  right: 25,
                }}
              />
            )}
            <Text
              style={[
                styles.profileText,
                {
                  color: TodayData?.checkOut?.time ? Colors.RED : Colors.BLACK,
                },
              ]}>
              {TodayData?.checkIn?.time ? 'Checked Out' : 'Check Out'}
            </Text>

            {/* <Text style={styles.profileText}>Time : 09:15:00</Text> */}

            {TodayData?.checkOut?.time && (
              <Text style={[styles.profileText, {textAlign: 'center'}]}>
                Time : {formatDateTime(TodayData?.checkOut?.time)}
              </Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        <ButtonCompt
          title={'Create Event'}
          onPress={() => navigation.navigate('SubmitTask')}
        />

        <CompletedEvents taskLoading={taskLoading} myTasks={myTasks} />
      </View>
    </ScrollView>
  );
};

export default TodayResult;
