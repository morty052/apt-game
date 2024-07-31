import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BackButton } from 'components/ui/BackButton';
import { Colors } from 'constants/colors';
import { useState } from 'react';
import { Pressable, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { acceptFriendRequest, getPlayers } from 'utils/supabase';
import { Text } from 'components/ui/Text';
import { getItem } from 'utils/storage';
import { Ionicons } from '@expo/vector-icons';
import Avatar, { AvatarObject } from 'components/Avatar';
import { Button } from 'components/ui/Button';

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

export function FriendRequestsScreen({ route, navigation }: any) {
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
          <View
            style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 200 }}>
            {!isLoading && friendRequests.length === 0 && (
              <Text
                style={{
                  color: 'white',
                  textAlign: 'center',
                  marginTop: 20,
                }}>
                No new friend requests
              </Text>
            )}
          </View>
        </View>
      </SafeAreaView>
    </View>
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
