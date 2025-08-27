// import React, { useState, useEffect } from 'react';
// import { View, Text, FlatList, StyleSheet, ActivityIndicator, Button ,Alert} from 'react-native';
// import { useSelector } from 'react-redux';
// import payrollApi from '../api/payrollApi';
// import * as FileSystem from 'expo-file-system'; // Expo पैकेज
// import * as Sharing from 'expo-sharing'; // Expo पैकेज

// const SalarySlipsScreen = () => {
//     const [payrolls, setPayrolls] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const { token } = useSelector((state) => state.auth);

//     useEffect(() => {
//         const fetchPayrolls = async () => {
//             try {
//                 const data = await payrollApi.getMyPayrolls(token);
//                 setPayrolls(data);
//             } catch (error) {
//                 console.error(error);
//             } finally {
//                 setLoading(false);
//             }
//         };
//         fetchPayrolls();
//     }, [token]);

//     const handleDownload = async (item) => {
//       // नोट: यह एक सरल उदाहरण है। असली PDF जेनरेट करने के लिए बैकएंड में लॉजिक की जरूरत होगी
//       // अभी हम यह मान रहे हैं कि बैकएंड एक PDF फाइल लौटाता है।
//       Alert.alert('Download', 'Download functionality requires backend PDF generation.');
//     };

//     if (loading) return <ActivityIndicator size="large" style={{ flex: 1 }} />;

//     return (
//         <FlatList
//             data={payrolls}
//             keyExtractor={(item) => item._id}
//             renderItem={({ item }) => (
//                 <View style={styles.itemContainer}>
//                     <Text style={styles.itemTitle}>Salary Slip: {item.month}/{item.year}</Text>
//                     <Text>Total Salary: ${item.totalSalary}</Text>
//                     <Button title="Download" onPress={() => handleDownload(item)} />
//                 </View>
//             )}
//             ListEmptyComponent={<Text style={styles.emptyText}>No salary slips found.</Text>}
//         />
//     );
// };

// const styles = StyleSheet.create({
//     itemContainer: {
//         padding: 15,
//         borderBottomWidth: 1,
//         borderBottomColor: '#ccc',
//         backgroundColor: 'white',
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     itemTitle: {
//         fontSize: 16,
//         fontWeight: 'bold',
//     },
//     emptyText: {
//         textAlign: 'center',
//         marginTop: 50,
//         fontSize: 16,
//     },
//     photo: {
//         width: 50,
//         height: 50,
//         borderRadius: 25,
//         marginRight: 15,
//     }
// });
// export default TaskHistoryScreen; // या जो भी स्क्रीन का नाम हो

import React, {useState, useEffect} from 'react';
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
import payrollApi from '../api/payrollApi';
import RNFS from 'react-native-fs';
import Share from 'react-native-share';

// बैकएंड का बेस URL, ताकि हम PDF का पूरा URL बना सकें
const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:5000' : 'http://localhost:5000';

const SalarySlipsScreen = () => {
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const {token} = useSelector(state => state.auth);

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const data = await payrollApi.getMyPayrolls(token);
        setPayrolls(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, [token]);

  const handleDownload = async item => {
    // नोट: यह फंक्शन तभी काम करेगा जब आपका बैकएंड '/api/payroll/:id/download'
    // जैसा कोई रूट PDF फाइल डाउनलोड करने के लिए प्रदान करेगा।
    // अभी के लिए, हम एक प्लेसहोल्डर लॉजिक बना रहे हैं।

    // 1. PDF का URL बनाएं (यह एक उदाहरण है)
    const pdfUrl = `${API_BASE_URL}/api/payroll/${item._id}/download`;

    // 2. फाइल को कहाँ सेव करना है, उसका पाथ बनाएं
    const filePath = `${RNFS.DocumentDirectoryPath}/payslip-${item.month}-${item.year}.pdf`;

    try {
      Alert.alert('Download Started', 'Your payslip is being downloaded...');

      // 3. RNFS का उपयोग करके फाइल डाउनलोड करें
      const downloadResult = await RNFS.downloadFile({
        fromUrl: pdfUrl,
        toFile: filePath,
      }).promise;

      if (downloadResult.statusCode === 200) {
        // 4. डाउनलोड सफल होने पर शेयरिंग का ऑप्शन दिखाएं
        await Share.open({
          title: `Payslip for ${item.month}/${item.year}`,
          url: Platform.OS === 'android' ? `file://${filePath}` : filePath,
          failOnCancel: false,
        });
      } else {
        Alert.alert(
          'Download Failed',
          'Could not download the file. Please check the server.',
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred during download or sharing.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={payrolls}
      keyExtractor={item => item._id}
      renderItem={({item}) => (
        <View style={styles.itemContainer}>
          <View style={styles.itemTextContainer}>
            <Text style={styles.itemTitle}>
              Salary Slip: {item.month}/{item.year}
            </Text>
            <Text>Total Salary: ${item.totalSalary}</Text>
          </View>
          <Button
            title="Download"
            onPress={() =>
              Alert.alert(
                'Feature Unavailable',
                'PDF download functionality is not yet implemented on the server.',
              )
            }
          />
          {/* <Button title="Download" onPress={() => handleDownload(item)} /> */}
        </View>
      )}
      ListEmptyComponent={
        <View style={styles.loaderContainer}>
          <Text style={styles.emptyText}>No salary slips found.</Text>
        </View>
      }
      contentContainerStyle={{flexGrow: 1}}
    />
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
  },
  emptyText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default SalarySlipsScreen;
