import Avatar, { AvatarObject } from 'components/Avatar';
import { Button } from 'components/ui/Button';
import { StyleSheet, Text, View } from 'react-native';

export default function FriendRequestCard({
  sender,
  acceptFriend,
  accepting,
}: {
  sender: { username: string; avatar: AvatarObject };
  acceptFriend: (username: string) => void;
  accepting: boolean;
}) {
  return (
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
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <Avatar height={40} width={40} avatarObject={sender.avatar} />
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
          onPress={() => {
            if (accepting) return;
            acceptFriend(sender.username);
          }}
          style={{
            flex: 1,
          }}
          title={!accepting ? 'Accept' : '...'}
        />
        <Button
          style={{ flex: 1, backgroundColor: 'red', borderColor: 'red' }}
          title="Reject"
          onPress={() => {}}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
