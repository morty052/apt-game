import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive from 'rive-react-native';

export default function LoadingScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: 'transparent' }}>
      <SafeAreaView
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 100 }}>
        <Rive
          style={{ width: '100%', maxHeight: 300 }}
          stateMachineName="State Machine 1"
          url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1724620847/rive/xjdn7izjbxijr53yonzy.riv"
        />
      </SafeAreaView>
    </View>
  );
}
