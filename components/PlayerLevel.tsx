import { Canvas, Circle, Group, Path } from '@shopify/react-native-skia';
import { StyleSheet, View } from 'react-native';

const width = 80;
export default function PlayerLevel() {
  const r = width / 2;

  const path = `M ${r}, ${r} m 0, -${r} a ${r}, ${r} 0 1,1 0,${2 * r} a ${r}, ${r} 0 1,1 0,${-2 * r} Z`;
  return (
    <Canvas
      style={{
        backgroundColor: 'transparent',
        width: 100,
        height: 90,
      }}>
      <Group transform={[{ translateX: 6 }, { translateY: 5 }]}>
        <Circle cx={r} cy={r} r={r} color="gold" />
        <Path
          path={path}
          color="gray"
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
          strokeWidth={8}
          // We trim the first and last quarter of the path
          style="stroke"
          start={0}
          end={0.2}
        />
      </Group>
    </Canvas>
  );
}

const styles = StyleSheet.create({});
