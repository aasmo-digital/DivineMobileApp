import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  SafeAreaView,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';
import {AppConstant} from '../../utils/AppConstant';
import {HeaderCompt} from '../../components';
import {showErrorToast} from '../../utils/HelperFuntions';
import axios from 'axios';

const TaskDetails = ({route}) => {
  const {item} = route?.params;
  const [address, setAddress] = useState(null);

  const getAddressFromCoords = async (latitude, longitude) => {
    if (!latitude || !longitude) {
      showErrorToast('Location not provided');
      return;
    }

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse`,
        {
          params: {
            format: 'json',
            lat: latitude,
            lon: longitude,
          },
          headers: {
            Accept: 'application/json',
            'User-Agent': 'ReactNativeApp', // ✅ Required by Nominatim
          },
          timeout: 10000, // ⏳ add timeout (10s)
        },
      );

      const data = response.data;
      setAddress(data.display_name || 'Unknown location');
    } catch (error) {
      if (error.message === 'Network Error') {
        console.log('🌐 No internet connection');
        setAddress('No internet connection. Please check your network.');
        showErrorToast('No internet connection');
      } else if (error.code === 'ECONNABORTED') {
        console.log('⏳ Request timeout');
        setAddress('Request timed out. Try again.');
        showErrorToast('Request timed out');
      } else {
        console.error('Axios error fetching address:', error.message);
        setAddress('Unable to fetch location');
        showErrorToast('Unable to fetch location');
      }
    }
  };

  useEffect(() => {
    getAddressFromCoords(
      item?.submissionProof?.location?.latitude,
      item?.submissionProof?.location?.longitude,
    );
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: Colors.WHITE}}>
      <HeaderCompt title={item?.title} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Task Title */}
        <Text style={styles.title}>{item?.title}</Text>

        {/* Image Proof */}
        {item?.submissionProof?.photoUrl ? (
          <Image
            source={{
              uri: AppConstant.BASEURL + item?.submissionProof?.photoUrl,
            }}
            style={styles.image}
          />
        ) : null}

        {/* Description */}
        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{item?.description}</Text>

        {/* Status */}
        <Text style={styles.label}>Status:</Text>
        <Text style={[styles.value, styles.status]}>{item?.status}</Text>

        {/* Location */}
        <Text style={styles.label}>Location:</Text>
        <Text style={styles.value}>
          Lat: {item?.submissionProof?.location?.latitude} | Lng:{' '}
          {item?.submissionProof?.location?.longitude}
        </Text>
        <Text style={styles.value}>{address}</Text>

        {/* Dates */}
        <Text style={styles.label}>Event At:</Text>
        <Text style={styles.value}>
          {new Date(item?.createdAt).toLocaleString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TaskDetails;

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: Colors.WHITE,
  },
  title: {
    fontSize: 20,
    fontFamily: Fonts.PoppinsSemiBold,
    color: Colors.BLACK,
    marginBottom: 12,
    textAlign: 'center',
  },
  image: {
    height: 200,
    borderRadius: 10,
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.GRAY,
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.BLACK,
  },
  status: {
    color: Colors.APPCOLOR,
    fontFamily: Fonts.PoppinsSemiBold,
  },
});
