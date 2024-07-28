import { useQuery } from '@tanstack/react-query';
import BottomNav from 'components/BottomNav';
import { Character } from 'components/CharacterSelectWindow';
import LoadingScreen from 'components/LoadingScreen';
import MatchMakingStatusBar from 'components/MatchMakingStatusBar';
import TopNav from 'components/TopNav';
import CharacterSelectButton from 'components/action-buttons/CharacterSelectButton';
import GameModeButton from 'components/action-buttons/GameModeButton';
import HelpButton from 'components/action-buttons/HelpButton';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React, { useContext } from 'react';
import { StyleSheet, View, ImageBackground, useWindowDimensions, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { inviteProps, playerProps } from 'types';
import { getItem } from 'utils/storage';
import { getInvites } from 'utils/supabase';

function RightNav() {
  return (
    <View style={styles.actionButtonsContainer}>
      <CharacterSelectButton />
      <GameModeButton />
      <HelpButton />
    </View>
  );
}

const Arc = () => {
  const { width, height } = useWindowDimensions();
  const circleWidth = width * 2;
  return (
    <View
      style={{
        width: circleWidth,
        height: circleWidth,
        backgroundColor: 'rgb(255,165,0)',
        position: 'absolute',
        elevation: 10,
        // borderRadius: circleWidth,
        zIndex: -1,
        transform: [{ translateY: -height * 0.8 }, { translateX: -width / 2 }],
      }}
    />
  );
};

function ModeCard() {
  return <Pressable style={styles.modeCard}></Pressable>;
}

export const Home = () => {
  const [findingMatch, setFindingMatch] = React.useState(false);

  const { socket } = useContext(SocketContext);

  const { initGame } = useGameStore();
  const { character, mode, connected, setMatchFound } = useAppStore();

  const { isLoading } = useQuery({
    queryKey: ['matchInvites'],
    queryFn: async () => {
      const username = getItem('USERNAME');
      const data = await getInvites(username as string);
      useAppStore.setState(() => ({ invites: data }));
      return data;
    },
  });

  const handleFindMatch = React.useCallback(() => {
    if (findingMatch) {
      return;
    }
    setFindingMatch(true);
    socket?.emit(
      'FIND_MATCH',
      {
        lobbyType: mode,
        player: {
          username: getItem('USERNAME'),
          character: character.name,
        },
      },
      (data: { matchId?: string }) => {
        console.log('joined queue');
      }
    );
  }, [character, mode, socket, findingMatch, setFindingMatch]);

  function handleMatchFound(queue: playerProps[], room: string) {
    //* save current player room and opponents to state
    initGame({ queue, room });

    // open match found modal
    setMatchFound(true);

    setFindingMatch(false);
    // navigation.navigate('GameScreen', { room });
  }

  React.useEffect(() => {
    socket?.on('MATCH_FOUND', (data: { queue: playerProps[]; room: string }) => {
      handleMatchFound(data.queue, data.room);
    });
  }, [socket]);

  if (!connected || isLoading) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <Arc />
      <SafeAreaView style={{ flex: 1 }}>
        <TopNav />
        <View style={styles.innerContainer}>
          <ModeCard />
          {/* <RightNav /> */}
          {/* <Character url={character.url} /> */}
          {/* {!findingMatch && <BottomNav findingMatch={findingMatch} onPressPlay={handleFindMatch} />} */}
          {findingMatch && <MatchMakingStatusBar />}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.plain,
    paddingBottom: 0,
    paddingHorizontal: 5,
    position: 'relative',
  },
  innerContainer: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 0,
    // backgroundColor: 'red',
    position: 'relative',
  },
  actionButton: {
    height: 50,
    width: 50,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 100,
    right: 10,
    width: 60,
    backgroundColor: 'rgba(255,255,255,0.5)',
    // borderWidth: 1,
    borderColor: 'black',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 10,
    borderRadius: 20,
  },
  modeCard: {
    width: '100%',
    backgroundColor: 'white',
    height: 100,
    borderRadius: 20,
  },
});
