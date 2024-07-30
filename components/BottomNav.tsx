import { View, StyleSheet, Pressable, Image, Dimensions } from 'react-native';
import PlayButton from './action-buttons/PlayButton';
import friendsIcon from '../assets/icons/friends-icon--min.png';
import marketIcon from '../assets/icons/market-place-icon--min.png';
import leaderBordIcon from '../assets/icons/leader-board-icon--min.png';
import settingsIcon from '../assets/icons/settings-icon--min.png';
import { useNavigation } from '@react-navigation/native';
import { Text } from './ui/Text';

export function NavBarButton({ screenName, icon }: { screenName: string; icon: any }) {
  const navigation = useNavigation<any>();
  return (
    <Pressable onPress={() => navigation.navigate(screenName)} style={styles.buttonContainer}>
      <Image source={icon} resizeMode="contain" style={styles.icon} />
    </Pressable>
  );
}

export default function BottomNav({ onPressPlay }: { onPressPlay: () => void }) {
  return (
    <View style={styles.container}>
      <NavBarButton icon={friendsIcon} screenName="FriendsList" />
      <NavBarButton icon={marketIcon} screenName="Market" />
      <PlayButton onPress={onPressPlay} />
      <NavBarButton icon={leaderBordIcon} screenName="LeaderBoard" />
      <NavBarButton icon={settingsIcon} screenName="SettingsScreen" />
    </View>
  );
}

// *TODO FIX DIMENSION STYLES ?
const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  buttonContainer: {
    height: Dimensions.get('window').width / 6,
    width: Dimensions.get('window').width / 6,
    borderRadius: Dimensions.get('window').width,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'black',
  },
  icon: {
    // height: 50,
    // width: 50,
    height: Dimensions.get('window').width / 7,
    width: Dimensions.get('window').width / 7,
  },
  text: {
    fontSize: 10,
  },
});
