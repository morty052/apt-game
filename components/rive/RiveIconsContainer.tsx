import { View } from 'react-native';
import RiveIconButton from './RiveIconButton';

const getArtboardName = (artboardName: string) => {
  if (artboardName === 'BackgroundColor') {
    return `${artboardName}Icon`;
  }
  return `Body${artboardName}Icon`;
};

/**
 * List out all the character feature icon buttons
 */
export default function RiveIconsContainer() {
  const className =
    'md:gap-x-4 gap-x-2 w-full h-14 md:h-20 lg:h-24 bg-[#1D1D1D] flex md:justify-between justify-center md:p-4 px-[12px] py-[4px] rounded-[16px] md:mx-auto';
  return (
    <View style={{ width: '100%', backgroundColor: '#1D1D1D', flexDirection: 'row' }}>
      <RiveIconButton artboardName={getArtboardName('Color')} />
      <RiveIconButton artboardName={getArtboardName('Size')} />
      <RiveIconButton artboardName={getArtboardName('Eyes')} />
      <RiveIconButton artboardName={getArtboardName('Hair')} />
      <RiveIconButton artboardName={getArtboardName('FaceHair')} />
      <RiveIconButton artboardName={getArtboardName('BackgroundColor')} />
    </View>
  );
}
