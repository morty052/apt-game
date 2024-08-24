import { Ionicons } from '@expo/vector-icons';
import { PlayerAvatar } from 'components/Avatar';
import { getDistanceFromLastLevel, ProgressBar } from 'components/ProgressBar';
import { Container } from 'components/ui/Container';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useAppStore } from 'models/appStore';
import { useMemo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { getItem } from 'utils/storage';

const avatarWidth = Dimensions.get('window').width * 0.7;

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
  const { wins, losses, points, games_played, high_score } = stats;
  const distanceFromLastLevel = useMemo(() => getDistanceFromLastLevel(points), [points]);
  const level = useMemo(() => Math.floor(points / 1000), [points]);
  return (
    <View style={{ gap: 20, paddingTop: 20, paddingHorizontal: 5 }}>
      <View
        // Button Linear Gradient
        style={styles.playerInfoCard}>
        <View>
          <Text style={{}}>{username}</Text>
          <Text style={{ fontSize: 12 }}>{email}</Text>
        </View>
        <ProgressBar level={level} distanceFromLastLevel={distanceFromLastLevel} />
      </View>

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
          <StatItem title="Level" value={level as number} />
          <StatDivider />
          <StatItem title="Points" value={points as number} />
        </StatContainer>
        <StatContainer>
          <StatItem title="Wins" value={wins as number} />
          <StatDivider />
          <StatItem title="Losses" value={losses as number} />
        </StatContainer>
        <StatContainer>
          <StatItem title="Games Played" value={games_played as number} />
          <StatDivider />
          <StatItem title="High Score" value={high_score as number} />
        </StatContainer>
      </View>
    </View>
  );
}

export default function Profile({ navigation }: any) {
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
        {/* <View style={styles.container}>
          <TabPanel tabs={tabs} activeTab={activeTab} setactiveTab={setactiveTab} />

          {activeTab === 'INFO' && <PlayerInfo />}
          {activeTab === 'INVENTORY' && <PlayerInventory />}
        </View> */}
        <PlayerInfo />
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
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 15,
    elevation: 5,
  },
  achievementCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 20,
    gap: 15,
  },
});
