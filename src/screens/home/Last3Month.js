import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import styles from './common.styles';

const Last3Month = () => {
  return (
    <View style={styles.row}>
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Attendance</Text>
        <Text style={styles.cardValue}>80</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Total Event</Text>
        <Text style={styles.cardValue}>10</Text>
      </View>
    </View>
  );
};

export default Last3Month;
