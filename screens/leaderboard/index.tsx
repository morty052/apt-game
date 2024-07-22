import { Pressable, StyleSheet, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from 'constants/colors';
import { BackButton } from 'components/ui/BackButton';
import { Text } from 'components/ui/Text';
import { Ionicons } from '@expo/vector-icons';
import Avatar, { AvatarObject } from 'components/Avatar';

const players = [
  {
    username: 'player1',
    totalPoints: 100,
    avatarObject: {
      BodyColor: 0,
      BodySize: 1,
      BodyEyes: 2,
      BodyHair: 3,
      BodyFaceHair: 4,
      BackgroundColor: 5,
    },
  },
  {
    username: 'player2',
    totalPoints: 100,
    avatarObject: {
      BodyColor: 0,
      BodySize: 1,
      BodyEyes: 2,
      BodyHair: 3,
      BodyFaceHair: 4,
      BackgroundColor: 5,
    },
  },
  {
    username: 'player3',
    totalPoints: 100,
    avatarObject: {
      BodyColor: 0,
      BodySize: 1,
      BodyEyes: 2,
      BodyHair: 3,
      BodyFaceHair: 4,
      BackgroundColor: 5,
    },
  },
];

const PositionBadge = ({ number }: { number: number }) => {
  return (
    <View style={styles.badgeContainer}>
      <Text>{number}</Text>
    </View>
  );
};

const PlayerRankingCard = ({
  player,
}: {
  player: { username: string; totalPoints: number; avatarObject: AvatarObject };
}) => {
  return (
    <Pressable style={styles.playerRankingCard}>
      <Avatar avatarObject={player.avatarObject} />
      <View style={{ paddingTop: 10 }}>
        <Text>{player.username}</Text>
        <Text>{player.totalPoints}</Text>
      </View>
      <PositionBadge number={1} />
    </Pressable>
  );
};

const LeaderBoard = ({ navigation }: any) => {
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

          {players.map((player, index) => (
            <PlayerRankingCard player={player} key={index} />
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
  },
});
