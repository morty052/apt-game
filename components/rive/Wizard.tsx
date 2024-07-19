import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive, { Alignment } from 'rive-react-native';

export default function Wizard() {
  const { height, width } = useWindowDimensions();

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Rive
          alignment={Alignment.Center}
          url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1721390706/owrshkzykhnxy9qj6hjm.riv"
          style={{ width: width * 0.95, backgroundColor: 'transparent' }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'transparent', alignItems: 'center' },
});
