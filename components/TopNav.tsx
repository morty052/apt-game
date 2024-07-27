import { View, Text, Image, StyleSheet } from 'react-native';

import coin from '../assets/icons/alph-a--min.png';
import EnergyBar from '../assets/icons/thunderbolt-icon--min.png';
import PlayerLevel from './PlayerLevel';
import { Ionicons } from '@expo/vector-icons';

function CoinsBalance() {
  return (
    <View style={styles.inventory}>
      <Image source={coin} style={{ height: 30, width: 30, borderWidth: 1, borderRadius: 15 }} />
      <Text style={{ fontFamily: 'Crispy-Tofu', fontSize: 14 }}>900</Text>
    </View>
  );
}

function EnergyBalance() {
  return (
    <View style={styles.inventory}>
      <Image source={EnergyBar} style={{ height: 30, width: 30 }} />
      <Text style={{ fontFamily: 'Crispy-Tofu', fontSize: 14 }}>900</Text>
    </View>
  );
}

function Notifications() {
  return (
    <View style={styles.notificationContainer}>
      <Ionicons name="notifications-outline" size={24} color="black" />
    </View>
  );
}

function TopNav() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // backgroundColor: 'green',
        paddingTop: 0,
        height: 100,
        gap: 10,
      }}>
      <PlayerLevel level={900} total_score={1440} />
      <EnergyBalance />
      <Notifications />
      {/* <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          gap: 20,
          backgroundColor: 'transparent',
        }}>
       
      </View> */}
    </View>
  );
}

const styles = StyleSheet.create({
  inventory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'gray',
    borderRadius: 20,
    flex: 0.4,
    maxWidth: 150,
    height: 32,
  },
  notificationContainer: {
    height: 40,
    width: 40,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 40,
  },
});

export default TopNav;
