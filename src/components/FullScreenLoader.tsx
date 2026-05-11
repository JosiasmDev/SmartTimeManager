import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

const FullScreenLoader = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="blue" />
    </View>
  );
};

export default FullScreenLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
