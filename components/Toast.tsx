import { Colors } from 'constants/colors';
import { useAppStore } from 'models/appStore';
import { useCallback, useEffect, useMemo } from 'react';
import { View, StyleSheet, Image } from 'react-native';
import Animated, { SlideInUp, SlideOutUp } from 'react-native-reanimated';
import { SafeAreaView } from 'react-native-safe-area-context';
import { inviteDataProps } from 'types';

import { Text } from './ui/Text';
import friendIcon from '../assets/icons/friends-icon--min.png';
import { useDB } from 'hooks/useDb';
import { Invites } from 'schema';

export type notificationDataTypes = 'INVITE' | 'FRIEND_REQUEST';

const FriendRequestToast = () => {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={styles.imageContainer}>
        <Image source={friendIcon} style={styles.image} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 14 }}>New Friend Request</Text>
        <Text style={{ fontSize: 12 }}>You Received a new friend request</Text>
      </View>
    </View>
  );
};

const MatchInviteToast = ({ invite }: { invite: { data: inviteDataProps } }) => {
  const invites = useAppStore().invites;
  const DB = useDB();

  const updateInvites = useCallback(async () => {
    console.info(invite.data);
    try {
      useAppStore.setState({ invites: invites + 1 });
      const res = await DB.insert(Invites)
        .values([
          {
            game_id: invite.data.game_id,
            host: invite.data.host.username,
            created_at: `${new Date()}`,
            avatar: invite.data.host.avatar,
            guests: invite.data.guests,
          },
        ])
        .returning();
      // console.log(res);
    } catch (error) {
      console.error(error);
    }
  }, [invites, useAppStore, invite.data, DB]);

  useEffect(() => {
    updateInvites();

    return () => {};
  }, []);

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
      <View style={styles.imageContainer}>
        <Image source={friendIcon} style={styles.image} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={{ fontSize: 14 }}>New Match Invitation</Text>
        <Text style={{ fontSize: 12 }}>You Received a new invitation to a game</Text>
      </View>
    </View>
  );
};

const Toast = ({
  showing,
  setShowing,
  data,
}: {
  showing: { type: notificationDataTypes; data?: any } | null;
  setShowing: React.Dispatch<
    React.SetStateAction<{ type: notificationDataTypes; data?: any } | null>
  >;
  data?: any;
}) => {
  useEffect(() => {
    if (!showing) return;
    const toastDuration = setTimeout(() => {
      setShowing(null);
    }, 3000);

    return () => {
      clearTimeout(toastDuration);
    };
  }, [showing]);

  if (!showing) {
    return null;
  }
  return (
    <Animated.View entering={SlideInUp} exiting={SlideOutUp} style={styles.container}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.innerContainer}>
          {showing.type === 'FRIEND_REQUEST' && <FriendRequestToast />}
          {showing.type === 'INVITE' && <MatchInviteToast invite={showing.data} />}
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

export default Toast;

const styles = StyleSheet.create({
  container: {
    height: 140,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: 'orange',
    flex: 1,
  },
  innerContainer: {
    backgroundColor: 'white',
    width: '95%',
    maxWidth: 400,
    alignSelf: 'center',
    marginTop: 10,
    borderRadius: 10,
    padding: 10,
    elevation: 10,
  },
  image: { height: 40, width: 40 },
  imageContainer: {
    height: 45,
    width: 45,
    backgroundColor: Colors.backGround,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
