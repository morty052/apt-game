import { NavigationProp, useNavigation } from '@react-navigation/native';
import { GameStackParamList } from 'Routes/GameStack';

import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

type gameModeProps = {
  value: 'HEAD_TO_HEAD' | 'FULL_HOUSE' | 'PRIVATE_MATCH' | 'SURVIVAL_MATCH';
  title: string;
};

const gameModes: gameModeProps[] = [
  { value: 'HEAD_TO_HEAD', title: 'Head to Head' },
  { value: 'FULL_HOUSE', title: 'Full House' },
  { value: 'PRIVATE_MATCH', title: 'Private Match' },
  { value: 'SURVIVAL_MATCH', title: 'Survival Match' },
];

function ModeSelectBox({ title, value }: { title: string; value: gameModeProps['value'] }) {
  const navigation = useNavigation<NavigationProp<GameStackParamList>>();

  const handleSelect = React.useCallback(() => {
    navigation.navigate('Lobby', { mode: value });
  }, [value, navigation]);

  return (
    <Pressable
      onPress={handleSelect}
      style={{
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 40,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'yellow',
      }}>
      <Text>{title}</Text>
    </Pressable>
  );
}
function LimitedTimeMode() {
  return (
    <View
      style={{
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        borderRadius: 10,
        height: 150,
        backgroundColor: 'white',
      }}>
      <Text>ModeSelectBox</Text>
    </View>
  );
}

export const ModeScreen = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <LimitedTimeMode />
      {/* <ModeSelectBox title="Head to Head" />
      <ModeSelectBox title="Full House" />
      <ModeSelectBox title="Private Match" />
      <ModeSelectBox title="Survival Match" /> */}
      {gameModes.map((mode, index) => (
        <ModeSelectBox key={index} title={mode.title} value={mode.value} />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: 'skyblue',
    gap: 20,
    paddingTop: 20,
  },
});
