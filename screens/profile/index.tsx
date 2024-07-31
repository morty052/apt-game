import { PlayerAvatar } from 'components/Avatar';
import { Container } from 'components/ui/Container';
import { Colors } from 'constants/colors';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'components/ui/Text';
import { getItem } from 'utils/storage';
import { useMemo, useState } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'components/ui/Button';
import { TabPanel } from 'components/ui/TabComponent';

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

function PlayerInfo() {
  const username = useMemo(() => getItem('USERNAME'), []);
  const email = useMemo(() => getItem('EMAIL'), []);
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

      <LinearGradient
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
      </LinearGradient>
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

export default function PlayerProfile() {
  const [activeTab, setactiveTab] = useState<string>('INFO');

  return (
    <Container>
      <View style={styles.topContainer}>
        <View
          style={{
            // backgroundColor: 'blue',
            flex: 1,
            height: avatarWidth,
            alignItems: 'center',
            marginTop: -10,
          }}>
          <PlayerAvatar
            height={avatarWidth}
            width={avatarWidth}
            avatarObject={{
              BodyColor: 1,
              BodySize: 0,
              BodyEyes: 0,
              BodyHair: 0,
              BodyFaceHair: 0,
              BackgroundColor: 0,
            }}
          />
        </View>
      </View>
      <View style={styles.container}>
        <TabPanel tabs={tabs} activeTab={activeTab} setactiveTab={setactiveTab} />
        {activeTab === 'INFO' && <PlayerInfo />}
        {activeTab === 'INVENTORY' && <PlayerInventory />}
      </View>
    </Container>
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
