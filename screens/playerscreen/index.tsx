import Avatar, { PlayerAvatar } from 'components/Avatar';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import dayjs from 'dayjs';
import { useAppStore } from 'models/appStore';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

const HR = () => {
  return <View style={{ height: 4, backgroundColor: 'gray' }} />;
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

export default function PlayerScreen({ route }: any) {
  const { username, avatar, points_to_compare, high_score_to_compare, level_to_compare } =
    route.params;
  const stats = useAppStore().stats;
  const { level, wins, points, high_score } = stats;
  const join_date = useMemo(() => {
    const rawDate = avatar.created_at;

    const day = dayjs(rawDate).get('D');
    const month = dayjs(rawDate).format('MMM');
    const year = dayjs(rawDate).get('year');

    return `${month} ${day}, ${year}`;
  }, [avatar]);
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 10 }}>
        <Avatar height={100} width={100} avatarObject={avatar} />
        <View style={{ flex: 1, gap: 4 }}>
          <Text>{username}</Text>
          <Text style={{ fontSize: 14 }}>Playing since {join_date}</Text>
        </View>
      </View>
      <HR />
      <View style={{ paddingHorizontal: 5, gap: 20 }}>
        <Button title="Challenge" />
        <View
          style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View style={{ gap: 5, flex: 1, alignItems: 'center' }}>
            <View style={{ maxHeight: 80 }}>
              <PlayerAvatar height={80} width={80} />
            </View>
            <Text style={{}}>{wins}</Text>
          </View>
          <View>
            <Text style={{ textAlign: 'center', fontSize: 16 }}>All Time</Text>
            <Text style={{ textAlign: 'center' }}>Wins</Text>
          </View>
          <View style={{ gap: 5, flex: 1, alignItems: 'center' }}>
            <View style={{ maxHeight: 80 }}>
              <Avatar height={80} width={80} avatarObject={avatar} />
            </View>
            <Text>0</Text>
          </View>
        </View>
        <View style={{}}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    gap: 20,
  },
});
