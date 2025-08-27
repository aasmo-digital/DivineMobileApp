import {StyleSheet} from 'react-native';
import {Colors} from '../../theme/colors';
import Fonts from '../../theme/Fonts';

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.GRAY,
    backgroundColor: Colors.WHITE,
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsRegular,
  },
  photo: {
    width: 100,
    height: 80,
    borderRadius: 25,
    marginRight: 15,
  },
});

export default styles;
