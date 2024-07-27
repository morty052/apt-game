import { Pressable, View, StyleSheet } from 'react-native';
import Avatar, { AvatarObject } from '../Avatar';
import { Colors } from 'constants/colors';
import { Text } from '../ui/Text';
import { Button } from 'components/ui/Button';
import { ReactNode } from 'react';

const OnlineStatusIndicator = ({ online }: { online: boolean }) => {
  return (
    <View
      style={[
        styles.onlineIndicator,
        online ? { backgroundColor: 'green' } : { backgroundColor: 'gray' },
      ]}
    />
  );
};

const FriendCard = ({
  player,
  children,
}: {
  player: { username: string; total_score: number; avatar: AvatarObject; online: boolean };
  children?: ReactNode;
}) => {
  return (
    <View style={styles.container}>
      <Pressable style={{ flexDirection: 'row', columnGap: 5 }}>
        <Avatar avatarObject={player.avatar} />
        <View style={{ paddingTop: 10 }}>
          <Text>{player.username}</Text>
          <Text>{player.total_score}</Text>
        </View>
        <OnlineStatusIndicator online={player.online} />
      </Pressable>
      {children}
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    paddingHorizontal: 10,
    gap: 20,
    paddingTop: 20,
  },
  friendCard: {
    position: 'relative',
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
