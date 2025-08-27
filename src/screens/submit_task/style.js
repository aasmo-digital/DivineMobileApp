import {StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';

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
    borderColor: Colors.GRAY,
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
    backgroundColor: Colors.EXTRA_LIGHT_GRAY,
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
    color: Colors.RED,
    fontFamily: Fonts.PoppinsRegular,
  },
});

export default styles;
