import { forwardRef, ReactNode } from 'react';
import { StyleSheet, Text as RNText, TextProps } from 'react-native';

type CustomTextProps = {
  children: ReactNode;
  style?: TextProps['style'];
} & TextProps;

export const Text = forwardRef<RNText, CustomTextProps>(({ children, style }, ref) => {
  return <RNText style={[styles.Text, style]}>{children}</RNText>;
});

const styles = StyleSheet.create({
  Text: {
    // color: 'black',
    fontSize: 20,
    fontFamily: 'Crispy-Tofu',
  },
});
