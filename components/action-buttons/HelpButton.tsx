import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function HelpButton() {
  const navigation = useNavigation<any>();

  return (
    <TouchableOpacity onPress={() => navigation.navigate('HelpScreen')} style={styles.container}>
      <Image
        style={styles.icon}
        source={{
          uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721391927/gxpgqp0xwbpofeqjkqge.png',
        }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: 60,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    height: 58,
    width: 58,
  },
});
