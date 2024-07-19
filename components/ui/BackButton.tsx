import { Feather } from '@expo/vector-icons';
import { Text, View, StyleSheet } from 'react-native';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <View style={styles.backButton}>
      <Feather name="chevron-left" size={24} color="white" />
      {/* <Text style={styles.backButtonText} onPress={onPress}>
        Back
      </Text> */}
    </View>
  );
};
const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    paddingLeft: 10,
  },
  backButtonText: {
    color: '#007AFF',
    marginLeft: 1,
  },
});
