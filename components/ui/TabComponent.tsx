import { Pressable, View, StyleSheet } from 'react-native';
import { Text } from './Text';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useEffect } from 'react';

interface tabBarButtonProps {
  title: string;
  value: string;
  onPress: (value: string) => void;
  isActive: boolean;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export const TabButton = ({ title, value, onPress, isActive }: tabBarButtonProps) => {
  const buttonColor = useSharedValue('white');

  useEffect(() => {
    if (isActive) {
      buttonColor.value = withSpring('#00daff');
    }
  }, [isActive]);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(isActive ? '#00daff' : 'white'),
    };
  });

  return (
    <AnimatedPressable onPress={() => onPress(value)} style={[styles.tabBarButton, animatedStyles]}>
      <Text style={{ fontSize: 12, color: isActive ? 'white' : 'black' }}>{title}</Text>
    </AnimatedPressable>
  );
};

export const TabPanel = ({
  tabs,
  activeTab,
  setactiveTab,
}: {
  tabs: { title: string; value: string }[];
  activeTab: string;
  setactiveTab: (value: string) => void;
}) => {
  return (
    <View style={{ width: '100%', flexDirection: 'row', gap: 10 }}>
      {tabs.map((tab) => (
        <TabButton
          isActive={activeTab === tab.value}
          key={tab.value}
          value={tab.value}
          onPress={(value) => setactiveTab(value)}
          title={tab.title}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: 'red',
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 5,
    gap: 20,
  },
  tabBarButton: {
    height: 40,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
