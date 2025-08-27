import {StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';

const styles = StyleSheet.create({
  container: {
    padding: 15,
    paddingBottom: 30,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.BLACK,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    color: Colors.BLACK,
    marginBottom: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.GRAY,
    paddingBottom: 10,
    fontFamily: Fonts.PoppinsMedium,
  },
  profileHeader: {
    alignItems: 'center',
    paddingTop: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderColor: Colors.APPCOLOR,
    marginBottom: 10,
    borderWidth: 0.5,
  
  },
  profileName: {
    fontSize: 24,
    color: Colors.BLACK,
    textTransform: 'capitalize',
    fontFamily: Fonts.PoppinsMedium,
  },
  profileId: {
    fontSize: 16,
    color: Colors.GRAY,
    marginBottom: 10,
  },
  statusBadge: {
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  statusText: {
    color: Colors.WHITE,
    fontSize: 12,
    fontFamily: Fonts.PoppinsMedium,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  infoIcon: {
    marginRight: 15,
  },
  infoTextContainer: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
    opacity: 0.8,
  },
  infoValue: {
    fontSize: 14,
    color: Colors.BLACK,
    // textTransform: 'capitalize',
    fontFamily: Fonts.PoppinsRegular,
    opacity: 0.7,
  },
  idImagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  idImageWrapper: {
    alignItems: 'center',
  },
  idImage: {
    width: 120,
    height: 80,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f0f0f0',
  },
  imageLabel: {
    marginBottom: 5,
    fontSize: 14,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsRegular,
  },
});

export default styles;
