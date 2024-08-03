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

export function Character({ url, height }: { url: string; height?: number }) {
  const { height: screenHeight, width } = useWindowDimensions();

  return (
    <View style={styles.characterContainer}>
      <View style={{ height: height || screenHeight * 0.75 }}>
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
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        borderRadius: 20,
        zIndex: 40,
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
    <View style={{ gap: 15 }}>
      <Text
        style={{
          fontSize: 24,
          fontFamily: 'Crispy-Tofu',
          color: 'white',
        }}>
        {character.name}
      </Text>
      <Text
        style={{
          fontSize: 17,
          fontFamily: 'Crispy-Tofu',
          color: Colors.plain,
        }}>
        {character.description}
      </Text>
    </View>
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
        paddingBottom: 10,
        gap: 20,
      }}>
      <View>
        <CharacterControlBar index={index} setIndex={setIndex} />
        <FlatList
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          scrollEnabled={false}
          contentContainerStyle={{ backgroundColor: 'transparent', height: height * 0.6 }}
          style={{ backgroundColor: 'transparent', maxHeight: height * 0.6 }}
          horizontal
          data={charactersArray}
          renderItem={({ item }) => <Character height={height * 0.6} url={item.url} />}
        />
      </View>
      <View
        style={{
          backgroundColor: Colors.backGround,
          justifyContent: 'space-between',
          paddingHorizontal: 5,
          paddingBottom: 10,
          paddingTop: 15,
          flex: 1,
          width: width * 0.98,
          alignSelf: 'center',
          borderRadius: 20,
        }}>
        {/* <CharacterInfoButtons /> */}
        <CharacterDescription character={activeCharacter} />
        <Button onPress={confirmCharacter} title="Confirm" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  characterContainer: { backgroundColor: 'transparent', alignItems: 'center' },
});
