import { useNavigation } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import Avatar from 'components/Avatar';
import { Button } from 'components/ui/Button';
import { TabPanel } from 'components/ui/TabComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import SocketContext from 'contexts/SocketContext';
import { eq } from 'drizzle-orm';
import { ExpoSQLiteDatabase } from 'drizzle-orm/expo-sqlite';
import { useDB } from 'hooks/useDb';
import { useRefreshOnFocus } from 'hooks/useRefreshOnFocus';
import { useAppStore } from 'models/appStore';
import React, { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { inviteProps } from 'types';
import { getItem } from 'utils/storage';

import * as SchemaProps from '../../schema';

function InvitationCard({
  invite,
  onAccept,
  onReject,
}: {
  invite: inviteProps;
  onAccept: () => void;
  onReject: () => void;
}) {
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
        <Avatar avatarObject={invite.avatar} />
        <View style={{ paddingRight: 10, flex: 1, gap: 2 }}>
          <Text>{invite.host}</Text>
          <Text style={{ fontSize: 12 }}>
            {invite.host} invited you and {invite.guests.length} members to play
          </Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <Button onPress={onAccept} fontSize={14} title="Accept" />
        <Button
          onPress={onReject}
          style={{ backgroundColor: 'red', borderColor: '#ff0040' }}
          textColor="white"
          fontSize={14}
          title="Reject"
        />
      </View>
    </View>
  );
}

const tabs = [
  {
    value: 'INVITES',
    title: 'Invites',
  },
  {
    value: 'MESSAGES',
    title: 'Messages',
  },
];

const InvitationPanel = ({
  acceptCreation,
  rejectInvite,
  invites,
}: {
  acceptCreation: (invite: inviteProps) => void;
  rejectInvite: (invite: inviteProps) => void;
  invites: inviteProps[];
}) => {
  return (
    <FlatList
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap: 20 }}
      data={invites}
      renderItem={({ item }) => (
        <InvitationCard
          onReject={() => rejectInvite(item)}
          onAccept={() => acceptCreation(item)}
          invite={item}
        />
      )}
    />
  );
};

const getInvites = async (DB: ExpoSQLiteDatabase<typeof SchemaProps>) => {
  const allRows = await DB.query.Invites.findMany({
    columns: {
      game_id: true,
      avatar: true,
      host: true,
      guests: true,
      created_at: true,
    },
    orderBy: (rows, { desc }) => [desc(rows.created_at)],
  });

  return allRows;
};

export default function NotificationsScreen() {
  const [activeTab, setactiveTab] = useState<string>('INVITES');

  const navigation = useNavigation<any>();
  const { socket } = React.useContext(SocketContext);

  const { character } = useAppStore();

  const DB = useDB();

  const {
    data: invites,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const invites = await getInvites(DB);

      return invites;
    },
  });

  useRefreshOnFocus(refetch);

  const acceptCreation = useCallback(
    (invite: inviteProps) => {
      socket?.emit('JOIN_PRIVATE_LOBBY', {
        private_room: invite.game_id,
        guest: {
          username: getItem('USERNAME'),
          character: character.name,
        },
      });
      navigation.navigate('Lobby', {
        private_room: invite.game_id,
        mode: 'PRIVATE_MATCH',
        guests: invite.guests,
      });
    },
    [navigation, socket]
  );

  // TODO: ADD DELETING FROM LOCAL DB
  const rejectNotification = async (item: inviteProps) => {
    console.log(item.game_id);
    const res = await DB.delete(SchemaProps.Invites)
      .where(eq(SchemaProps.Invites.game_id, item.game_id))
      .returning();
    useAppStore.setState((state) => ({
      invites: state.invites - 1,
    }));
    // useAppStore.setState((state) => ({
    //   invites: state.invites?.filter((invite) => invite.game_id !== item.game_id),
    // }));
  };

  if (isLoading) {
    return null;
  }

  console.log({ invites });

  return (
    <View style={styles.container}>
      {/* <Avatar avatarObject={invites[0].avatar} /> */}
      <TabPanel tabs={tabs} activeTab={activeTab} setactiveTab={setactiveTab} />
      {activeTab === 'INVITES' && (
        <InvitationPanel
          invites={invites as inviteProps[]}
          rejectInvite={rejectNotification}
          acceptCreation={acceptCreation}
        />
      )}
      {activeTab === 'MESSAGES' && (
        <InvitationPanel
          invites={invites as inviteProps[]}
          rejectInvite={rejectNotification}
          acceptCreation={acceptCreation}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.plain,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 20,
  },
});
