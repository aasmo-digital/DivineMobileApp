import {StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.WHITE},
  locationBox: {
    padding: 10,
    backgroundColor: Colors.LIGHT_GRAY,
    margin: 10,
    borderRadius: 8,
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.BLACK,
  },
  latlngText: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 4,
  },
  camera: {flex: 1},
  captureContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingBottom: 30,
  },
  captureButton: {
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    height: 70,
    width: 70,
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    paddingHorizontal: 16,
  },
  previewImage: {
    width: '90%',
    height: '60%',
    borderRadius: 10,
    alignSelf: 'center',
  },
});

export default styles;
