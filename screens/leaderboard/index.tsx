import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import { BackButton } from 'components/ui/BackButton';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
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
  onPress,
}: {
  player: { username: string; total_score: number; avatar: AvatarObject };
  position: number;
  onPress: () => void;
}) => {
  return (
    <Pressable onPress={onPress} style={styles.playerRankingCard}>
      <PositionBadge number={position} />
      <Avatar avatarObject={player.avatar} />
      <View style={{ paddingTop: 10 }}>
        <Text style={{ fontSize: 14 }}>{player.username}</Text>
        <Text>{player.total_score}</Text>
      </View>
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
    <View style={{ flex: 1, backgroundColor: Colors.plain }}>
      <ScrollView>
        <View style={styles.container}>
          {players?.map((player, index) => (
            <PlayerRankingCard
              onPress={() => {
                navigation.navigate('PlayerScreen', {
                  username: player.username,
                  avatar: player.avatar,
                  points_to_compare: player.total_score,
                  high_score_to_compare: player.highscore,
                  level_to_compare: player.level,
                });
              }}
              key={index}
              player={player}
              position={index + 1}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 10,
    backgroundColor: Colors.plain,
    gap: 30,
    paddingVertical: 20,
  },
  playerRankingCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    elevation: 5,
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  badgeContainer: {
    backgroundColor: 'white',
    padding: 5,
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
