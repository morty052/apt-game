import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import React, { useEffect } from 'react';

import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { BottomTabBarButtonProps, BottomTabBarProps } from '@react-navigation/bottom-tabs';

import friendsIcon from '../../assets/icons/friends-icon--min.png';
import marketIcon from '../../assets/icons/market-place-icon--min.png';
import leaderBoardIcon from '../../assets/icons/leader-board-icon--min.png';
import settingsIcon from '../../assets/icons/settings-icon--min.png';
import { Colors } from 'constants/colors';

const icons = {
  Friends: friendsIcon,
  Market: marketIcon,
  Standings: leaderBoardIcon,
  Home: leaderBoardIcon,
  Settings: settingsIcon,
};

const TabBarButton = (props: any) => {
  const { isFocused, label, routeName, color } = props;

  const scale = useSharedValue(0);
  const jump = useSharedValue(0);

  useEffect(() => {
    scale.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 1 : 0) : isFocused, {
      duration: 350,
    });
    jump.value = withSpring(typeof isFocused === 'boolean' ? (isFocused ? 8 : 0) : isFocused, {
      duration: 350,
    });
  }, [scale, isFocused, jump]);

  const animatedIconStyle = useAnimatedStyle(() => {
    const scaleValue = interpolate(scale.value, [0, 1], [1, 1.4]);
    // const top = interpolate(scale.value, [0, 1], [0, 8]);

    return {
      // styles
      transform: [{ scale: scaleValue }, { translateY: -jump.value }],
      //   top,
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    const opacity = interpolate(scale.value, [0, 1], [1, 0]);

    return {
      // styles
      opacity,
    };
  });
  return (
    <Pressable {...props} style={styles.container}>
      <Animated.View style={[animatedIconStyle]}>
        <Image
          style={{ width: 40, height: 40 }}
          source={icons[routeName as keyof typeof icons]}
          resizeMode="contain"
        />
      </Animated.View>

      <Animated.Text
        style={[
          {
            color: isFocused ? Colors.tertiary : 'gray',
            fontSize: 10,
            fontFamily: 'Crispy-Tofu',
          },
          //   animatedTextStyle,
        ]}>
        {label}
      </Animated.Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
});

export default TabBarButton;
