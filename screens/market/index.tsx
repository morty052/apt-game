import { useQuery } from '@tanstack/react-query';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from 'models/appStore';
import { Dimensions, Image, ScrollView, StyleSheet, View } from 'react-native';
import gift from '../../assets/gifts/giftbox-base.png';
import { ModalComponent } from 'components/ui/ModalComponent';
import { useState } from 'react';
import Rive from 'rive-react-native';

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
        width: 80,
        height: 80,
        borderRadius: 10,
      }}>
      <Image source={gift} style={{ width: 80, height: 80 }} />
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
  console.log(rewardNumber);
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
      colors={[Colors.tertiary, 'gold']}
      style={{
        padding: 10,
        height: 180,
        borderRadius: 10,
      }}>
      <Text>AD Free Bundle</Text>
      <Text style={{ fontSize: 12 }}>Get rid of ads for 7 days</Text>
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
  return (
    <ModalComponent visible={claiming}>
      <View
        onLayout={() => {
          setTimeout(() => {
            setunWrapping(false);
          }, 3000);
        }}
      />
      {unWrapping && (
        <Rive
          url="https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722789579/rive/i1ayobpu2ijavdpff7sr.riv"
          style={{
            width: Dimensions.get('window').width,
            maxHeight: 400,
            backgroundColor: 'red',
            flex: 1,
          }}
        />
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
          <Button style={{ width: '100%' }} title="Continue" onPress={() => setClaiming(false)} />
        </View>
      )}
    </ModalComponent>
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
          <Text style={{}}>Coin Packs</Text>
          <AdFreeBundle />
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
    paddingVertical: 20,
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
