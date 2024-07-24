import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getUserFriends } from 'utils/supabase';
import { Text } from 'components/ui/Text';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BackButton } from 'components/ui/BackButton';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from 'constants/colors';
import Avatar, { AvatarObject } from 'components/Avatar';

const FriendCard = ({
  player,
  position,
}: {
  player: { username: string; totalscore: number; avatar: AvatarObject };
  position: number;
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

export default function FriendListScreen({ navigation }: any) {
  const { data: friends, isLoading } = useQuery({
    queryKey: ['friendlist'],
    queryFn: getUserFriends,
  });

  if (isLoading) {
    return null;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <BackButton onPress={() => navigation.goBack()} />
            <Text style={{ textAlign: 'center', color: 'white', fontSize: 24, flex: 1 }}>
              Friends
            </Text>
            <Pressable
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

          {friends?.map((friend, index) => (
            <FriendCard key={friend.username} player={friend} position={index + 1} />
          ))}
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
  badgeContainer: {
    position: 'absolute',
    top: -10,
    right: -5,
    backgroundColor: 'white',
    padding: 5,
    zIndex: 1,
    height: 40,
    width: 40,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
});
