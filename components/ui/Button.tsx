import { Colors } from 'constants/colors';
import { forwardRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';

type ButtonProps = {
  onPress?: TouchableOpacityProps['onPress'];
  title?: string;
  style?: any;
  fontSize?: number;
  textColor?: string;
} & TouchableOpacityProps;

export const Button = forwardRef<TouchableOpacity, ButtonProps>(
  ({ onPress, title, style, fontSize, textColor }, ref) => {
    return (
      <TouchableOpacity ref={ref} style={[styles.button, style]} onPress={onPress}>
        <Text
          style={[
            styles.buttonText,
            { fontSize: fontSize ? fontSize : 20, color: textColor ? textColor : 'black' },
          ]}>
          {title}
        </Text>
      </TouchableOpacity>
    );
  }
);

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
