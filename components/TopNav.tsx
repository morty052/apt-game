import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet } from 'react-native';

import PlayerLevel from './PlayerLevel';
import NotificationsButton from './action-buttons/NotificationsButton';
import coin from '../assets/icons/alph-a--min.png';
import EnergyBar from '../assets/icons/thunderbolt-icon--min.png';

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
      <View
        style={{
          height: 30,
          width: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 45,
          backgroundColor: 'white',
        }}>
        <Image source={EnergyBar} style={{ height: 25, width: 25 }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontFamily: 'Crispy-Tofu', fontSize: 13, textAlign: 'right', color: 'white' }}>
          900
        </Text>
      </View>
      <Ionicons name="add-circle" size={24} color="lime" />
    </View>
  );
}

function TopNav() {
  return (
    <View style={{ height: 70 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 10,
        }}>
        <PlayerLevel level={900} total_score={1460} />
        <EnergyBalance />
      </View>
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
    borderWidth: 2,
    borderColor: 'white',
    paddingHorizontal: 2,
    height: 35,
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
