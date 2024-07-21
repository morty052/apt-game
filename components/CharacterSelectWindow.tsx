import { Ionicons } from '@expo/vector-icons';
import { charactersArray } from 'constants/characters';
import { useAppStore } from 'models/appStore';
import React from 'react';
import { FlatList, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Rive, { Alignment, Fit } from 'rive-react-native';
import { CharacterProps } from 'types';
import { Button } from './ui/Button';

export function Character({ url }: { url: string }) {
  const { height, width } = useWindowDimensions();

  return (
    <View style={styles.characterContainer}>
      <View style={{ height: height * 0.65 }}>
        <Rive
          alignment={Alignment.BottomCenter}
          fit={Fit.Contain}
          url={url}
          style={{ width: width * 0.95, backgroundColor: 'transparent' }}
        />
      </View>
    </View>
  );
}

function CharacterControlBar({
  index,
  setIndex,
}: {
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const scrollRight = React.useCallback(() => {
    if (index + 1 > charactersArray.length - 1) {
      setIndex(0);
      return;
    }

    setIndex((prev) => prev + 1);
  }, [index, setIndex]);

  const scrollLeft = React.useCallback(() => {
    if (index - 1 < 0) {
      setIndex(charactersArray.length - 1);
      return;
    }

    setIndex((prev) => prev - 1);
  }, [index, setIndex]);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // backgroundColor: 'gold',
        borderRadius: 20,
        height: 60,
      }}>
      <Pressable
        style={{
          height: 60,
          width: 60,
          borderRadius: 60,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'gold',
        }}
        onPress={scrollLeft}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Pressable
        style={{
          height: 60,
          width: 60,
          borderRadius: 60,
          borderWidth: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'gold',
        }}
        onPress={scrollRight}>
        <Ionicons name="chevron-forward" size={24} color="white" />
      </Pressable>
    </View>
  );
}

function CharacterDescription({ character }: { character: CharacterProps }) {
  return (
    <View>
      <Text
        style={{
          fontSize: 24,
          fontFamily: 'Crispy-Tofu',
          marginBottom: 10,
        }}>
        {character.name}
      </Text>
      <Text
        style={{
          fontSize: 20,
          fontFamily: 'Crispy-Tofu',
        }}>
        {character.description}
      </Text>
    </View>
  );
}

function CharacterInfoButtons() {
  return (
    <View style={{ flexDirection: 'row', columnGap: 10, marginLeft: -5 }}>
      <View style={{ height: 60, width: 60, borderRadius: 60, borderWidth: 1 }} />
      <View style={{ height: 60, width: 60, borderRadius: 60, borderWidth: 1 }} />
      <View style={{ height: 60, width: 60, borderRadius: 60, borderWidth: 1 }} />
    </View>
  );
}

function CharacterConfirmButton({ confirmCharacter }: { confirmCharacter: () => void }) {
  return (
    <Pressable
      onPress={confirmCharacter}
      style={{
        height: 60,
        width: 60,
        borderRadius: 60,
        borderWidth: 1,
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: 'rgba(255,255,255,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
      }}>
      <Ionicons name="checkmark" size={30} color="green" />
    </Pressable>
  );
}

export default function CharacterSelectWindow({ navigation }: { navigation: any }) {
  const [index, setIndex] = React.useState(0);

  const { height, width } = useWindowDimensions();
  const flatListRef = React.useRef<FlatList>(null);

  const { setCharacter } = useAppStore();

  const activeCharacter = React.useMemo(() => charactersArray[index], [index]);

  const scroll = (index: number) => {
    if (flatListRef.current) {
      flatListRef.current.scrollToIndex({ index, animated: true });
    }
  };

  const confirmCharacter = () => {
    setCharacter(activeCharacter);
    // setSelectingCharacter(false);
    navigation.goBack();
  };

  React.useEffect(() => {
    scroll(index);
  }, [index]);

  return (
    <View style={{ flex: 1, borderWidth: 1 }}>
      <SafeAreaView
        style={{
          flex: 1,
          position: 'relative',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
        }}>
        <View>
          {/* <CharacterConfirmButton confirmCharacter={confirmCharacter} /> */}
          <FlatList
            ref={flatListRef}
            scrollEnabled={false}
            contentContainerStyle={{ backgroundColor: 'transparent', height: height * 0.65 }}
            style={{ backgroundColor: 'transparent', maxHeight: height * 0.65 }}
            horizontal
            data={charactersArray}
            renderItem={({ item }) => <Character url={item.url} />}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: 'white',
            justifyContent: 'space-between',
            padding: 10,
          }}>
          {/* <CharacterInfoButtons /> */}
          <CharacterDescription character={activeCharacter} />
          <CharacterControlBar index={index} setIndex={setIndex} />
          <Button onPress={confirmCharacter} title="Confirm" />
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  characterContainer: { backgroundColor: 'transparent', alignItems: 'center' },
});
