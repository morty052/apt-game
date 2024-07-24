import { Canvas, Circle, Group, Path } from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';
import { Text } from './ui/Text';

const width = 80;
export default function PlayerLevel() {
  const r = width / 2;

  const path = `M ${r}, ${r} m 0, -${r} a ${r}, ${r} 0 1,1 0,${2 * r} a ${r}, ${r} 0 1,1 0,${-2 * r} Z`;
  return (
    <View style={{ width, height: 90, position: 'relative' }}>
      <Canvas
        style={{
          backgroundColor: 'transparent',
          width: 100,
          height: 90,
        }}>
        <Group transform={[{ translateX: 6 }, { translateY: 5 }]}>
          <Circle cx={r} cy={r} r={r} color="#00c4ee" />
          <Path
            path={path}
            color="#d3d3d3"
            //   strokeJoin="round"
            strokeWidth={10}
            // We trim the first and last quarter of the path
            style="stroke"
            start={0}
            end={1}
          />
          <Path
            path={path}
            color="yellow"
            strokeJoin="round"
            strokeCap={'round'}
            strokeWidth={6}
            // We trim the first and last quarter of the path
            style="stroke"
            start={0}
            end={0.2}
          />
        </Group>
      </Canvas>
      <View
        style={{
          position: 'absolute',
          top: r - 5,
          left: 0,
          backgroundColor: 'transparent',
          width: 100,
          alignItems: 'center',
          transform: [{ translateX: -6 }],
        }}>
        <Text style={{ color: 'white', textAlign: 'center' }}>1</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({});
