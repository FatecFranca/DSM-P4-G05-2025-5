import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native';

const ScreenContainer = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safe}>{children}</SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safe: {
    flex: 1,
    padding: 20
  },
});

export default ScreenContainer;
