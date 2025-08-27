import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal} from 'react-native';
import MaterialIcons from '@react-native-vector-icons/material-icons';
import {Colors} from '../theme/colors';
import Fonts from '../theme/Fonts';

const LogoutPopup = ({visible, onClose, onConfirm}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <MaterialIcons name="logout" size={40} color="#e74c3c" />
          <Text style={styles.title}>Confirm Logout</Text>
          <Text style={styles.message}>Are you sure you want to logout?</Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.logoutBtn} onPress={onConfirm}>
              <Text style={styles.logoutText}>Logout</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default LogoutPopup;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: '80%',
    backgroundColor: Colors.WHITE,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  title: {
    fontSize: 18,
    marginTop: 10,
    color: Colors.BLACK,
    fontFamily: Fonts.PoppinsSemiBold,
  },
  message: {
    fontSize: 14,
    color: Colors.GRAY,
    textAlign: 'center',
    marginVertical: 10,
    fontFamily: Fonts.PoppinsRegular,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 15,
    justifyContent: 'space-between',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.LIGHT_GRAY,
    marginRight: 10,
  },
  cancelText: {
    color: Colors.BLACK,
    fontWeight: '600',
  },
  logoutBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: Colors.RED,
  },
  logoutText: {
    color: Colors.WHITE,
    fontFamily: Fonts.PoppinsSemiBold,
  },
});
