import {StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.APPCOLOR,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  cardTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
  cardValue: {
    color: Colors.BLACK,
    marginTop: 10,
    fontFamily: Fonts.PoppinsSemiBold,
    fontSize: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.GRAY,
    marginVertical: 10,
    opacity: 0.5,
  },
  heading: {
    color: Colors.BLACK,
    textAlign: 'center',
    fontSize: 20,
    fontFamily: Fonts.PoppinsMedium,
  },
  profileContainer: {
    alignItems: 'center',
    flex: 1,
    alignSelf: 'flex-start',
  },
  outerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    borderColor: Colors.LIGHT_APPCOLOR,
    borderWidth: 10,
  },
  innerCircle: {
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 200,
    borderColor: Colors.MEDIUM_APPCOLOR,
    borderWidth: 10,
    alignSelf: 'flex-start',
  },
  profileImg: {
    height: 100,
    width: 100,
    borderRadius: 100,
  },
  profileText: {
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsSemiBold,
    fontSize: 14,
    marginTop: 5,
  },
});

export default styles;
