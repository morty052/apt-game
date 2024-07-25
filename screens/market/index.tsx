import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import { BackButton } from 'components/ui/BackButton';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUserFriends } from 'utils/supabase';

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

export default function Market({ navigation }: any) {
  const { data: friends, isLoading } = useQuery({
    queryKey: ['market'],
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
              Market
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
