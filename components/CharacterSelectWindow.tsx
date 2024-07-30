import { Ionicons } from '@expo/vector-icons';
import { charactersArray } from 'constants/characters';
import { Colors } from 'constants/colors';
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
      <View style={{ height: height * 0.75 }}>
        <Rive
          alignment={Alignment.BottomCenter}
          fit={Fit.Contain}
          url={url}
          style={{ width, backgroundColor: 'transparent' }}
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
      }}>
      <Pressable
        style={{
          height: 40,
          width: 40,
          borderRadius: 60,
          borderWidth: 2,
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.tertiary,
        }}
        onPress={scrollLeft}>
        <Ionicons name="chevron-back" size={24} color="white" />
      </Pressable>

      <Pressable
        style={{
          height: 40,
          width: 40,
          borderRadius: 60,
          borderWidth: 2,
          borderColor: 'white',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.tertiary,
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
          fontSize: 16,
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
    <View
      style={{
        flex: 1,
        position: 'relative',
        backgroundColor: 'transparent',
      }}>
      <View>
        {/* <CharacterConfirmButton confirmCharacter={confirmCharacter} /> */}
        <FlatList
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          scrollEnabled={false}
          contentContainerStyle={{ backgroundColor: 'transparent', height: height * 0.5 }}
          style={{ backgroundColor: 'transparent', maxHeight: height * 0.5 }}
          horizontal
          data={charactersArray}
          renderItem={({ item }) => <Character url={item.url} />}
        />
      </View>
      <View
        style={{
          backgroundColor: 'transparent',
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          paddingTop: 10,
          flex: 1,
          paddingBottom: 30,
        }}>
        {/* <CharacterInfoButtons /> */}
        <CharacterDescription character={activeCharacter} />
        <CharacterControlBar index={index} setIndex={setIndex} />
        <Button onPress={confirmCharacter} title="Confirm" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  characterContainer: { backgroundColor: 'transparent', alignItems: 'center' },
});
