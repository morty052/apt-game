import { useNavigation } from '@react-navigation/native';
import Avatar from 'components/Avatar';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { useAppStore } from 'models/appStore';
import React, { useCallback } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { inviteProps } from 'types';
import { getItem } from 'utils/storage';

function InvitationCard({ invite, onAccept }: { invite: inviteProps; onAccept: () => void }) {
  return (
    <View
      style={{
        backgroundColor: 'white',
        paddingHorizontal: 10,
        paddingVertical: 20,
        gap: 20,
        borderRadius: 10,
      }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Avatar avatarObject={invite.host.avatar} />
        <View style={{ paddingRight: 10, flex: 1, gap: 2 }}>
          <Text>{invite.host.username}</Text>
          <Text style={{ fontSize: 12 }}>
            {invite.host.username} invited you and {invite.guests.length} members to play
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button onPress={onAccept} fontSize={14} title="Accept" />
        <Button
          style={{ backgroundColor: 'red', borderColor: '#ff0040' }}
          textColor="white"
          fontSize={14}
          title="Reject"
        />
      </View>
    </View>
  );
}

export default function NotificationsScreen() {
  const { invites } = useAppStore();

  const navigation = useNavigation<any>();
  const { socket } = React.useContext(SocketContext);

  const { character } = useAppStore();

  const acceptCreation = useCallback(
    (invite: inviteProps) => {
      socket?.emit('JOIN_PRIVATE_LOBBY', {
        private_room: invite.id,
        guest: {
          username: getItem('USERNAME'),
          character: character.name,
        },
      });
      navigation.navigate('Lobby', { private_room: invite.id, mode: 'PRIVATE_MATCH' });
    },
    [navigation, socket]
  );

  return (
    <View style={styles.container}>
      <FlatList
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 20 }}
        data={invites}
        renderItem={({ item }) => (
          <InvitationCard onAccept={() => acceptCreation(item)} invite={item} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.plain,
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
});
