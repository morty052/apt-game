import { StyleSheet, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export const Container = ({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export const SafeContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>{children}</View>;
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
