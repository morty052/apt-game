import { NavigationProp, RouteProp } from '@react-navigation/native';
import { GameStackParamList } from 'Routes/GameStack';
import { Text } from 'components/ui/Text';
import SocketContext from 'contexts/SocketContext';
import { useGameStore } from 'models/gameStore';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

function Lobby({
  navigation,
  route,
}: {
  navigation: NavigationProp<GameStackParamList>;
  route: RouteProp<GameStackParamList, 'Lobby'>;
}) {
  const [selectingCharacter, setSelectingCharacter] = React.useState(false);
  const { mode, friends } = route.params;
  const { socket } = React.useContext(SocketContext);
  const { initGame } = useGameStore();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'skyblue' }}>
      <View style={styles.container}>
        {friends?.map((friend, index) => <Text key={index}>{friend.username}</Text>)}
      </View>
    </SafeAreaView>
  );
}

export default Lobby;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: 'skyblue',
    gap: 20,
    paddingVertical: 20,
    position: 'relative',
  },
});
