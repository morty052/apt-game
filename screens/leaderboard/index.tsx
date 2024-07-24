import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import { BackButton } from 'components/ui/BackButton';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getLeaderBoard } from 'utils/supabase';

const PositionBadge = ({ number }: { number: number }) => {
  return (
    <View style={styles.badgeContainer}>
      <Text>{number}</Text>
    </View>
  );
};

const PlayerRankingCard = ({
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
      <PositionBadge number={position} />
    </Pressable>
  );
};

const LeaderBoard = ({ navigation }: any) => {
  const { data: players, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderBoard,
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
              Leader board
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

          {players?.map((player, index) => (
            <PlayerRankingCard key={index} player={player} position={index + 1} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
};

export default LeaderBoard;

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
