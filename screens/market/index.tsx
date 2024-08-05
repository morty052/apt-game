import { Button } from 'components/ui/Button';
import { ModalComponent } from 'components/ui/ModalComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from 'models/appStore';
import { useState } from 'react';
import { Dimensions, FlatList, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import Rive from 'rive-react-native';

import gift from '../../assets/gifts/giftbox-base.png';
import removeAdsIcons from '../../assets/icons/removeAds-min.png';
import energy from '../../assets/icons/thunderbolt-icon--min.png';
import coin from '../../assets/icons/alph-a--min.png';

const days = [1, 2, 3, 4, 5, 6, 7];

const DailyLoginProgressBar = ({ rewardNumber }: { rewardNumber: number }) => {
  return (
    <View style={{ flexDirection: 'row', gap: 3, alignItems: 'center', alignSelf: 'center' }}>
      <View
        style={[
          styles.barItem,
          {
            borderTopLeftRadius: 30,
            borderBottomLeftRadius: 30,
            backgroundColor: rewardNumber > 0 ? Colors.tertiary : 'gray',
          },
        ]}
      />
      {days.slice(1).map((day) => {
        const isActive = rewardNumber >= day;
        return (
          <View
            key={day}
            style={[styles.barItem, { backgroundColor: isActive ? Colors.tertiary : 'gray' }]}
          />
        );
      })}
      <View
        style={{
          height: 60,
          width: 60,
          backgroundColor: 'gray',
          marginLeft: -4,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
        }}>
        <Image source={gift} style={{ width: 58, height: 58 }} />
      </View>
    </View>
  );
};

const DailyRewardIndicator = ({ isEligibleToClaim }: { isEligibleToClaim: boolean }) => {
  return (
    <View
      style={{
        backgroundColor: isEligibleToClaim ? Colors.backGround : 'gray',
        width: 60,
        height: 60,
        borderRadius: 10,
      }}>
      <Image source={gift} style={{ width: 58, height: 58 }} />
    </View>
  );
};

const DailyRewardCard = ({
  rewardNumber,
  onPressClaim,
}: {
  rewardNumber: number;
  onPressClaim: () => void;
}) => {
  return (
    <View style={styles.dailyRewardCard}>
      <View>
        <Text style={{ textAlign: 'center' }}>Daily login reward</Text>
        <Text style={{ textAlign: 'center', fontSize: 15 }}>Claim your daily login reward</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          justifyContent: 'center',
          flexWrap: 'wrap',
        }}>
        {days.map((day) => (
          <DailyRewardIndicator isEligibleToClaim={rewardNumber >= day} key={day} />
        ))}
      </View>
      <DailyLoginProgressBar rewardNumber={rewardNumber} />
      <Text style={{ textAlign: 'center', fontSize: 12 }}>
        Claim 7 days to receive a bonus reward
      </Text>
      <Button onPress={onPressClaim} title="Claim" />
    </View>
  );
};

const AdFreeBundle = () => {
  return (
    <LinearGradient
      colors={[Colors.backGround, 'lightblue']}
      style={{
        padding: 10,
        height: 180,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      <View style={{ gap: 10 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ color: 'white' }}>AD Free Bundle</Text>
          <Text style={{ fontSize: 12, color: 'white' }}>Get rid of ads for 7 days</Text>
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

const ClaimModal = ({
  claiming,
  setClaiming,
}: {
  claiming: boolean;
  setClaiming: (state: boolean) => void;
}) => {
  const [unWrapping, setunWrapping] = useState(true);
  const [loopCount, setloopCount] = useState(0);

  // useEffect(() => {
  //   if (!unWrapping) {
  //     return;
  //   }
  //   const interval = setTimeout(() => {
  //     setunWrapping(false);
  //   }, 3000);

  //   return () => {
  //     clearTimeout(interval);
  //   };
  // }, [unWrapping]);

  return (
    <ModalComponent visible={claiming}>
      {unWrapping && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingTop: 20,
            paddingBottom: 100,
          }}>
          <Rive
            url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722789579/rive/i1ayobpu2ijavdpff7sr.riv"
            style={{
              width: Dimensions.get('window').width,
              maxHeight: 400,
              // backgroundColor: 'red',
              flex: 1,
              marginLeft: -20,
            }}
            onLoopEnd={() => {
              if (loopCount >= 2) {
                setunWrapping(false);
                return;
              }
              setloopCount((prev) => prev + 1);
            }}
          />
        </View>
      )}
      {!unWrapping && (
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            paddingVertical: 20,
            position: 'relative',
            paddingHorizontal: 10,
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              alignItems: 'center',
              flex: 1,
              justifyContent: 'center',
              // backgroundColor: 'red',
              paddingBottom: 80,
            }}>
            <View style={{ alignItems: 'center' }}>
              <Text>Congratulations</Text>
              <Text>You received:</Text>
            </View>
            <Image
              source={gift}
              style={{ height: 300, width: 300, borderWidth: 1, borderRadius: 15 }}
            />
            <Text style={{ fontSize: 14 }}>Come back tomorrow for more rewards</Text>
          </View>
          {/* @ts-ignore */}
          <Button
            style={{ width: '100%' }}
            title="Continue"
            onPress={() => {
              setClaiming(false);
              setunWrapping(true);
              setloopCount(0);
            }}
          />
        </View>
      )}
    </ModalComponent>
  );
};

const CoinBundleCard = () => {
  return (
    <View
      style={{
        padding: 10,
        width: Dimensions.get('window').width - 40,
        height: 180,
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: 'lightblue',
      }}>
      <View style={{ gap: 10 }}>
        <View style={{ gap: 5 }}>
          <Text style={{ color: 'white' }}>Starter Pack</Text>
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
        <Pressable
          style={{
            backgroundColor: 'yellow',
            padding: 5,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 10,
          }}>
          <Text>$100.00</Text>
        </Pressable>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          // backgroundColor: 'red',
        }}>
        <Image resizeMode="contain" style={{ height: '85%', width: '85%' }} source={coin} />
      </View>
    </View>
  );
};

export default function Market({ navigation }: any) {
  const [claiming, setClaiming] = useState(false);

  // const { data: friends, isLoading } = useQuery({
  //   queryKey: ['market'],
  //   queryFn: getUserFriends,
  // });

  // if (isLoading) {
  //   return null;
  // }

  const rewardCount = useAppStore().rewardCount;

  return (
    <View style={{ flex: 1, backgroundColor: Colors.plain }}>
      <ScrollView>
        <View style={styles.container}>
          <DailyRewardCard onPressClaim={() => setClaiming(true)} rewardNumber={rewardCount} />
          <AdFreeBundle />
          <View style={{ backgroundColor: Colors.tertiary, padding: 10, borderRadius: 20 }}>
            <Text style={{ textAlign: 'center', color: 'white' }}>Coin Packs</Text>
          </View>
          <FlatList
            contentContainerStyle={{
              gap: 10,
              maxHeight: 250,
              // backgroundColor: 'red',
              paddingBottom: 10,
              paddingHorizontal: 2,
            }}
            horizontal
            data={[1, 2, 3, 4]}
            renderItem={() => <CoinBundleCard />}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      </ScrollView>
      <ClaimModal claiming={claiming} setClaiming={setClaiming} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 5,
    backgroundColor: Colors.plain,
    gap: 30,
    paddingTop: 20,
    paddingBottom: 50,
  },
  dailyRewardCard: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    gap: 25,
    paddingVertical: 20,
    elevation: 10,
  },
  barItem: {
    backgroundColor: 'gray',
    width: Dimensions.get('window').width / 10,
    height: 30,
  },
});
