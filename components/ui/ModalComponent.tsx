import { ReactNode } from 'react';
import { Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const ModalComponent = ({
  visible,
  children,
}: {
  visible: boolean;
  children: ReactNode;
}) => {
  return (
    <Modal animationType="slide" statusBarTranslucent visible={visible}>
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
    </Modal>
  );
};
