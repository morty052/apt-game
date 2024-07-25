import { View, Text, Image } from 'react-native';

import coin from '../assets/icons/alph-a--min.png';
import EnergyBar from '../assets/icons/thunderbolt-icon--min.png';
import PlayerLevel from './PlayerLevel';

function CoinsBalance() {
  return (
    <View
      style={{
        height: 40,
        flex: 1,
        width: '90%',
        maxWidth: 400,
        backgroundColor: 'white',
        borderBottomRightRadius: 10,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        gap: 5,
        paddingLeft: 20,
      }}>
      <Image source={coin} style={{ height: 30, width: 30, borderWidth: 1, borderRadius: 15 }} />
      <View style={{ flex: 1, backgroundColor: 'transparent' }}>
        <Text style={{ fontFamily: 'Crispy-Tofu', fontSize: 20 }}>900</Text>
      </View>
    </View>
  );
}

function EnergyBalance() {
  return (
    <View
      style={{
        maxWidth: 400,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10,
        flexDirection: 'row',
        gap: 5,
        paddingLeft: 20,
        paddingVertical: 5,
        paddingRight: 30,
        backgroundColor: 'white',
      }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5,
          borderColor: 'black',
          borderWidth: 1,
          flex: 1,
          paddingVertical: 5,
        }}>
        <Image
          source={EnergyBar}
          style={{ height: 30, width: 30, borderWidth: 1, borderRadius: 15 }}
        />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Text style={{ fontFamily: 'Crispy-Tofu', fontSize: 20 }}>900</Text>
        </View>
      </View>
    </View>
  );
}

function TopNav() {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'green',
        paddingTop: 0,
      }}>
      <PlayerLevel level={900} total_score={1440} />
      <View style={{ flexDirection: 'column', columnGap: 10, flex: 1 }}>
        <EnergyBalance />
        <CoinsBalance />
      </View>
    </View>
  );
}

export default TopNav;
