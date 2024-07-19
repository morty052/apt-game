import { Pressable, StyleSheet, Text, View } from 'react-native';
import React from 'react';

export default function PlayButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Text style={styles.playText}>Play</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'yellow',
    height: 100,
    width: 100,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 6,
    borderColor: 'gold',
  },
  playText: {
    color: 'black',
    fontSize: 20,
    // fontWeight: 'bold',
    fontFamily: 'Crispy-Tofu',
  },
});
