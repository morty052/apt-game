import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: '#00c4ee' }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Connecting</Text>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({});
