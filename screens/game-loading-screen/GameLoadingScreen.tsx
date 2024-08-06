import { ActivityIndicator, Dimensions, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/colors';
import Rive from 'rive-react-native';

export default function GameLoadingScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.plain,
        gap: 20,
        paddingHorizontal: 10,
        alignItems: 'center',
      }}>
      <Rive
        url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722927084/yfayyncncuijh4gyfl6o.riv"
        style={{
          width: Dimensions.get('window').width,
          backgroundColor: Colors.plain,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({});
