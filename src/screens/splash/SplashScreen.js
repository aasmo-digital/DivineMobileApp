import React, {useEffect} from 'react';
import {
  Image,
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {useSelector} from 'react-redux';
import imageindex from '../../assets/images/imageindex';
import {Colors} from '../../theme/colors';

const SplashScreen = ({navigation}) => {
  const token = useSelector(state => state?.user?.token); // Correct reducer key

  useEffect(() => {
    const checkLoginAndNavigate = async () => {
      try {
        // Optional splash delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        if (token) {
          // console.log('Token from Redux found:', token);
          navigation.replace('Tabs');
        } else {
          // Fallback check from AsyncStorage
          // const storedToken = await AsyncStorage.getItem('token');
          const storedToken = token;
          if (storedToken) {
            console.log('Token from AsyncStorage found:', storedToken);
            navigation.replace('Tabs');
          } else {
            console.log('No token found. Navigating to Login.');
            navigation.replace('AuthNavigator');
          }
        }
      } catch (error) {
        console.error('Error during splash auth check:', error);
        // navigation.replace('Login');
      }
    };

    checkLoginAndNavigate();
  }, [token]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={Colors.WHITE} barStyle={'dark-content'} />
      <Image source={imageindex.logo} style={styles.logo} />
      <ActivityIndicator size="large" style={{marginTop: 20}} />
    </SafeAreaView>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.WHITE,
  },
  logo: {
    height: 100,
    width: 200,
    resizeMode: 'contain',
  },
});
