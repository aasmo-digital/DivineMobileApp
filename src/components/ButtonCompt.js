import React, {memo} from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Fonts from '../theme/Fonts';
import {Colors} from '../theme/colors';

const ButtonCompt = ({
  title,
  onPress,
  isLoading,
  style,
  textStyle,
  isOutline,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.button,
        style,
        {
          backgroundColor: isOutline ? Colors.WHITE : Colors.APPCOLOR,
          borderWidth: isOutline ? 0.5 : 0,
        },
      ]}
      onPress={onPress}
      disabled={isLoading} // Disable button when loading
    >
      {isLoading ? (
        <ActivityIndicator size="small" color="#ffffff" />
      ) : (
        <Text
          style={[
            styles.buttonText,
            textStyle,
            {color: isOutline ? Colors.BLACK : Colors.WHITE},
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.APPCOLOR,
    paddingHorizontal: 15,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    marginTop: 20,
    minHeight: 50,
  },
  buttonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
  },
});

export default memo(ButtonCompt);
