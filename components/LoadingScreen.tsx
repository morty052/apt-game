import { StyleSheet, Text, View } from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <Text>Connecting</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
