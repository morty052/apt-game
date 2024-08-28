import { useQuery } from '@tanstack/react-query';
import BottomNav from 'components/BottomNav';
import { Character } from 'components/CharacterSelectWindow';
import TopNav from 'components/TopNav';
import CharacterSelectButton from 'components/action-buttons/CharacterSelectButton';
import NotificationsButton from 'components/action-buttons/NotificationsButton';
import { useDB } from 'hooks/useDb';
import { useAppStore } from 'models/appStore';
import { StyleSheet, View, ImageBackground, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameLoadingScreen from 'screens/game-loading-screen/GameLoadingScreen';
import { inviteProps, StatsProps } from 'types';

import GameBackgroundImage from '../../assets/game-background-image--min.jpg';

function RightNav() {
  return (
    <View style={styles.actionButtonsContainer}>
      <NotificationsButton />
      <CharacterSelectButton />
      {/* <GameModeButton /> */}
    </View>
  );
}

const getInvites = async (DB: any) => {
  const allRows = await DB.query.Invites.findMany({
    columns: {
      game_id: true,
      avatar: true,
      host: true,
      guests: true,
      created_at: true,
    },
  });

  return allRows;
};

const getUserData = async (DB: any): Promise<{ stats: StatsProps; invites: inviteProps[] }> => {
  try {
    const invites = await getInvites(DB);
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

    return { stats, invites };
  } catch (error) {
    console.log(error);
    return {} as any;
  }
};

export const Home = ({ navigation }: any) => {
  const DB = useDB();

  const { character } = useAppStore();

  const { isLoading } = useQuery({
    queryKey: ['userData'],
    queryFn: async () => {
      const { stats, invites } = await getUserData(DB);
      useAppStore.setState(() => ({ invites: invites.length, stats }));
      return stats;
    },
  });

  if (isLoading) {
    return <GameLoadingScreen />;
  }

  return (
    <>
      <ImageBackground resizeMode="cover" source={GameBackgroundImage} style={styles.container}>
        <SafeAreaView style={{ flex: 1 }}>
          <View>
            <TopNav />
            <RightNav />
            <Character url={character.url} />
          </View>
          <BottomNav onPressPlay={() => {}} />
        </SafeAreaView>
      </ImageBackground>
    </>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: Colors.plain,
    // backgroundColor: '#00c4ee',
    paddingBottom: 0,
    paddingHorizontal: 5,
    position: 'relative',
    gap: 30,
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 0,
    // backgroundColor: 'red',
  },
  actionButton: {
    height: 50,
    width: 50,
    borderRadius: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  actionButtonsContainer: {
    position: 'absolute',
    top: 80,
    right: 0,
    width: 60,
    // backgroundColor: 'rgba(255,255,255,0.5)',
    // borderWidth: 1,
    borderColor: 'black',
    zIndex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    borderRadius: 20,
  },
});
