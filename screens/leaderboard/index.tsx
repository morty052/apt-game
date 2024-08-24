import { useQuery } from '@tanstack/react-query';
import Avatar, { AvatarObject } from 'components/Avatar';
import PlayerProfileModal from 'components/PlayerProfileModal';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { getItem } from 'utils/storage';

import { getLeaderBoard } from '../../api/index';
import BaseChest from '../../assets/gifts/chest-common.png';
import EpicChest from '../../assets/gifts/chest-epic.png';
import LegendaryChest from '../../assets/gifts/chest-legendary.png';
import RareChest from '../../assets/gifts/chest-rare.png';

const PositionBadge = ({
  number,
  isLeader,
  isRunnerUp,
  isThird,
}: {
  number: number;
  isLeader: boolean;
  isRunnerUp: boolean;
  isThird: boolean;
}) => {
  if (isLeader) {
    return (
      <View style={[styles.badgeContainer, { backgroundColor: 'gold' }]}>
        <Text>{number}</Text>
      </View>
    );
  }

  if (isRunnerUp) {
    return (
      <View style={[styles.badgeContainer, { backgroundColor: 'silver' }]}>
        <Text>{number}</Text>
      </View>
    );
  }

  if (isThird) {
    return (
      <View style={[styles.badgeContainer, { backgroundColor: 'brown' }]}>
        <Text>{number}</Text>
      </View>
    );
  }

  return (
    <View style={styles.badgeContainer}>
      <Text>{number}</Text>
    </View>
  );
};

const RewardIndicator = ({
  number,
  isLeader,
  isRunnerUp,
  isThird,
}: {
  number: number;
  isLeader: boolean;
  isRunnerUp: boolean;
  isThird: boolean;
}) => {
  return (
    <Image
      source={isLeader ? LegendaryChest : isRunnerUp ? EpicChest : isThird ? RareChest : BaseChest}
      style={{ width: 45, height: 45 }}
    />
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
  const isPlayer = useMemo(() => player.username === getItem('USERNAME'), [player]);
  const { isLeader, isRunnerUp, isThird } = useMemo(() => {
    const isLeader = position === 1;
    const isRunnerUp = position === 2;
    const isThird = position === 3;
    return { isLeader, isRunnerUp, isThird };
  }, [position]);

  return (
    <Pressable
      onPress={onPress}
      style={[styles.playerRankingCard, { backgroundColor: isPlayer ? '#ffffe0' : 'white' }]}>
      <PositionBadge
        isLeader={isLeader}
        isRunnerUp={isRunnerUp}
        isThird={isThird}
        number={position}
      />
      <Avatar avatarObject={player.avatar} />
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 14 }}>{player.username}</Text>
        <Text>{player.total_score}</Text>
      </View>
      <RewardIndicator
        isLeader={isLeader}
        isRunnerUp={isRunnerUp}
        isThird={isThird}
        number={position}
      />
    </Pressable>
  );
};

const LeaderBoardBanner = () => {
  return (
    <LinearGradient
      colors={[Colors.backGround, 'lightblue']}
      style={{
        padding: 10,
        borderRadius: 10,
        gap: 20,
        elevation: 10,
      }}>
      <View style={{ gap: 10 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ fontSize: 18, color: 'white' }}>Rank high to earn</Text>
          <Text style={{ fontSize: 15, color: 'white' }}>Get fantastic prizes every week</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flex: 1, maxHeight: 100 }}>
          <Image
            resizeMode="contain"
            style={{ maxHeight: 100, width: '100%' }}
            source={BaseChest}
          />
        </View>
        <View style={{ flex: 1, maxHeight: 100 }}>
          <Image
            resizeMode="contain"
            style={{ maxHeight: 100, width: '100%' }}
            source={RareChest}
          />
        </View>
        <View style={{ flex: 1, maxHeight: 100 }}>
          <Image
            resizeMode="contain"
            style={{ maxHeight: 100, width: '100%' }}
            source={EpicChest}
          />
        </View>
        {/* <Image style={{ height: 100, width: 100 }} source={RareChest} />
        <Image resizeMode="contain" style={{ height: 100, width: 100 }} source={EpicChest} /> */}
      </View>
    </LinearGradient>
  );
};

const LeaderBoard = ({ navigation }: any) => {
  const [viewingPlayer, setViewingPlayer] = useState(false);
  const [playerToView, setplayerToView] = useState();
  const { data: players, isLoading } = useQuery({
    queryKey: ['leaderboard'],
    queryFn: getLeaderBoard,
  });

  if (isLoading) {
    return null;
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.plain,
      }}>
      <ScrollView>
        <View style={styles.container}>
          <LeaderBoardBanner />
          <View>
            {players?.map((player: any, index: number) => (
              <PlayerRankingCard
                onPress={() => {
                  setplayerToView(player);
                  setViewingPlayer(true);
                }}
                key={index}
                player={player}
                position={index + 1}
              />
            ))}
          </View>
        </View>
      </ScrollView>
      <PlayerProfileModal
        playerToView={playerToView}
        visible={viewingPlayer}
        setVisible={setViewingPlayer}
      />
    </View>
  );
};

export default LeaderBoard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.plain,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 20,
  },
  playerRankingCard: {
    padding: 10,
    flexDirection: 'row',
    columnGap: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: Colors.lightBlack,
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
