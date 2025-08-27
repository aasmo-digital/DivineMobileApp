import React, {useState} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import {ButtonCompt, InputCompt} from '../../components';
import LoginController from './LoginController';
import imageindex from '../../assets/images/imageindex';
import styles from './login.styls';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';

const LoginScreen = () => {
  const {isLoading, handleAppSubmit, AppValidationSchema} = LoginController();

  return (
    <SafeAreaView style={{flex: 1}}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{flexGrow: 1}}>
        <View style={styles.container}>
          <StatusBar backgroundColor={Colors.WHITE} barStyle={'dark-content'} />
          <Image source={imageindex.logo} style={styles.logo} />
          <Text style={styles.descriptiontext}>
            Manage your attendance with{' '}
            <Text
              style={{
                fontFamily: Fonts.PoppinsRegular,
                color: Colors.APPCOLOR,
                textTransform: 'uppercase',
              }}>
              Divine
            </Text>
          </Text>
          <Formik
            validationSchema={AppValidationSchema}
            initialValues={{email: '', password: ''}}
            onSubmit={handleAppSubmit}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <>
                <InputCompt
                  label="Email"
                  placeholder="Enter your email"
                  iconName="email-outline"
                  onChangeText={handleChange('email')}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={handleBlur('email')}
                  value={values.email}
                  leftImage={imageindex.mail}
                />
                {touched.email && errors.email && (
                  <Text style={styles.errorText}>{errors.email}</Text>
                )}

                <InputCompt
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  label="Password"
                  placeholder="Enter your password"
                  iconName="lock-outline"
                  leftImage={imageindex.lock}
                  rightImage={true}
                  isPassword={true}
                />
                {touched.password && errors.password && (
                  <Text style={styles.errorText}>{errors.password}</Text>
                )}

                <ButtonCompt
                  title="Login"
                  onPress={handleSubmit}
                  isLoading={isLoading}
                />
              </>
            )}
          </Formik>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LoginScreen;
