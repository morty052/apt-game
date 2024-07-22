import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function GameModeButton() {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('ModeSelectScreen')}
      style={styles.container}>
      <Image
        style={styles.icon}
        source={{
          uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721392338/x0kqlfzqakpcbckyzphi.png',
        }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 70,
    width: 70,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  icon: {
    height: 58,
    width: 58,
  },
});
