import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

import coin from '../../assets/icons/alph-a--min.png';
import removeAdsIcons from '../../assets/icons/removeAds-min.png';
import energy from '../../assets/icons/thunderbolt-icon--min.png';

const AdFreeBundle = () => {
  return (
    <LinearGradient
      colors={[Colors.backGround, 'lightblue']}
      style={{
        padding: 10,
        height: 140,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{ gap: 10, flex: 1.5 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ fontSize: 12, color: 'white' }}>
            Get the ad free bundle by referring friends
          </Text>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              borderRadius: 10,
              padding: 5,
            }}>
            <Image style={{ height: 60, width: 60 }} source={energy} />
            <Text style={{ fontSize: 14 }}>x100</Text>
          </View>
          <View
            style={{
              backgroundColor: 'white',
              alignItems: 'center',
              borderRadius: 10,
              padding: 5,
            }}>
            <Image style={{ height: 60, width: 60 }} source={coin} />
            <Text style={{ fontSize: 14 }}>x100</Text>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
        }}>
        <Image
          resizeMode="contain"
          style={{ height: '95%', width: '95%' }}
          source={removeAdsIcons}
        />
      </View>
    </LinearGradient>
  );
};

export default AdFreeBundle;

const styles = StyleSheet.create({});
