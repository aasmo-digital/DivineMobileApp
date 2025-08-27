import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {RNCamera} from 'react-native-camera';

import {ButtonCompt, HeaderCompt} from '../../components';
import {Colors} from '../../theme/colors';
import styles from './styles';
import useAttdance from './useAttdance';

const AttendanceScreen = ({navigation}) => {
  const {
    photo,
    setPhoto,
    loading,
    location,
    address,
    locLoading,
    takePicture,
    handleCheckin,
    cameraRef,
  } = useAttdance();
  return (
    <View style={styles.container}>
      <HeaderCompt title={'Check In'} />

      {/* 📍 Location Info */}
      <View style={styles.locationBox}>
        {locLoading ? (
          <ActivityIndicator color={Colors.PRIMARY} size="small" />
        ) : (
          <>
            <Text style={styles.addressText} numberOfLines={2}>
              {address}
            </Text>
            {location && (
              <Text style={styles.latlngText}>
                Lat: {location.lat.toFixed(6)} | Lng: {location.lng.toFixed(6)}
              </Text>
            )}
          </>
        )}
      </View>

      {photo ? (
        <View style={styles.previewContainer}>
          <Image source={{uri: photo}} style={styles.previewImage} />

          <ButtonCompt
            title={'Retake Photo'}
            onPress={() => setPhoto(null)}
            isOutline={true}
          />

          <ButtonCompt
            isLoading={loading}
            title={'Check In'}
            onPress={handleCheckin}
          />
        </View>
      ) : (
        <RNCamera
          ref={cameraRef}
          style={styles.camera}
          type={RNCamera.Constants.Type.front}
          captureAudio={false}>
          <View style={styles.captureContainer}>
            <TouchableOpacity
              onPress={takePicture}
              style={styles.captureButton}
            />
          </View>
        </RNCamera>
      )}
    </View>
  );
};

export default AttendanceScreen;
