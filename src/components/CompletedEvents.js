import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {memo} from 'react';
import Fonts from '../theme/Fonts';
import {AppConstant} from '../utils/AppConstant';
import {Colors} from '../theme/colors';
import commonStyles from '../screens/home/common.styles';
import imageindex from '../assets/images/imageindex';
import {useNavigation} from '@react-navigation/native';

const CompletedEvents = ({taskLoading, myTasks}) => {
  const navigation = useNavigation();
  return (
    <View>
      {/* 🔹 Header */}
      <View style={styles.headerContainer}>
        <View style={[commonStyles.divider, {flex: 1}]} />
        <Text style={styles.headerText}>Comleted Events</Text>
        <View style={[commonStyles.divider, {flex: 1}]} />
      </View>

      {/* 🔹 Loader or List */}
      {taskLoading ? (
        <ActivityIndicator size={'large'} />
      ) : (
        <FlatList
          data={myTasks}
          keyExtractor={item => item?.id?.toString()}
          renderItem={({item}) => (
            <Pressable
              onPress={() => navigation.navigate('TaskDetails', {item: item})}
              style={styles.card}>
              <Image
                source={{
                  uri: AppConstant.BASEURL + item?.submissionProof?.photoUrl,
                }}
                style={styles.cardImage}
              />
              <Text numberOfLines={2} style={styles.cardTitle}>
                {item?.title}
              </Text>
              <Image
                source={imageindex?.successright}
                style={styles.statusIcon}
              />
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <Text style={styles.emptyText}>No Task Found.</Text>
          )}
        />
      )}
    </View>
  );
};

export default memo(CompletedEvents);

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  headerText: {
    color: Colors.BLACK,
    marginHorizontal: 10,
    fontFamily: Fonts.PoppinsSemiBold,
    fontSize: 16,
  },
  card: {
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
  },
  cardImage: {
    height: 100,
    width: 100,
    borderRadius: 10,
  },
  cardTitle: {
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsSemiBold,
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  statusIcon: {
    height: 50,
    width: 50,
    tintColor: Colors.APPCOLOR,
  },
  emptyText: {
    color: Colors.BLACK,
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    fontFamily: Fonts.PoppinsMedium,
  },
});
