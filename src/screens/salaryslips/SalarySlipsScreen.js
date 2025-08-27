import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Button,
  Alert,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import {ButtonCompt, HeaderCompt, PageContainer} from '../../components';
import ApiRequest from '../../network/ApiRequest';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {Colors} from '../../theme/colors';
import {AppConstant} from '../../utils/AppConstant';

const SalarySlipsScreen = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const token = useSelector(state => state?.UserData?.token); // Correct reducer key

  const handleDownload = async item => {
    // नोट: यह फंक्शन तभी काम करेगा जब आपका बैकएंड '/api/payroll/:id/download'
    // जैसा कोई रूट PDF फाइल डाउनलोड करने के लिए प्रदान करेगा।
    // अभी के लिए, हम एक प्लेसहोल्डर लॉजिक बना रहे हैं।

    // 1. PDF का URL बनाएं (यह एक उदाहरण है)
    const pdfUrl = `${AppConstant.BASEURL}/api/payroll/${item?.id}/download`;

    // 2. फाइल को कहाँ सेव करना है, उसका पाथ बनाएं
    const filePath = `${RNFS.DocumentDirectoryPath}/payslip-${item?.month}-${item?.year}.pdf`;

    try {
      setDownloading(true);
      // Alert.alert('Download Started', 'Your payslip is being downloaded...');

      // 3. RNFS का उपयोग करके फाइल डाउनलोड करें
      const downloadResult = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        setDownloading(false);
        // 4. डाउनलोड सफल होने पर शेयरिंग का ऑप्शन दिखाएं
        await Share.open({
          title: `Payslip for ${item.month}/${item.year}`,
          url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
          failOnCancel: false,
        });
      } else {
        setDownloading(false);
        Alert.alert(
          'Download Failed',
          'Could not download the file. Please check the server.',
        );
      }
    } catch (error) {
      setDownloading(false);
      console.error(error);
      Alert.alert('Error', 'An error occurred during download or sharing.');
    }
  };

  const getAllSalarySlipsData = async id => {
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
        // console.log('----------response.data', response?.data);
        setPayrolls(response?.data);
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
      // जब screen focus होगी तब चलेगा
      getAllSalarySlipsData();

      // अगर cleanup की ज़रूरत है तो यहाँ return कर सकते हो
      return () => {
        console.log('Screen unfocused');
      };
    }, []),
  );
  return (
    <PageContainer>
      <HeaderCompt title={'Salary Slips'} />

      {loading ? (
        <ActivityIndicator size="large" style={{flex: 1}} />
      ) : (
        <FlatList
          data={payrolls}
          keyExtractor={item => item._id}
          renderItem={({item}) => (
            <View style={styles.itemContainer}>
              <View style={styles.itemTextContainer}>
                <Text style={styles.itemTitle}>
                  Salary Slip: {item?.month || 6}/{item?.year || 2025}
                </Text>
                <Text style={{color: Colors.BLACK}}>
                  Total Salary: ${item?.totalSalary || 10}
                </Text>
              </View>

              {/* <Button title="Download" onPress={() => handleDownload(item)} /> */}

              <ButtonCompt
                title={'Downlaod'}
                style={{
                  backgroundColor: Colors.WHITE,
                  borderWidth: 0.5,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 20,
                  alignSelf: 'center',
                  marginTop: 0,
                  minHeight: 0,
                }}
                textStyle={{
                  color: Colors.BLACK,
                  fontSize: 12,
                }}
                isLoading={downloading}
                onPress={() => handleDownload(item)}
              />
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.loaderContainer}>
              <Text style={styles.emptyText}>No salary slips found.</Text>
            </View>
          }
          contentContainerStyle={{flexGrow: 1}}
        />
      )}
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemTextContainer: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.BLACK,
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default SalarySlipsScreen;
