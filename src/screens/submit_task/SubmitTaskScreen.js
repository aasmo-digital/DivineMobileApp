import React, {useState} from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {useSelector} from 'react-redux';
import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
import {
  ButtonCompt,
  HeaderCompt,
  InputCompt,
  PageContainer,
} from '../../components';

import {showSuccessToast} from '../../utils/HelperFuntions';
import styles from './style';
import useSubmitTask from './useSubmitTask';

const SubmitTaskScreen = ({navigation}) => {
  const {
    title,
    setTitle,
    photo,
    description,
    setDescription,
    loading,
    error,
    setError,
    pickImage,
    handleSubmit,
  } = useSubmitTask();

  return (
    <PageContainer>
      <SafeAreaView style={styles.container}>
        <HeaderCompt title={'Add Task'} />
        <InputCompt
          label={'Task Title*'}
          value={title}
          // Clear error when user starts typing
          onChangeText={text => {
            setTitle(text);
            if (error.titleError) {
              setError(prev => ({...prev, titleError: ''}));
            }
          }}
          placeholder={'Enter title'}
        />
        {!!error.titleError && (
          <Text style={styles.errorText}>{error.titleError}</Text>
        )}

        <InputCompt
          label={'Description*'}
          placeholder={'Enter description...'}
          value={description}
          // Clear error when user starts typing
          onChangeText={text => {
            setDescription(text);
            if (error.descriptionError) {
              setError(prev => ({...prev, descriptionError: ''}));
            }
          }}
          multiline
        />
        {!!error.descriptionError && (
          <Text style={styles.errorText}>{error.descriptionError}</Text>
        )}

        <Text style={styles.label}>
          {photo ? 'Selected Photo' : 'Upload Photo Proof*'}
        </Text>

        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text style={styles.imagePickerText}>
            {photo ? 'Change Image' : 'Pick an image for proof'}
          </Text>
        </TouchableOpacity>

        {photo && (
          <Image source={{uri: photo.uri}} style={styles.previewImage} />
        )}

        {!!error.photoError && (
          <Text style={styles.errorText}>{error.photoError}</Text>
        )}

        <ButtonCompt
          title={'Submit Task'}
          onPress={handleSubmit}
          disabled={loading}
          isLoading={loading}
        />
      </SafeAreaView>
    </PageContainer>
  );
};

export default SubmitTaskScreen;
