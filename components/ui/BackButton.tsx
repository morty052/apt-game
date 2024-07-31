import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity } from 'react-native';

export const BackButton = ({ onPress }: { onPress: () => void }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.backButton}>
      <Ionicons name="chevron-back" size={24} color="black" />
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  backButton: {
    flexDirection: 'row',
    borderWidth: 1,
    height: 40,
    width: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow',
    borderColor: 'gold',
    marginLeft: 5,
  },
  backButtonText: {
    color: 'black',
    marginLeft: 1,
  },
});
