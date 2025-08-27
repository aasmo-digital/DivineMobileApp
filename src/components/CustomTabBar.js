import React from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {Colors} from '../theme/colors';

const CustomTabBar = ({state, descriptors, navigation}) => {
  return (
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;

        const isFocused = state.index === index;

        // icons for each tab
        let iconName;
        switch (route.name) {
          case 'Home':
            iconName = 'home';
            break;
          case 'Attendance':
            iconName = 'event-available';
            break;
          case 'Tasks':
            iconName = 'assignment';
            break;
          case 'History':
            iconName = 'history';
            break;
          // case 'Salary':
          //   iconName = 'attach-money';
          //   break;

          case 'Profile':
            iconName = 'man';
            break;
          default:
            iconName = 'circle';
        }

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? {selected: true} : {}}
            onPress={onPress}
            style={styles.tab}>
            <MaterialIcons
              name={iconName}
              size={26}
              color={isFocused ? Colors.APPCOLOR : Colors.GRAY}
            />
            <Text
              allowFontScaling={true}
              style={[styles.label, isFocused && {color: Colors.APPCOLOR}]}>
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.WHITE,
    elevation: 5,
    borderTopWidth: 0.5,
    borderTopColor: Colors.LIGHT_GRAY,
    // borderTopLeftRadius: 20,
    // borderTopRightRadius: 20,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
  },
  label: {
    fontSize: 12,
    color: Colors.GRAY,
    marginTop: 2,
  },
});

export default CustomTabBar;
