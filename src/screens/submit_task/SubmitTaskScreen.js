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
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';
import {SuccessToast} from 'react-native-toast-message';
import {showSuccessToast} from '../../utils/HelperFuntions';

const SubmitTaskScreen = ({navigation}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state?.user?.token); // Correct reducer key
  const [error, setError] = useState({
    titleError: '',
    descriptionError: '',
    photoError: '',
  });

  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.7,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setPhoto(response.assets[0]);
        // Clear photo error when an image is selected
        setError(prev => ({...prev, photoError: ''}));
      }
    });
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {titleError: '', descriptionError: '', photoError: ''};

    if (!title.trim()) {
      newErrors.titleError = 'Title is required.';
      isValid = false;
    }
    if (!description.trim()) {
      newErrors.descriptionError = 'Description is required.';
      isValid = false;
    }
    if (!photo) {
      newErrors.photoError = 'Photo proof is required.';
      isValid = false;
    }

    setError(newErrors);
    return isValid;
  };

  const handleSubmit = () => {
    // Return early if validation fails
    if (!validate()) {
      return;
    }

    setLoading(true);
    Geolocation.getCurrentPosition(
      async position => {
        try {
          const formData = new FormData();
          formData.append('title', title);
          formData.append('description', description);
          formData.append('latitude', position.coords.latitude);
          formData.append('longitude', position.coords.longitude);
          formData.append('photo', {
            uri: photo.uri,
            name: photo.fileName,
            type: photo.type,
          });

          console.log('===formData=====', formData);
          const response = await ApiRequest({
            BASEURL: ApiRoutes.addTask,
            isForm: true,
            req: formData,
            method: 'POST',
            token: token,
          });

          console.log('--------', response);

          if (response?.status == '200' || response?.status == '201') {
            // Alert.alert('Success', 'Task submitted successfully!');

            showSuccessToast('Success', 'Task submitted successfully!');

            navigation.goBack();
          } else {
            // Handle non-200 success responses if your API has them
            Alert.alert('Error', response?.message || 'Failed to submit task.');
          }
        } catch (error) {
          Alert.alert('Error', 'An unexpected error occurred.');
          console.error(error);
        } finally {
          setLoading(false);
        }
      },
      error => {
        Alert.alert(
          'Location Error',
          'Could not get location. Please enable GPS and try again.',
        );
        console.log(error);
        setLoading(false);
      },
      {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
    );
  };

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

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE},
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontFamily: Fonts.PoppinsMedium,
    color: Colors.BLACK,
    marginTop: 10,
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  imagePicker: {
    backgroundColor: '#eee',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    borderStyle: 'dashed',
  },
  imagePickerText: {
    fontSize: 14,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginVertical: 10,
    borderWidth: 0.3,
    borderColor: Colors.LIGHT_GRAY,
  },
  errorText: {
    fontSize: 12,
    color: 'red',
    // marginBottom: 10, // Removed to keep it close to the input
    fontFamily: Fonts.PoppinsRegular,
  },
});

export default SubmitTaskScreen;
