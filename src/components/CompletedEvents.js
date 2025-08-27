import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo} from 'react';
import Fonts from '../theme/Fonts';
import {AppConstant} from '../utils/AppConstant';
import {Colors} from '../theme/colors';
import styles from '../screens/home/common.styles';
import imageindex from '../assets/images/imageindex';

const CompletedEvents = ({taskLoading, myTasks}) => {
  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 10,
        }}>
        <View style={[styles.divider, {flex: 1}]} />
        <Text
          style={{
            color: Colors.BLACK,
            marginHorizontal: 10,
            fontFamily: Fonts.PoppinsSemiBold,
            fontSize: 16,
          }}>
          Comleted Events
        </Text>
        <View style={[styles.divider, {flex: 1}]} />
      </View>
      {taskLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={myTasks}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({item, index}) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginVertical: 5,
                  borderWidth: 0.3,
                  padding: 5,
                  borderColor: Colors.LIGHT_GRAY,
                  borderRadius: 10,
                  backgroundColor: Colors.WHITE,
                  shadowColor: Colors.GRAY,
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}>
                <Image
                  source={{
                    uri: AppConstant.BASEURL + item?.submissionProof?.photoUrl,
                  }}
                  style={{height: 100, width: 100, borderRadius: 10}}
                />
                <Text
                  numberOfLines={2}
                  style={{
                    color: Colors.BLACK,
                    fontFamily: Fonts.PoppinsSemiBold,
                    fontSize: 16,
                    flex: 1,
                    marginLeft: 10,
                  }}>
                  {item?.title}
                </Text>
                <Image
                  source={imageindex?.successright}
                  style={{height: 50, width: 50, tintColor: Colors.APPCOLOR}}
                />
              </View>
            );
          }}
          ListEmptyComponent={() => (
            <Text
              style={{
                color: Colors.BLACK,
                textAlign: 'center',
                marginTop: 20,
                fontSize: 16,
                fontFamily: Fonts.PoppinsMedium,
              }}>
              No Task Found.
            </Text>
          )}
        />
      )}
    </View>
  );
};

export default memo(CompletedEvents);
