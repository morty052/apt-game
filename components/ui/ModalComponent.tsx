import { ReactNode } from 'react';
import { Modal, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ModalComponent = ({
  visible,
  children,
  style,
}: {
  visible: boolean;
  children: ReactNode;
  style?: ViewStyle;
}) => {
  return (
    <Modal animationType="slide" statusBarTranslucent visible={visible}>
      <View style={[{ flex: 1 }, style]}>
        <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      </View>
    </Modal>
  );
};
