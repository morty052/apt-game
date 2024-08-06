import { useQuery } from '@tanstack/react-query';
import { Button } from 'components/ui/Button';
import { ModalComponent } from 'components/ui/ModalComponent';
import { Text } from 'components/ui/Text';
import { Colors } from 'constants/colors';
import { useDB } from 'hooks/useDb';
import { useAppStore } from 'models/appStore';
import { useEffect, useState } from 'react';
import { Image, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import compass from '../../assets/icons/findingmatchicon.png';

const AnimatedImage = Animated.createAnimatedComponent(Image);

const Skeleton = ({
  height,
  width,
  style,
}: {
  height?: number;
  width?: number;
  style?: ViewStyle;
}) => {
  const backgroundColor = useSharedValue('white');

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: backgroundColor.value,
    };
  });

  useEffect(() => {
    backgroundColor.value = withRepeat(withTiming(Colors.plain, { duration: 1000 }), -1, true);
  }, []);

  return (
    <Animated.View
      style={[{ height: height || 300, width: width || 300 }, animatedStyles, style]}
    />
  );
};

const NuggetSkeleton = () => {
  return (
    <View style={{ gap: 20, alignItems: 'center' }}>
      <Skeleton
        style={{ width: 220, height: 220, borderRadius: 20, elevation: 5, alignSelf: 'center' }}
        height={200}
        width={200}
      />
      <Skeleton style={{ borderRadius: 10 }} height={30} width={250} />
      <Skeleton style={{ borderRadius: 10 }} height={20} width={300} />
      <Skeleton style={{ borderRadius: 10 }} height={20} width={300} />
    </View>
  );
};

const Nugget = ({
  nugget,
}: {
  nugget:
    | { id: number; title: string | null; type: string; image: string; content: number }
    | undefined;
}) => {
  return (
    <>
      <View
        style={{
          backgroundColor: 'white',
          justifyContent: 'center',
          alignItems: 'center',
          width: 220,
          height: 220,
          borderRadius: 20,
          elevation: 5,
        }}>
        <Image
          source={{ uri: nugget?.image }}
          style={{ height: 200, width: 200, alignSelf: 'center' }}
        />
      </View>
      <Text
        style={{
          color: 'white',
          textAlign: 'center',
          fontSize: 24,
        }}>
        {nugget?.title}
      </Text>
      <Text style={{ color: 'white', textAlign: 'center', fontSize: 18, lineHeight: 24 }}>
        {nugget?.content}
      </Text>
    </>
  );
};

export default function PendingMatchScreen() {
  const DB = useDB();
  const getNugget = async () => {
    const allRows = await DB.query.Nuggets.findMany({
      columns: {
        id: true,
        title: true,
        content: true,
        type: true,
        image: true,
      },
    });

    const rowToPick = Math.floor(Math.random() * allRows.length);
    console.log(allRows[rowToPick]);
    return allRows[rowToPick];
  };

  const { data: nugget, isLoading } = useQuery({
    queryKey: ['Nugget'],
    queryFn: getNugget,
  });
  const y = useSharedValue(0);
  const opacity = useSharedValue(1);
  const matchmaking = useAppStore((state) => state.matchmaking);

  useEffect(() => {
    // y.value = withRepeat(withTiming(10, { duration: 1000 }), -1, true);
    opacity.value = withRepeat(withTiming(0.6, { duration: 1000 }), -1, true);
  }, []);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: y.value }, { rotate: '-20deg' }],
    };
  });

  const animatedTextStyles = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  return (
    <ModalComponent style={{ backgroundColor: Colors.tertiary }} visible={matchmaking}>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          {/* HEADER */}
          <View style={{ gap: 2 }}>
            <AnimatedImage
              source={compass}
              style={[{ height: 100, width: 100, alignSelf: 'center' }, animatedStyles]}
            />
            <Animated.Text
              style={[
                { textAlign: 'center', fontSize: 16, color: 'black', fontFamily: 'Crispy-Tofu' },
                animatedTextStyles,
              ]}>
              Finding Match
            </Animated.Text>
          </View>
          {/* HR */}
          <View style={{ height: 2, backgroundColor: 'rgba(255,255,255,0.5)', width: '100%' }} />

          {!isLoading && <Nugget nugget={nugget} />}
          {isLoading && <NuggetSkeleton />}
        </View>
        <Button
          onPress={() => useAppStore.setState({ matchmaking: false })}
          style={{ backgroundColor: 'red', borderColor: '#d80000' }}
          textColor="white"
          title="Cancel"
        />
      </View>
    </ModalComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
    flex: 1,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.tertiary,
    position: 'relative',
    paddingTop: 10,
    gap: 20,
  },
});
