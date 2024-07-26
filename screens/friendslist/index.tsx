import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import { BackButton } from 'components/ui/BackButton';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useCallback, useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { playerProps } from 'types';
import { getItem } from 'utils/storage';
import {
  acceptFriendRequest,
  getPlayers,
  getSearchResults,
  getUserFriends,
  sendFriendRequest,
} from 'utils/supabase';

const Stack = createStackNavigator();

const FriendRequestsBadge = ({ requests }: { requests: number }) => {
  return (
    <View style={styles.badge}>
      <Text
        style={{
          fontSize: 14,
          color: 'white',
        }}>
        {requests}
      </Text>
    </View>
  );
};

const FriendCard = ({
  player,
  online,
}: {
  player: { username: string; totalscore: number; avatar: AvatarObject };
  online: boolean;
}) => {
  return (
    <Pressable style={styles.playerRankingCard}>
      <Avatar avatarObject={player.avatar} />
      <View style={{ paddingTop: 10 }}>
        <Text>{player.username}</Text>
        <Text>{player.totalscore}</Text>
      </View>
    </Pressable>
  );
};

const PlayerResultItem = ({
  player,
  online,
  onPress,
}: {
  player: { username: string; totalscore: number; avatar: AvatarObject };
  online: boolean;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.playerRankingCard}>
      <Avatar avatarObject={player.avatar} />
      <View style={{ paddingTop: 10 }}>
        <Text>{player.username}</Text>
        <Text>{player.totalscore}</Text>
      </View>
    </Pressable>
  );
};

function Header({ friendRequests }: { friendRequests: string[] }) {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, flex: 1 }}>Friends</Text>
      <Pressable
        onPress={() => navigation.navigate('FriendRequests', { friendRequests })}
        style={{
          height: 40,
          width: 40,
          backgroundColor: 'yellow',
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <Ionicons name="mail" size={24} color="black" />
        <FriendRequestsBadge requests={friendRequests?.length} />
      </Pressable>
    </View>
  );
}

function FriendsUi({
  friends,
}: {
  friends: { username: string; totalscore: number; avatar: AvatarObject }[] | null;
}) {
  return (
    <View style={{ gap: 10 }}>
      {friends?.map((friend, index) => (
        <FriendCard key={friend.username} player={friend} online={false} />
      ))}
    </View>
  );
}
function ResultsUi({
  results,
  onPress,
}: {
  results: { username: string; totalscore: number; avatar: AvatarObject }[] | null;
  onPress: () => void;
}) {
  return (
    <View style={{ gap: 10 }}>
      {results?.map((result) => (
        <PlayerResultItem onPress={onPress} key={result.username} player={result} online={false} />
      ))}
    </View>
  );
}

function FriendsHomeScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<null | any[]>(null);

  const { data, isLoading } = useQuery({
    queryKey: ['friendlist'],
    queryFn: () => getUserFriends(getItem('USERNAME') as string),
  });

  const searchUsers = useCallback(async () => {
    const { data: users, error } = await getSearchResults(query);

    console.log({ users, error });
    if (error) {
      console.error(error);
      setResults(null);
    }
    setResults(users);
  }, [setResults, query]);

  const addFriendMutation = async (receiverUsername: string) => {
    const senderUsername = getItem('USERNAME');
    const { data, error } = await sendFriendRequest({
      receiverUsername,
      senderUsername: senderUsername as string,
    });

    if (error) {
      console.error(error);
    }

    console.log(data);
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <Header friendRequests={data?.friendRequests} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="rgba(255,255,255,0.8)"
            cursorColor="white"
            placeholder="Search Friend or players"
            style={styles.searchInput}
          />
          {!query && <FriendsUi friends={data?.friends} />}

          {query && <Button title="Search Friends" onPress={searchUsers} />}

          {results && <ResultsUi onPress={() => addFriendMutation(query)} results={results} />}
        </View>
      </SafeAreaView>
    </View>
  );
}

function FriendRequestsScreen({ route, navigation }: any) {
  const [requests, setRequests] = useState([]);
  const { friendRequests } = route.params;

  const queryClient = useQueryClient();

  const { data: senders, isLoading } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      const data = await getPlayers(friendRequests);
      setRequests(data);
      return data;
    },
  });

  const { mutate } = useMutation({
    mutationFn: ({
      receiverUsername,
      senderUsername,
    }: {
      receiverUsername: string;
      senderUsername: string;
    }) => acceptFriendRequest({ receiverUsername, senderUsername }),
    mutationKey: ['acceptFriendRequest'],
    onSuccess: (data) => {
      console.log('friend request accepted');
      setRequests(data.filteredRequests);
      queryClient.invalidateQueries({ queryKey: ['friendlist'] });
    },
  });

  const acceptFriend = async (senderUsername: string) => {
    mutate({ receiverUsername: getItem('USERNAME') as string, senderUsername });
  };

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 20, flex: 1 }}>
              Friend Requests
            </Text>
            <Pressable
              onPress={() => navigation.navigate('FriendRequests', { friendRequests })}
              style={{
                height: 40,
                width: 40,
                backgroundColor: 'yellow',
                borderRadius: 40,
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}>
              <Ionicons name="mail" size={24} color="black" />
              <FriendRequestsBadge requests={friendRequests?.length} />
            </Pressable>
          </View>
          {requests?.map((sender: { username: string; avatar: AvatarObject }) => (
            <View
              style={{
                padding: 10,
                backgroundColor: 'white',
                borderRadius: 10,
                gap: 10,
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: {
                  height: 2,
                  width: 0,
                },
              }}
              key={sender.username}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 10,
                }}>
                <Avatar avatarObject={sender.avatar} />
                <View>
                  <Text>{sender.username}</Text>
                  <Text style={{ color: 'gray', fontSize: 14 }}>Wants to be your friend</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 20,
                }}>
                <Button
                  style={{ flex: 1 }}
                  title="Accept"
                  onPress={() => acceptFriend(sender.username)}
                />
                <Button
                  style={{ flex: 1, backgroundColor: 'red' }}
                  title="Reject"
                  onPress={() => {}}
                />
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}

export default function FriendListScreen({ navigation }: any) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="FriendsHomeScreen" component={FriendsHomeScreen} />
      <Stack.Screen name="FriendRequests" component={FriendRequestsScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.backGround,
    gap: 30,
    paddingTop: 20,
  },
  playerRankingCard: {
    backgroundColor: Colors.secondary,
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 5,
    position: 'relative',
  },
  searchInput: {
    height: 50,
    borderColor: 'white',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    // textAlign: 'center',
    fontFamily: 'Crispy-Tofu',
    color: 'white',
  },
  badge: {
    position: 'absolute',
    top: -10,
    right: -5,
    backgroundColor: 'red',
    padding: 5,
    zIndex: 1,
    height: 24,
    width: 24,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    shadowColor: 'black',
  },
});
