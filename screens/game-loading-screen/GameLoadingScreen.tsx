import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/colors';

export default function GameLoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={100} color={Colors.tertiary} />
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
