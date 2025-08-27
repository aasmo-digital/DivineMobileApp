import React, {memo, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import imageindex from '../assets/images/imageindex';
import {Colors} from '../theme/colors';
import Fonts from '../theme/Fonts';

const InputCompt = ({
  label,
  leftImage,
  rightImage,
  onRightImagePress,
  isPassword = false,
  value,
  onChangeText,
  placeholder,
  style,
  maxLength,
  ...rest
}) => {
  const [secure, setSecure] = useState(isPassword);

  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View style={styles.inputWrapper}>
        {/* Left Side Image */}
        {leftImage && (
          <Image
            source={leftImage}
            style={styles.leftIcon}
            resizeMode="contain"
          />
        )}

        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          secureTextEntry={secure}
          maxLength={maxLength}
          placeholderTextColor={Colors.GRAY}
          {...rest}
        />

        {/* Right Side Image */}
        {rightImage && (
          <TouchableOpacity
            onPress={onRightImagePress || (() => setSecure(!secure))}>
            <Image
              source={secure ? imageindex.hide : imageindex.show}
              style={styles.rightIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 5,
    marginTop: 10,
  },
  label: {
    marginBottom: 5,
    color: Colors.BLACK,
    fontSize: 14,
    opacity: 0.8,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  leftIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    tintColor: Colors.BLACK,
    opacity: 0.5,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
    fontFamily: Fonts.PoppinsRegular,
  },
  rightIcon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    opacity: 0.5,
    tintColor: Colors.BLACK,
  },
});

export default memo(InputCompt);
