import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import {Colors} from '../theme/colors';

const PageContainer = ({
  children,
  style,
  scrollable = false,
  loading = false,
  onRefresh,
  isRefreshing = false,
}) => {
  // अगर लोडिंग हो रही है, तो फुल-स्क्रीन लोडर दिखाएं
  if (loading) {
    return (
      <SafeAreaView style={[styles.fullScreenLoader, style]}>
        <ActivityIndicator size="large" color="#007AFF" />
      </SafeAreaView>
    );
  }

  // अगर पेज स्क्रॉल करने योग्य है, तो ScrollView का उपयोग करें
  if (scrollable) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          style={[styles.container, style]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            onRefresh ? (
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            ) : undefined
          }>
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }

  // डिफ़ॉल्ट रूप से, एक सामान्य View का उपयोग करें
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar backgroundColor={Colors.WHITE} barStyle={'dark-content'} />
      <View style={[styles.container, style]}>{children}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff', // ऐप का डिफ़ॉल्ट बैकग्राउंड कलर
  },
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  scrollContent: {
    flexGrow: 1, // यह सुनिश्चित करता है कि कम कंटेंट होने पर भी कंटेनर पूरी ऊंचाई ले
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
  },
});

export default PageContainer;
