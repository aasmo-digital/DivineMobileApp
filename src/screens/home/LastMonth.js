import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import styles from './common.styles';

const LastMonth = () => {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Attendance</Text>
        <Text style={styles.cardValue}>25</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Event</Text>
        <Text style={styles.cardValue}>00</Text>
      </View>
    </View>
  );
};

export default LastMonth;
