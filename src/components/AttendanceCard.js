// import {StyleSheet, Text, View, Image} from 'react-native';
// import React, {memo, useState, useEffect} from 'react';
// import {Colors} from '../theme/colors';
// import {
//   formatDate,
//   formatDateTime,
//   formatDuration,
// } from '../utils/HelperFuntions';
// import {AppConstant} from '../utils/AppConstant';
// import Fonts from '../theme/Fonts';

// const AttendanceCard = ({item}) => {
//   console.log('-----fulliTem ---', item);
//   // State for both check-in and check-out addresses
//   const [checkInAddress, setCheckInAddress] = useState('Loading location...');
//   const [checkOutAddress, setCheckOutAddress] = useState(''); // Initially empty

//   useEffect(() => {
//     // Reusable helper function to fetch address from coordinates
//     const getAddressFromCoords = async (latitude, longitude, setAddress) => {
//       // Guard against invalid or missing coordinates
//       if (!latitude || !longitude) {
//         setAddress('Location not provided');
//         return;
//       }
//       try {
//         const response = await fetch(
//           `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
//         );

//         if (!response.ok) {
//           throw new Error('Failed to fetch location');
//         }

//         const data = await response.json();
//         setAddress(data.display_name || 'Unknown location');
//       } catch (error) {
//         console.error('Error fetching address:', error.message);
//         setAddress('Unable to fetch location');
//       }
//     };

//     // Fetch Check-In location
//     getAddressFromCoords(
//       item.checkIn?.location?.latitude,
//       item.checkIn?.location?.longitude,
//       setCheckInAddress,
//     );

//     // Fetch Check-Out location only if it exists
//     if (item.checkOut?.location) {
//       setCheckOutAddress('Loading location...'); // Show loading for checkout
//       getAddressFromCoords(
//         item.checkOut.location.latitude,
//         item.checkOut.location.longitude,
//         setCheckOutAddress,
//       );
//     } else {
//       setCheckOutAddress('No checkout location');
//     }
//     // Dependency array ensures this effect runs when the item's location data changes
//   }, [item.checkIn?.location, item.checkOut?.location]);

//   return (
//     <View style={styles.card}>
//       <View style={styles.header}>
//         <Text style={styles.date}>📅 {formatDate(item.date)}</Text>
//         <Text style={styles.status}>
//           Status: <Text style={{color: 'green'}}>{item.status}</Text>
//         </Text>
//       </View>

//       <View style={styles.row}>
//         {/* Check-In Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Check-In</Text>
//           <Text style={styles.timeText}>
//             ⏰ {formatDateTime(item.checkIn?.time)}
//           </Text>
//           <Text style={styles.locationText}>📍 {checkInAddress}</Text>
//           {item.checkIn?.photoUrl ? (
//             <Image
//               source={{uri: AppConstant.BASEURL + item.checkIn.photoUrl}}
//               style={styles.image}
//             />
//           ) : (
//             <View style={styles.noPhoto}>
//               <Text style={styles.noPhotoText}>No Photo</Text>
//             </View>
//           )}
//         </View>

//         {/* Check-Out Section */}
//         <View style={styles.section}>
//           <Text style={styles.sectionTitle}>Check-Out</Text>
//           <Text style={styles.timeText}>
//             ⏰{' '}
//             {item?.checkOut?.time ? formatDateTime(item.checkOut.time) : 'N/A'}
//           </Text>
//           <Text style={styles.locationText}>📍 {checkOutAddress}</Text>
//           {item.checkOut?.photoUrl ? (
//             <Image
//               source={{uri: AppConstant.BASEURL + item.checkOut.photoUrl}}
//               style={styles.image}
//             />
//           ) : (
//             <View style={styles.noPhoto}>
//               <Text style={styles.noPhotoText}>No Photo</Text>
//             </View>
//           )}
//         </View>
//       </View>

//       <View style={styles.footer}>
//         <Text style={styles.footerText}>
//           🗑 Waste Collected: {item.checkOut?.wasteCollected ?? 0} Kg
//         </Text>
//         <Text style={styles.footerText}>
//           ⏳ Duration: {formatDuration(item.duration)}
//         </Text>
//       </View>
//     </View>
//   );
// };

