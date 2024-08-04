import { useQuery } from '@tanstack/react-query';
import { Button } from 'components/ui/Button';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppStore } from 'models/appStore';
import { Dimensions, ScrollView, StyleSheet, View } from 'react-native';

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
            backgroundColor: rewardNumber > 0 ? 'green' : 'gray',
          },
        ]}
      />
      {days.slice(1).map((day) => {
        const isActive = rewardNumber >= day;
        return (
          <View
            key={day}
            style={[styles.barItem, { backgroundColor: isActive ? 'green' : 'gray' }]}
          />
        );
      })}
      <View style={{ height: 60, width: 60, backgroundColor: 'blue', marginLeft: -4 }} />
    </View>
  );
};

const DailyRewardIndicator = ({ isEligibleToClaim }: { isEligibleToClaim: boolean }) => {
  return (
    <View
      style={{
        backgroundColor: isEligibleToClaim ? 'green' : 'red',
        width: 80,
        height: 80,
        borderRadius: 10,
      }}
    />
  );
};

const DailyRewardCard = ({ rewardNumber }: { rewardNumber: number }) => {
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
      <Button title="Claim" />
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

export default function Market({ navigation }: any) {
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
          <DailyRewardCard rewardNumber={rewardCount} />
          <AdFreeBundle />
          <Text style={{}}>Coin Packs</Text>
          <AdFreeBundle />
        </View>
      </ScrollView>
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
    height: 40,
  },
});
