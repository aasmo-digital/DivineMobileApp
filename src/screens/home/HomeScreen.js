// src/screens/HomeScreen/HomeScreen.js
import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from 'react-native'; // Import ActivityIndicator
import {Colors} from '../../theme/colors';
import HomeHeader from './HomeHeader'; // Your HomeHeader component
import Fonts from '../../theme/Fonts';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import TodayResult from './TodayResult';
import Yesterday from './Yesterday';
import LastMonth from './LastMonth';
import Last3Month from './Last3Month';
import {useFocusEffect} from '@react-navigation/native';
import {PageContainer} from '../../components'; // Assuming PageContainer is a common component
import HomeController from './HomeController';

const HomeScreen = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  // Use your HomeController hook
  const {
    address,
    isLocationLoading,
    locationError,
    refreshLocation, // Get the refresh function
    showLogoutPopup,
    setShowLogoutPopup,
    onLogout,
  } = HomeController();

  // Call refreshLocation when HomeScreen comes into focus
  useFocusEffect(
    useCallback(() => {
      refreshLocation(); // This will trigger the location fetch
      return () => {
        // Optional cleanup
      };
    }, [refreshLocation]), // Depend on refreshLocation to ensure it's up-to-date
  );

  const filterOptions = [
    {id: 0, label: 'Today'},
    {id: 1, label: 'Yesterday'},
    {id: 2, label: 'Last Month'},
    // {id: 3, label: 'Last 3 month'},
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 0:
        return <TodayResult />;
      case 1:
        return <Yesterday />;
      case 2:
        return <LastMonth />;
      // case 3:
      //   return <Last3Month />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      {/* Pass location-related data and logout props to HomeHeader */}
      <HomeHeader
        address={address}
        isLocationLoading={isLocationLoading}
        locationError={locationError}
        showLogoutPopup={showLogoutPopup}
        setShowLogoutPopup={setShowLogoutPopup}
        onLogout={onLogout}
      />

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: 5,
        }}>
        <View style={styles.filterview}>
          {filterOptions.map(option => (
            <Pressable
              key={option.id}
              onPress={() => setSelectedTab(option.id)}
              style={[
                styles.filterButton,
                {
                  backgroundColor:
                    selectedTab === option.id ? Colors.APPCOLOR : null,
                },
              ]}>
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      selectedTab === option.id ? Colors.WHITE : Colors.BLACK,
                  },
                ]}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
        <Pressable
          style={{
            padding: 4,
            borderRadius: 50,
            backgroundColor: Colors.APPCOLOR,
          }}>
          <MaterialIcons name="sort" size={26} color={Colors.WHITE} />
        </Pressable>
      </View>

      {renderContent()}
    </PageContainer>
  );
};

// ... (Your StyleSheet remains the same)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 30,
    width: '80%',
  },
  filterview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 5,
    flex: 1,
  },
  filterButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 50,
    borderWidth: 0.5,
    flex: 1,
    marginHorizontal: 5,
  },
  filterText: {
    fontFamily: Fonts.PoppinsMedium,
    fontSize: 10,
    textAlign: 'center',
  },
});

export default HomeScreen;
