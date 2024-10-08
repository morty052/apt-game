import { useNavigation } from '@react-navigation/native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getFriendRequests, acceptFriendRequest } from 'api/index';
import Avatar, { AvatarObject } from 'components/Avatar';
import FriendRequestCard from 'components/cards/FriendRequestCard';
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
import LoadingScreen from 'components/LoadingScreen';

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
    value: 'REQUESTS',
    title: 'Friend Requests',
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

const RequestsPanel = () => {
  const [requests, setRequests] = useState([]);
  const { isLoading, refetch, isRefetching } = useQuery({
    queryKey: ['friendRequests'],
    queryFn: async () => {
      const { friendRequests } = await getFriendRequests();
      console.log({ friendRequestsggg: friendRequests });
      setRequests(friendRequests.data);
      return friendRequests;
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: ({ senderUsername }: { senderUsername: string }) =>
      acceptFriendRequest({ senderUsername }),
    mutationKey: ['acceptFriendRequest'],
    onSuccess: ({ error, filteredRequests }) => {
      console.log('friend request accepted', { error, filteredRequests });
      // setRequests(data.filteredRequests);
      queryClient.invalidateQueries({ queryKey: ['friendRequests'] });
    },
  });

  const acceptFriend = async (senderUsername: string) => {
    mutate({ senderUsername });
  };

  useRefreshOnFocus(refetch);

  if (isLoading || isRefetching) {
    return <LoadingScreen />;
  }

  return (
    <View style={{ flex: 1, backgroundColor: Colors.backGround }}>
      <View style={styles.container}>
        {requests &&
          requests?.map((sender: { username: string; avatar: AvatarObject }) => (
            <FriendRequestCard
              key={sender.username}
              sender={sender}
              acceptFriend={(username) => acceptFriend(username)}
              accepting={isPending}
            />
          ))}
        <View
          style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: 200 }}>
          {!isLoading && requests?.length === 0 && (
            <Text
              style={{
                color: 'white',
                textAlign: 'center',
                marginTop: 20,
              }}>
              No new friend requests
            </Text>
          )}
        </View>
      </View>
    </View>
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
  const [invites, setInvites] = useState<null | any[]>(null);

  const navigation = useNavigation<any>();
  const { socket } = React.useContext(SocketContext);

  const { character } = useAppStore();

  const DB = useDB();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['userNotifications'],
    queryFn: async () => {
      const invites = await getInvites(DB);
      setInvites(invites);
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
      {activeTab === 'REQUESTS' && <RequestsPanel />}
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
