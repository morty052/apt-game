import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { PlayerAvatar } from 'components/Avatar';
import { Button } from 'components/ui/Button';
import { Container } from 'components/ui/Container';
import { TabPanel } from 'components/ui/TabComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { eq } from 'drizzle-orm';
import { LinearGradient } from 'expo-linear-gradient';
import { useDB } from 'hooks/useDb';
import { useAppStore } from 'models/appStore';
import { useMemo, useState } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Stats } from 'schema';
import { StatsProps } from 'types';
import { getItem } from 'utils/storage';

const avatarWidth = Dimensions.get('window').width * 0.7;

const tabs = [
  {
    value: 'INFO',
    title: 'Your info',
  },
  {
    value: 'INVENTORY',
    title: 'Inventory',
  },
];

const ProgressBar = ({
  distanceFromLastLevel,
  level,
}: {
  distanceFromLastLevel: any;
  level: number;
}) => {
  return (
    <View
      style={{
        backgroundColor: 'gray',
        flex: 1,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: 'white',
        height: 30,
        position: 'relative',
      }}>
      <View
        style={{
          backgroundColor: '#00daff',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
          height: 26,
          width: `${distanceFromLastLevel}%`,
          justifyContent: 'center',
        }}
      />
      <View
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          justifyContent: 'center',
          zIndex: 1,
        }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 14 }}>{level}</Text>
      </View>
    </View>
  );
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
      }}>
      {children}
    </View>
  );
};

const StatItem = ({ title, value }: { title: string; value: string | number }) => {
  return (
    <View style={{ alignItems: 'center', flex: 1, gap: 5 }}>
      <Text style={{ fontSize: 16 }}>{title}</Text>
      <Text style={{ fontSize: 24 }}>{value}</Text>
    </View>
  );
};

const StatDivider = () => {
  return <View style={{ width: 1, backgroundColor: 'gray' }} />;
};

function PlayerInfo() {
  const username = useMemo(() => getItem('USERNAME'), []);
  const email = useMemo(() => getItem('EMAIL'), []);
  const stats = useAppStore().stats;
  const { level, wins, losses, points, games_played, high_score } = stats;
  return (
    <View style={{ gap: 20 }}>
      <LinearGradient
        // Button Linear Gradient
        colors={[Colors.backGround, '#00aecc']}
        start={{ x: 0, y: 0 }}
        style={styles.playerInfoCard}>
        <View>
          <Text style={{ color: 'white' }}>{username}</Text>
          <Text style={{ color: 'white' }}>{email}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ProgressBar level={0} distanceFromLastLevel={0} />
        </View>
      </LinearGradient>

      {/* <LinearGradient
        // Button Linear Gradient
        colors={[Colors.tertiary, 'gold']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.playerInfoCard}>
        <Text style={{ color: 'white', fontSize: 14 }}>Achievements</Text>
        <View style={{ gap: 3 }}>
          <Text style={{ color: 'white' }}>Level 7</Text>
          <Text style={{ color: 'white', fontSize: 14 }}>Around the world in 80 days</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ProgressBar level={0} distanceFromLastLevel={0} />
        </View>
        <Button title="View Achievements" />
      </LinearGradient> */}

      <View>
        <StatContainer>
          <StatItem title={'Level'} value={level as number} />
          <StatDivider />
          <StatItem title={'Points'} value={points as number} />
        </StatContainer>
        <StatContainer>
          <StatItem title={'Wins'} value={wins as number} />
          <StatDivider />
          <StatItem title={'Losses'} value={losses as number} />
        </StatContainer>
        <StatContainer>
          <StatItem title={'Games Played'} value={games_played as number} />
          <StatDivider />
          <StatItem title={'High Score'} value={high_score as number} />
        </StatContainer>
      </View>
    </View>
  );
}

function PlayerInventory() {
  return (
    <View style={{ gap: 20 }}>
      <LinearGradient
        // Button Linear Gradient
        colors={[Colors.tertiary, 'gold']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.playerInfoCard}>
        <View style={{ gap: 3 }}>
          <Text style={{ color: 'white' }}>0 items</Text>
          <Text style={{ color: 'white', fontSize: 14 }}>your inventory is empty</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}>
          <ProgressBar level={0} distanceFromLastLevel={0} />
        </View>
        <Button title="Browse Store" />
      </LinearGradient>
    </View>
  );
}

export default function Profile({ navigation }: any) {
  const [activeTab, setactiveTab] = useState<string>('INFO');
  const DB = useDB();
  const getStats = async (): Promise<StatsProps> => {
    try {
      const allRows = await DB.query.Stats.findMany({
        columns: {
          level: true,
          points: true,
          high_score: true,
          games_played: true,
          wins: true,
          losses: true,
        },
      });

      const stats = allRows[0];
      return stats;
    } catch (error) {
      console.log(error);
      return {} as StatsProps;
    }
  };

  const updateStats = async () => {
    try {
      const transaction = await DB.update(Stats)
        .set({ level: 0, losses: 0, high_score: 0, points: 0, games_played: 0, wins: 0 })
        .where(eq(Stats.id, 0))
        .returning({ updatedId: Stats.level });

      console.log(transaction);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <ScrollView>
      <Container style={{ paddingBottom: 40 }}>
        <View style={[styles.topContainer, { alignItems: 'center' }]}>
          <View
            style={{
              // backgroundColor: 'blue',
              flex: 1,
              height: avatarWidth,
              width: avatarWidth,
              alignItems: 'center',
              position: 'relative',
            }}>
            <PlayerAvatar height={avatarWidth} width={avatarWidth} />
            <Pressable
              onPress={() => navigation.navigate('AvatarEditor')}
              // onPress={() => updateStats()}
              style={{
                backgroundColor: 'white',
                position: 'absolute',
                top: 20,
                right: 5,
                height: 40,
                width: 40,
                borderRadius: 20,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Ionicons name="add-circle" size={24} color="black" />
            </Pressable>
          </View>
        </View>
        <View style={styles.container}>
          <TabPanel tabs={tabs} activeTab={activeTab} setactiveTab={setactiveTab} />

          {activeTab === 'INFO' && <PlayerInfo />}
          {activeTab === 'INVENTORY' && <PlayerInventory />}
        </View>
      </Container>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 5,
    gap: 20,
  },
  topContainer: {
    backgroundColor: Colors.tertiary,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    paddingHorizontal: 10,
    height: avatarWidth - 0,
  },
  tabBarButton: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  playerInfoCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 15,
  },
  achievementCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 15,
  },
});
