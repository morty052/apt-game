import { StyleSheet, Image, Pressable } from 'react-native';
import React from 'react';
import { useAppStore } from 'models/appStore';
import { useNavigation } from '@react-navigation/native';

const characterButtonImages = {
  DETECTIVE:
    'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721393509/j7nr9fems2sxjfzsaiyd.png',
  RACOON: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721393686/and2gvkovtzxvxukuexm.png',
  GENIUS: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721393931/c9h8nj8honcyg0nhzbe5.png',
};
export default function CharacterSelectButton() {
  const { character } = useAppStore();

  const navigation = useNavigation<any>();

  return (
    <Pressable onPress={() => navigation.navigate('CharacterSelect')} style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.icon}
        source={{
          uri: characterButtonImages[character.name as keyof typeof characterButtonImages],
        }}
      />
    </Pressable>
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
