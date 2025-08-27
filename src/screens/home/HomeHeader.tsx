import React, {useEffect, useState} from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  ActivityIndicator,
} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {Colors} from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {userLogout} from '../../redux/reducer/LoginReducer';
import {useNavigation} from '@react-navigation/native';
import Geolocation from 'react-native-geolocation-service';
import {useDispatch} from 'react-redux';
import Fonts from '../../theme/Fonts';
import LogoutPopup from '../../components/LogoutPopop';

const HomeHeader = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [showPopup, setShowPopup] = useState(false);

  const [address, setAddress] = useState<string>('Fetching location...');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // Ask permission for location (Android + iOS)
  const requestLocationPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message:
              'This app needs access to your location to show your current position.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        return true; // iOS handled by pod config
      }
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  // Fetch Location + Reverse Geocode
  const fetchLocation = async () => {
    setLoading(true);
    setError(false);
    setAddress('Fetching location...');

    const hasPermission = await requestLocationPermission();
    if (!hasPermission) {
      setError(true);
      setAddress('Permission denied');
      setLoading(false);
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        try {
          const {latitude, longitude} = position.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'User-Agent': 'MyReactNativeApp/1.0 (myemail@example.com)',
              },
            },
          );
          const data = await res.json();
          setAddress(data.display_name || 'Unknown location');
        } catch (err) {
          console.log('Geocoding error:', err);
          setError(true);
          setAddress('Address unavailable');
        } finally {
          setLoading(false);
        }
      },
      geoError => {
        console.log('Geolocation error:', geoError.message);
        setError(true);
        setAddress('Unable to fetch location');
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  // Logout
  const onLogout = async () => {
    await AsyncStorage.removeItem('userToken');
    dispatch(userLogout());
    navigation.reset({
      index: 0,
      routes: [{name: 'AuthNavigator'}],
    });
  };

  return (
    <View style={styles.container}>
      {/* Location */}
      <View style={styles.row}>
        <MaterialIcons name="location-on" size={26} color={Colors.APPCOLOR} />

        {loading ? (
          <ActivityIndicator
            size="small"
            color={Colors.APPCOLOR}
            style={{marginLeft: 5}}
          />
        ) : error ? (
          <Pressable onPress={fetchLocation} style={styles.retryBtn}>
            <MaterialIcons name="refresh" size={22} color={Colors.WHITE} />
            <Text style={styles.retryText}>Retry</Text>
          </Pressable>
        ) : (
          <Text style={styles.text}>{address}</Text>
        )}
      </View>

      {/* Logout */}
      <Pressable
        onPress={() => setShowPopup(!showPopup)}
        style={styles.logoutBtn}>
        <MaterialIcons name="logout" size={26} color={Colors.APPCOLOR} />
      </Pressable>

      <LogoutPopup
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        onConfirm={onLogout}
      />
    </View>
  );
};

export default HomeHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.9,
  },
  text: {
    color: Colors.BLACK,
    marginLeft: 5,
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 12,
    flex: 1,
  },
  logoutBtn: {
    padding: 5,
  },
  retryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.APPCOLOR,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 5,
  },
  retryText: {
    color: Colors.WHITE,
    marginLeft: 5,
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
  },
});
