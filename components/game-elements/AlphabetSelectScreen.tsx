import { useGameStore } from 'models/gameStore';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable, Dimensions } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SocketProps } from 'types';

import { Button } from '../ui/Button';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const AlphabetButton = ({
  alphabet,
  onPress,
  activeLetter,
}: {
  alphabet: string;
  onPress: () => void;
  activeLetter: string;
}) => {
  const isSelected = React.useMemo(() => alphabet === activeLetter, [activeLetter]);
  const buttonColor = useSharedValue('white');

  const buttonStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withSpring(isSelected ? 'gold' : buttonColor.value),
    };
  });

  const textStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(isSelected ? 1.1 : 1),
        },
        {
          rotateZ: withSpring(isSelected ? '-10deg' : '0deg'),
        },
      ],
    };
  });

  // React.useEffect(() => {
  //   if (isSelected) {
  //     buttonColor.value = withSpring('gold', { damping: 15 });
  //   } else {
  //     buttonColor.value = 'white';
  //   }
  // }, [isSelected]);

  return (
    <AnimatedPressable
      onPress={onPress}
      style={[styles.alphabetButton, { borderColor: 'white' }, buttonStyles]}>
      <Animated.Text style={[styles.alphabet, textStyles]}>{alphabet}</Animated.Text>
    </AnimatedPressable>
  );
};

const AlphabetSelectScreen = ({ socket, room }: { socket: SocketProps | null; room: string }) => {
  const [letter, setLetter] = React.useState('');
  const { alphabets, currentTurn, player } = useGameStore();

  const { turn } = player;

  const confirmLetter = () => {
    socket?.emit('SELECT_LETTER', { room, letter });
  };

  return (
    <View style={styles.alphabetScreencontainer}>
      {currentTurn === turn && (
        <SafeAreaView style={{ flex: 1 }}>
          <View
            style={{
              rowGap: 15,
              justifyContent: 'space-between',
              flex: 1,
              paddingBottom: 0,
              paddingHorizontal: 10,
            }}>
            {/* HEADER TEXT */}
            <Text
              style={{
                color: 'white',
                fontSize: 28,
                fontFamily: 'Crispy-Tofu',
                textAlign: 'center',
              }}>
              Select an alphabet
            </Text>

            <View>
              {/* ALPHABETS */}
              <FlatList
                showsVerticalScrollIndicator={false}
                numColumns={4}
                columnWrapperStyle={{ gap: 10 }}
                contentContainerStyle={{
                  rowGap: 10,
                  paddingHorizontal: 10,
                  alignItems: 'center',
                  backgroundColor: 'transparent',
                }}
                data={alphabets}
                renderItem={({ item }) => (
                  <AlphabetButton
                    activeLetter={letter}
                    onPress={() => setLetter(item)}
                    alphabet={item}
                  />
                )}
              />
            </View>
            <Button onPress={confirmLetter} title="Confirm" />
          </View>
        </SafeAreaView>
      )}
      {currentTurn !== turn && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>Waiting for new letter</Text>
        </View>
      )}
    </View>
  );
};

export default AlphabetSelectScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    paddingTop: 10,
  },
  gameScreen: {
    flex: 1,
  },
  alphabetScreencontainer: {
    flex: 1,
    backgroundColor: 'pink',
    gap: 20,
    paddingTop: 20,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  alphabetButton: {
    height: 80,
    width: Dimensions.get('window').width / 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
  },
  alphabet: {
    fontSize: 40,
    fontFamily: 'Crispy-Tofu',
  },
});
