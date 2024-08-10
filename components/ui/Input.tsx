import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import React from 'react';

type InputProps = {
  label?: string;
  value: string;
  onChangeText: (value: string) => void;
  style?: any;
} & TextInputProps;

export const Input = React.forwardRef<TextInput, InputProps>(
  ({ label, value, onChangeText, style, ...props }, ref) => {
    return (
      <TextInput
        value={value}
        onChangeText={onChangeText}
        ref={ref}
        style={[styles.input, style]}
        {...props}
      />
    );
  }
);

export default Input;

const styles = StyleSheet.create({
  input: {
    height: 50,
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    fontFamily: 'Crispy-Tofu',
  },
});
