import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive from 'rive-react-native';

export default function Wizard() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Rive
          url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1720973212/uz8qqy9d6gkgjyeui8nl.riv"
          style={{ height: 400, width: 400 }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent' },
});
