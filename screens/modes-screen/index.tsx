import { NavigationProp, useNavigation } from '@react-navigation/native';
import { GameStackParamList } from 'Routes/GameStack';
import { Colors } from 'constants/colors';
import { useAppStore } from 'models/appStore';

import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Text } from 'components/ui/Text';
import { BackButton } from 'components/ui/BackButton';
import { Ionicons } from '@expo/vector-icons';

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

function ModeSelectBox({
  title,
  value,
  setSelectingMode,
}: {
  title: string;
  value: gameModeProps['value'];
  setSelectingMode: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  // const handleSelect = React.useCallback(() => {
  //   navigation.navigate('Lobby', { mode: value });
  // }, [value, navigation]);

  const handleSelect = () => {
    useAppStore.setState(() => ({ mode: value }));
    setSelectingMode(false);
  };

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
      <Text>Limited Time Mode</Text>
    </View>
  );
}

export const ModeSelectWindow = ({
  selectingMode,
  setSelectingMode,
}: {
  selectingMode: boolean;
  setSelectingMode: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <View style={styles.container}>
      <Pressable
        style={{ height: 40, width: 40, backgroundColor: 'red' }}
        onPress={() => setSelectingMode(false)}
      />
      <LimitedTimeMode />
      {/* <ModeSelectBox title="Head to Head" />
      <ModeSelectBox title="Full House" />
      <ModeSelectBox title="Private Match" />
      <ModeSelectBox title="Survival Match" /> */}
      {gameModes.map((mode, index) => (
        <ModeSelectBox
          setSelectingMode={setSelectingMode}
          key={index}
          title={mode.title}
          value={mode.value}
        />
      ))}
    </View>
  );
};

export const ModeScreen = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, flex: 1 }}>
              Game Mode
            </Text>
            <Pressable
              style={{
                height: 40,
                width: 40,
                backgroundColor: 'yellow',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons name="help" size={24} color="black" />
            </Pressable>
          </View>
          <LimitedTimeMode />
          {gameModes.map((mode, index) => (
            <ModeSelectBox
              setSelectingMode={() => {}}
              key={index}
              title={mode.title}
              value={mode.value}
            />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ModeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.backGround,
    gap: 20,
    paddingTop: 20,
  },
});
