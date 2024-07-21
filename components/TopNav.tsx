import { View, Text, Image } from 'react-native';
import Avatar from './Avatar';

import coin from '../assets/icons/alph-a--min.png';
import EnergyBar from '../assets/icons/thunderbolt-icon--min.png';

function CoinsBalance() {
  return (
    <View
      style={{
        height: 40,
        width: 100,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 5,
        paddingHorizontal: 10,
      }}>
      <Image source={coin} style={{ height: 30, width: 30, borderWidth: 1, borderRadius: 15 }} />
      <Text style={{ flex: 1, fontFamily: 'Crispy-Tofu', textAlign: 'center', fontSize: 16 }}>
        900
      </Text>
    </View>
  );
}

function EnergyBalance() {
  return (
    <View
      style={{
        height: 40,
        width: 100,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 5,
        paddingHorizontal: 10,
      }}>
      <Image
        source={EnergyBar}
        style={{ height: 30, width: 30, borderWidth: 1, borderRadius: 15 }}
      />
      <Text style={{ flex: 1, fontFamily: 'Crispy-Tofu', textAlign: 'center', fontSize: 16 }}>
        900
      </Text>
    </View>
  );
}

function TopNav() {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
      <View style={{ flexDirection: 'row', gap: 10, flex: 1, justifyContent: 'flex-end' }}>
        <CoinsBalance />
        <EnergyBalance />
      </View>
    </View>
  );
}

export default TopNav;
