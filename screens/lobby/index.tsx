import { NavigationProp, RouteProp } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import { GameStackParamList } from 'Routes/GameStack';
import Avatar, { AvatarObject } from 'components/Avatar';
import CharacterSelectButton from 'components/action-buttons/CharacterSelectButton';
import AdFreeBundle from 'components/cards/AdfreeBundle';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { eq } from 'drizzle-orm';
import { LinearGradient } from 'expo-linear-gradient';
import { useDB } from 'hooks/useDb';
import { useRefreshOnFocus } from 'hooks/useRefreshOnFocus';
import { useAppStore } from 'models/appStore';
import { useGameStore } from 'models/gameStore';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View, Image, ScrollView, Pressable } from 'react-native';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';

import { getHost, getPlayers } from '../../api/index';
import friendsIcon from '../../assets/icons/friends-icon--min.png';
import * as SchemaProps from '../../schema';

const delay = () => {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, 1000);
  });
};

const getlobby = async ({ guests, room }: { guests: string[]; room: string }) => {
  await delay();
  const guestsData = await getPlayers(guests);
  const host = await getHost(room);
  return {
    guestsData,
    host,
  };
};

const LobbyInfoCard = () => {
  return (
    <LinearGradient
      colors={[Colors.backGround, 'lightblue']}
      style={{
        padding: 10,
        height: 120,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
      }}>
      <Image resizeMode="contain" style={{ height: 100, width: 100 }} source={friendsIcon} />
      <View style={{ gap: 10 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ color: 'white' }}>Private Match</Text>
          <Text style={{ fontSize: 12, color: 'white' }}>Waiting for other players</Text>
        </View>
      </View>
    </LinearGradient>
  );
};

function Lobby({
  navigation,
  route,
}: {
  navigation: NavigationProp<GameStackParamList>;
  route: RouteProp<GameStackParamList, 'Lobby'>;
}) {
  const [guestList, setGuestList] = useState<{ username: string; avatar: AvatarObject }[]>([]);
  const [host, setHost] = useState<{ username: string; avatar: AvatarObject } | null>(null);
  const { mode, private_room, guests } = route.params;
  const { socket } = React.useContext(SocketContext);
  const { initGame } = useGameStore();

  const DB = useDB();

  // const { character } = useAppStore();

  const { isLoading, refetch, isError, isFetching } = useQuery({
    queryKey: ['lobby_data'],
    queryFn: async () => {
      const { guestsData, host } = await getlobby({
        guests: guests as string[],
        room: private_room as string,
      });
      setGuestList(guestsData);
      setHost(host.host);
      return guestsData;
    },
  });

  useRefreshOnFocus(refetch);

  function handleStartMatch(queue: playerProps[], room: string) {
    initGame({ queue, room });
    navigation.navigate('GameScreen', { room: private_room as string });
  }

  useEffect(() => {
    socket?.on('PLAYER_JOINED', (data) => {
      console.log('player joined', data);
    });

    socket?.on('PLAYER_LEFT', async (data) => {
      const { username } = data;
      const isUserLeft = username === getItem('USERNAME');
      if (isUserLeft) {
        console.log('you left', username);

        await DB.delete(SchemaProps.Invites)
          .where(eq(SchemaProps.Invites.game_id, private_room as string))
          .returning();
        useAppStore.setState((state) => ({
          invites: state.invites - 1,
        }));
        navigation.goBack();
      } else {
        console.log('user left', username);
      }
    });

    socket?.on('START_PRIVATE_MATCH', (data: { queue: playerProps[]; room: string }) => {
      console.log(data);
      handleStartMatch(data.queue, data.room);
    });

    return () => {
      socket?.off('PLAYER_JOINED');
      socket?.off('PLAYER_LEFT');
      socket?.off('START_PRIVATE_MATCH');
    };
  }, [socket]);

  if (isLoading || isFetching) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size={200} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>omoooooo</Text>
      </View>
    );
  }

  console.log(guestList);

  return (
    <View style={styles.container}>
      <LobbyInfoCard />
      <ScrollView contentContainerStyle={{ gap: 20, flex: 1 }}>
        <View style={[styles.playerCard]}>
          <Avatar avatarObject={host?.avatar as AvatarObject} />
          <View
            style={{
              flex: 1,
              justifyContent: 'space-between',
              flexDirection: 'row',
              alignItems: 'center',
            }}>
            <Text style={{ fontSize: 16 }}>{host?.username}</Text>
            <Image
              style={{ height: 50, width: 50 }}
              source={{
                uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1721898799/wimoptoz8qwzcp5s40tf.png',
              }}
            />
          </View>
        </View>
        {guestList?.map((guest) => {
          const isUser = guest?.username === getItem('USERNAME');
          return (
            <View style={styles.playerCard} key={guest.username}>
              {guest.avatar && <Avatar avatarObject={guest?.avatar} />}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-between',
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{ fontSize: 16 }}>{guest.username}</Text>
                {isUser && (
                  <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <CharacterSelectButton />
                    <Pressable
                      onPress={() =>
                        socket?.emit('EXIT_PRIVATE_LOBBY', {
                          private_room,
                          guest: {
                            username: getItem('USERNAME'),
                          },
                        })
                      }>
                      <Image
                        style={{ height: 55, width: 55 }}
                        source={{
                          uri: 'https://res.cloudinary.com/dg6bgaasp/image/upload/v1723159925/puz1ukbqkfyzcpqybgkh.png',
                        }}
                      />
                    </Pressable>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>
      <AdFreeBundle />
    </View>
  );
}

export default Lobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.plain,
    gap: 20,
    paddingVertical: 20,
    position: 'relative',
  },
  playerCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingVertical: 5,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      height: 2,
      width: 0,
    },
    marginHorizontal: 5,
  },
});
