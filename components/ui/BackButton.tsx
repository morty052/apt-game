import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'constants/colors';
import { Pressable, StyleSheet, ViewStyle } from 'react-native';

export const BackButton = ({
  onPress,
  style,
  iconColor,
}: {
  onPress: () => void;
  style?: ViewStyle;
  iconColor?: string;
}) => {
  return (
    <Pressable onPress={onPress} style={[styles.backButton, style]}>
      <Ionicons name="chevron-back" size={24} color={iconColor || 'white'} />
    </Pressable>
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
    borderColor: 'white',
    backgroundColor: Colors.tertiary,
    marginLeft: 5,
  },
  backButtonText: {
    color: 'black',
    marginLeft: 1,
  },
});
