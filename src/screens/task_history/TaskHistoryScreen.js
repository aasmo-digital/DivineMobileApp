import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {useSelector} from 'react-redux';
import {HeaderCompt, PageContainer} from '../../components';
import {Colors} from '../../theme/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ApiRequest from '../../network/ApiRequest';
import {useFocusEffect} from '@react-navigation/native';

const TaskHistoryScreen = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useSelector(state => state?.UserData?.token); // Correct reducer key

  const getTaskSubmitted = async () => {
    const token = await AsyncStorage.getItem('userToken');
    try {
      setLoading(true);
      const response = await ApiRequest({
        BASEURL: 'https://fakestoreapi.com/products',
        method: 'GET',
        // req: null,
        token: token,
      });

      if (response.status === 200 || response.status === 201) {
        setLoading(false);
        console.log('----------response.data', response?.data);
        setTasks([]);
      } else {
        console.error('Server error:', response?.message);
      }
    } catch (error) {
      setLoading(false);
      console.error('Fetch Error:', error);
    }
  };
  useFocusEffect(
    useCallback(() => {
      getTaskSubmitted();
      return () => {
        console.log('Screen unfocused');
      };
    }, []),
  );

  return (
    <PageContainer>
      <HeaderCompt title={'Tasks History'} />
      {loading ? (
        <ActivityIndicator size="large" style={{flex: 1}} />
      ) : (
        <FlatList
          data={tasks}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text>Status: {item.status}</Text>
              <Text>
                Submitted: {new Date(item.createdAt).toLocaleDateString()}
              </Text>
            </View>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No tasks submitted yet.</Text>
          }
        />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  itemContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: Colors.BLACK,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
});
export default TaskHistoryScreen;
