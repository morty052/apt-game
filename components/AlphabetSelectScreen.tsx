import { useGameStore } from 'models/gameStore';
import React from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SocketProps } from 'types';

import { Button } from './ui/Button';

const AlphabetButton = ({ alphabet, onPress }: { alphabet: string; onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.alphabetButton}>
      <Text style={styles.alphabet}>{alphabet}</Text>
    </Pressable>
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
        <>
          <View style={{ gap: 20, justifyContent: 'center', flex: 1, paddingBottom: 100 }}>
            {/* HEADER TEXT */}
            <View style={{ paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: 'white', fontSize: 28, fontWeight: '700' }}>
                Select an alphabet
              </Text>
            </View>
            {/* ALPHABETS */}
            <View>
              <FlatList
                showsHorizontalScrollIndicator={false}
                horizontal
                contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}
                data={alphabets}
                renderItem={({ item }) => (
                  <AlphabetButton onPress={() => setLetter(item)} alphabet={item} />
                )}
              />
            </View>
            <Text style={{ color: 'white', fontSize: 50, textAlign: 'center', fontWeight: 'bold' }}>
              {letter}
            </Text>
          </View>
          <View style={{ paddingHorizontal: 10 }}>
            <Button onPress={confirmLetter} title="Confirm" />
          </View>
        </>
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
    backgroundColor: '#00c4ee',
    gap: 20,
    paddingTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 30,
  },
  alphabetButton: {
    height: 80,
    width: 80,
    backgroundColor: 'gold',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
  },
  alphabet: {
    fontSize: 36,
    fontWeight: 'bold',
  },
});
