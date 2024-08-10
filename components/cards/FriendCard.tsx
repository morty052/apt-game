import { Pressable, View, StyleSheet } from 'react-native';
import Avatar, { AvatarObject } from '../Avatar';
import { Colors } from 'constants/colors';
import { Text } from '../ui/Text';
import { Button } from 'components/ui/Button';
import { ReactNode } from 'react';
import { Ionicons } from '@expo/vector-icons';

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
      <Pressable style={{ flexDirection: 'row', columnGap: 5, alignItems: 'center' }}>
        <Avatar avatarObject={player.avatar} />
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 18 }}>{player.username}</Text>
          <Text style={{ fontSize: 16 }}>{player.total_score} points</Text>
        </View>
        {/* hide delete button when card has no children */}
        {!children && (
          <Button fontSize={14} style={styles.deleteButton} title="play" onPress={() => {}}>
            <Ionicons name="trash-outline" size={20} color={Colors.plain} />
          </Button>
        )}
      </Pressable>
      {children}
      <OnlineStatusIndicator online={player.online} />
    </View>
  );
};

export default FriendCard;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 5,
    paddingVertical: 20,
    gap: 20,
    borderWidth: 1,
    borderColor: Colors.gray,
  },
  friendCard: {
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    top: -5,
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
  deleteButton: {
    height: 35,
    padding: 0,
    width: 80,
    backgroundColor: 'red',
    borderColor: '#d80000',
  },
});
