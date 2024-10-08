import { Ionicons } from '@expo/vector-icons';
import { View, Text, Image, StyleSheet, Pressable } from 'react-native';

import PlayerLevel from './PlayerLevel';
import NotificationsButton from './action-buttons/NotificationsButton';
import coin from '../assets/icons/alph-a--min.png';
import EnergyBar from '../assets/icons/thunderbolt-icon--min.png';
import { useNavigation } from '@react-navigation/native';

function CoinsBalance() {
  const navigation = useNavigation<any>();
  return (
    <Pressable onPress={() => navigation.navigate('Store')} style={styles.inventory}>
      <View
        style={{
          height: 30,
          width: 30,
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: 45,
          backgroundColor: 'white',
        }}>
        <Image source={coin} style={{ height: 25, width: 25 }} />
      </View>
      <View style={{ flex: 1 }}>
        <Text
          style={{ fontFamily: 'Crispy-Tofu', fontSize: 13, textAlign: 'right', color: 'white' }}>
          900
        </Text>
      </View>
      <Ionicons name="add-circle" size={24} color="lime" />
    </Pressable>
  );
}

function EnergyBalance() {
  const navigation = useNavigation<any>();
  return (
    <Pressable onPress={() => navigation.navigate('Store')} style={styles.inventory}>
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
    </Pressable>
  );
}

function TopNav() {
  return (
    <View style={{ height: 70 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 10,
        }}>
        <PlayerLevel />
        <EnergyBalance />
        <CoinsBalance />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  inventory: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(203, 203, 203,0.90)',
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
