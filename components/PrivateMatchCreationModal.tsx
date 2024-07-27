import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { BackButton } from 'components/ui/BackButton';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import React, { useMemo, useState } from 'react';
import { FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { friend } from 'types';
import FriendCard from './cards/FriendCard';
import Avatar from './Avatar';

const Header = ({ handleClose }: { handleClose: () => void }) => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <BackButton onPress={handleClose} />
      <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, flex: 1 }}>
        Create match
      </Text>
      <Pressable
        onPress={() => {}}
        style={{
          height: 40,
          width: 40,
          backgroundColor: 'yellow',
          borderRadius: 40,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Ionicons name="help" size={24} color="black" />
      </Pressable>
    </View>
  );
};

export default function PrivateMatchCreationModal({
  open,
  handleClose,
  friends,
}: {
  open: boolean;
  handleClose: () => void;
  friends?: friend[];
}) {
  const [query, setquery] = useState('');
  const [invitedFriends, setInvitedFriends] = useState<friend[]>([]);
  const navigation = useNavigation<any>();

  const searchResults = useMemo(() => {
    if (!query) {
      return friends;
    }
    const results = friends?.filter((friend) =>
      friend.username.toLowerCase().includes(query.toLowerCase())
    );
    return results;
  }, [query, friends]);

  return (
    <Modal animationType="slide" statusBarTranslucent visible={open}>
      <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
        <SafeAreaView style={{ flex: 1 }}>
          <View style={styles.container}>
            <View style={{ gap: 20 }}>
              <Header handleClose={handleClose} />
              <TextInput
                value={query}
                onChangeText={setquery}
                style={styles.searchInput}
                placeholder="Search friends"
              />
              <FlatList
                horizontal
                data={invitedFriends}
                renderItem={({ item }) => <Avatar avatarObject={item.avatar} />}
              />
              <View style={{ gap: 10 }}>
                {searchResults?.map((friend, index) => (
                  <FriendCard key={friend.username} player={friend}>
                    <View
                      style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                      <Button
                        onPress={() => {
                          if (invitedFriends.includes(friend)) {
                            setInvitedFriends(invitedFriends.filter((f) => f !== friend));
                            return;
                          }
                          setInvitedFriends([...invitedFriends, friend]);
                        }}
                        style={{
                          flex: 1,
                          backgroundColor: invitedFriends.includes(friend) ? 'red' : 'gold',
                        }}
                        title={invitedFriends.includes(friend) ? 'Remove' : 'Add to match'}
                      />
                    </View>
                  </FriendCard>
                ))}
              </View>
            </View>
            <Button
              title="Create match"
              onPress={() =>
                navigation.navigate('Lobby', { friends: invitedFriends, mode: 'PRIVATE_MATCH' })
              }
            />
          </View>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
    justifyContent: 'space-between',
    paddingBottom: 20,
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
});
