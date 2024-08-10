import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import LoadingScreen from 'components/LoadingScreen';
import PrivateMatchCreationModal from 'components/PrivateMatchCreationModal';
import FriendCard from 'components/cards/FriendCard';
import { BackButton } from 'components/ui/BackButton';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useRefreshOnFocus } from 'hooks/useRefreshOnFocus';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pressable, View, StyleSheet, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { friend } from 'types';
import { getItem } from 'utils/storage';
import { getSearchResults, getUserFriends, sendFriendRequest } from 'utils/supabase';

import friendsIcon from '../../../assets/icons/friends-icon--min.png';

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

function FriendsUi({ friends }: { friends: friend[] | null }) {
  return (
    <View style={{ gap: 10 }}>
      {friends?.map((friend, index) => <FriendCard key={friend.username} player={friend} />)}
    </View>
  );
}

function Header({ friendRequests }: { friendRequests: string[] }) {
  const navigation = useNavigation<any>();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <BackButton onPress={() => navigation.goBack()} />
      <Text style={{ textAlign: 'center', color: 'black', fontSize: 24, flex: 1 }}>Friends</Text>
      <Pressable
        onPress={() => navigation.navigate('FriendRequests', { friendRequests })}
        style={{
          height: 40,
          width: 40,
          backgroundColor: Colors.tertiary,
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
          position: 'relative',
        }}>
        <Ionicons name="mail" size={24} color="white" />
        {friendRequests?.length > 0 && <FriendRequestsBadge requests={friendRequests?.length} />}
      </Pressable>
    </View>
  );
}

const CreateMatchCard = ({ onPress }: { onPress: () => void }) => {
  return (
    <LinearGradient colors={[Colors.backGround, 'steelblue']} style={styles.createMatchCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            width: 50,
            height: 50,
            borderRadius: 45,
            backgroundColor: 'white',
          }}>
          <Image style={{ height: 45, width: 45 }} source={friendsIcon} />
        </View>
        <View style={{ flex: 1, gap: 10 }}>
          <Text style={{ fontSize: 20, color: 'white' }}>Private match</Text>
          <Text style={{ fontSize: 14, color: 'white' }}>
            create a private match with up to six friends
          </Text>
        </View>
      </View>
      <Button onPress={onPress} title="Create" />
    </LinearGradient>
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
    <View style={styles.playerRankingCard}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 0 }}>
        <Avatar avatarObject={player.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16 }}>{player.username}</Text>
        </View>
        <Button style={styles.addButton} onPress={onPress}>
          <Ionicons name="add" size={24} color="white" />
        </Button>
      </View>
    </View>
  );
};

export function ResultsUi({
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

export function FriendsHomeScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<null | any[]>(null);
  const [creatingMatch, setCreatingMatch] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['friendlist'],
    queryFn: () => getUserFriends(getItem('USERNAME') as string),
  });

  useRefreshOnFocus(refetch);

  const friends = useMemo(() => {
    if (!query) {
      return data?.friends;
    }
    return data?.friends.filter((friend: any) =>
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, data?.friends]);

  const searchUsers = useCallback(async () => {
    const { data: users, error } = await getSearchResults(query);

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

  useEffect(() => {
    if (!query) {
      return;
    }

    const searchDebounce = setTimeout(() => {
      searchUsers().then(() => console.log('done'));
    }, 500);

    return () => {
      clearTimeout(searchDebounce);
    };
  }, [query, friends]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <View style={{ flex: 1, backgroundColor: Colors.plain }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <Header friendRequests={data?.friendRequests} />
            <TextInput
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                if (text.length === 0) {
                  setResults(null);
                }
              }}
              placeholderTextColor="black"
              cursorColor="black"
              placeholder="Search Friend or players"
              style={styles.searchInput}
            />
            {!query && <CreateMatchCard onPress={() => setCreatingMatch(true)} />}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 15 }}>{query ? 'Results' : 'Friends'}</Text>
              <Text style={{ fontSize: 15 }}>{query ? results?.length : friends?.length}</Text>
            </View>
            {results && <ResultsUi onPress={() => addFriendMutation(query)} results={results} />}
            <FriendsUi friends={friends} />
          </View>
        </SafeAreaView>
      </View>
      <PrivateMatchCreationModal
        open={creatingMatch}
        handleClose={() => setCreatingMatch(false)}
        friends={data?.friends}
      />
      <StatusBar style="dark" />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.plain,
    gap: 30,
    paddingTop: 20,
  },
  playerRankingCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    gap: 10,
  },
  createMatchCard: {
    backgroundColor: Colors.secondary,
    paddingHorizontal: 10,
    borderRadius: 10,
    elevation: 15,
    gap: 15,
    paddingVertical: 20,
  },
  searchInput: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    borderColor: Colors.gray,
    fontFamily: 'Crispy-Tofu',
    color: 'black',
    backgroundColor: Colors.lightBlack,
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
  onlineIndicator: {
    position: 'absolute',
    top: -10,
    right: -5,
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
  addButton: {
    height: 35,
    padding: 0,
    width: 80,
    backgroundColor: Colors.backGround,
    borderColor: 'skyblue',
  },
});