// export default memo(AttendanceCard);

// const styles = StyleSheet.create({
//   card: {
//     backgroundColor: Colors.WHITE,
//     padding: 15,
//     marginBottom: 12,
//     borderRadius: 12,
//     shadowColor: Colors.BLACK,
//     shadowOpacity: 0.1,
//     shadowOffset: {width: 0, height: 2},
//     shadowRadius: 5,
//     elevation: 3,
//     borderWidth: 0.4,
//     borderColor: Colors.GRAY,
//   },
//   header: {
//     marginBottom: 10,
//   },
//   date: {
//     fontSize: 16,
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsSemiBold,
//   },
//   status: {
//     fontSize: 14,
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsMedium,
//   },
//   row: {
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//   },
//   section: {
//     flex: 1, // Ensures both sections take equal width
//     marginHorizontal: 5, // Adds spacing between sections
//   },
//   sectionTitle: {
//     fontSize: 15,
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsMedium,
//     marginBottom: 4,
//   },
//   timeText: {
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsRegular,
//     marginBottom: 4,
//   },
//   locationText: {
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsRegular,
//     fontSize: 12,
//     marginBottom: 8,
//     minHeight: 30, // Prevents layout shift while address is loading
//   },
//   image: {
//     width: '100%',
//     aspectRatio: 1, // Makes the image a square
//     height: undefined,
//     borderRadius: 8,
//     borderWidth: 0.4,
//     borderColor: Colors.GRAY,
//   },
//   noPhoto: {
//     width: '100%',
//     aspectRatio: 1,
//     borderRadius: 8,
//     backgroundColor: '#f0f0f0',
//     justifyContent: 'center',
//     alignItems: 'center',
//     borderWidth: 0.4,
//     borderColor: Colors.GRAY,
//   },
//   noPhotoText: {
//     fontFamily: Fonts.PoppinsRegular,
//     color: Colors.GRAY,
//   },
//   footer: {
//     marginTop: 15,
//     borderTopWidth: 1,
//     borderTopColor: '#eee',
//     paddingTop: 10,
//   },
//   footerText: {
//     marginTop: 4,
//     color: Colors.BLACK,
//     fontFamily: Fonts.PoppinsMedium,
//   },
// });

import {StyleSheet, Text, View, Image} from 'react-native';
import React, {memo, useState, useEffect} from 'react';
import axios from 'axios'; // ✅ Axios import
import {Colors} from '../theme/colors';
import {
  formatDate,
  formatDateTime,
  formatDuration,
} from '../utils/HelperFuntions';
import {AppConstant} from '../utils/AppConstant';
import Fonts from '../theme/Fonts';

