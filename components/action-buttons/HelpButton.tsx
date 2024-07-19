import { StyleSheet, Image, View } from 'react-native';
import React from 'react';

export default function HelpButton() {
  return (
    <View style={styles.container}>
      <Image
        style={styles.icon}
        source={{
          uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721391927/gxpgqp0xwbpofeqjkqge.png',
        }}
      />
    </View>
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
