import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive from 'rive-react-native';
import { Text } from './ui/Text';
import { ModalComponent } from './ui/ModalComponent';
import { useAppStore } from 'models/appStore';

export default function NetworkFailedModal() {
  const failed = useAppStore().networkState.failed;

  return (
    <ModalComponent style={{ flex: 1, backgroundColor: 'gray' }} visible={failed}>
      <View style={{ flex: 1, backgroundColor: 'gray' }}>
        <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Rive
            style={{ width: 200, maxHeight: 200 }}
            stateMachineName="State Machine 1"
            url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722929035/piojle0tfhxs9q3vwdpy.riv"
          />
          <Text>Connecting</Text>
        </SafeAreaView>
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({});
