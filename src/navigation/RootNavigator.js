import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/splash/SplashScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import CheckOut from '../screens/checkout/CheckOut';
import SubmitTaskScreen from '../screens/submit_task/SubmitTaskScreen';
 
const RootNavigator = () => {
  const Stack = createNativeStackNavigator();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{headerShown: false}}
        initialRouteName="SplashScreen">
        <Stack.Screen name="SplashScreen" component={SplashScreen} />
        <Stack.Screen name="Tabs" component={AppNavigator} />
        <Stack.Screen name="AuthNavigator" component={AuthNavigator} />
        <Stack.Screen name="CheckOut" component={CheckOut} />
        <Stack.Screen name="SubmitTask" component={SubmitTaskScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
