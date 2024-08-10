import { Colors } from 'constants/colors';
import dayjs from 'dayjs';
import { useAppStore } from 'models/appStore';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from './ui/Text';

import Avatar from './Avatar';
import { getDistanceFromLastLevel, ProgressBar } from './ProgressBar';
import { ModalComponent } from './ui/ModalComponent';
import { Ionicons } from '@expo/vector-icons';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  playerToView?: any;
};

const HR = () => {
  return <View style={{ height: 4, backgroundColor: Colors.gray }} />;
};

const StatContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        borderTopWidth: 1,
        borderColor: 'gray',
        borderBottomWidth: 1,
        paddingVertical: 20,
        alignItems: 'center',
      }}>
      {children}
    </View>
  );
};

const StatItem = ({ value }: { value: string | number }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <Text>{value}</Text>
    </View>
  );
};

const StatDivider = ({ title, subtitle }: { title: string; subtitle: string }) => {
  return (
    <View>
      <Text style={{ textAlign: 'center', fontSize: 16 }}>{title}</Text>
      <Text style={{ textAlign: 'center' }}>{subtitle}</Text>
    </View>
  );
};

const PlayerProfileModal = ({ visible, setVisible, playerToView }: Props) => {
  const {
    username,
    avatar,
    total_score: points_to_compare,
    highscore: high_score_to_compare,
    level: level_to_compare,
    created_at,
  } = playerToView || {};

  const join_date = useMemo(() => {
    const rawDate = created_at;

    const day = dayjs(rawDate).get('D');
    const month = dayjs(rawDate).format('MMM');
    const year = dayjs(rawDate).get('year');

    return `${month} ${day}, ${year}`;
  }, [avatar]);

  const distanceFromLastLevel = useMemo(
    () => getDistanceFromLastLevel(points_to_compare),
    [points_to_compare]
  );
  const opponentlevel = useMemo(() => Math.floor(points_to_compare / 1000), [points_to_compare]);

  const stats = useAppStore().stats;
  const { points, high_score, level } = stats;

  return (
    <ModalComponent transparent style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }} visible={visible}>
      <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10 }}>
        <View style={{ alignItems: 'flex-end', paddingBottom: 10 }}>
          <Pressable
            onPress={() => setVisible(false)}
            style={{ backgroundColor: 'white', padding: 10, borderRadius: 40 }}>
            <Ionicons name="close" size={24} color="red" />
          </Pressable>
        </View>
        <View
          style={{ backgroundColor: 'white', gap: 10, paddingHorizontal: 10, borderRadius: 10 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingTop: 10,
            }}>
            <Avatar height={100} width={100} avatarObject={avatar} />
            <View style={{ flex: 1, gap: 4 }}>
              <Text>{username}</Text>
              <Text style={{ fontSize: 14 }}>Playing since {join_date}</Text>
            </View>
          </View>
          <HR />
          <ProgressBar level={opponentlevel} distanceFromLastLevel={distanceFromLastLevel} />
          <View>
            <StatContainer>
              <StatItem value={points as number} />
              <StatDivider title="All time" subtitle="Points" />
              <StatItem value={points_to_compare as number} />
            </StatContainer>
            <StatContainer>
              <StatItem value={high_score as number} />
              <StatDivider title="High" subtitle="Score" />
              <StatItem value={high_score_to_compare as number} />
            </StatContainer>
            <StatContainer>
              <StatItem value={level as number} />
              <StatDivider title="Current" subtitle="Level" />
              <StatItem value={level_to_compare as number} />
            </StatContainer>
          </View>
        </View>
      </View>
    </ModalComponent>
  );
};

export default PlayerProfileModal;

const styles = StyleSheet.create({});
