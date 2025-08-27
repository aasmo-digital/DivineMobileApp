import ApiRequest from '../../network/ApiRequest';
import {ApiRoutes} from '../../utils/ApiRoutes';
// import {launchImageLibrary} from 'react-native-image-picker';
import Geolocation from 'react-native-geolocation-service';
import {useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {showErrorToast, showSuccessToast} from '../../utils/HelperFuntions';
import {Alert} from 'react-native';
import {useSelector} from 'react-redux';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const useSubmitTask = () => {
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

  const navigation = useNavigation();

  // const pickImage = () => {
  //   const options = {
  //     mediaType: 'photo',
  //     quality: 0.7,
  //   };
  //   launchImageLibrary(options, response => {
  //     if (response.didCancel) {
  //       console.log('User cancelled image picker');
  //     } else if (response.errorCode) {
  //       console.log('ImagePicker Error: ', response.errorMessage);
  //     } else if (response.assets && response.assets.length > 0) {
  //       setPhoto(response.assets[0]);
  //       // Clear photo error when an image is selected
  //       setError(prev => ({...prev, photoError: ''}));
  //     }
  //   });
  // };

  const pickImage = () => {
    Alert.alert(
      'Upload Proof',
      'Choose an option',
      [
        {
          text: 'Camera',
          onPress: () => {
            const options = {
              mediaType: 'photo',
              quality: 0.7,
            };
            launchCamera(options, response => {
              if (response.didCancel) {
                console.log('User cancelled camera');
              } else if (response.errorCode) {
                console.log('Camera Error: ', response.errorMessage);
              } else if (response.assets && response.assets.length > 0) {
                setPhoto(response.assets[0]);
                setError(prev => ({...prev, photoError: ''}));
              }
            });
          },
        },
        {
          text: 'Gallery',
          onPress: () => {
            const options = {
              mediaType: 'photo',
              quality: 0.7,
            };
            launchImageLibrary(options, response => {
              if (response.didCancel) {
                console.log('User cancelled gallery');
              } else if (response.errorCode) {
                console.log('Gallery Error: ', response.errorMessage);
              } else if (response.assets && response.assets.length > 0) {
                setPhoto(response.assets[0]);
                setError(prev => ({...prev, photoError: ''}));
              }
            });
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
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

          console.log('--------', response?.data?.message);

          if (response?.status == '200' || response?.status == '201') {
            showSuccessToast('Success', 'Task submitted successfully!');

            navigation.goBack();
          } else {
            showErrorToast(response?.data?.message);
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
  return {
    title,
    setTitle,
    photo,
    setPhoto,
    description,
    setDescription,
    loading,
    setLoading,
    token,
    error,
    setError,
    pickImage,
    validate,
    handleSubmit,
  };
};

export default useSubmitTask;
