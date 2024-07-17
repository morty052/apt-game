import { Pressable, ScrollView, View } from 'react-native';

import RiveOptionButton from './RiveOptionButton';

interface RiveOptionsContainerProps {
  buttonCollectionName: string;
  numOptions: number;
  onPress: (mainName: string, optionIdx: number) => void;
}

const getArtboardName = (artboardName: string) => {
  if (artboardName === 'BackgroundColor') {
    return `${artboardName}Button`;
  }
  return `Body${artboardName}Button`;
};

const colors = ['068399', 'C86069', 'FBCC40', '7656D7', '8E1F79'];

function BodyColorPicker({ color, onPress }: { color: string; onPress: () => void }) {
  return (
    <Pressable
      style={{ backgroundColor: color, width: 100, height: 100, borderRadius: 10 }}
      onPress={onPress}
    />
  );
}

/**
 * List out all the character feature option buttons
 */
export default function RiveOptionsContainer({
  buttonCollectionName,
  numOptions,
  onPress,
}: RiveOptionsContainerProps) {
  console.log('RiveOptionsContainer', buttonCollectionName, numOptions);

  const optionButtons = [];
  for (let i = 0; i < numOptions; i++) {
    optionButtons.push(
      <RiveOptionButton
        onPress={(mainName, optionIdx) => onPress(mainName, optionIdx)}
        key={`RiveOptionButton-${buttonCollectionName}-${i}`}
        artboardName={getArtboardName(buttonCollectionName)}
        optionIdx={i}
      />
    );
  }

  const colorOptionButtons = [];
  for (let i = 0; i < numOptions; i++) {
    colorOptionButtons.push(
      <BodyColorPicker
        onPress={() => onPress('BodyColor', i)}
        key={`RiveOptionButton-${buttonCollectionName}-${i}`}
        color={`#${colors[i]}`}
        // artboardName={getArtboardName(buttonCollectionName)}
        // optionIdx={i}
      />
    );
  }

  if (buttonCollectionName === 'Color') {
    return (
      <View
        style={{
          width: '100%',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
          paddingVertical: 20,
          paddingHorizontal: 10,
        }}>
        {colorOptionButtons.map((buttonComp) => buttonComp)}
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        width: '100%',
        flexDirection: 'row',
        flexWrap: 'wrap',
      }}>
      {optionButtons.map((buttonComp) => buttonComp)}
    </ScrollView>
  );
}
