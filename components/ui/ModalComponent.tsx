import { Colors } from 'constants/colors';
import { forwardRef, ReactNode } from 'react';
import { StyleSheet, Text, Modal, TouchableOpacityProps, ViewStyle } from 'react-native';

type ButtonProps = {
  onPress?: TouchableOpacityProps['onPress'];
  children: ReactNode;
  style?: ViewStyle;
} & TouchableOpacityProps;

export const ModalComponent = forwardRef<Modal, ButtonProps>(({ style, children }, ref) => {
  return (
    <Modal visible={false} ref={ref} style={[styles.button, style]}>
      {children}
    </Modal>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: 'gold',
    borderRadius: 24,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 8,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: Colors.ButtonOutline,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: 'black',
    fontSize: 20,
    fontFamily: 'Crispy-Tofu',
    textAlign: 'center',
  },
});
