import React from 'react';
import { ImageBackground, StyleSheet, SafeAreaView } from 'react-native';

const ScreenContainer = ({ children }) => {
  return (
    <ImageBackground
      source={require('../assets/Background.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <SafeAreaView style={styles.safeArea}>
        {children}
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  safeArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ScreenContainer;
