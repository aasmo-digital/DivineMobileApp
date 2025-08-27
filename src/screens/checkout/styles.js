import { Platform, StyleSheet } from 'react-native'
import { Colors } from '../../theme/colors';
import Fonts from '../../theme/Fonts';


const styles = StyleSheet.create({
  container: {flex: 1},
  formContainer: {gap: 20, paddingBottom: 30},
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
  locationText: {fontSize: 14, color: '#555'},
  addressText: {marginTop: 5, fontSize: 14, color: Colors.APPCOLOR},
  loadingContainer: {flexDirection: 'row', alignItems: 'center'},
  cameraLauncher: {
    height: 200,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  placeholder: {alignItems: 'center'},
  placeholderText: {
    marginTop: 8,
    color: Colors.GRAY,
    fontFamily: Fonts.PoppinsRegular,
  },
  previewImage: {height: '100%', width: '100%'},
  camera: {flex: 1},
  cameraOverlay: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingBottom: 40,
    gap: 30,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  captureButton: {
    borderWidth: 2,
    borderColor: '#fff',
    borderRadius: 50,
    height: 70,
    width: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles