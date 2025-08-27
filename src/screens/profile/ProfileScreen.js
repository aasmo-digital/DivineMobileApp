import React, {useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import {HeaderCompt, PageContainer} from '../../components';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {formatDate, showErrorToast} from '../../utils/HelperFuntions';
import MaterialIcons from '@react-native-vector-icons/material-icons';

import {AppConstant} from '../../utils/AppConstant';
import styles from './styles.profile';
import {Colors} from '../../theme/colors';

// IMPORTANT: Replace this with your actual API's base URL for images
const BASE_IMAGE_URL = AppConstant.BASEURL;

// Reusable component for displaying a row of information
const InfoRow = ({icon, label, value}) => (
  <View style={styles.infoRow}>
    <MaterialIcons name={icon} size={24} color="#555" style={styles.infoIcon} />
    <View style={styles.infoTextContainer}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value || 'N/A'}</Text>
    </View>
  </View>
);

const ProfileScreen = () => {
  const [profileData, setProfileData] = useState(null);
  const [error, setError] = useState(false);

  console.log('---------profileData------', profileData);
  const [loading, setLoading] = useState(true);
  const token = useSelector(state => state?.user?.token);

  const getEmployeeInfo = async () => {
    try {
      setLoading(true);
      const response = await ApiRequest({
        BASEURL: ApiRoutes.getEmployeeInfo,
        method: 'GET',
        token: token,
      });

      if (response.status === 200 || response.status === 201) {
        setProfileData(response.data);

        // console.log('-------propfileDatra', response.data);
      } else {
        showErrorToast('Failed to fetch profile', response?.message);
        console.error('Server error:', response?.message);
      }
    } catch (error) {
      showErrorToast('An error occurred', 'Please check your connection.');
      console.error('Fetch Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getEmployeeInfo();
    }, []),
  );

  // Helper function to format date string
  //   const formatDate = dateString => {
  //     if (!dateString) return 'N/A';
  //     const options = {year: 'numeric', month: 'long', day: 'numeric'};
  //     return new Date(dateString).toLocaleDateString(undefined, options);
  //   };

  if (loading) {
    return (
      <PageContainer>
        <HeaderCompt title={'Your Profile'} />
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={Colors.APPCOLOR} />
        </View>
      </PageContainer>
    );
  }

  if (!profileData) {
    return (
      <PageContainer>
        <HeaderCompt title={'Your Profile'} />
        <View style={styles.loaderContainer}>
          <Text style={{color: Colors.BLACK}}>
            Could not load profile data.
          </Text>
        </View>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <HeaderCompt title={'Your Profile'} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* --- Profile Header --- */}
        <View style={[styles.card, styles.profileHeader]}>
          {/* <Image
            source={{uri: `${BASE_IMAGE_URL}${profileData.profilePhotoUrl}`}}
            style={styles.profileImage}
          /> */}

          <Image
            source={{
              uri: error
                ? 'https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png'
                : `${BASE_IMAGE_URL}${profileData.profilePhotoUrl}`,
            }}
            style={styles.profileImage}
            onError={e => setError(true)} // ❌ अगर image load fail होगी तो fallback set हो जाएगा
          />

          <Text style={styles.profileName}>{profileData.fullName}</Text>
          <Text style={styles.profileId}>ID: {profileData.uniqueId}</Text>
          <View
            style={[
              styles.statusBadge,
              {backgroundColor: profileData.isActive ? '#34C759' : '#FF3B30'},
            ]}>
            <Text style={styles.statusText}>
              {profileData.isActive ? 'Active' : 'Inactive'}
            </Text>
          </View>
        </View>

        {/* --- Contact Info Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Contact Information</Text>
          <InfoRow icon="email" label="Email" value={profileData.email} />
          <InfoRow
            icon="phone"
            label="Contact No"
            value={profileData.contactNo}
          />
          <InfoRow
            icon="phone-in-talk"
            label="Alternate No"
            value={profileData.alternateContactNo}
          />
        </View>

        {/* --- Work Details Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Work Details</Text>
          <InfoRow icon="work" label="Role" value={profileData.role} />
          <InfoRow
            icon="location-city"
            label="Assigned City"
            value={profileData.assignedCity}
          />
          <InfoRow
            icon="location-on"
            label="Address"
            value={profileData.address}
          />
          <InfoRow
            icon="date-range"
            label="Date Joined"
            value={formatDate(profileData.createdAt)}
          />
        </View>

        {/* --- Salary Details Card --- */}
        {profileData?.dailySalary !== 0 && (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Salary Details</Text>
            {/* <InfoRow
            icon="money"
            label="Salary"
            value={profileData?.dailySalary}
          /> */}
            <Text style={styles.infoValue}>
              Daily Salary : {profileData?.dailySalary} /-
            </Text>
          </View>
        )}

        {/* --- ID Proof Card --- */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>ID Proof</Text>
          <InfoRow
            icon="fingerprint"
            label="ID Type"
            value={profileData.idProof.idType.toUpperCase()}
          />
          <InfoRow
            icon="subtitles"
            label="ID Number"
            value={profileData.idProof.idNumber}
          />
          <View style={styles.idImagesContainer}>
            <View style={styles.idImageWrapper}>
              <Text style={styles.imageLabel}>Front</Text>
              <Image
                source={{
                  uri: `${BASE_IMAGE_URL}${profileData.idProof.frontImageUrl}`,
                }}
                style={styles.idImage}
              />
            </View>
            <View style={styles.idImageWrapper}>
              <Text style={styles.imageLabel}>Back</Text>
              <Image
                source={{
                  uri: `${BASE_IMAGE_URL}${profileData.idProof.backImageUrl}`,
                }}
                style={styles.idImage}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </PageContainer>
  );
};

export default ProfileScreen;
