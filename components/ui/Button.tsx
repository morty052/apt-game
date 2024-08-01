import { Colors } from 'constants/colors';
import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, PressableProps } from 'react-native';

type ButtonProps = {
  onPress?: PressableProps['onPress'];
  title?: string;
  style?: any;
  fontSize?: number;
  textColor?: string;
} & PressableProps;

export const Button = forwardRef<any, ButtonProps>(
  ({ onPress, title, style, fontSize, textColor }, ref) => {
    return (
      <Pressable ref={ref} style={[styles.button, style]} onPress={onPress}>
        <Text
          style={[
            styles.buttonText,
            { fontSize: fontSize ? fontSize : 20, color: textColor ? textColor : 'black' },
          ]}>
          {title}
        </Text>
      </Pressable>
    );
  }
);

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: Colors.ButtonOutline,
    borderRadius: 24,
    elevation: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 16,
    borderBottomWidth: 8,
    borderLeftWidth: 4,
    borderRightWidth: 4,
    borderColor: 'gold',
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
