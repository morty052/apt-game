import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import FriendCard from 'components/cards/FriendCard';
import PrivateMatchCreationModal from 'components/PrivateMatchCreationModal';
import { BackButton } from 'components/ui/BackButton';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useCallback, useState } from 'react';
import { Pressable, View, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { friend } from 'types';
import { getItem } from 'utils/storage';
import { getSearchResults, getUserFriends, sendFriendRequest } from 'utils/supabase';

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

const CreateMatchCard = ({ onPress }: { onPress: () => void }) => {
  return (
    <Pressable onPress={onPress} style={styles.createMatchCard}>
      <View style={{ paddingTop: 10 }}>
        <Text>Create Private match</Text>
        <Text style={{ fontSize: 14 }}>create a private match with up to six friends</Text>
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

  const { data, isLoading } = useQuery({
    queryKey: ['friendlist'],
    queryFn: () => getUserFriends(getItem('USERNAME') as string),
  });

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

  if (isLoading) {
    return null;
  }

  return (
    <>
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
            <CreateMatchCard onPress={() => setCreatingMatch(true)} />
            {!query && <FriendsUi friends={data?.friends} />}
            {query && <Button title="Search Friends" onPress={searchUsers} />}
            {results && <ResultsUi onPress={() => addFriendMutation(query)} results={results} />}
          </View>
        </SafeAreaView>
      </View>
      <PrivateMatchCreationModal
        open={creatingMatch}
        handleClose={() => setCreatingMatch(false)}
        friends={data?.friends}
      />
    </>
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
  createMatchCard: {
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
});