const AttendanceCard = ({item}) => {
  // console.log('-----fulliTem ---', item);
  const [checkInAddress, setCheckInAddress] = useState('Loading location...');
  const [checkOutAddress, setCheckOutAddress] = useState('');

  useEffect(() => {
    // const getAddressFromCoords = async (latitude, longitude, setAddress) => {
    //   if (!latitude || !longitude) {
    //     setAddress('Location not provided');
    //     return;
    //   }
    //   try {
    //     const response = await axios.get(
    //       `https://nominatim.openstreetmap.org/reverse`,
    //       {
    //         params: {
    //           format: 'json',
    //           lat: latitude,
    //           lon: longitude,
    //         },
    //         headers: {
    //           Accept: 'application/json',
    //           'User-Agent': 'ReactNativeApp', // ✅ Required by Nominatim
    //         },
    //       },
    //     );

    //     const data = response.data;
    //     setAddress(data.display_name || 'Unknown location');
    //   } catch (error) {
    //     console.error('Axios error fetching address:', error.message);
    //     setAddress('Unable to fetch location');
    //   }
    // };

    const getAddressFromCoords = async (latitude, longitude, setAddress) => {
      if (!latitude || !longitude) {
        setAddress('Location not provided');
        return;
      }

      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse`,
          {
            params: {
              format: 'json',
              lat: latitude,
              lon: longitude,
            },
            headers: {
              Accept: 'application/json',
              'User-Agent': 'ReactNativeApp', // ✅ Required by Nominatim
            },
            timeout: 10000, // ⏳ 10s timeout
          },
        );

        const data = response.data;
        setAddress(data.display_name || 'Unknown location');
      } catch (error) {
        if (error.message === 'Network Error') {
          console.log('🌐 No internet connection');
          setAddress('No internet connection. Please check your network.');
        } else if (error.code === 'ECONNABORTED') {
          console.log('⏳ Request timeout');
          setAddress('Request timed out. Try again.');
        } else {
          console.error('Axios error fetching address:', error.message);
          setAddress('Unable to fetch location');
        }
      }
    };

    // ✅ Check-In Location
    getAddressFromCoords(
      item.checkIn?.location?.latitude,
      item.checkIn?.location?.longitude,
      setCheckInAddress,
    );

    // ✅ Check-Out Location (agar hai)
    if (item.checkOut?.location) {
      setCheckOutAddress('Loading location...');
      getAddressFromCoords(
        item.checkOut.location.latitude,
        item.checkOut.location.longitude,
        setCheckOutAddress,
      );
    } else {
      setCheckOutAddress('No checkout location');
    }
  }, [item.checkIn?.location, item.checkOut?.location]);

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.date}>📅 {formatDate(item.date)}</Text>
        <Text style={styles.status}>
          Status: <Text style={{color: 'green'}}>{item.status}</Text>
        </Text>
      </View>

      <View style={styles.row}>
        {/* ✅ Check-In Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-In</Text>
          <Text style={styles.timeText}>
            ⏰ {formatDateTime(item.checkIn?.time)}
          </Text>
          <Text style={styles.locationText}>📍 {checkInAddress}</Text>
          {item.checkIn?.photoUrl ? (
            <Image
              source={{uri: AppConstant.BASEURL + item.checkIn.photoUrl}}
              style={styles.image}
            />
          ) : (
            <View style={styles.noPhoto}>
              <Text style={styles.noPhotoText}>No Photo</Text>
            </View>
          )}
        </View>

        {/* ✅ Check-Out Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Check-Out</Text>
          <Text style={styles.timeText}>
            ⏰{' '}
            {item?.checkOut?.time ? formatDateTime(item.checkOut.time) : 'N/A'}
          </Text>
          <Text style={styles.locationText}>📍 {checkOutAddress}</Text>
          {item.checkOut?.photoUrl ? (
            <Image
              source={{uri: AppConstant.BASEURL + item.checkOut.photoUrl}}
              style={styles.image}
            />
          ) : (
            <View style={styles.noPhoto}>
              <Text style={styles.noPhotoText}>No Photo</Text>
            </View>
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          🗑 Waste Collected: {item.checkOut?.wasteCollected ?? 0} Kg
        </Text>
        <Text style={styles.footerText}>
          ⏳ Duration: {formatDuration(item.duration)}
        </Text>
      </View>
    </View>
  );
};

export default memo(AttendanceCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.WHITE,
    padding: 15,
    marginBottom: 12,
    borderRadius: 12,
    shadowColor: Colors.BLACK,
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    shadowRadius: 5,
    elevation: 3,
    borderWidth: 0.4,
    borderColor: Colors.GRAY,
  },
  header: {marginBottom: 10},
  date: {
    fontSize: 16,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  status: {
    fontSize: 14,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  section: {
    flex: 1,
    marginHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 15,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
    marginBottom: 4,
  },
  timeText: {
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsRegular,
    marginBottom: 4,
  },
  locationText: {
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsRegular,
    fontSize: 12,
    marginBottom: 8,
    minHeight: 30,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    height: undefined,
    borderRadius: 8,
    borderWidth: 0.4,
    borderColor: Colors.GRAY,
  },
  noPhoto: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0.4,
    borderColor: Colors.GRAY,
  },
  noPhotoText: {
    fontFamily: Fonts.PoppinsRegular,
    color: Colors.GRAY,
  },
  footer: {
    marginTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 10,
  },
  footerText: {
    marginTop: 4,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsMedium,
  },
});
