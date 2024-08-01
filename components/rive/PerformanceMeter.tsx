import { Dimensions, StyleSheet, Text, View } from 'react-native';
import Rive, { Alignment } from 'rive-react-native';

const gaugeUrl = 'https://res.cloudinary.com/dg6bgaasp/raw/upload/v1722506806/gauge_t19e5u.riv';

export type performanceAnimationNames = 'zero' | 'okay' | 'average' | 'good' | 'great';

export default function PerformanceMeter({ animation }: { animation: performanceAnimationNames }) {
  return (
    <Rive
      alignment={Alignment.BottomCenter}
      stateMachineName="State Machine 1"
      animationName={animation}
      url={gaugeUrl}
      style={{
        width: Dimensions.get('window').width * 0.98,
        maxHeight: 250,
        // backgroundColor: 'red',
      }}
    />
  );
}

const styles = StyleSheet.create({});
