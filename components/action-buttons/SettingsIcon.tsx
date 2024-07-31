import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Pressable } from 'react-native';

function SettingsButton() {
  const navigation = useNavigation<any>();

  return (
    <>
      <Pressable
        onPress={() => navigation.navigate('SettingsScreen')}
        style={styles.settingsButtonContainer}>
        <Ionicons name="settings-outline" size={30} color="black" />
      </Pressable>
    </>
  );
}

export default SettingsButton;

const styles = StyleSheet.create({
  settingsButtonContainer: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
    marginRight: 5,
  },
});
